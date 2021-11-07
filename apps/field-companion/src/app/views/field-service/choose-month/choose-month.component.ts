import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { ApplicationState } from '../../../core/store/index.reducers';
import { selectCurrentDailyReportTime } from '../../../core/store/reports/daily-reports.selectors';
import { take, tap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { ChangeChosenTime } from '../../../core/store/reports/daily-reports.actions';

@Component({
  selector: 'app-choose-month',
  templateUrl: './choose-month.component.html',
  styleUrls: ['./choose-month.component.scss'],
})
export class ChooseMonthComponent implements OnInit {
  public yearFormControl = new FormControl();
  public monthFormControl = new FormControl();
  public editYearPicker: boolean;
  public editMonthPicker: boolean;

  public yearOptionSource: any[];
  public monthOptionSource: any[];

  public hideMainNavigation = true;

  constructor(
    private store: Store<ApplicationState>,
    private router: Router,
    private translateService: TranslateService
  ) {}

  public ngOnInit(): void {
    this.yearOptionSource = this.initYearOptionSource();
    this.monthOptionSource = this.initMonthOptionSource();
    this.store
      .pipe(
        select(selectCurrentDailyReportTime),
        take(1),
        tap((chosenTime) => this.yearFormControl.setValue(chosenTime.year)),
        tap((chosenTime) => this.monthFormControl.setValue(chosenTime.month))
      )
      .subscribe();
  }

  public done() {
    this.store.dispatch(
      ChangeChosenTime({
        chosenTime: {
          month: this.monthFormControl.value,
          year: this.yearFormControl.value,
          dataExistOnDates: [],
        },
      })
    );

    window.history.back();
  }

  private initYearOptionSource() {
    const tmp = [];

    for (let i = 0; i < 4; i++) {
      const y = new Date().getFullYear() - i;
      tmp.push({
        value: y,
        text: y + '',
      });
    }

    return tmp;
  }

  private initMonthOptionSource() {
    const tmp = [];
    for (let i = 0; i < 12; i++) {
      tmp.push({
        value: i,
        text: this.translateService.instant('month.' + i),
      });
    }
    return tmp;
  }
}
