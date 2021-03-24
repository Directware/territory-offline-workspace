import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {LoadSettings, LoadSettingsSuccess, UpsertSettings, UpsertSettingsSuccess} from './settings.actions';
import {map, switchMap} from 'rxjs/operators';
import {from} from 'rxjs';
import {SettingsState} from "./settings.reducer";
import {AppDatabaseService} from "../../services/database/app-database.service";
import {settingsCollectionName, TimedEntity} from "@territory-offline-workspace/shared-interfaces";

@Injectable()
export class SettingsEffects
{
  public loadSettings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LoadSettings),
      map((action) => this.database.load(settingsCollectionName)),
      switchMap((promise: Promise<TimedEntity[]>) => from(promise)),
      map(settings => settings[0]),
      map((settings: SettingsState) => LoadSettingsSuccess({settings}))
    )
  );

  public upsertSettings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UpsertSettings),
      map((action) => this.database.upsert(settingsCollectionName, action.settings)),
      switchMap((promise: Promise<TimedEntity>) => from(promise)),
      map((settings: SettingsState) => UpsertSettingsSuccess({settings}))
    )
  );

  constructor(private actions$: Actions, private database: AppDatabaseService)
  {
  }
}
