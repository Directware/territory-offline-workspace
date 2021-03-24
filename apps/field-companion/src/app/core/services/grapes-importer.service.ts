import {Injectable} from '@angular/core';
import * as Pako from 'pako';
import {select, Store} from "@ngrx/store";
import {ApplicationState} from "../store/index.reducers";
import {selectSettings} from "../store/settings/settings.selectors";
import {take, tap} from "rxjs/operators";
import {UpsertSettings} from "../store/settings/settings.actions";
import {BulkImportDailyReports, BulkImportDailyReportsSuccess} from "../store/reports/daily-reports.actions";
import {Actions, ofType} from "@ngrx/effects";
import {TranslateService} from "@ngx-translate/core";
import {convertGrapesReportsToDailyReports} from "@territory-offline-workspace/shared-interfaces";

@Injectable({
  providedIn: 'root'
})
export class GrapesImporterService
{
  constructor(private store: Store<ApplicationState>,
              private translateService: TranslateService,
              private actions$: Actions)
  {
  }

  public importData(result: ArrayBuffer)
  {
    const tmp = Pako.inflate(new Uint8Array(result), {to: 'string'});
    if (tmp)
    {
      const dataToImport = JSON.parse(tmp);

      if (dataToImport && !!dataToImport.reports)
      {
        this.importReports(dataToImport.reports);
      }

      if (dataToImport && !!dataToImport.goals)
      {
        this.importGoals(dataToImport.goals);
      }
    }
  }

  private importReports(reports)
  {
    this.successListener();
    const convertedReports = convertGrapesReportsToDailyReports(reports);
    this.store.dispatch(BulkImportDailyReports({dailyReports: convertedReports}));
  }

  private importGoals(goals: { yearlyValue: number, monthlyValue: number })
  {
    this.store
      .pipe(
        select(selectSettings),
        take(1),
        tap((settings) => this.store.dispatch(UpsertSettings({
          settings: {
            ...settings,
            monthlyGoal: goals.monthlyValue,
            yearlyGoal: goals.yearlyValue
          }
        })))
      ).subscribe();
  }

  private successListener()
  {
    this.actions$.pipe(
      ofType(BulkImportDailyReportsSuccess),
      take(1),
      tap((action) => {
        alert(this.translateService.instant("settings.actions.grapesImportSucceed"));
      })
    ).subscribe();
  }
}
