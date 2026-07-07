import os
import time
from collections import defaultdict
from contextlib import asynccontextmanager

import httpx
from fastapi import FastAPI, HTTPException, Request, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel, EmailStr, Field

# ---------------------------------------------------------------------------
# Configuration (environment variables)
# ---------------------------------------------------------------------------
NTFY_URL = os.getenv("NTFY_URL", "http://ntfy")
NTFY_TOPIC = os.getenv("NTFY_TOPIC", "contact-portfolio")
# Access token when the ntfy server runs with auth (auth-default-access: deny-all)
NTFY_TOKEN = os.getenv("NTFY_TOKEN", "")
LISTEN_PORT = int(os.getenv("LISTEN_PORT", "8000"))

# Rate-limiting: max requests per IP within the time window (seconds)
RATE_LIMIT_MAX = int(os.getenv("RATE_LIMIT_MAX", "5"))
RATE_LIMIT_WINDOW = int(os.getenv("RATE_LIMIT_WINDOW", "60"))

# ---------------------------------------------------------------------------
# Rate-limiter (simple in-memory, per-IP)
# ---------------------------------------------------------------------------
_rate_store: dict[str, list[float]] = defaultdict(list)


def _is_rate_limited(ip: str) -> bool:
    now = time.time()
    window_start = now - RATE_LIMIT_WINDOW

    # Prune old entries
    _rate_store[ip] = [t for t in _rate_store[ip] if t > window_start]

    if len(_rate_store[ip]) >= RATE_LIMIT_MAX:
        return True

    _rate_store[ip].append(now)
    return False


# ---------------------------------------------------------------------------
# HTTP client lifecycle
# ---------------------------------------------------------------------------
_http_client: httpx.AsyncClient | None = None


@asynccontextmanager
async def lifespan(_app: FastAPI):
    global _http_client
    _http_client = httpx.AsyncClient(timeout=10.0)
    yield
    await _http_client.aclose()


# ---------------------------------------------------------------------------
# FastAPI app
# ---------------------------------------------------------------------------
app = FastAPI(title="Contact Proxy", version="1.0.0", lifespan=lifespan)


# ---------------------------------------------------------------------------
# Request / Response models
# ---------------------------------------------------------------------------
class ContactRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    message: str = Field(..., min_length=1, max_length=2000)


class ContactResponse(BaseModel):
    status: str = "ok"


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------
@app.get("/health")
async def health():
    return {"status": "healthy"}


@app.post(
    "/api/contact",
    response_model=ContactResponse,
    status_code=status.HTTP_200_OK,
)
async def contact(body: ContactRequest, request: Request):
    # Rate-limiting
    client_ip = request.headers.get("X-Forwarded-For", request.client.host if request.client else "unknown")
    # Take the first IP if X-Forwarded-For contains multiple
    client_ip = client_ip.split(",")[0].strip()

    if _is_rate_limited(client_ip):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many requests. Please try again later.",
        )

    # Format the notification message
    ntfy_body = (
        f"Name: {body.name}\n"
        f"Email: {body.email}\n"
        f"---\n"
        f"{body.message}"
    )

    # Forward to ntfy
    ntfy_endpoint = f"{NTFY_URL.rstrip('/')}/{NTFY_TOPIC}"

    try:
        assert _http_client is not None
        headers = {
            "Title": f"Contact: {body.name}",
            "Tags": "incoming_envelope",
            "Priority": "high",
            "Actions": f"view, Reply via email, mailto:{body.email}",
        }
        if NTFY_TOKEN:
            headers["Authorization"] = f"Bearer {NTFY_TOKEN}"

        resp = await _http_client.post(
            ntfy_endpoint,
            content=ntfy_body.encode("utf-8"),
            headers=headers,
        )
        resp.raise_for_status()
    except httpx.HTTPError as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Failed to deliver the message. Please try again later.",
        ) from exc

    return ContactResponse()


# ---------------------------------------------------------------------------
# Validation error handler (return JSON instead of 422 HTML)
# ---------------------------------------------------------------------------
from fastapi.exceptions import RequestValidationError  # noqa: E402


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(_request: Request, exc: RequestValidationError):
    first_error = exc.errors()[0] if exc.errors() else {}
    detail = first_error.get("msg", "Invalid input")
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": detail},
    )


# ---------------------------------------------------------------------------
# Entrypoint
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=LISTEN_PORT)
