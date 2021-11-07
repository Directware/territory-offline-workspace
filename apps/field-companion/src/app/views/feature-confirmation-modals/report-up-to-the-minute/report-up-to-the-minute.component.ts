import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { ApplicationState } from '../../../core/store/index.reducers';
import { selectSettings } from '../../../core/store/settings/settings.selectors';
import { take, tap } from 'rxjs/operators';
import {
  UpsertSettings,
  UpsertSettingsSuccess,
} from '../../../core/store/settings/settings.actions';
import { MatDialogRef } from '@angular/material/dialog';
import { Actions, ofType } from '@ngrx/effects';

@Component({
  selector: 'territory-offline-workspace-report-up-to-the-minute',
  templateUrl: './report-up-to-the-minute.component.html',
  styleUrls: ['./report-up-to-the-minute.component.scss'],
})
export class ReportUpToTheMinuteComponent implements OnInit {
  public constructor(
    private store: Store<ApplicationState>,
    private actions$: Actions,
    private matDialogRef: MatDialogRef<ReportUpToTheMinuteComponent>
  ) {}

  public ngOnInit(): void {}

  public confirm() {
    this.actions$
      .pipe(
        ofType(UpsertSettingsSuccess),
        take(1),
        tap(() => this.matDialogRef.close())
      )
      .subscribe();

    this.store
      .pipe(
        select(selectSettings),
        take(1),
        tap((settings) =>
          this.store.dispatch(
            UpsertSettings({
              settings: {
                ...settings,
                confirmedFeatures: {
                  ...settings.confirmedFeatures,
                  'report.up.to.the.minute': 'true',
                },
              },
            })
          )
        )
      )
      .subscribe();
  }
}
