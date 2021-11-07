import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { ApplicationState } from '../../../core/store/index.reducers';
import { selectCurrentDailyReport } from '../../../core/store/reports/daily-reports.selectors';
import { MatDialogRef } from '@angular/material/dialog';
import { DurationService } from '../../../core/services/duration.service';
import { FormControl } from '@angular/forms';
import { tap } from 'rxjs/operators';
import { UpsertDailyReport } from '../../../core/store/reports/daily-reports.actions';
import { DailyReport } from '@territory-offline-workspace/shared-interfaces';

@Component({
  selector: 'app-input-duration',
  templateUrl: './input-duration.component.html',
  styleUrls: ['./input-duration.component.scss'],
})
export class InputDurationComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('durationInputWrapper', { static: true })
  public durationInputWrapper: ElementRef;

  @ViewChild('durationPickerWrapper', { static: false })
  public durationPickerWrapper: ElementRef;

  public durationFormControl = new FormControl();
  public currentDailyReport$: Observable<DailyReport>;

  constructor(
    private store: Store<ApplicationState>,
    private dialogRef: MatDialogRef<InputDurationComponent>,
    private durationService: DurationService
  ) {}

  public ngOnInit(): void {
    this.currentDailyReport$ = this.store.pipe(
      select(selectCurrentDailyReport),
      tap((dailyReport) => {
        const hours = Math.floor(dailyReport.duration / 60);
        const minutes = dailyReport.duration - hours * 60;
        const value = `${hours}:${minutes}`;

        if (this.durationFormControl.value !== value) {
          this.durationFormControl.setValue(value);
        }
      })
    );
  }

  public ngAfterViewInit() {
    const originDurationInputElement = document.getElementById('duration-input');

    if (originDurationInputElement) {
      const boundingClientRect = originDurationInputElement.getBoundingClientRect();
      const durationBoundingClientRect =
        this.durationPickerWrapper.nativeElement.getBoundingClientRect();

      this.durationPickerWrapper.nativeElement.style.left = boundingClientRect.left + 'px';
      this.durationPickerWrapper.nativeElement.style.top =
        boundingClientRect.top - durationBoundingClientRect.height - 8 + 'px';

      this.durationInputWrapper.nativeElement.style.top = boundingClientRect.top + 'px';
      this.durationInputWrapper.nativeElement.style.left = boundingClientRect.left + 'px';
      this.durationInputWrapper.nativeElement.style.width = boundingClientRect.width + 'px';
      this.durationInputWrapper.nativeElement.style.height = boundingClientRect.height + 'px';
    }
  }

  public ngOnDestroy() {}

  public increaseDuration(dailyReport: DailyReport) {
    this.durationService.increase(dailyReport);
  }

  public decreaseDuration(dailyReport: DailyReport) {
    this.durationService.decrease(dailyReport);
  }

  public add(value: string, dailyReport: DailyReport) {
    if (value) {
      const split = value.split(':');
      const hours = parseInt(split[0], 10);
      const minutes = parseInt(split[1], 10);

      this.store.dispatch(
        UpsertDailyReport({
          dailyReport: {
            ...dailyReport,
            duration: hours * 60 + minutes,
          },
        })
      );
    }
  }

  public padDuration(value: number): string {
    return this.durationService.padDuration(value);
  }
}
