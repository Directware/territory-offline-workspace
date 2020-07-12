import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {select, Store} from "@ngrx/store";
import {ApplicationState} from "../../../core/store/index.reducers";
import {SettingsState} from "../../../core/store/settings/settings.reducer";
import {selectSettings} from "../../../core/store/settings/settings.selectors";
import {take, tap} from "rxjs/operators";
import {UpsertSettings} from "../../../core/store/settings/settings.actions";

@Component({
  selector: 'app-processing-due-after',
  templateUrl: './processing-due-after.component.html',
  styleUrls: ['./processing-due-after.component.scss']
})
export class ProcessingDueAfterComponent implements OnInit
{
  public settings: SettingsState;
  public value: number;
  public valueIsValid: boolean;

  constructor(private router: Router,
              private store: Store<ApplicationState>)
  {
  }

  public ngOnInit(): void
  {
    this.store
      .pipe(
        select(selectSettings),
        take(1),
        tap(settings => this.settings = settings),
        tap(settings => this.value = settings.processingPeriodInMonths)
      ).subscribe();
  }

  public back()
  {
    this.router.navigate([{outlets: {'second-thread': null}}]);
  }

  public setNewValue(value: number)
  {
    this.value = value;

    if (this.settings)
    {
      this.valueIsValid = value > 0 && this.settings.processingPeriodInMonths !== value;
    }
  }

  public save()
  {
    if (this.settings && this.valueIsValid)
    {
      this.store.dispatch(UpsertSettings({
        settings: {
          ...this.settings,
          processingPeriodInMonths: this.value
        }
      }));

      this.back();
    }
  }
}
