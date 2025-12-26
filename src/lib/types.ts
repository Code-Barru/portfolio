export interface NavBarItem {
  label: string,
  link: string
}

export interface TechStackItem {
  icon: any,
  color: string,
  title: string,
  link: string
}
export interface TimelineItem {
	title: string;
	role: string;
	date: string;
	link: string;
	descriptions: string[];
  imgUrl: string
};

export interface MapLocation {
  longitude: number;
  latitude: number;
  label?: string;
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

export interface MapConfig {
  center: [number, number];
  zoom?: number;
  marker?: MapMarker;
  interactive?: boolean;
  showControls?: boolean;
  minZoom?: number;
  maxZoom?: number;
}

// Posts and Projects types for mdsvex content

/** Frontmatter data extracted from post markdown files */
export interface PostFrontmatter {
  title: string;
  date: string;
  description: string;
  tags: string[];
  published?: boolean;
  coverImage?: string;
  locale?: 'en' | 'fr';
}

/** Full post object with computed fields */
export interface Post extends PostFrontmatter {
  slug: string;
  readingTime: number;
  content: any; // Svelte component from mdsvex
}

/** Frontmatter data extracted from project markdown files */
export interface ProjectFrontmatter {
  title: string;
  date: string;
  description: string;
  tags: string[]; // Includes technologies
  featured: boolean;
  github?: string;
  demoUrl?: string;
  status?: 'completed' | 'in-progress' | 'archived';
  coverImage?: string;
  locale?: 'en' | 'fr';
}

/** Full project object with computed fields */
export interface Project extends ProjectFrontmatter {
  slug: string;
  readingTime: number;
  content: any; // Svelte component from mdsvex
}

/** Pagination configuration and state */
export interface PaginationConfig {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}
