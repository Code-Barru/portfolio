<script lang="ts">
	import 'maplibre-gl/dist/maplibre-gl.css';
	import type { Map as MapLibreMap, Marker, Popup } from 'maplibre-gl';
	import type { MapMarker } from '../../lib/types';
	import styleTemplate from '../../lib/styles/maptiler-catppuccin.json';

	const LANG_CHANGE_FLAG = 'locale_switching';
	const LANG_CHANGE_WINDOW_MS = 2000;

	let {
		center,
		zoom = 12,
		marker = undefined,
		class: className = '',
		height = 'h-96',
		interactive = true,
		showControls = true,
		minZoom = 1,
		maxZoom = 18,
		enableTraveling = false
	}: {
		center: [number, number];
		zoom?: number;
		marker?: MapMarker;
		class?: string;
		height?: string;
		interactive?: boolean;
		showControls?: boolean;
		minZoom?: number;
		maxZoom?: number;
		enableTraveling?: boolean;
	} = $props();

	let mapContainer = $state<HTMLDivElement | null>(null);
	let map = $state<MapLibreMap | null>(null);
	let markerInstance = $state<Marker | null>(null);
	let isTravelingComplete = $derived(!enableTraveling);

	$effect(() => {
		if (!mapContainer) return;

		import('maplibre-gl').then(({ Map, NavigationControl, Marker, Popup }) => {
			const apiKey = import.meta.env.PUBLIC_MAPTILER_API_KEY;
			const styleString = JSON.stringify(styleTemplate);
			const styleWithKey = styleString.replaceAll('USE_KEY_PARAMETER', apiKey);
			const mapStyle = JSON.parse(styleWithKey);

			const langChangeTimestamp = sessionStorage.getItem(LANG_CHANGE_FLAG);
			const isLanguageChange =
				langChangeTimestamp && Date.now() - parseInt(langChangeTimestamp) < LANG_CHANGE_WINDOW_MS;

			if (langChangeTimestamp) {
				sessionStorage.removeItem(LANG_CHANGE_FLAG);
			}

			const shouldPlayAnimation = enableTraveling && !isLanguageChange;
			const initialCenter = shouldPlayAnimation ? ([10.0, 52.0] as [number, number]) : center;
			const initialZoom = shouldPlayAnimation ? 2 : zoom;

			map = new Map({
				container: mapContainer!,
				style: mapStyle,
				center: initialCenter,
				zoom: initialZoom,
				interactive,
				minZoom,
				maxZoom,
				attributionControl: { compact: true }
			});

			// Compact attribution opens expanded by default — start it collapsed.
			map.once('load', () => {
				const attrib = mapContainer?.querySelector('.maplibregl-ctrl-attrib');
				attrib?.classList.remove('maplibregl-compact-show');
				attrib
					?.querySelector('.maplibregl-ctrl-attrib-button')
					?.setAttribute('aria-expanded', 'false');
			});

			const addControlsAndMarkers = () => {
				if (!map) return;

				if (showControls) {
					map.addControl(new NavigationControl(), 'top-right');
				}

				if (marker) {
					const el = document.createElement('div');
					el.className = 'custom-marker';
					el.style.backgroundColor = marker.color || '#b4befe';
					el.style.width = '24px';
					el.style.height = '24px';
					el.style.borderRadius = '50%';
					el.style.border = '3px solid #1e1e2e';
					el.style.cursor = 'pointer';
					el.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.3)';

					markerInstance = new Marker({ element: el }).setLngLat(marker.position).addTo(map);

					if (marker.popup) {
						const popupContent =
							typeof marker.popup === 'string'
								? `<p class="text-mocha-text">${marker.popup}</p>`
								: `<h3 class="font-bold text-mocha-lavender mb-1">${marker.popup.title || ''}</h3><p class="text-mocha-text text-sm">${marker.popup.description || ''}</p>`;

						const popup = new Popup({ offset: 25, closeButton: true }).setHTML(popupContent);

						markerInstance.setPopup(popup);
					}
				}
			};

			if (shouldPlayAnimation) {
				map.on('load', () => {
					if (!map) return;

					setTimeout(() => {
						if (!map) return;

						map.flyTo({
							center: center,
							zoom: zoom,
							duration: 5000,
							essential: true
						});

						setTimeout(() => addControlsAndMarkers(), 500);

						setTimeout(() => {
							isTravelingComplete = true;
						}, 5500);
					}, 500);
				});
			} else {
				addControlsAndMarkers();
				isTravelingComplete = true;
			}
		});

		return () => {
			markerInstance?.remove();
			map?.remove();
		};
	});

	$effect(() => {
		if (map && center && isTravelingComplete) {
			map.flyTo({ center, zoom, duration: 1000 });
		}
	});
</script>

<div
	bind:this={mapContainer}
	class="map-container {height} {className}"
	role="application"
	aria-label="Interactive map"
></div>

<style>
	.map-container {
		width: 100%;
		border-top-right-radius: 0.5rem;
		border-top-left-radius: 0.5rem;
		overflow: hidden;
		border: 1px solid #313244;
		border-bottom: 0px;
	}
</style>
