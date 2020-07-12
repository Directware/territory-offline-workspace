import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {select, Store} from "@ngrx/store";
import {ApplicationState} from "../../../core/store/index.reducers";
import {selectDurationStep, selectSettings} from "../../../core/store/settings/settings.selectors";
import {FormControl} from "@angular/forms";
import {take, tap} from "rxjs/operators";
import {Actions, ofType} from "@ngrx/effects";
import {UpsertSettings, UpsertSettingsSuccess} from "../../../core/store/settings/settings.actions";

@Component({
  selector: 'app-change-duration-step',
  templateUrl: './change-duration-step.component.html',
  styleUrls: ['./change-duration-step.component.scss']
})
export class ChangeDurationStepComponent implements OnInit
{
  public hideMainNavigation = true;
  public currentDurationStep$: Observable<number>;
  public options = [];
  public formControl = new FormControl();

  private cachedDurationStep: number;

  constructor(private store: Store<ApplicationState>, private actions$: Actions)
  {
  }

  public ngOnInit(): void
  {
    for (let i = 15; i <= 60; i = i + 5)
    {
      this.options.push({text: i, value: i});
    }
    this.currentDurationStep$ = this.store.pipe(
      select(selectDurationStep),
      tap((durationStep) =>
      {
        this.cachedDurationStep = durationStep;
        this.formControl.setValue(durationStep)
      }));
  }

  public done()
  {
    if (this.cachedDurationStep !== this.formControl.value)
    {
      this.actions$.pipe(
        ofType(UpsertSettingsSuccess),
        take(1),
        tap(() => window.history.back())
      ).subscribe();

      this.store
        .pipe(
          select(selectSettings),
          take(1),
          tap(settings => this.store.dispatch(UpsertSettings({
            settings: {
              ...settings,
              durationStep: this.formControl.value
            }
          })))
        ).subscribe();
    }
    else
    {
      window.history.back();
    }
  }
}
