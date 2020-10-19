import { Component, OnInit } from '@angular/core';
import {select, Store} from "@ngrx/store";
import {ApplicationState} from "../../../core/store/index.reducers";
import {Actions, ofType} from "@ngrx/effects";
import {MatDialogRef} from "@angular/material/dialog";
import {UpsertSettings, UpsertSettingsSuccess} from "../../../core/store/settings/settings.actions";
import {take, tap} from "rxjs/operators";
import {selectSettings} from "../../../core/store/settings/settings.selectors";

@Component({
  selector: 'fc-territory-feature',
  templateUrl: './territory-feature.component.html',
  styleUrls: ['./territory-feature.component.scss']
})
export class TerritoryFeatureComponent implements OnInit {
  public constructor(private store: Store<ApplicationState>,
                     private actions$: Actions,
                     private matDialogRef: MatDialogRef<TerritoryFeatureComponent>)
  {
  }

  public ngOnInit(): void
  {
  }

  public confirm()
  {
    this.actions$.pipe(
      ofType(UpsertSettingsSuccess),
      take(1),
      tap(() => this.matDialogRef.close())
    ).subscribe();

    this.store.pipe(
      select(selectSettings),
      take(1),
      tap(settings => this.store.dispatch(UpsertSettings({
        settings: {
          ...settings,
          confirmedFeatures: {
            ...settings.confirmedFeatures,
            "territories.feature": "true"
          }
        }
      })))
    ).subscribe();
  }
}
