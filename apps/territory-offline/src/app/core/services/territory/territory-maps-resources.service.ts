import {Injectable} from '@angular/core';
import * as MapboxDraw from '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw';
import * as MapBox from 'mapbox-gl';
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.min.js';
import {FeatureCollection} from '@turf/turf';
import {Plugins} from '@capacitor/core';
import {ToMapBoxSources} from '../../model/territory/mapbox/to-mapbox-sources.enum';
import {environment} from '../../../../environments/environment';
import {logger} from '../../utils/usefull.functions';

const {Network} = Plugins;

@Injectable({
  providedIn: 'root'
})
export class TerritoryMapsResourcesService
{
  private _map: MapBox.Map;
  private drawManager: MapboxDraw;
  private currentMarkers: any[];

  constructor()
  {
    MapBox.accessToken = environment.mapboxAccessToken;
  }

  public get map(): MapBox.Map
  {
    return this._map;
  }

  public initMapBoxMap(containerName, center, initialZoom, onload?: Function)
  {
    Network.getStatus()
      .then((status) =>
      {
        if (status.connected)
        {
          this._map = new MapBox.Map({
            container: containerName,
            // style: 'mapbox://styles/jonadab144/ck5z60q5b10y21ijwjc4ugrq9',
            style: 'https://api.maptiler.com/maps/8a0d25a8-3989-4508-9a15-eb9b6366b3fb/style.json?key=JAC0nmE7iwuArAWW6eTi',
            center: center,
            zoom: initialZoom || 13,
            pitchWithRotate: false
          });

          this._map.on('load', () =>
          {
            this.initMapSource(ToMapBoxSources.MAPS);
            this.initMapLayers();
            this.currentMarkers = [];
            this.initGeocoder({position: "top-left"});

            if (onload)
            {
              onload();
            }
          });
        }
      });
  }

  public setMarker(coordinates, popupText: string)
  {
    const mapMarker = document.createElement('div');
    mapMarker.className = 'mapbox-marker';

    const marker = new MapBox.Marker(mapMarker)
      .setLngLat(coordinates)
      .setPopup(new MapBox.Popup({offset: 25}) // add popups
        .setHTML(popupText))
      .addTo(this.map);

    this.currentMarkers.push(marker);
  }

  public clearAllMarkers()
  {
    this.currentMarkers.forEach((marker: any) => marker.remove());
  }

  public initDrawMode(featureCollection?: FeatureCollection, callback?: Function)
  {
    logger("Init draw manager.");
    this.drawManager = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true
      },
      styles: [
        // ACTIVE (being drawn)
        // line stroke
        {
          'id': 'gl-draw-line',
          'type': 'line',
          'filter': ['all', ['==', '$type', 'LineString'], ['!=', 'mode', 'static']],
          'layout': {
            'line-cap': 'round',
            'line-join': 'round'
          },
          'paint': {
            'line-color': '#4f9cdc',
            'line-dasharray': [0.2, 2],
            'line-width': 2
          }
        },
        // polygon fill
        {
          'id': 'gl-draw-polygon-fill',
          'type': 'fill',
          'filter': ['all', ['==', '$type', 'Polygon'], ['!=', 'mode', 'static']],
          'paint': {
            'fill-color': '#4f9cdc',
            'fill-outline-color': '#4f9cdc',
            'fill-opacity': 0.1
          }
        },
        // polygon outline stroke
        // This doesn't style the first edge of the polygon, which uses the line stroke styling instead
        {
          'id': 'gl-draw-polygon-stroke-active',
          'type': 'line',
          'filter': ['all', ['==', '$type', 'Polygon'], ['!=', 'mode', 'static']],
          'layout': {
            'line-cap': 'round',
            'line-join': 'round'
          },
          'paint': {
            'line-color': '#4f9cdc',
            'line-dasharray': [0.2, 2],
            'line-width': 2
          }
        },
        // vertex point halos
        {
          'id': 'gl-draw-polygon-and-line-vertex-halo-active',
          'type': 'circle',
          'filter': ['all', ['==', 'meta', 'vertex'], ['==', '$type', 'Point'], ['!=', 'mode', 'static']],
          'paint': {
            'circle-radius': 9,
            'circle-color': '#FFF'
          }
        },
        // vertex points
        {
          'id': 'gl-draw-polygon-and-line-vertex-active',
          'type': 'circle',
          'filter': ['all', ['==', 'meta', 'vertex'], ['==', '$type', 'Point'], ['!=', 'mode', 'static']],
          'paint': {
            'circle-radius': 7,
            'circle-color': '#4f9cdc',
          }
        },

        // INACTIVE (static, already drawn)
        // line stroke
        {
          'id': 'gl-draw-line-static',
          'type': 'line',
          'filter': ['all', ['==', '$type', 'LineString'], ['==', 'mode', 'static']],
          'layout': {
            'line-cap': 'round',
            'line-join': 'round'
          },
          'paint': {
            'line-color': '#000',
            'line-width': 3
          }
        },
        // polygon fill
        {
          'id': 'gl-draw-polygon-fill-static',
          'type': 'fill',
          'filter': ['all', ['==', '$type', 'Polygon'], ['==', 'mode', 'static']],
          'paint': {
            'fill-color': '#000',
            'fill-outline-color': '#000',
            'fill-opacity': 0.1
          }
        },
        // polygon outline
        {
          'id': 'gl-draw-polygon-stroke-static',
          'type': 'line',
          'filter': ['all', ['==', '$type', 'Polygon'], ['==', 'mode', 'static']],
          'layout': {
            'line-cap': 'round',
            'line-join': 'round'
          },
          'paint': {
            'line-color': '#000',
            'line-width': 3
          }
        }
      ]
    });
    this.map.addControl(this.drawManager, 'top-right');
    this.map.on('draw.create', (e) => callback ? callback(e, this.drawManager) : null);
    this.map.on('draw.delete', (e) => callback ? callback(e, this.drawManager) : null);
    this.map.on('draw.update', (e) => callback ? callback(e, this.drawManager) : null);

    let initialFeatureCollection = featureCollection;

    if (!featureCollection)
    {
      initialFeatureCollection = { type: "FeatureCollection", features: []};
    }

    this.drawManager.add({
      ...initialFeatureCollection,
      features: initialFeatureCollection.features.filter(f => f.geometry.type === 'Polygon')
    });

    // Important! Without this the drawing would be lost
    callback("initial", this.drawManager)
  }

  public destroyDrawMode()
  {
    if (this.drawManager)
    {
      logger("Destroy draw manager.");
      this.map.removeControl(this.drawManager);
      setTimeout(() => this.drawManager = null, 0);
    }
  }

  public setDataForSourceId(sourceId: string, featureCollection: FeatureCollection)
  {
    const currentSource = this.map.getSource(sourceId);

    if (currentSource)
    {
      // console.log(`[TerritoryMapsResourcesService - setDataForSourceId] (sourceId=${sourceId})`, featureCollection);
      currentSource.setData(featureCollection);
    }
    else
    {
      console.log(`[TerritoryMapsResourcesService - setDataForSourceId]: No source found! (sourceId=${sourceId})`);
    }
  }

  private initGeocoder(config: any)
  {
    this.map.addControl(new MapboxGeocoder({
      accessToken: environment.mapboxAccessToken,
      mapboxgl: MapBox
    }), config.position);
  }

  private initMapSource(sourceId: string)
  {
    if (!this.map.getSource(sourceId))
    {
      this.map.addSource(sourceId, {
        'type': 'geojson',
        'data': null
      });
    }
  }

  private initMapLayers()
  {
    const minimalZoom = 8;
    if (!this.map.getLayer('to-map-boundary'))
    {
      this.map.addLayer({
        'id': 'to-map-boundary',
        'type': 'fill',
        'minzoom': minimalZoom,
        'source': ToMapBoxSources.MAPS,
        'filter': ['==', '$type', 'Polygon'],
        'paint': {
          'fill-color': ['get', 'color'],
          'fill-opacity': ['get', 'opacity']
        }
      });
    }

    if (!this.map.getLayer('to-map-lines-boundary'))
    {
      this.map.addLayer({
        'id': 'to-map-lines-boundary',
        'type': 'line',
        'minzoom': minimalZoom,
        'source': ToMapBoxSources.MAPS,
        'paint': {
          'line-width': 1.5,
          'line-color': ['get', 'color'],
          'line-opacity': ['get', 'opacity']
        }
      });
    }

    if (!this.map.getLayer('to-map-labels'))
    {
      this.map.addLayer({
        'id': 'to-map-labels',
        'type': 'symbol',
        'source': ToMapBoxSources.MAPS,
        'maxzoom': 16,
        'minzoom': 10,
        'paint': {
          'text-color': '#000000',
          "text-halo-color": '#ffffff',
          "text-halo-width": 1.5,
          "text-opacity": ['get', 'textOpacity']
        },
        'layout': {
          'text-field': ['get', 'description'],
          'text-variable-anchor': ['center'],
          'text-justify': 'center',
          'text-allow-overlap': false,
          'text-ignore-placement': false,
          'text-size': 14
        }
      });
    }

    if (!this.map.getLayer('to-map-labels-duration'))
    {
      this.map.addLayer({
        'id': 'to-map-labels-duration',
        'type': 'symbol',
        'source': ToMapBoxSources.MAPS,
        'maxzoom': 22,
        'minzoom': 16,
        'paint': {
          'text-color': '#000000',
          "text-halo-color": '#ffffff',
          "text-halo-width": 1.5,
          "text-opacity": ['get', 'textOpacity']
        },
        'layout': {
          'text-field': ['get', 'durationPhrase'],
          'text-variable-anchor': ['center'],
          'text-justify': 'center',
          'text-allow-overlap': false,
          'text-ignore-placement': false,
          'text-size': 14
        }
      });
    }
  }
}
