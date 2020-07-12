import {Component, OnInit} from '@angular/core';
import {select, Store} from "@ngrx/store";
import {ApplicationState} from "../../../core/store/index.reducers";
import {FormControl} from "@angular/forms";
import {selectSettings, selectUserLanguage} from "../../../core/store/settings/settings.selectors";
import {Observable} from "rxjs";
import {UpsertSettings, UpsertSettingsSuccess} from "../../../core/store/settings/settings.actions";
import {take, tap} from "rxjs/operators";
import {Actions, ofType} from "@ngrx/effects";

@Component({
  selector: 'app-change-language',
  templateUrl: './change-language.component.html',
  styleUrls: ['./change-language.component.scss']
})
export class ChangeLanguageComponent implements OnInit
{
  public initialUserLanguage$: Observable<string>;
  public hideMainNavigation = true;
  public formControl = new FormControl();

  constructor(private store: Store<ApplicationState>, private actions$: Actions)
  {
  }

  public ngOnInit(): void
  {
    this.initialUserLanguage$ = this.store.pipe(select(selectUserLanguage));
  }

  public done()
  {
    if (this.formControl.value)
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
              userLanguage: this.formControl.value
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
