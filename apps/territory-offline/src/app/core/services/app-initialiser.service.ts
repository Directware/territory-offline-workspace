import { Injectable } from "@angular/core";
import { Actions, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { take, tap } from "rxjs/operators";
import { ApplicationState } from "../store/index.reducers";
import {
  LoadSettings,
  LoadSettingsSuccess,
} from "../store/settings/settings.actions";
import { DataSecurityService } from "./common/data-security.service";
import { DatabaseService } from "./db/database.service";
import { SettingsDatabaseService } from "./db/settings-database.service";
import { environment } from "../../../environments/environment";
import { logger } from "@territory-offline-workspace/shared-utils";

@Injectable({ providedIn: "root" })
export class AppInitializerService {
  constructor(
    private store: Store<ApplicationState>,
    private dataSecurityService: DataSecurityService,
    private settingsDatabaseService: SettingsDatabaseService,
    private databaseService: DatabaseService,
    private actions$: Actions
  ) {}

  public async load(): Promise<any> {
    console.log("AppInitializerService");
    return new Promise((resolve, reject) =>
      this.beforeAppStart()
        .then(() => {
          console.log("[AppInitializerService] resolved");
          resolve(null);
        })
        .catch((e) => {
          console.error("[AppInitializerService] rejected");
          console.error(e);
        })
    );
  }

  private async beforeAppStart(): Promise<any> {
    this.logNgrxActions();
    console.log("[AppInitializerService] init data security");
    await this.dataSecurityService.init();
    console.log("[AppInitializerService] init database");
    await this.settingsDatabaseService.initAppropriateSQLite();
    console.log("[AppInitializerService] open data security");
    await this.databaseService
      .init()
      .then(() => logger(`Database successfully opened.`))
      .catch((e) =>
        console.error("####### \n\n Fehler beim öffnen der Datenbank! \n\n", e)
      );

    console.log("[AppInitializerService] load app configuration");
    await this.loadAppConfiguration();
    console.log("[AppInitializerService] ready state");
    return "ready";
  }

  private async loadAppConfiguration() {
    const promise = new Promise((resolve, reject) =>
      this.actions$
        .pipe(
          ofType(LoadSettingsSuccess),
          take(1),
          tap(() => resolve(null))
        )
        .subscribe()
    );
    this.store.dispatch(LoadSettings());
    return promise;
  }

  private logNgrxActions() {
    if (environment.consoleLogNgrxActions) {
      this.actions$
        .pipe(
          tap((action) =>
            console.log(`[NGRX - ${action.type}]: ${JSON.stringify(action)}`)
          )
        )
        .subscribe();
    }
  }
}
