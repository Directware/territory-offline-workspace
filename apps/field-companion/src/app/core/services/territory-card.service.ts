import { Injectable, NgZone } from "@angular/core";
import {
  DeleteTerritoryCard,
  UpsertTerritoryCard,
  UpsertTerritoryCardSuccess,
} from "../store/territory-card/territory-card.actions";
import * as Pako from "pako";
import { select, Store } from "@ngrx/store";
import { ApplicationState } from "../store/index.reducers";
import { TerritoryCard } from "@territory-offline-workspace/shared-interfaces";
import { Actions, ofType } from "@ngrx/effects";
import { first, tap } from "rxjs/operators";
import { Router } from "@angular/router";
import { selectTerritoryCardByTerritoryId } from "../store/territory-card/territory-card.selectors";

@Injectable({
  providedIn: "root",
})
export class TerritoryCardService {
  constructor(
    private store: Store<ApplicationState>,
    private router: Router,
    private ngZone: NgZone,
    private actions$: Actions
  ) {}

  public async importTerritory(data) {
    const unzippedData = Pako.inflate(new Uint8Array(data), { to: "string" });
    if (unzippedData) {
      const parsedData = JSON.parse(unzippedData);

      const features = parsedData.drawing.featureCollection.features.map(
        (feature) => ({
          ...feature,
          properties: {
            ...feature.properties,
            description: parsedData.territory.key, // Should show the territory key on the map
          },
        })
      );

      const editedTerritoryCard = {
        ...parsedData,
        drawing: {
          ...parsedData.drawing,
          featureCollection: {
            ...parsedData.drawing.featureCollection,
            features,
          },
        },
      };

      this.navigateToTerritoryCardAfterAdding();

      const alreadyExistingCard = await this.store
        .pipe(
          select(selectTerritoryCardByTerritoryId, parsedData.territory.id),
          first()
        )
        .toPromise();

      if (alreadyExistingCard) {
        this.store.dispatch(
          DeleteTerritoryCard({ territoryCard: alreadyExistingCard })
        );
      }

      this.store.dispatch(
        UpsertTerritoryCard({
          territoryCard: editedTerritoryCard,
        })
      );
    }
  }

  public importTerritoryFromFileSystem(data) {
    const unzippedData = Pako.ungzip(data, { to: "string" });
    if (unzippedData) {
      const parsedData = JSON.parse(unzippedData) as TerritoryCard;

      if (parsedData.territory && parsedData.id && parsedData.assignment) {
        this.navigateToTerritoryCardAfterAdding();
        this.store.dispatch(UpsertTerritoryCard({ territoryCard: parsedData }));
      }
    }
  }

  private navigateToTerritoryCardAfterAdding() {
    this.actions$
      .pipe(
        ofType(UpsertTerritoryCardSuccess),
        first(),
        tap((action) =>
          this.ngZone.run(() =>
            setTimeout(
              () =>
                this.router.navigate([`/territory/${action.territoryCard.id}`]),
              300
            )
          )
        )
      )
      .subscribe();
  }
}
