import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {Router} from '@angular/router';
import {LoadSettings, LoadSettingsSuccess, LockApp, UnlockApp, UpsertSettings, UpsertSettingsSuccess} from './settings.actions';
import {map, switchMap, tap} from 'rxjs/operators';
import {from} from 'rxjs';
import {SettingsState} from './settings.reducer';
import {SettingsDatabaseService} from '../../services/db/settings-database.service';
import {LastDoingsService} from "../../services/common/last-doings.service";

@Injectable()
export class SettingsEffects
{
  public loadSettings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LoadSettings),
      map((action) => this.database.load()),
      switchMap((promise: Promise<SettingsState>) => from(promise)),
      map((settings) => LoadSettingsSuccess({settings: settings}))
    )
  );

  public upsertSettings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UpsertSettings),
      map((action) => this.database.upsert(action.settings)),
      switchMap((promise: Promise<SettingsState>) => from(promise)),
      map((settings) => UpsertSettingsSuccess({settings: settings}))
    )
  );

  public lockApp$ = createEffect(() =>
      this.actions$.pipe(
        ofType(LockApp),
        tap(() => this.router.navigate([{outlets: {global: ['lock-screen']}}]))
      ),
    {dispatch: false});

  public unlockApp$ = createEffect(() =>
      this.actions$.pipe(
        ofType(UnlockApp),
        tap(() => this.router.navigate([{outlets: {global: null}}])),
        tap(() => setTimeout(() => this.router.navigate(['dashboard']), 0))
      ),
    {dispatch: false});

  constructor(private actions$: Actions,
              private database: SettingsDatabaseService,
              private lastDoingsService: LastDoingsService,
              private router: Router) {}
}
