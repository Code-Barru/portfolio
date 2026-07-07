export interface TechStackItem {
	icon: any;
	color: string;
	title: string;
	link: string;
}

export interface TimelineItem {
	title: string;
	role: string;
	date: string;
	link: string;
	descriptions: string[];
	imgUrl: string;
}

export interface MapPopupContent {
	title?: string;
	description?: string;
	html?: string;
}

export interface MapMarker {
	position: [number, number]; // [longitude, latitude]
	color?: string;
	popup?: string | MapPopupContent;
}

/** JSON-serializable post metadata passed to islands (no entry/body). */
export interface PostMeta {
	slug: string;
	locale: 'en' | 'fr';
	title: string;
	date: string; // ISO string — serializable across the island boundary
	description: string;
	tags: string[];
	readingTime: number;
}

/** JSON-serializable project metadata passed to islands. */
export interface ProjectMeta extends PostMeta {
	featured: boolean;
	github?: string;
	demoUrl?: string;
	status?: 'completed' | 'in-progress' | 'archived';
}
