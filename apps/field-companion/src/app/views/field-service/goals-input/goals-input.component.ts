import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { ApplicationState } from '../../../core/store/index.reducers';
import { Router } from '@angular/router';
import { selectGoals, selectSettings } from '../../../core/store/settings/settings.selectors';
import { UpsertSettings } from '../../../core/store/settings/settings.actions';
import { take, takeUntil, tap } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { IosSelectorOptionSource } from '../../../../../../../libs/ui-components/src/lib/form-controls/model/ios-selector-option-source.interface';

@Component({
  selector: 'app-goals-input',
  templateUrl: './goals-input.component.html',
  styleUrls: ['./goals-input.component.scss'],
})
export class GoalsInputComponent implements OnInit, OnDestroy {
  public durationGoals$: Observable<{ yearly: number; monthly: number }>;
  public hideMainNavigation = true;

  public monthly: FormControl;
  public monthlyOptions: IosSelectorOptionSource[];
  public yearly: FormControl;
  public yearlyOptions: IosSelectorOptionSource[];
  private destroyer = new Subject();

  constructor(private store: Store<ApplicationState>, private router: Router) {}

  public ngOnInit(): void {
    this.durationGoals$ = this.store.pipe(select(selectGoals));
  }

  public ngOnDestroy() {
    this.destroyer.next();
    this.destroyer.complete();
  }

  public done() {
    this.router.navigate(['field-service']);
  }

  public initMonthly(initialValue: number) {
    let isInitialising = true;
    this.monthlyOptions = [];
    for (let i = 0; i < 90; i++) {
      this.monthlyOptions.push({ text: i + '', value: i });
    }

    this.monthly = new FormControl(initialValue);

    this.monthly.valueChanges
      .pipe(
        takeUntil(this.destroyer),
        tap((value) => {
          if (!isInitialising) {
            this.store
              .pipe(
                select(selectSettings),
                take(1),
                tap((settings) =>
                  this.store.dispatch(
                    UpsertSettings({
                      settings: {
                        ...settings,
                        monthlyGoal: value,
                      },
                    })
                  )
                )
              )
              .subscribe();
          }
        })
      )
      .subscribe();

    setTimeout(() => (isInitialising = false), 500);
  }

  public initYearly(initialValue: number) {
    let isInitialising = true;
    this.yearlyOptions = [];
    for (let i = 0; i < 1000; i = i + 10) {
      this.yearlyOptions.push({ text: i + '', value: i });
    }

    this.yearly = new FormControl(initialValue);

    this.yearly.valueChanges
      .pipe(
        takeUntil(this.destroyer),
        tap((value) => {
          if (!isInitialising) {
            this.store
              .pipe(
                select(selectSettings),
                take(1),
                tap((settings) =>
                  this.store.dispatch(
                    UpsertSettings({
                      settings: {
                        ...settings,
                        yearlyGoal: value,
                      },
                    })
                  )
                )
              )
              .subscribe();
          }
        })
      )
      .subscribe();

    setTimeout(() => (isInitialising = false), 500);
  }
}
