import { cubicOut, quintOut } from 'svelte/easing';
import type { TransitionConfig } from 'svelte/transition';

interface PageTransitionParams {
	delay?: number;
	duration?: number;
	easing?: (t: number) => number;
	direction?: 'left' | 'right' | 'bottom';
}

export function pageTransition(
	node: HTMLElement,
	{ delay = 0, duration = 500, easing = cubicOut, direction = 'right' }: PageTransitionParams = {}
): TransitionConfig {
	const opacity = +getComputedStyle(node).opacity;
	const transform = getComputedStyle(node).transform === 'none' ? '' : getComputedStyle(node).transform;

	return {
		delay,
		duration: direction === 'bottom' ? 600 : duration,
		easing,
		css: (t) => {
			// Navigation gauche/droite
			const translateX = direction === 'right'
				? (1 - t) * 20   // arrive de la droite
				: (1 - t) * -20; // arrive de la gauche

			return `
				opacity: ${t * opacity};
				transform: ${transform} translateX(${translateX}px);
			`;
		}
	};
}

interface StaggerFadeInParams {
	delay?: number;
	duration?: number;
	easing?: (t: number) => number;
	y?: number;
}

export function staggerFadeIn(
	node: HTMLElement,
	{ delay = 0, duration = 600, easing = quintOut, y = 30 }: StaggerFadeInParams = {}
): TransitionConfig {
	return {
		delay,
		duration,
		easing,
		css: (t) => `
			opacity: ${t};
			transform: translateY(${(1 - t) * y}px);
		`
	};
}
