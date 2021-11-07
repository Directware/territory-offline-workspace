import { Injectable } from '@angular/core';
import { DailyReport } from '@territory-offline-workspace/shared-interfaces';
import { UpsertDailyReport } from '../store/reports/daily-reports.actions';
import { select, Store } from '@ngrx/store';
import { ApplicationState } from '../store/index.reducers';
import { selectDurationStep } from '../store/settings/settings.selectors';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DurationService {
  constructor(private store: Store<ApplicationState>) {}

  public increase(dailyReport: DailyReport) {
    this.selectDurationStep().subscribe((step) => {
      this.store.dispatch(
        UpsertDailyReport({
          dailyReport: {
            ...dailyReport,
            duration: (dailyReport.duration || 0) + step,
          },
        })
      );
    });
  }

  public decrease(dailyReport: DailyReport) {
    this.selectDurationStep().subscribe((step) => {
      let value = 0;
      if (dailyReport.duration >= step) {
        value = dailyReport.duration - step;
      }

      this.store.dispatch(
        UpsertDailyReport({
          dailyReport: {
            ...dailyReport,
            duration: value,
          },
        })
      );
    });
  }

  public padDuration(value: number): string {
    if (!value) {
      return '00:00';
    }
    const hours = Math.floor(value / 60)
      .toString()
      .padStart(2, '0');
    const minutes = (value - Math.floor(value / 60) * 60).toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  private selectDurationStep() {
    return this.store.pipe(select(selectDurationStep), take(1));
  }
}
