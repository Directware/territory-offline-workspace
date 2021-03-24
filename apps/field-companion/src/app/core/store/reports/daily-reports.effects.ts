import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {concatMap, map, switchMap, tap, withLatestFrom} from 'rxjs/operators';
import {from, of} from 'rxjs';
import {
  BulkImportDailyReports,
  BulkImportDailyReportsSuccess,
  DecreaseStudies,
  DeleteDailyReport,
  DeleteDailyReportSuccess,
  IncreaseStudies,
  LoadDailyReports,
  LoadDailyReportsSuccess, SetStudies,
  UpsertDailyReport,
  UpsertDailyReportSuccess
} from "./daily-reports.actions";
import {DailyReport, dailyReportCollectionName, TimedEntity} from "@territory-offline-workspace/shared-interfaces";
import {AppDatabaseService} from "../../services/database/app-database.service";
import {select, Store} from "@ngrx/store";
import {ApplicationState} from "../index.reducers";
import {selectDailyReportForStudy} from "./daily-reports.selectors";

@Injectable({providedIn: 'root'})
export class DailyReportsEffects
{
  private loadDailyReports$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LoadDailyReports),
      map((action) => this.database.load(dailyReportCollectionName)),
      switchMap((promise: Promise<TimedEntity[]>) => from(promise)),
      map((dailyReports: DailyReport[]) => LoadDailyReportsSuccess({dailyReports: dailyReports}))
    )
  );

  private upsertDailyReport$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UpsertDailyReport),
      map((action) => this.database.upsert(dailyReportCollectionName, action.dailyReport)),
      switchMap((promise: Promise<TimedEntity>) => from(promise)),
      map((dailyReport: DailyReport) => UpsertDailyReportSuccess({dailyReport: dailyReport}))
    )
  );

    private bulkImportDailyReports$ = createEffect(() =>
      this.actions$.pipe(
        ofType(BulkImportDailyReports),
        map((action) => this.database.bulkUpsert(dailyReportCollectionName, action.dailyReports)),
        switchMap((promise: Promise<TimedEntity[]>) => from(promise)),
        map((dailyReports: DailyReport[]) => BulkImportDailyReportsSuccess({dailyReports: dailyReports}))
      )
    );

  private deleteDailyReport$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DeleteDailyReport),
      map((action) => this.database.delete(dailyReportCollectionName, action.dailyReport)),
      switchMap((promise: Promise<TimedEntity>) => from(promise)),
      map((dailyReport: DailyReport) => DeleteDailyReportSuccess({dailyReport: dailyReport}))
    )
  );

  private setStudies$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SetStudies),
      concatMap(action => of(action).pipe(withLatestFrom(this.store.pipe(select(selectDailyReportForStudy))))),
      map(([action, dailyReport]) => UpsertDailyReport({
          dailyReport: {...dailyReport, studies: action.count}
        })
      )
    )
  );

  private increaseStudies$ = createEffect(() =>
    this.actions$.pipe(
      ofType(IncreaseStudies),
      concatMap(action => of(action).pipe(withLatestFrom(this.store.pipe(select(selectDailyReportForStudy))))),
      map(([_, dailyReport]) => UpsertDailyReport({
          dailyReport: {...dailyReport, studies: dailyReport.studies + 1}
        })
      )
    )
  );

  private decreaseStudies$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DecreaseStudies),
      concatMap(action => of(action).pipe(withLatestFrom(this.store.pipe(select(selectDailyReportForStudy))))),
      tap(([_, dailyReport]) =>
        {
          if (dailyReport.studies > 0)
          {
            this.store.dispatch(UpsertDailyReport({
              dailyReport: {...dailyReport, studies: dailyReport.studies - 1}
            }));
          }
        }
      )
    ), {dispatch: false}
  );

  constructor(private store: Store<ApplicationState>, private actions$: Actions, private database: AppDatabaseService)
  {
  }
}
