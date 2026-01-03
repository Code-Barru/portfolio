import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { paraglideMiddleware } from '$lib/paraglide/server';

const handleWWWRedirect: Handle = ({ event, resolve }) => {
	if (event.url.hostname === 'www.antoineousselin.fr') {
		const newUrl = new URL(event.url);
		newUrl.hostname = 'antoineousselin.fr';
		throw redirect(301, newUrl.toString());
	}
	return resolve(event);
};

const handleParaglide: Handle = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ request, locale }) => {
		event.request = request;

		return resolve(event, {
			transformPageChunk: ({ html }) => html.replace('%paraglide.lang%', locale)
		});
	});

export const handle: Handle = sequence(handleWWWRedirect, handleParaglide);
