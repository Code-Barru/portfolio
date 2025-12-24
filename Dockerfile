FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

ARG PUBLIC_MAPTILER_API_KEY
ENV PUBLIC_MAPTILER_API_KEY=$PUBLIC_MAPTILER_API_KEY

RUN npm run build



FROM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf

COPY --from=builder /app/build /usr/share/nginx/html

COPY --from=builder /app/static /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
