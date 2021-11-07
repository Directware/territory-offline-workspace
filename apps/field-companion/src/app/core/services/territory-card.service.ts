import { Injectable, NgZone } from '@angular/core';
import {
  UpsertTerritoryCard,
  UpsertTerritoryCardSuccess,
} from '../store/territory-card/territory-card.actions';
import * as Pako from 'pako';
import { Store } from '@ngrx/store';
import { ApplicationState } from '../store/index.reducers';
import { TerritoryCard } from '@territory-offline-workspace/shared-interfaces';
import { Actions, ofType } from '@ngrx/effects';
import { first, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class TerritoryCardService {
  constructor(
    private store: Store<ApplicationState>,
    private router: Router,
    private ngZone: NgZone,
    private actions$: Actions
  ) {}

  public importTerritory(data) {
    const unzippedData = Pako.inflate(new Uint8Array(data), { to: 'string' });
    if (unzippedData) {
      const parsedData = JSON.parse(unzippedData);
      this.navigateToTerritoryCardAfterAdding();
      this.store.dispatch(UpsertTerritoryCard({ territoryCard: parsedData }));
    }
  }

  public importTerritoryFromFileSystem(data) {
    const unzippedData = Pako.ungzip(data, { to: 'string' });
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
            setTimeout(() => this.router.navigate([`/territory/${action.territoryCard.id}`]), 300)
          )
        )
      )
      .subscribe();
  }
}
