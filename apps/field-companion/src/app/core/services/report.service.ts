import {Injectable} from '@angular/core';
import {select, Store} from "@ngrx/store";
import {selectCurrentDailyReportTime} from "../store/reports/daily-reports.selectors";
import {take, tap} from "rxjs/operators";
import {CalendarDatasource} from "../../views/shared/calendar/model/calendar-datasource.model";
import {ChangeChosenTime} from "../store/reports/daily-reports.actions";
import {ApplicationState} from "../store/index.reducers";

@Injectable({
  providedIn: 'root'
})
export class ReportService
{
  private automaticTimeChangeThreshold = 6;
  private previousCalendarDataSource: CalendarDatasource;

  constructor(private store: Store<ApplicationState>)
  {
  }

  public considerChoosingPreviousMonth()
  {
    this.store
      .pipe(
        select(selectCurrentDailyReportTime),
        take(1),
        tap((chosenTime: CalendarDatasource) =>
        {
          const today = new Date();
          const shouldConsiderChangeTime = today.getDate() < this.automaticTimeChangeThreshold;
          const prevMonthNotEqualActualMonth = (today.getMonth() - 1) !== chosenTime.month;

          if (shouldConsiderChangeTime && prevMonthNotEqualActualMonth)
          {
            this.previousCalendarDataSource = {...chosenTime};
            // Im Januar sollte Dezember genommen werden
            const prevMonth = today.getMonth() > 0 ? today.getMonth() - 1 : 11;
            const year = today.getMonth() > 0 ? today.getFullYear() : today.getFullYear() - 1;

            this.store.dispatch(ChangeChosenTime({
              chosenTime: {
                month: prevMonth,
                year: year,
                dataExistOnDates: []
              }
            }));
          }
        })
      ).subscribe();
  }

  public considerRevertAutomaticTimeChange()
  {
    if (this.previousCalendarDataSource)
    {
      this.store.dispatch(ChangeChosenTime({chosenTime: { ...this.previousCalendarDataSource }}));
      this.previousCalendarDataSource = null;
    }
  }
}
