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
import {isInLocationPath} from "../../../core/utils/usefull.functions";
import {GeocodingResult, LastDoingActionsEnum, VisitBan} from "@territory-offline-workspace/api";

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
  private destroyer = new Subject();
  private geoCodingInitialisationDone: boolean;

  constructor(private fb: FormBuilder,
              private store: Store<ApplicationState>,
              private actions$: Actions,
              private mapsService: TerritoryMapsService,
              private router: Router,
              private lastDoingsService: LastDoingsService,
              private territoryMapsService: TerritoryMapsService,
              private activatedRoute: ActivatedRoute)
  {
  }

  public ngOnInit(): void
  {
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
    this.mapsService.clearMarkers();
    this.destroyer.next();
    this.destroyer.complete();
  }

  public cancel()
  {
    if (isInLocationPath("/all-visit-bans"))
    {
      window.history.back();
      return;
    }
    this.router.navigate([{outlets: {'second-thread': ['visit-bans', this.activatedRoute.snapshot.params.territoryId]}}]);
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
    const canDelete = confirm("Möchtest du diese Adresse wirklich löschen?");

    if (canDelete)
    {
      this.actions$.pipe(
        ofType(DeleteVisitBanSuccess),
        take(1),
        tap(() => this.cancel())
      ).subscribe();

      this.store.dispatch(DeleteVisitBan({visitBan: this.visitBan.getRawValue()}));
    }
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

    const territory = await this.chooseTerritoryConsideringFeature(feature);

    this.visitBan.patchValue({
      street: street,
      streetSuffix: feature.address,
      city: cityName,
      territoryId: territory ? territory.id : null,
      gpsPosition: {
        lng: feature.center[0],
        lat: feature.center[1]
      }
    });

    this.mapsService.clearMarkers();
    this.mapsService.goTo(feature.center[0], feature.center[1]);
    this.mapsService.setMarker(feature.center, "");
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

    if (vb && vb.gpsPosition)
    {
      this.mapsService.setMarker([vb.gpsPosition.lng, vb.gpsPosition.lat], `<p>${vb.name || 'kein Name'}</p>`);
    }

    if (vb && vb.street && vb.streetSuffix)
    {
      this.geoCodingForm.patchValue(`${vb.street} ${vb.streetSuffix}`, {emitEvent: false})
    }
  }

  private async chooseTerritoryConsideringFeature(feature): Promise<any>
  {
    const territory = await combineLatest([
      this.store.pipe(select(selectAllDrawings)),
      this.store.pipe(select(selectAllTerritories))
    ]).pipe(
      take(1),
      map(([drawings, territories]) =>
      {
        const drawing = drawings.filter((d) =>
          d.featureCollection
            .features
            .filter(f => f.geometry.type === "Polygon")
            .filter(f =>
            {
              // @ts-ignore
              const polygon = Turf.polygon(f.geometry.coordinates);
              return Turf.booleanPointInPolygon(feature.center, polygon);
            }).length > 0
        )[0];

        if (drawing)
        {
          return territories.filter(t => t.territoryDrawingId === drawing.id)[0];
        }
        console.log("keine zeichnung");

        return null;
      })).toPromise()

    return territory;
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
