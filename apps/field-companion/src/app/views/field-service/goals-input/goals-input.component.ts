import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {select, Store} from "@ngrx/store";
import {ApplicationState} from "../../../core/store/index.reducers";
import {Router} from "@angular/router";
import {selectGoals, selectSettings} from "../../../core/store/settings/settings.selectors";
import {UpsertSettings} from "../../../core/store/settings/settings.actions";
import {take, tap} from "rxjs/operators";

@Component({
  selector: 'app-goals-input',
  templateUrl: './goals-input.component.html',
  styleUrls: ['./goals-input.component.scss']
})
export class GoalsInputComponent implements OnInit
{
  public durationGoals$: Observable<{ yearly: number, monthly: number }>
  public hideMainNavigation = true;

  constructor(private store: Store<ApplicationState>, private router: Router)
  {
  }

  public ngOnInit(): void
  {
    this.durationGoals$ = this.store.pipe(select(selectGoals));
  }

  public done()
  {
    this.router.navigate(["field-service"]);
  }

  public increase(goalName: string, step: number)
  {
    this.store.pipe(
      select(selectSettings),
      take(1),
      tap(settings => this.store.dispatch(UpsertSettings({
        settings: {
          ...settings,
          [goalName]: settings[goalName] + step
        }
      })))
    ).subscribe();
  }

  public decrease(goalName: string, step: number)
  {
    this.store.pipe(
      select(selectSettings),
      take(1),
      tap(settings => this.store.dispatch(UpsertSettings({
        settings: {
          ...settings,
          [goalName]: settings[goalName] - step
        }
      })))
    ).subscribe();
  }
}
