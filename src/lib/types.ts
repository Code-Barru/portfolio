export type NavBarItem = {
  label: string,
  link: string
}

export type TechStackItem = {
  icon: any,
  color: string,
  title: string,
  link: string
}

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
