import {ElementRef, Injectable} from '@angular/core';
import {select, Store} from '@ngrx/store';
import * as Turf from '@turf/turf';
import {Observable, of} from 'rxjs';
import {concatMap, mergeMap, take, tap, withLatestFrom} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {TerritoryMapsResourcesService} from './territory-maps-resources.service';
import {Actions, ofType} from '@ngrx/effects';
import {ApplicationState} from '../../store/index.reducers';
import {selectSettings} from '../../store/settings/settings.selectors';
import {environment} from '../../../../environments/environment';
import {selectAllDrawings} from '../../store/drawings/drawings.selectors';
import {SettingsState} from '../../store/settings/settings.reducer';
import {UpsertDrawingSuccess} from '../../store/drawings/drawings.actions';
import {Router} from "@angular/router";
import {selectTerritoryByDrawingId} from "../../store/territories/territories.selectors";
import {
  allTerritoryStatus,
  Drawing,
  GeocodingResult, Territory,
  TerritoryDrawingPrintConfiguration, TerritoryStatus, ToMapBoxSources
} from "@territory-offline-workspace/shared-interfaces";
import {mergeDrawings} from "@territory-offline-workspace/shared-utils";

@Injectable({providedIn: 'root'})
export class TerritoryMapsService
{
  private activeFeaturesProps = {
    opacity: 0.4,
    textOpacity: 1
  };

  private cachedDrawings: Drawing[];
  private currentlyFocusedOnDrawingIds: string[];
  private cachedPadding: { top: number, right: number; bottom: number, left: number };
  private cachedSettingsCenter: { lat: number, lng: number };
  private visibleTerritoryStatus = allTerritoryStatus();

  private shouldBlockMapSynchronizer: boolean;

  constructor(
    private store: Store<ApplicationState>,
    private actions: Actions,
    private mapsResources: TerritoryMapsResourcesService,
    private router: Router,
    private http: HttpClient
  )
  {
  }

  public initJustMap(config: any)
  {
    this.mapsResources.initMapBoxMap(config.containerName, config.center, config.initialZoom);
  }

  public initMapWithDrawings(config: any, onload?: Function)
  {
    this.getDrawingsSnapshot()
      .pipe(
        tap(([drawings, settings]) => this.cachedSettingsCenter = settings.territoryOrigin),
        tap(([drawings, settings]) =>
          this.mapsResources.initMapBoxMap(
            config.containerName,
            this.getCenterOfAllDrawings(drawings, settings),
            config.initialZoom,
            () =>
            {
              if (onload)
              {
                onload();
              }
              this.showDrawingsOnTheMap(drawings)
            }
          )
        )
      ).subscribe();
  }

  public updateDrawingStatus()
  {
    setTimeout(() =>
    {
      this.store.pipe(
        select(selectAllDrawings),
        take(1),
        tap((drawings) =>
        {
          this.cachedDrawings = drawings;
          this.showDrawingsOnTheMap(this.cachedDrawings)
        })
      ).subscribe();
    }, 150);
  }

  public geocode(search: string, territoryProximity?: string): Observable<GeocodingResult>
  {
    if (!search)
    {
      return of(null);
    }

    const token = environment.mapboxAccessToken;
    const proximity = territoryProximity || `${this.cachedSettingsCenter.lng},${this.cachedSettingsCenter.lat}`;
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${search}.json?proximity=${proximity}&types=address&access_token=${token}`;

    return this.http.get<GeocodingResult>(url);
  }

  public destroyMap(elementRef: ElementRef)
  {
    const canvas = elementRef.nativeElement.querySelector('canvas');
    if (canvas)
    {
      const webglContext = canvas.getContext('webgl');
      webglContext.getExtension('WEBGL_lose_context').loseContext();
      webglContext.canvas.width = 1;
      webglContext.canvas.height = 1;
    }
  }

  public setPrintingDrawingColor(color: string, opacity: number)
  {
    this.setPropsOnFeatures(this.cachedDrawings, {
      color: color,
      opacity: opacity,
      textOpacity: 0
    }, {opacity: 0, textOpacity: 0});
  }

  public removePrintingDrawingColor()
  {
    const drawingId = this.currentlyFocusedOnDrawingIds[0];
    const drawing = this.cachedDrawings.filter(cd => cd.id === drawingId)[0];
    this.setPropsOnFeatures(this.cachedDrawings, {
      color: drawing.featureCollection.features[0].properties.status,
      textOpacity: 1
    }, {})
  }

  public wholeVisitBansView()
  {
    this.setPropsOnFeatures(this.cachedDrawings, {
      color: "#181e25",
      opacity: 0.1,
      textOpacity: 0.5
    }, {})
  }

  public leaveWholeVisitBansView()
  {
    this.setPropsOnFeatures(this.cachedDrawings, {
      opacity: this.activeFeaturesProps.opacity,
      textOpacity: this.activeFeaturesProps.textOpacity
    }, {})
  }

  public rotateMap()
  {
    let bearing = this.mapsResources.map.transform.bearing + 90;
    if (bearing >= 360)
    {
      bearing = 0;
    }
    this.mapsResources.map.rotateTo(bearing);
  }

  public resetNorth()
  {
    this.mapsResources.map.resetNorth();
  }

  public fitBoundsOfCurrent()
  {

  }

  public getCachedPadding()
  {
    return this.cachedPadding;
  }

  public getMap()
  {
    return this.mapsResources.map;
  }

  public setMarker(id: string, coordinates, popupText: string)
  {
    this.mapsResources.setMarker(id, coordinates, popupText);
  }

  public clearMarker(id: string)
  {
    this.mapsResources.clearMarker(id);
  }

  public goTo(lng: number, lat: number, zoom = 14)
  {
    this.mapsResources.map.flyTo({center: [lng, lat], zoom: zoom});
  }

  public setShouldBlockMapSynchronizer(shouldBlock: boolean)
  {
    this.shouldBlockMapSynchronizer = shouldBlock;
  }

  public clearMarkers()
  {
    this.mapsResources.clearAllMarkers();
  }

  public getMapParametersSnapshot(): TerritoryDrawingPrintConfiguration
  {
    return {
      bearing: this.mapsResources.map.getBearing(),
      zoom: this.mapsResources.map.getZoom(),
      pitch: this.mapsResources.map.getPitch(),
      center: this.mapsResources.map.getCenter(),
      bounds: this.mapsResources.map.getBounds()
    };
  }

  public applyMapParameterSnapshot(config: TerritoryDrawingPrintConfiguration)
  {
    if (config)
    {
      this.mapsResources.map.setBearing(config.bearing);
      this.mapsResources.map.setZoom(config.zoom);
      this.mapsResources.map.setPitch(config.pitch);
      this.mapsResources.map.setCenter(config.center);
    }
  }

  public deleteDrawingFromCache(drawingId: string)
  {
    this.cachedDrawings = this.cachedDrawings.filter(d => d.id !== drawingId);
    this.setPropsOnFeatures(this.cachedDrawings, this.activeFeaturesProps, {});
  }

  public initMapSynchronizer()
  {
    this.mapsResources.map.on('click', 'to-map-boundary', (e) =>
    {
      this.store.pipe(
        select(selectTerritoryByDrawingId, e.features[0].properties.drawingId),
        take(1),
        tap((territory: Territory) =>
        {
          if (!this.shouldBlockMapSynchronizer && territory && !this.currentlyFocusedOnDrawingIds?.includes(territory.territoryDrawingId))
          {
            this.router.navigate([{outlets: {'second-thread': ['territory', territory.id]}}]);
          }
        })
      ).subscribe();
    });
  }

  public initDrawMode(drawingId: string, callback?: Function)
  {
    const drawingInEditableMode = this.cachedDrawings.filter(d => d.id === drawingId)[0];
    this.showDrawingsOnTheMap(this.cachedDrawings.filter(d => d.id !== drawingId));

    if (drawingInEditableMode)
    {
      this.mapsResources.initDrawMode(drawingInEditableMode.featureCollection, callback);
    }
    else
    {
      this.mapsResources.initDrawMode(null, callback);
    }
  }

  public addToDrawingManager(geoJson: any)
  {
    return this.mapsResources.addToDrawingManager(geoJson, this.cachedPadding);
  }

  public destroyDrawMode(updateCache?: boolean)
  {
    this.mapsResources.destroyDrawMode();

    if (updateCache)
    {
      this.actions
        .pipe(
          ofType(UpsertDrawingSuccess),
          take(1),
          mergeMap(() => this.getDrawingsSnapshot()),
          tap(() => this.showDrawingsOnTheMap(this.cachedDrawings))
        ).subscribe();
    }
  }

  public setPadding(padding: any)
  {
    if (this.mapsResources.map)
    {
      this.cachedPadding = padding;
      const mergedDrawings = this.mergeDrawingsConsideringCurrentlyFocused();

      if (mergedDrawings)
      {
        this.mapsResources.map.fitBounds(Turf.bbox(mergedDrawings.featureCollection), {padding: this.cachedPadding});
      }
    }
  }

  public focusOnDrawingIds(drawingIds?: string[])
  {
    try
    {
      this.currentlyFocusedOnDrawingIds = drawingIds;
      const mergedDrawings = this.mergeDrawingsConsideringCurrentlyFocused();

      if (mergedDrawings && mergedDrawings.featureCollection.features.length > 0)
      {
        this.mapsResources.map.fitBounds(Turf.bbox(mergedDrawings.featureCollection), {padding: this.cachedPadding});

        this.setPropsOnFeatures(this.cachedDrawings, this.activeFeaturesProps, {
          opacity: 0.1
        });
      }
    } catch (e)
    {
      console.warn(e);
    }
  }

  public focusOnMarkers()
  {
    this.mapsResources.focusOnMarkers(this.cachedPadding);
  }

  public setFilterDrawingsByStatus(status: TerritoryStatus, enable: boolean): { drawings: Drawing[], visibleTerritoryStatus: TerritoryStatus[] }
  {
    if (enable)
    {
      this.visibleTerritoryStatus = [...this.visibleTerritoryStatus, status];
    }
    else
    {
      this.visibleTerritoryStatus = [...this.visibleTerritoryStatus.filter(s => s !== status)]
    }

    this.getMap().setFilter('to-map-boundary', ['in', ['get', 'status'], ['literal', this.visibleTerritoryStatus]]);
    this.getMap().setFilter('to-map-lines-boundary', ['in', ['get', 'status'], ['literal', this.visibleTerritoryStatus]]);
    this.getMap().setFilter('to-map-labels', ['in', ['get', 'status'], ['literal', this.visibleTerritoryStatus]]);

    return {
      drawings: this.cachedDrawings,
      visibleTerritoryStatus: this.visibleTerritoryStatus
    };
  }

  public resetFilterDrawing()
  {
    this.visibleTerritoryStatus = allTerritoryStatus();
    this.getMap().setFilter('to-map-boundary', ['in', ['get', 'status'], ['literal', this.visibleTerritoryStatus]]);
  }

  /*
    public changeColorForAll(config: any)
    {
      this._currentFeatureCollection.features.forEach((feature) => feature.properties.color = config[feature.properties.drawingId]);
      this.mapsResources.setDataForSourceId(ToMapBoxSources.MAPS, this._currentFeatureCollection);
    }

    public focusTerritories(config: any)
    {
      this._currentFeatureCollection.features.forEach((feature) =>
      {
        if (config[feature.properties.drawingId])
        {
          feature.properties.opacity = this.config.fillMaxOpacity;
          feature.properties.visibility = 1;
        }
      });
      this.mapsResources.setDataForSourceId(ToMapBoxSources.MAPS, this._currentFeatureCollection);
    }

    public hideTerritories(config: any)
    {
      this._currentFeatureCollection.features.forEach((feature) =>
      {
        if (config[feature.properties.drawingId])
        {
          feature.properties.opacity = 0;
          feature.properties.visibility = 0;
        }
      });
      this.mapsResources.setDataForSourceId(ToMapBoxSources.MAPS, this._currentFeatureCollection);
    }

    public hideAllButNot(featuresToBeDisplayed: any = {})
    {
      this._currentFeatureCollection
        .features
        .filter((feature) => !featuresToBeDisplayed[feature.properties.drawingId])
        .forEach((feature) =>
        {
          feature.properties.opacity = 0;
          feature.properties.visibility = 0;
        });

      this.mapsResources.setDataForSourceId(ToMapBoxSources.MAPS, this._currentFeatureCollection);
    }

    public showAllButNot(featuresToBeDisplayed: any = {})
    {
      this._currentFeatureCollection
        .features
        .filter((feature) => !featuresToBeDisplayed[feature.properties.drawingId])
        .forEach((feature) =>
        {
          feature.properties.opacity = this.config.fillMaxOpacity;
          feature.properties.visibility = 1;
        });
      this.mapsResources.setDataForSourceId(ToMapBoxSources.MAPS, this._currentFeatureCollection);
    }

    public fitByTerritories(featuresToBeDisplayed: any, config: any = {animate: true})
    {
      let featureCollection = this._currentFeatureCollection;

      if (featuresToBeDisplayed)
      {
        featureCollection = {
          ...featureCollection,
          features: this._currentFeatureCollection.features.filter(f => !!featuresToBeDisplayed[f.properties.drawingId])
        };
      }

      this.mapsResources.map.fitBounds(Turf.bbox(featureCollection), config);
    }

    public hideTerritoryLabel()
    {
      this._currentFeatureCollection.features.forEach(f => f.properties.visibility = 0);
      this.mapsResources.setDataForSourceId(ToMapBoxSources.MAPS, this._currentFeatureCollection);
      // const drawingIdsToBeHidden = territories.map(t => t.territoryDrawingId);
      // this.changeFeatureCollectionProperties(drawingIdsToBeHidden, {visibility: 0});
    }

   */
  private getDrawingsSnapshot()
  {
    return this.store
      .pipe(
        select(selectAllDrawings),
        concatMap(drawings => of(drawings).pipe(
          withLatestFrom(this.store.pipe(select(selectSettings)))
        )),
        take(1),
        tap(([drawings, settings]) => this.cachedDrawings = drawings)
      );
  }

  private showDrawingsOnTheMap(drawings: Drawing[], callback?: Function)
  {
    if (drawings && drawings.length > 0)
    {
      this.setPropsOnFeatures(drawings, this.activeFeaturesProps, {opacity: 0.1});

      if (callback)
      {
        callback();
      }
    }
  }

  private getCenterOfAllDrawings(drawings: Drawing[], settings: SettingsState)
  {
    if (!drawings || drawings.length === 0)
    {
      return [settings.territoryOrigin.lng, settings.territoryOrigin.lat];
    }

    return Turf.center(this.mergeDrawings(drawings).featureCollection).geometry.coordinates;
  }

  private mergeDrawingsConsideringCurrentlyFocused()
  {
    let eligibleDrawings = this.cachedDrawings;

    if (this.currentlyFocusedOnDrawingIds)
    {
      eligibleDrawings = this.cachedDrawings.filter(d => this.currentlyFocusedOnDrawingIds.includes(d.id));
    }

    return this.mergeDrawings(eligibleDrawings);
  }

  private mergeDrawings(drawings: Drawing[]): Drawing
  {
    return mergeDrawings(drawings);
  }

  private setPropsOnFeatures(drawings: Drawing[], activeProps: any, inactiveProps: any)
  {
    const mergedDrawings = this.mergeDrawings(drawings);

    mergedDrawings.featureCollection.features.forEach(feature =>
    {
      if ((feature.properties.drawingId && this.currentlyFocusedOnDrawingIds && this.currentlyFocusedOnDrawingIds.includes(feature.properties.drawingId))
        || !this.currentlyFocusedOnDrawingIds
        || this.currentlyFocusedOnDrawingIds.length === 0)
      {
        feature.properties = {
          ...feature.properties,
          ...activeProps,
          color: activeProps.color ? activeProps.color : feature.properties.status
        };
      }
      else
      {
        feature.properties = {
          ...feature.properties,
          ...inactiveProps,
          color: inactiveProps.color ? inactiveProps.color : feature.properties.status
        };
      }
    });

    this.mapsResources.setDataForSourceId(ToMapBoxSources.MAPS, mergedDrawings.featureCollection);
  }
}

