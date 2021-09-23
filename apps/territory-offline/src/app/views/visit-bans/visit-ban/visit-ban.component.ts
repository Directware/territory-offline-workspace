import {TranslateService} from '@ngx-translate/core';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {select, Store} from '@ngrx/store';
import {ApplicationState} from '../../../core/store/index.reducers';
import {Actions, ofType} from '@ngrx/effects';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {debounceTime, map, take, takeUntil, tap} from 'rxjs/operators';
import {selectVisitBanById} from '../../../core/store/visit-bans/visit-bans.selectors';
import {
  DeleteVisitBan,
  DeleteVisitBanSuccess,
  UpsertVisitBan,
  UpsertVisitBanSuccess
} from '../../../core/store/visit-bans/visit-bans.actions';
import {v4 as uuid} from 'uuid';
import {combineLatest, Subject} from 'rxjs';
import {TerritoryMapsService} from '../../../core/services/territory/territory-maps.service';
import {LastDoingsService} from "../../../core/services/common/last-doings.service";
import {selectAllDrawings} from "../../../core/store/drawings/drawings.selectors";
import {selectAllTerritories} from "../../../core/store/territories/territories.selectors";
import * as Turf from '@turf/turf';
import {GeocodingResult, LastDoingActionsEnum, Territory, VisitBan} from "@territory-offline-workspace/shared-interfaces";
import {isInLocationPath} from "@territory-offline-workspace/shared-utils";

@Component({
  selector: 'app-visit-ban',
  templateUrl: './visit-ban.component.html',
  styleUrls: ['./visit-ban.component.scss']
})
export class VisitBanComponent implements OnInit, OnDestroy
{
  public geoCodingForm = new FormControl();
  public geoCodingResults: any[];
  public shouldManualPicAddress: boolean;
  public visitBan: FormGroup;
  public isCreation: boolean;
  public editLastVisit: boolean;
  public isManuallyPositioning: boolean;
  private destroyer = new Subject();
  private geoCodingInitialisationDone: boolean;

  constructor(private fb: FormBuilder,
              private store: Store<ApplicationState>,
              private actions$: Actions,
              private mapsService: TerritoryMapsService,
              private router: Router,
              private lastDoingsService: LastDoingsService,
              private territoryMapsService: TerritoryMapsService,
              private activatedRoute: ActivatedRoute,
              private translate: TranslateService)
  {
  }

  public ngOnInit(): void
  {
    if (!isInLocationPath("all-visit-bans"))
    {
      this.mapsService.setShouldBlockMapSynchronizer(true);
    }

    this.activatedRoute.params
      .pipe(
        takeUntil(this.destroyer),
        tap((params) => this.considerInitialisingFromVisitBan(params))
      ).subscribe();

    this.geoCodingForm
      .valueChanges
      .pipe(
        takeUntil(this.destroyer),
        debounceTime(400),
        tap((input: string) => this.geocode(input))
      ).subscribe();

  }

  public ngOnDestroy(): void
  {
    if (!isInLocationPath("all-visit-bans"))
    {
      this.mapsService.clearMarkers();
      this.mapsService.setShouldBlockMapSynchronizer(false);
    }

    this.destroyer.next();
    this.destroyer.complete();
  }

  public cancel()
  {
    if (isInLocationPath("all-visit-bans"))
    {
      this.router.navigate([{outlets: {'second-thread': null}}]);
      return;
    }
    this.router.navigate([{outlets: {'second-thread': ['visit-bans', this.activatedRoute.snapshot.params.territoryId]}}]);
  }

  public reset()
  {
    this.visitBan.patchValue({territoryId: null, street: ""});
    this.geoCodingForm.reset();
    this.mapsService.clearMarkers();
  }

  public setVisitBanManually()
  {
    this.isManuallyPositioning = true;

    this.mapsService
      .getMap()
      .once('click', async (e) =>
      {
        const address = this.geoCodingForm.value.split(" ");
        const street = address.shift();
        const streetSuffix = address.join(" ");

        await this.setVisitBan(e.lngLat.lng, e.lngLat.lat, street, streetSuffix, "");
        this.isManuallyPositioning = false;
      });
  }

  public createVisitBans()
  {
    const lastDoingAction = this.isCreation ? LastDoingActionsEnum.CREATE : LastDoingActionsEnum.UPDATE;
    this.actions$.pipe(
      ofType(UpsertVisitBanSuccess),
      take(1),
      tap((action) => this.lastDoingsService.createLastDoing(lastDoingAction, action.visitBan.street + " " + action.visitBan.streetSuffix)),
      tap(() => this.cancel())
    ).subscribe();

    this.store.dispatch(UpsertVisitBan({visitBan: this.visitBan.getRawValue()}));
  }

  public deleteVisitBan()
  {
    this.translate.get('visitBan.reallyDelete').pipe(take(1)).subscribe((translation: string) =>
    {
      const canDelete = confirm(translation);

      if (canDelete)
      {
        this.actions$.pipe(
          ofType(DeleteVisitBanSuccess),
          take(1),
          tap(() => this.cancel())
        ).subscribe();

        this.store.dispatch(DeleteVisitBan({visitBan: this.visitBan.getRawValue()}));
      }
    });
  }

  public setLastVisitToday()
  {
    this.visitBan.patchValue({ lastVisit: new Date()});
    this.visitBan.markAsDirty();
  }

  public geoCodeAgainCurrentPlaceName()
  {
    this.geocode(`${this.visitBan.get("street").value} ${this.visitBan.get("streetSuffix").value}`)
  }

  public async chooseGeoCodingResult(feature)
  {
    let cityName = '';
    let street = null;
    if (feature.place_name)
    {
      const splittedPlaceName = feature.place_name.split(',');
      const streetWithSuffix = splittedPlaceName[0];
      const postalCodeAndCityName = splittedPlaceName[1];

      if (streetWithSuffix)
      {
        const streetWithoutSuffix = streetWithSuffix.trim().replace(/[0-9]/g, '');
        street = streetWithoutSuffix.trim();
      }

      if (postalCodeAndCityName)
      {
        cityName = postalCodeAndCityName.trim().split(' ')[1];
      }
    }

    await this.setVisitBan(feature.center[0], feature.center[1], street, feature.address, cityName);
  }

  private async setVisitBan(lng: number, lat: number, street: string, streetSuffix: string, cityName: string)
  {
    const territories = await this.chooseTerritoryConsideringFeature(lng, lat);

    if (!territories.length)
    {
      this.translate.get('visitBan.noTerritoryMapped').pipe(take(1)).subscribe((translation: string) =>
        alert(translation));
      return;
    }

    if (territories.length > 1)
    {
      const tNames = territories.map(t => t.key + " " + t.name).join(", ");
      this.translate.get('visitBan.noTerritoryMapped', {
        count: territories.length,
        territories: tNames
      }).pipe(take(1)).subscribe((translation: string) =>
        alert(translation));
      return;
    }
    const territory = territories[0];

    this.visitBan.patchValue({
      street: street,
      streetSuffix: streetSuffix,
      city: cityName,
      territoryId: territory ? territory.id : null,
      gpsPosition: {
        lng: lng,
        lat: lat
      }
    });

    if (!isInLocationPath("all-visit-bans"))
    {
      this.mapsService.clearMarkers();
      this.mapsService.setMarker(this.visitBan.get("id").value, [lng, lat], "");
    }

    this.visitBan.markAsDirty();
    this.geoCodingResults = null;

    if (!territory)
    {
      this.shouldManualPicAddress = true;
    }
  }

  private considerInitialisingFromVisitBan(snapshotParams: Params)
  {
    if (snapshotParams.id)
    {
      this.isCreation = false;
      this.store
        .pipe(
          select(selectVisitBanById, snapshotParams.id),
          take(1),
          tap(visitBan => this.initFormGroup(visitBan, snapshotParams.territoryId))
        ).subscribe();
    }
    else
    {
      this.isCreation = true;
      this.initFormGroup(null, snapshotParams.territoryId);
    }
  }

  private initFormGroup(vb: VisitBan, territoryId: string)
  {
    this.visitBan = this.fb.group({
      id: [vb ? vb.id : uuid(), Validators.required],
      creationTime: [vb && vb.creationTime ? vb.creationTime : new Date()],
      name: [vb ? vb.name : ''],
      street: [vb ? vb.street : '', Validators.required],
      streetSuffix: [vb ? vb.streetSuffix : '', Validators.required],
      territoryId: [vb ? vb.territoryId : territoryId, Validators.required],
      city: [vb ? vb.city : ''],
      floor: [vb ? vb.floor : ''],
      lastVisit: [vb ? vb.lastVisit : null],
      comment: [vb ? vb.comment : ''],
      gpsPosition: [vb ? vb.gpsPosition : null, Validators.required],
      tags: [vb ? vb.tags : []]
    });

    if (vb && vb.gpsPosition && !this.router.url.includes("all-visit-bans"))
    {
      const translation = this.translate.instant('visitBan.noName');
      this.mapsService.setMarker(vb.id, [vb.gpsPosition.lng, vb.gpsPosition.lat], `<p>${vb.name || translation}</p>`);
    }

    if (vb && vb.street && vb.streetSuffix)
    {
      this.geoCodingForm.patchValue(`${vb.street} ${vb.streetSuffix}`, {emitEvent: false})
    }
  }

  private async chooseTerritoryConsideringFeature(lng: number, lat: number): Promise<Territory[]>
  {
    const applicableTerritories = await combineLatest([
      this.store.pipe(select(selectAllDrawings)),
      this.store.pipe(select(selectAllTerritories))
    ]).pipe(
      take(1),
      map(([drawings, territories]) =>
      {
        const applicableDrawings = drawings.filter((d) =>
          d.featureCollection
            .features
            .filter(f => f.geometry.type === "Polygon")
            .filter(f =>
            {
              // @ts-ignore
              const polygon = Turf.polygon(f.geometry.coordinates);
              return Turf.booleanPointInPolygon(Turf.point([lng, lat]), polygon);
            }).length > 0
        );

        if (applicableDrawings.length)
        {
          return territories.filter(t => applicableDrawings.map(d => d.id).includes(t.territoryDrawingId));
        }

        return [];
      })).toPromise()

    return applicableTerritories;
  }

  private geocode(input: string)
  {
    const hasNumberRegExp = /[0-9]/;

    if (!!input && input.length > 3 && hasNumberRegExp.test(input))
    {
      this.territoryMapsService
        .geocode(`${input}`)
        .subscribe(async (result: GeocodingResult) =>
          {
            if (result)
            {
              this.geoCodingResults = result.features;
            }
          },
          (error) =>
          {
            this.geoCodingResults = [];
          });
    }
    else
    {
      this.geoCodingResults = null;
    }
  }
}
