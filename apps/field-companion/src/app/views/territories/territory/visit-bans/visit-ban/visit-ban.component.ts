import { Component, OnDestroy, OnInit } from "@angular/core";
import { Observable, Subject } from "rxjs";
import {
  GeocodingResult,
  TerritoryCard,
} from "@territory-offline-workspace/shared-interfaces";
import { select, Store } from "@ngrx/store";
import { ApplicationState } from "../../../../../core/store/index.reducers";
import { selectTerritoryCardById } from "../../../../../core/store/territory-card/territory-card.selectors";
import { ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { debounceTime, first, takeUntil, tap } from "rxjs/operators";
import { v4 as uuid4 } from "uuid";
import { MapService } from "../../../../../core/services/map/map.service";
import * as Turf from "@turf/turf";
import { UpsertTerritoryCard } from "../../../../../core/store/territory-card/territory-card.actions";
import { MatDialog } from "@angular/material/dialog";
import { VisitBanManualChooserComponent } from "../visit-ban-manual-chooser/visit-ban-manual-chooser.component";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "fc-visit-ban",
  templateUrl: "./visit-ban.component.html",
  styleUrls: ["./visit-ban.component.scss"],
})
export class VisitBanComponent implements OnInit, OnDestroy {
  public territoryCard$: Observable<TerritoryCard>;
  public visitBanId: string;
  public geoCoderFormGroup: FormGroup;
  public visitBan: FormGroup;
  public hideMainNavigation = true;
  public isManuallyPositioning: boolean;
  public geoCodingResults: any[];

  public isCreation: boolean;

  private destroyer = new Subject();

  public constructor(
    private store: Store<ApplicationState>,
    private fb: FormBuilder,
    private matDialog: MatDialog,
    private mapsService: MapService,
    private translateService: TranslateService,
    private activatedRoute: ActivatedRoute
  ) {}

  public ngOnInit(): void {
    this.visitBanId = this.activatedRoute.snapshot.params.visitBanId;
    this.territoryCard$ = this.store.pipe(
      select(selectTerritoryCardById, this.activatedRoute.snapshot.params.id),
      tap((territoryCard) => this.initFormGroup(territoryCard))
    );
  }

  public ngOnDestroy() {
    this.destroyer.next();
    this.destroyer.complete();
  }

  public done() {
    window.history.back();
  }

  public save(territoryCard: TerritoryCard) {
    if (this.geoCoderFormGroup.valid && this.visitBan.valid) {
      const rawValueGeoCoder = this.geoCoderFormGroup.getRawValue();
      const rawValue = this.visitBan.getRawValue();

      const newVisitBan = {
        id: uuid4(),
        name: rawValueGeoCoder.name,
        street: rawValue.street,
        streetSuffix: rawValue.streetSuffix,
        creationTime: new Date(),
        gpsPosition: rawValue.gpsPosition,
        city: rawValue.city,
        territoryId: rawValue.territoryId,
        tags: [],
      };

      this.store.dispatch(
        UpsertTerritoryCard({
          territoryCard: {
            ...territoryCard,
            visitBans: [...territoryCard.visitBans, newVisitBan],
          },
        })
      );

      this.done();
    }
  }

  public delete(territoryCard: TerritoryCard) {
    const confirmation = confirm(
      this.translateService.instant("territories.reallyDeleteVisitBan")
    );
    if (confirmation) {
      const index = territoryCard.visitBans.findIndex(
        (vb) => vb.id === this.visitBanId
      );
      territoryCard.visitBans.splice(index, 1);
      this.store.dispatch(UpsertTerritoryCard({ territoryCard }));
      this.done();
    }
  }

  public chooseGeoCodingResult(feature) {
    if (feature.place_name) {
      const splittedPlaceName = feature.place_name.split(",");
      const streetSegment = splittedPlaceName[0].trim().split(" ");
      const streetSuffix = streetSegment.pop();
      const street = streetSegment.join(" ");
      const postalCode = splittedPlaceName[1].trim().split(" ")[1];
      const city = splittedPlaceName[1].trim().split(" ")[1];

      this.visitBan.patchValue(
        {
          street: street,
          streetSuffix: streetSuffix,
          city: city,
          gpsPosition: {
            lng: feature.center[0],
            lat: feature.center[1],
          },
        },
        { emitEvent: true }
      );

      this.visitBan.markAsDirty();
      this.geoCodingResults = null;
    }
  }

  public setVisitBanManually() {
    this.matDialog
      .open(VisitBanManualChooserComponent, {
        disableClose: true,
        panelClass: "visit-ban-manual-chooser",
      })
      .afterClosed()
      .pipe(
        first(),
        tap((gps) => {
          const rawValueGeoCoder = this.geoCoderFormGroup.getRawValue();
          const segmentedAddress = rawValueGeoCoder.address.split(" ");
          const streetSuffix = segmentedAddress.pop();
          const street = segmentedAddress.join(" ");
          this.visitBan.patchValue(
            {
              street: street,
              streetSuffix: streetSuffix,
              city: "",
              gpsPosition: {
                lng: gps.lng,
                lat: gps.lat,
              },
            },
            { emitEvent: true }
          );

          this.visitBan.markAsDirty();
          this.geoCodingResults = null;
        })
      )
      .subscribe();
  }

  private initFormGroup(territoryCard: TerritoryCard) {
    const visitBan = territoryCard.visitBans.find(
      (vb) => vb.id === this.visitBanId
    );
    this.isCreation = !visitBan;

    this.geoCoderFormGroup = this.fb.group({
      name: [
        { value: visitBan ? visitBan.name : "", disabled: !this.isCreation },
      ],
      address: [
        {
          value: visitBan ? visitBan.street + " " + visitBan.streetSuffix : "",
          disabled: !this.isCreation,
        },
        Validators.required,
      ],
    });

    this.visitBan = this.fb.group({
      id: [visitBan ? visitBan.id : uuid4(), Validators.required],
      street: [visitBan ? visitBan.street : null, Validators.required],
      streetSuffix: [
        visitBan ? visitBan.streetSuffix : null,
        Validators.required,
      ],
      city: [visitBan ? visitBan.city : null],
      territoryId: [territoryCard.territory.id, Validators.required],
      gpsPosition: {
        lng: [
          visitBan && visitBan.gpsPosition ? visitBan.gpsPosition.lng : null,
          Validators.required,
        ],
        lat: [
          visitBan && visitBan.gpsPosition ? visitBan.gpsPosition.lat : null,
          Validators.required,
        ],
      },
    });

    if (this.isCreation) {
      this.initGeoCoder();
    }
  }

  private async initGeoCoder() {
    const territoryCard = await this.store
      .pipe(
        select(selectTerritoryCardById, this.activatedRoute.snapshot.params.id),
        first()
      )
      .toPromise();
    const center = Turf.center(territoryCard.drawing.featureCollection);

    this.geoCoderFormGroup
      .get("address")
      .valueChanges.pipe(
        takeUntil(this.destroyer),
        debounceTime(500),
        tap((address: string) => {
          const hasNumberRegExp = /[0-9]/;

          if (
            !!address &&
            address.length > 3 &&
            hasNumberRegExp.test(address)
          ) {
            this.mapsService
              .geocode(
                `${address}`,
                `${center.geometry.coordinates[0]},${center.geometry.coordinates[1]}`
              )
              .subscribe(
                async (result: GeocodingResult) => {
                  if (result) {
                    this.geoCodingResults = result.features;
                  }
                },
                (error) => {
                  this.geoCodingResults = [];
                }
              );
          } else {
            this.geoCodingResults = null;
          }
        })
      )
      .subscribe();
  }
}
