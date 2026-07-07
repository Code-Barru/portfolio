import en from './en.json';
import fr from './fr.json';

export type Locale = 'en' | 'fr';
export const locales: Locale[] = ['en', 'fr'];
export const defaultLocale: Locale = 'en';

const messages = { en, fr } as const;

export type MessageKey = keyof typeof en;

export type Translator = (key: MessageKey, params?: Record<string, string | number>) => string;

export function useT(locale: Locale): Translator {
	return (key, params) => {
		let msg: string = messages[locale][key] ?? messages.en[key];
		if (params) {
			for (const [k, v] of Object.entries(params)) {
				msg = msg.replaceAll(`{${k}}`, String(v));
			}
		}
		return msg;
	};
}

/** Prefix a locale-less path for the given locale. en stays unprefixed. */
export function localizePath(path: string, locale: Locale): string {
	if (locale === 'en') return path;
	return path === '/' ? '/fr' : `/fr${path}`;
}

/** Split a pathname into its locale and locale-less path. */
export function stripLocale(pathname: string): { locale: Locale; path: string } {
	if (pathname === '/fr' || pathname.startsWith('/fr/')) {
		return { locale: 'fr', path: pathname.slice(3) || '/' };
	}
	return { locale: 'en', path: pathname };
}

export const ogLocale = (locale: Locale): string => (locale === 'fr' ? 'fr_FR' : 'en_US');
