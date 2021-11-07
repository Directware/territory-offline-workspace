import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SetStudies } from '../../../core/store/reports/daily-reports.actions';
import { select, Store } from '@ngrx/store';
import { ApplicationState } from '../../../core/store/index.reducers';
import { Observable, Subject } from 'rxjs';
import { selectCurrentDailyReportStudies } from '../../../core/store/reports/daily-reports.selectors';
import { IosSelectorOptionSource } from '../../../../../../../libs/ui-components/src/lib/form-controls/model/ios-selector-option-source.interface';
import { FormControl } from '@angular/forms';
import { take, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'app-studies-input',
  templateUrl: './studies-input.component.html',
  styleUrls: ['./studies-input.component.scss'],
})
export class StudiesInputComponent implements OnInit, OnDestroy {
  public currentStudies$: Observable<{ value: number }>;
  public hideMainNavigation = true;

  public studies: FormControl;
  public studiesOptions: IosSelectorOptionSource[];
  private destroyer = new Subject();

  constructor(private store: Store<ApplicationState>, private router: Router) {}

  public ngOnInit(): void {
    this.currentStudies$ = this.store.pipe(select(selectCurrentDailyReportStudies));

    this.studiesOptions = [];
    for (let i = 0; i < 24; i++) {
      this.studiesOptions.push({ text: '' + i, value: i });
    }

    this.initInitialValue();
  }

  public ngOnDestroy() {
    this.destroyer.next();
    this.destroyer.complete();
  }

  public done() {
    this.router.navigate(['field-service']);
  }

  public initInitialValue() {
    let isInitialising = true;

    this.store
      .pipe(
        take(1),
        select(selectCurrentDailyReportStudies),
        tap((studies) => {
          this.studies = new FormControl(studies.value);

          this.studies.valueChanges
            .pipe(
              takeUntil(this.destroyer),
              tap((value) => {
                if (!isInitialising) {
                  this.store.dispatch(SetStudies({ count: value }));
                }
              })
            )
            .subscribe();

          setTimeout(() => (isInitialising = false), 500);
        })
      )
      .subscribe();
  }
}
