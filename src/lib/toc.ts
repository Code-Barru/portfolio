export interface Heading {
	level: 2 | 3;
	text: string;
	id: string;
	element: HTMLElement;
}

export interface TOCItem {
	level: 2;
	text: string;
	id: string;
	element: HTMLElement;
	children: Heading[];
}

/**
 * Converts text to URL-safe slug
 */
export function generateSlug(text: string): string {
	return text
		.toLowerCase()
		.trim()
		.replace(/[^\w\s-]/g, '') // Remove special characters
		.replace(/\s+/g, '-') // Replace spaces with hyphens
		.replace(/-+/g, '-'); // Remove consecutive hyphens
}

/**
 * Extracts h2 and h3 headings from a container element
 * and builds a hierarchical TOC structure
 */
export function extractHeadings(container: Element): TOCItem[] {
	const headings = container.querySelectorAll('h2, h3');
	const items: TOCItem[] = [];
	let currentH2: TOCItem | null = null;

	headings.forEach((heading) => {
		const level = parseInt(heading.tagName[1]) as 2 | 3;
		const text = heading.textContent || '';
		let id = heading.id;

		// Generate ID if absent
		if (!id) {
			id = generateSlug(text);
			heading.id = id;
		}

		if (level === 2) {
			currentH2 = { level, text, id, element: heading as HTMLElement, children: [] };
			items.push(currentH2);
		} else if (level === 3 && currentH2) {
			currentH2.children.push({ level, text, id, element: heading as HTMLElement });
		}
	});

	return items;
}
