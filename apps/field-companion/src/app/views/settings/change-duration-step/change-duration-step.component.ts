import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subject} from "rxjs";
import {select, Store} from "@ngrx/store";
import {ApplicationState} from "../../../core/store/index.reducers";
import {selectDurationStep, selectSettings} from "../../../core/store/settings/settings.selectors";
import {FormControl} from "@angular/forms";
import {take, takeUntil, tap} from "rxjs/operators";
import {Actions, ofType} from "@ngrx/effects";
import {UpsertSettings, UpsertSettingsSuccess} from "../../../core/store/settings/settings.actions";
import {IosSelectorOptionSource} from "../../../../../../../libs/ui-components/src/lib/form-controls/model/ios-selector-option-source.interface";
import {selectCurrentDailyReportStudies} from "../../../core/store/reports/daily-reports.selectors";
import {SetStudies} from "../../../core/store/reports/daily-reports.actions";

@Component({
  selector: 'app-change-duration-step',
  templateUrl: './change-duration-step.component.html',
  styleUrls: ['./change-duration-step.component.scss']
})
export class ChangeDurationStepComponent implements OnInit, OnDestroy
{
  public hideMainNavigation = true;
  public currentDurationStep$: Observable<number>;
  public durationOptions: IosSelectorOptionSource[];
  public duration = new FormControl();

  private cachedDurationStep: number;
  private destroyer = new Subject();

  constructor(private store: Store<ApplicationState>, private actions$: Actions)
  {
  }

  public ngOnInit(): void
  {
    this.durationOptions = [];
    for (let i = 15; i <= 60; i = i + 5)
    {
      this.durationOptions.push({text: i + "", value: i});
    }

    this.currentDurationStep$ = this.store.pipe(select(selectDurationStep));

    this.initInitialValue();

    /*
    this.currentDurationStep$ = this.store.pipe(
      select(selectDurationStep),
      tap((durationStep) =>
      {
        this.cachedDurationStep = durationStep;
        this.duration.setValue(durationStep)
      }));
    */
  }

  public ngOnDestroy()
  {
    this.destroyer.next();
    this.destroyer.complete();
  }

  public done()
  {
    window.history.back();
  }

  private initInitialValue()
  {
    let isInitialising = true;

    this.store
      .pipe(
        take(1),
        select(selectDurationStep),
        tap((step) =>
        {
          this.duration = new FormControl(step);

          this.duration
            .valueChanges
            .pipe(
              takeUntil(this.destroyer),
              tap((value) =>
              {
                if (!isInitialising)
                {
                  this.store
                    .pipe(
                      select(selectSettings),
                      take(1),
                      tap(settings => this.store.dispatch(UpsertSettings({
                        settings: {
                          ...settings,
                          durationStep: this.duration.value
                        }
                      })))
                    ).subscribe();
                }
              })
            ).subscribe();

          setTimeout(() => isInitialising = false, 500);
        })
      ).subscribe();
  }
}
