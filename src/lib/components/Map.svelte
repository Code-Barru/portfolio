<script lang="ts">
  import { browser } from '$app/environment';
  import { env } from '$env/dynamic/public';
  import type { Map as MapLibreMap, Marker, Popup } from 'maplibre-gl';
  import type { MapMarker } from '$lib/types';
  import styleTemplate from '$lib/styles/maptiler-catppuccin.json';

  // Constants pour détection de changement de langue
  const LANG_CHANGE_FLAG = 'locale_switching';
  const LANG_CHANGE_WINDOW_MS = 2000; // 2 secondes

  // Props avec destructuring Svelte 5
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

  // State
  let mapContainer = $state<HTMLDivElement | null>(null);
  let map = $state<MapLibreMap | null>(null);
  let markerInstance = $state<Marker | null>(null);
  let isTravelingComplete = $state<boolean>(!enableTraveling);

  // Effect pour initialisation
  $effect(() => {
    if (!browser || !mapContainer) return;

    // Import dynamique pour réduire bundle initial
    import('maplibre-gl').then(({ Map, NavigationControl, Marker, Popup }) => {
      // Préparer le style avec la clé API
      const apiKey = env.PUBLIC_MAPTILER_API_KEY;
      const styleString = JSON.stringify(styleTemplate);
      const styleWithKey = styleString.replaceAll('USE_KEY_PARAMETER', apiKey);
      const mapStyle = JSON.parse(styleWithKey);

      // Vérifier si le chargement est dû à un changement de langue
      const langChangeTimestamp = browser && sessionStorage.getItem(LANG_CHANGE_FLAG);
      const isLanguageChange = langChangeTimestamp &&
        (Date.now() - parseInt(langChangeTimestamp)) < LANG_CHANGE_WINDOW_MS;

      // Nettoyer le flag s'il est présent
      if (browser && langChangeTimestamp) {
        sessionStorage.removeItem(LANG_CHANGE_FLAG);
      }

      // Décider si l'animation doit jouer
      const shouldPlayAnimation = enableTraveling && !isLanguageChange;

      // Position initiale (Europe si animation doit jouer, sinon position normale)
      const initialCenter = shouldPlayAnimation ? [10.0, 52.0] as [number, number] : center;
      const initialZoom = shouldPlayAnimation ? 2 : zoom;

      // Initialiser la carte
      map = new Map({
        container: mapContainer,
        style: mapStyle,
        center: initialCenter,
        zoom: initialZoom,
        interactive,
        minZoom,
        maxZoom
      });

      // Ajouter controls et markers
      const addControlsAndMarkers = () => {
        if (!map) return;

        // Ajouter controls si demandé
        if (showControls) {
          map.addControl(new NavigationControl(), 'top-right');
        }

        // Ajouter marker si fourni
        if (marker) {
          // Créer élément HTML personnalisé avec couleur lavender
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

          // Ajouter popup si fourni
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

      // Gérer l'animation traveling si décidée
      if (shouldPlayAnimation) {
        map.on('load', () => {
          if (!map) return;

          // Attendre un peu que la carte s'affiche, puis animer vers la destination
          setTimeout(() => {
            if (!map) return;

            map.flyTo({
              center: center,
              zoom: zoom,
              duration: 5000,
              essential: true
            });

            // Ajouter les controls et markers après le début de l'animation
            setTimeout(() => addControlsAndMarkers(), 500);

            // Marquer le traveling comme terminé après l'animation (8000ms + 500ms de délai)
            setTimeout(() => {
              isTravelingComplete = true;
            }, 5500);
          }, 500);
        });
      } else {
        // Pas d'animation (changement de langue ou traveling désactivé)
        addControlsAndMarkers();
        isTravelingComplete = true;
      }
    });

    // Cleanup
    return () => {
      markerInstance?.remove();
      map?.remove();
    };
  });

  // Effect pour réactivité center/zoom (seulement après le traveling initial)
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
