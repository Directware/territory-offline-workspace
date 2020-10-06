import {Injectable} from '@angular/core';
import {Plugins} from '@capacitor/core';
import * as MapBox from 'mapbox-gl';
import {Drawing, GeocodingResult} from "@territory-offline-workspace/api";
import * as Turf from '@turf/turf';
import {select, Store} from "@ngrx/store";
import {ApplicationState} from "../../store/index.reducers";
import {selectAllTerritoryCards, selectTerritoryCardById} from "../../store/territory-card/territory-card.selectors";
import {first} from "rxjs/operators";
import {mergeDrawings} from "../../utils/usefull.functions";
import {Observable, of} from "rxjs";
import {environment} from "../../../../../../territory-offline/src/environments/environment";
import {HttpClient} from "@angular/common/http";

const {Network} = Plugins;

@Injectable({
  providedIn: 'root'
})
export class MapService
{
  private _map: MapBox.Map;
  private currentMarkers = [];
  private userMarker;
  private readonly mapSourceName = "fc-map-source";

  constructor(private store: Store<ApplicationState>, private http: HttpClient)
  {
  }

  public async initWithAllTerritories()
  {
    const territoryCards = await this.store.pipe(select(selectAllTerritoryCards), first()).toPromise();
    const mergedDrawings = mergeDrawings(territoryCards.map(tc => tc.drawing));
    const center = Turf.center(mergedDrawings.featureCollection).geometry.coordinates;
    this.init(center, mergedDrawings);
  }

  public async initWithOneTerritory(territoryId: string)
  {
    const territoryCard = await this.store.pipe(select(selectTerritoryCardById, territoryId), first()).toPromise();
    const mergedDrawings = mergeDrawings([territoryCard.drawing]);
    const center = Turf.center(mergedDrawings.featureCollection).geometry.coordinates;
    this.init(center, mergedDrawings);
  }

  public focusOn(drawing: Drawing)
  {
    this._map.fitBounds(Turf.bbox(drawing.featureCollection), {padding: 30});
  }

  public setMarker(coordinates, popupText: string)
  {
    const mapMarker = document.createElement('div');
    mapMarker.className = 'mapbox-marker';

    const marker = new MapBox.Marker(mapMarker)
      .setLngLat(coordinates)
      .setPopup(new MapBox.Popup({offset: 25}) // add popups
        .setHTML(popupText))
      .addTo(this._map);

    this.currentMarkers.push(marker);
  }

  public clearAllMarkers()
  {
    this.currentMarkers.forEach((marker: any) => marker.remove());
  }

  public showUserMarker(coordinates)
  {
    if (!this.userMarker)
    {
      const mapMarker = document.createElement('div');
      mapMarker.className = 'mapbox-marker-user';

      this.userMarker = new MapBox.Marker(mapMarker).setLngLat(coordinates).addTo(this._map);
      this._map.flyTo({center: coordinates, zoom: 17});
    }
    else
    {
      this.userMarker.setLngLat(coordinates);

      // this._map.flyTo({center: coordinates});

    }
  }

  public removeUserMarker()
  {
    if (this.userMarker)
    {
      this.userMarker.remove();
    }
  }

  public getCenterPoint()
  {
    return this._map.getCenter();
  }

  public geocode(search: string, territoryProximity: string): Observable<GeocodingResult>
  {
    if (!search)
    {
      return of(null);
    }

    const token = environment.mapboxAccessToken;
    const proximity = territoryProximity;//  || `${this.cachedSettingsCenter.lng},${this.cachedSettingsCenter.lat}`;
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${search}.json?proximity=${proximity}&types=address&access_token=${token}`;

    return this.http.get<GeocodingResult>(url);
  }

  private initLayers()
  {
    const minimalZoom = 8;
    if (!this._map.getLayer('to-map-boundary'))
    {
      this._map.addLayer({
        'id': 'to-map-boundary',
        'type': 'fill',
        'minzoom': minimalZoom,
        'source': this.mapSourceName,
        'filter': ['==', '$type', 'Polygon'],
        'paint': {
          'fill-color': '#4f9cdc',
          'fill-opacity': 0.15
        }
      });
    }

    if (!this._map.getLayer('to-map-lines-boundary'))
    {
      this._map.addLayer({
        'id': 'to-map-lines-boundary',
        'type': 'line',
        'minzoom': minimalZoom,
        'source': this.mapSourceName,
        'paint': {
          'line-width': 1.5,
          'line-color': '#4f9cdc',
          'line-opacity': 1
        }
      });
    }

    if (!this._map.getLayer('to-map-labels'))
    {
      this._map.addLayer({
        'id': 'to-map-labels',
        'type': 'symbol',
        'source': this.mapSourceName,
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

  }

  private init(center, mergedDrawings)
  {
    Network.getStatus()
      .then((status) =>
      {
        if (status.connected)
        {
          this._map = new MapBox.Map({
            container: "fc-map",
            style: 'https://api.maptiler.com/maps/8a0d25a8-3989-4508-9a15-eb9b6366b3fb/style.json?key=JAC0nmE7iwuArAWW6eTi',
            center: center,
            zoom: 13,
            pitchWithRotate: false
          });

          this._map.on('load', () =>
          {
            this._map.addSource(this.mapSourceName, {'type': 'geojson', 'data': mergedDrawings.featureCollection});
            this.initLayers();
            this._map.fitBounds(Turf.bbox(mergedDrawings.featureCollection), {padding: 30});
          });

          this._map.on('click', 'to-map-boundary', (e) =>
          {
            if (e.features && e.features[0])
            {
              this._map.fitBounds(Turf.bbox(e.features[0]), {padding: 30});
            }
          });
        }
      });

  }
}
