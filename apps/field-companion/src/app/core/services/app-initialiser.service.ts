import {Injectable} from "@angular/core";
import {Store} from "@ngrx/store";
import {ApplicationState} from "../store/index.reducers";
import {Actions, ofType} from "@ngrx/effects";
import {LoadSettings, LoadSettingsSuccess} from "../store/settings/settings.actions";
import {take} from "rxjs/operators";
import {LoadDailyReports} from "../store/reports/daily-reports.actions";
import {AppDatabaseService} from "./database/app-database.service";
import {LoadTerritoryCards} from "../store/territory-card/territory-card.actions";

@Injectable({providedIn: "root"})
export class AppInitializerService
{
  constructor(private store: Store<ApplicationState>,
              private databaseService: AppDatabaseService,
              private actions$: Actions)
  {
  }

  public load(): Promise<any>
  {
    return new Promise((resolve, reject) => this.loadAppConfiguration().then(() => resolve()));
  }

  private async loadAppConfiguration()
  {
    const promise = new Promise((resolve, reject) =>
      this.actions$
        .pipe(
          ofType(LoadSettingsSuccess),
          take(1)
        ).subscribe(() => resolve())
    );

    await this.databaseService.initAppropriateSQLite();

    this.store.dispatch(LoadSettings());
    this.store.dispatch(LoadDailyReports());
    this.store.dispatch(LoadTerritoryCards());
    return promise;
  }
}
