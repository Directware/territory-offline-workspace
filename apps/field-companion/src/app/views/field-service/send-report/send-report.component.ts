import { Component, OnDestroy, OnInit } from "@angular/core";
import { select, Store } from "@ngrx/store";
import { ApplicationState } from "../../../core/store/index.reducers";
import { Router } from "@angular/router";
import { combineLatest, Observable } from "rxjs";
import {
  selectCurrentDailyReports,
  selectCurrentDailyReportTime,
  selectMergedCurrentDailyReports,
  selectNextMonthsDailyReport,
} from "../../../core/store/reports/daily-reports.selectors";
import { CalendarDatasource } from "../../shared/calendar/model/calendar-datasource.model";
import { TranslateService } from "@ngx-translate/core";
import { take, tap } from "rxjs/operators";
import { ReportService } from "../../../core/services/report.service";
import {
  UpsertDailyReport,
  UpsertDailyReportSuccess,
} from "../../../core/store/reports/daily-reports.actions";
import { Actions, ofType } from "@ngrx/effects";
import {
  DailyReport,
  MergedDailyReport,
} from "@territory-offline-workspace/shared-interfaces";

import { Share } from "@capacitor/share";

@Component({
  selector: "app-send-report",
  templateUrl: "./send-report.component.html",
  styleUrls: ["./send-report.component.scss"],
})
export class SendReportComponent implements OnInit, OnDestroy {
  public monthlyReport$: Observable<MergedDailyReport>;
  public chosenTime$: Observable<CalendarDatasource>;

  public hideMainNavigation = true;

  constructor(
    private store: Store<ApplicationState>,
    private actions$: Actions,
    private translateService: TranslateService,
    private reportService: ReportService,
    private router: Router
  ) {}

  public ngOnInit(): void {
    this.reportService.considerChoosingPreviousMonth();
    this.monthlyReport$ = this.store.pipe(
      select(selectMergedCurrentDailyReports)
    );
    this.chosenTime$ = this.store.pipe(select(selectCurrentDailyReportTime));
  }

  public ngOnDestroy(): void {
    this.reportService.considerRevertAutomaticTimeChange();
  }

  public explainDurationTrimmer() {
    alert(this.translateService.instant("service.explainDurationTrimmer"));
  }

  public trimMonthlyDuration(duration: number) {
    return Math.floor(duration / 60);
  }

  public done() {
    this.router.navigate(["field-service"]);
  }

  public async send() {
    combineLatest([this.monthlyReport$, this.chosenTime$])
      .pipe(
        take(1),
        tap(
          async ([mergedReports, chosenTime]: [
            MergedDailyReport,
            CalendarDatasource
          ]) => {
            const isWholeNumber =
              mergedReports.duration ===
              Math.floor(mergedReports.duration / 60) * 60;
            let reports = mergedReports;

            if (!isWholeNumber) {
              const wholeNumberDuration =
                Math.floor(mergedReports.duration / 60) * 60;
              const remainingTime =
                mergedReports.duration - wholeNumberDuration;

              reports = {
                ...mergedReports,
                duration: wholeNumberDuration,
              };

              this.actions$
                .pipe(
                  ofType(UpsertDailyReportSuccess),
                  take(1),
                  tap(() => this.increaseNextMonthsReport(remainingTime))
                )
                .subscribe();

              this.decreaseReport(remainingTime);
            }

            let shareRet = await Share.share({
              dialogTitle: this.translateService.instant("service.sendReport"),
              title: this.evaluateShareTitle(chosenTime),
              text:
                this.evaluateShareTitle(chosenTime) +
                "\n\n" +
                this.evaluateShareText(reports),
            });
            return shareRet;
          }
        )
      )
      .subscribe();
  }

  private evaluateShareTitle(chosenTime: CalendarDatasource) {
    return `${this.translateService.instant(
      "service.report"
    )} - ${this.translateService.instant("month." + chosenTime.month)} ${
      chosenTime.year
    }:`;
  }

  private evaluateShareText(mergedReports: MergedDailyReport) {
    return (
      `${this.translateService.instant("service.duration")}: ${
        mergedReports.duration / 60
      }h, ` +
      `${this.translateService.instant("service.videos")}: ${
        mergedReports.videos
      }, ` +
      `${this.translateService.instant("service.deliveries")}: ${
        mergedReports.deliveries
      }, ` +
      `${this.translateService.instant("service.returnVisits")}: ${
        mergedReports.returnVisits
      }, ` +
      `${this.translateService.instant("service.studies")}: ${
        mergedReports.studies
      }.`
    );
  }

  private decreaseReport(remainingMinutes: number) {
    this.store
      .pipe(
        select(selectCurrentDailyReports),
        take(1),
        tap((dailyReports: DailyReport[]) => {
          dailyReports.sort((dr1, dr2) =>
            dr1.creationTime.getTime() < dr2.creationTime.getTime() ? 1 : -1
          );

          for (let i = 0; i < dailyReports.length; i++) {
            const isWholeNumber =
              dailyReports[i].duration ===
              Math.floor(dailyReports[i].duration / 60) * 60;

            if (
              !isWholeNumber &&
              dailyReports[i].duration >= remainingMinutes
            ) {
              this.store.dispatch(
                UpsertDailyReport({
                  dailyReport: {
                    ...dailyReports[i],
                    duration: dailyReports[i].duration - remainingMinutes,
                  },
                })
              );
              break;
            }
          }
        })
      )
      .subscribe();
  }

  private increaseNextMonthsReport(remainingMinutes: number) {
    this.store
      .pipe(
        select(selectNextMonthsDailyReport),
        take(1),
        tap((dailyReport) =>
          this.store.dispatch(
            UpsertDailyReport({
              dailyReport: {
                ...dailyReport,
                duration: dailyReport.duration + remainingMinutes,
              },
            })
          )
        )
      )
      .subscribe();
  }
}
