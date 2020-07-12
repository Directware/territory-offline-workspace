import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {DailyReport} from "../../../core/store/reports/model/daily-report.model";
import {select, Store} from "@ngrx/store";
import {ApplicationState} from "../../../core/store/index.reducers";
import {selectCurrentDailyReport} from "../../../core/store/reports/daily-reports.selectors";
import {take, tap} from "rxjs/operators";
import {UpsertDailyReport, UpsertDailyReportSuccess} from "../../../core/store/reports/daily-reports.actions";
import {Actions, ofType} from "@ngrx/effects";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-input-duration',
  templateUrl: './input-duration.component.html',
  styleUrls: ['./input-duration.component.scss']
})
export class InputDurationComponent implements OnInit
{
  public currentDailyReport$: Observable<DailyReport>
  public hours: number;
  public minutes: number;

  constructor(private store: Store<ApplicationState>,
              private dialogRef: MatDialogRef<InputDurationComponent>,
              private actions$: Actions)
  {
  }

  public ngOnInit(): void
  {
    this.currentDailyReport$ = this.store.pipe(select(selectCurrentDailyReport), tap(currentDailyReport =>
    {
      this.hours = Math.floor(currentDailyReport.duration / 60);
      this.minutes = currentDailyReport.duration - (this.hours * 60);
    }));
  }

  public add(dailyReport: DailyReport)
  {
    this.actions$.pipe(
      ofType(UpsertDailyReportSuccess),
      take(1),
      tap(() => this.dialogRef.close())
    ).subscribe();

    this.store.dispatch(UpsertDailyReport({
      dailyReport: {
        ...dailyReport,
        duration: (this.hours * 60) + this.minutes
      }
    }));
  }
}
