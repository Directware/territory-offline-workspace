import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {select, Store} from "@ngrx/store";
import {ApplicationState} from "../../../../core/store/index.reducers";
import {
  selectCurrentDailyReports,
  selectCurrentLastDayInMonthDailyReport,
  selectMergedCurrentDailyReports
} from "../../../../core/store/reports/daily-reports.selectors";
import {take, tap} from "rxjs/operators";
import {UpsertDailyReport} from "../../../../core/store/reports/daily-reports.actions";
import {ReportService} from "../../../../core/services/report.service";
import {DurationService} from "../../../../core/services/duration.service";
import {DailyReport, MergedDailyReport} from "@territory-offline-workspace/shared-interfaces";

@Component({
  selector: 'app-edit-report-before-send',
  templateUrl: './edit-report-before-send.component.html',
  styleUrls: ['./edit-report-before-send.component.scss']
})
export class EditReportBeforeSendComponent implements OnInit
{
  public monthlyReport$: Observable<MergedDailyReport>;
  public hideMainNavigation = true;

  constructor(private store: Store<ApplicationState>,
              private durationService: DurationService,
              private reportService: ReportService)
  {
  }

  public ngOnInit(): void
  {
    this.reportService.considerChoosingPreviousMonth();
    this.monthlyReport$ = this.store.pipe(select(selectMergedCurrentDailyReports));
  }

  public increase(propName: string, step: number)
  {
    this.store.pipe(
      select(selectCurrentLastDayInMonthDailyReport),
      take(1),
      tap((dailyReport: DailyReport) =>
      {
        this.store.dispatch(UpsertDailyReport({
          dailyReport: {
            ...dailyReport,
            [propName]: dailyReport[propName] + step
          }
        }));
      })
    ).subscribe();
  }

  public decrease(propName: string, step: number)
  {
    this.store.pipe(
      select(selectCurrentDailyReports),
      take(1),
      tap((dailyReports: DailyReport[]) =>
      {
        dailyReports.sort((dr1, dr2) => dr1.creationTime.getTime() < dr2.creationTime.getTime() ? 1 : -1);

        for (let i = 0; i < dailyReports.length; i++)
        {
          if (dailyReports[i][propName] >= step)
          {
            this.store.dispatch(UpsertDailyReport({
              dailyReport: {
                ...dailyReports[i],
                [propName]: dailyReports[i][propName] - step
              }
            }));
            break;
          }
        }
      })
    ).subscribe();
  }

  public padDuration(value: number): string
  {
    return this.durationService.padDuration(value);
  }
}

