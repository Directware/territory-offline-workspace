import {Injectable} from '@angular/core';
import {Actions, ofType} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {take, tap} from 'rxjs/operators';
import {ApplicationState} from '../store/index.reducers';
import {LoadSettings, LoadSettingsSuccess} from '../store/settings/settings.actions';
import {ToUpdatesService} from './common/to-updates.service';
import {SettingsState} from '../store/settings/settings.reducer';
import {DataSecurityService} from "./common/data-security.service";
import {DatabaseService} from "./db/database.service";
import {SettingsDatabaseService} from "./db/settings-database.service";
import {environment} from "../../../environments/environment";
import {logger} from "@territory-offline-workspace/shared-utils";

@Injectable({providedIn: 'root'})
export class AppInitializerService
{
  constructor(private store: Store<ApplicationState>,
              private toUpdatesService: ToUpdatesService,
              private dataSecurityService: DataSecurityService,
              private settingsDatabaseService: SettingsDatabaseService,
              private databaseService: DatabaseService,
              private actions$: Actions)
  {
  }

  public async load(): Promise<any>
  {
    return new Promise((resolve, reject) => this.beforeAppStart().then(() => resolve()));
  }

  private async beforeAppStart(): Promise<any>
  {
    this.logNgrxActions();
    await this.dataSecurityService.init();
    await this.settingsDatabaseService.initAppropriateSQLite();
    await this.databaseService
      .init()
      .then(() => logger(`Database successfully opened.`))
      .catch((e) => console.error('####### \n\n Fehler beim öffnen der Datenbank! \n\n', e));

    await this.loadAppConfiguration();
    return "ready";
  }

  private async loadAppConfiguration()
  {
    const promise = new Promise((resolve, reject) =>
      this.actions$
        .pipe(
          ofType(LoadSettingsSuccess),
          take(1),
          tap(() => resolve())
        ).subscribe()
    );
    this.store.dispatch(LoadSettings());
    return promise;
  }

  private logNgrxActions()
  {
    if(environment.consoleLogNgrxActions)
    {
      this.actions$.pipe(
        tap((action) => console.log(`[NGRX - ${action.type}]: ${JSON.stringify(action)}`))
      ).subscribe();
    }
  }

  private considerToGetReleaseInfos(settings: SettingsState)
  {
    // FIXME wenn man es hier aufruft ist unter umständen die App gelockt obwohl sie gerade unlocked wurde

    if (settings && settings.initialConfigurationDone)
    {
      this.toUpdatesService.considerToGetReleaseInfos();
    }
  }
}
