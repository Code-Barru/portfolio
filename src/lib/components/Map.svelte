<script lang="ts">
  import { browser } from '$app/environment';
  import { env } from '$env/dynamic/public';
  import type { Map as MapLibreMap, Marker, Popup } from 'maplibre-gl';
  import type { MapMarker } from '$lib/types';
  import styleTemplate from '$lib/styles/maptiler-catppuccin.json';

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
  let isTravelingComplete = $state<boolean>(!enableTraveling);

  $effect(() => {
    if (!browser || !mapContainer) return;

    import('maplibre-gl').then(({ Map, NavigationControl, Marker, Popup }) => {
      const apiKey = env.PUBLIC_MAPTILER_API_KEY;
      const styleString = JSON.stringify(styleTemplate);
      const styleWithKey = styleString.replaceAll('USE_KEY_PARAMETER', apiKey);
      const mapStyle = JSON.parse(styleWithKey);

      const langChangeTimestamp = browser && sessionStorage.getItem(LANG_CHANGE_FLAG);
      const isLanguageChange = langChangeTimestamp &&
        (Date.now() - parseInt(langChangeTimestamp)) < LANG_CHANGE_WINDOW_MS;

      if (browser && langChangeTimestamp) {
        sessionStorage.removeItem(LANG_CHANGE_FLAG);
      }

      const shouldPlayAnimation = enableTraveling && !isLanguageChange;
      const initialCenter = shouldPlayAnimation ? [10.0, 52.0] as [number, number] : center;
      const initialZoom = shouldPlayAnimation ? 2 : zoom;

      map = new Map({
        container: mapContainer,
        style: mapStyle,
        center: initialCenter,
        zoom: initialZoom,
        interactive,
        minZoom,
        maxZoom
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

          markerInstance = new Marker({ element: el })
            .setLngLat(marker.position)
            .addTo(map);

          if (marker.popup) {
            const popupContent = typeof marker.popup === 'string'
              ? `<p class="text-mocha-text">${marker.popup}</p>`
              : `<h3 class="font-bold text-mocha-lavender mb-1">${marker.popup.title || ''}</h3><p class="text-mocha-text text-sm">${marker.popup.description || ''}</p>`;

            const popup = new Popup({ offset: 25, closeButton: true })
              .setHTML(popupContent);

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
  @reference;
  @import 'maplibre-gl/dist/maplibre-gl.css';

  .map-container {
    width: 100%;
    border-top-right-radius: 0.5rem;
    border-top-left-radius: 0.5rem;
    overflow: hidden;
    border: 1px solid #313244;
    border-bottom: 0px;
  }

  :global(.maplibregl-popup-content) {
    background-color: #313244;
    color: #cdd6f4;
    border: 1px solid #45475a;
    border-top-right-radius: 0.5rem;
    border-top-left-radius: 0.5rem;
    padding: 1rem;
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  }

  :global(.maplibregl-popup-close-button) {
    color: #b4befe;
    font-size: 1.25rem;
    width: 24px;
    height: 24px;
    transition: color 200ms;
  }

  :global(.maplibregl-popup-close-button:hover) {
    color: #cba6f7;
  }

  :global(.maplibregl-ctrl-group) {
    background-color: #313244;
    border: 1px solid #45475a;
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  }

  :global(.maplibregl-ctrl-group button) {
    color: #cdd6f4;
    transition: background-color 200ms;
  }

  :global(.maplibregl-ctrl-group button:hover:not(:disabled)) {
    background-color: #45475a;
  }

  :global(.maplibregl-ctrl-icon) {
    background-color: transparent;
  }

  :global(.maplibregl-ctrl button.maplibregl-ctrl-zoom-in .maplibregl-ctrl-icon) {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='29' height='29' viewBox='0 0 29 29'%3E%3Cpath fill='%23cdd6f4' d='M14.5 8.5v12m-6-6h12'/%3E%3C/svg%3E");
  }

  :global(.maplibregl-ctrl button.maplibregl-ctrl-zoom-out .maplibregl-ctrl-icon) {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='29' height='29' viewBox='0 0 29 29'%3E%3Cpath fill='%23cdd6f4' d='M8.5 14.5h12'/%3E%3C/svg%3E");
  }

  :global(.maplibregl-ctrl button.maplibregl-ctrl-compass .maplibregl-ctrl-icon) {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='29' height='29' viewBox='0 0 29 29'%3E%3Cpath fill='%23cdd6f4' d='m 10.5 14 4 8 4 -8 -8 0 z'/%3E%3Cpath fill='%239399b2' d='m 10.5 16 4 -8 4 8 -8 0 z'/%3E%3C/svg%3E");
  }

  :global(.maplibregl-ctrl-attrib) {
    background-color: rgba(30, 30, 46, 0.8);
    color: #a6adc8;
  }

  :global(.maplibregl-ctrl-attrib-button) {
    color: #cdd6f4;
  }

  :global(.maplibregl-ctrl-attrib a) {
    color: #b4befe;
    transition: color 200ms;
  }

  :global(.maplibregl-ctrl-attrib a:hover) {
    color: #cba6f7;
  }
</style>
