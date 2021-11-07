import { Injectable } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import * as Pako from 'pako';
import { ApplicationState } from '../store/index.reducers';
import {
  BulkImportDailyReports,
  BulkImportDailyReportsSuccess,
} from '../store/reports/daily-reports.actions';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { BackupImportProgressComponent } from '../../views/shared/backup-import-progress/backup-import-progress.component';
import { selectSettings } from '../store/settings/settings.selectors';
import { UpsertSettings, UpsertSettingsSuccess } from '../store/settings/settings.actions';
import { DailyReport } from '@territory-offline-workspace/shared-interfaces';

@Injectable({
  providedIn: 'root',
})
export class DataImportService {
  public static readonly CONGREGATION_COPY_KEY = '[TO] congr cpy';

  constructor(
    private store: Store<ApplicationState>,
    private matDialog: MatDialog,
    private translateService: TranslateService,
    private actions$: Actions
  ) {}

  public async importBackup(gzippedData: any) {
    const importProgressDialogRef = this.matDialog.open(BackupImportProgressComponent, {
      disableClose: true,
    });
    const unGzippedData = Pako.ungzip(gzippedData, { to: 'string' });
    const json = JSON.parse(unGzippedData);

    if (json && json.type === 'field-companion-backup') {
      await this.importDailyReports(this.datesFromStringToObject(json.reports)).toPromise();
      await this.importGoals(json.monthlyGoal, json.yearlyGoal).toPromise();
      alert(this.translateService.instant('settings.importSucceed'));
    } else {
      alert(this.translateService.instant('settings.noBackupFile'));
    }

    importProgressDialogRef.close();
  }

  private importDailyReports(dailyReports: DailyReport[]): Observable<any> {
    return this.bulkImport(
      dailyReports,
      BulkImportDailyReports,
      'dailyReports',
      BulkImportDailyReportsSuccess
    );
  }

  private importGoals(monthlyGoal, yearlyGoal) {
    const subject = new Subject();

    this.actions$
      .pipe(
        ofType(UpsertSettingsSuccess),
        take(1),
        tap(() =>
          setTimeout(() => {
            subject.next();
            subject.complete();
          }, 100)
        )
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
                monthlyGoal,
                yearlyGoal,
              },
            })
          )
        )
      )
      .subscribe();

    return subject;
  }

  private datesFromStringToObject(data: any[]) {
    const dateProperties = [
      'creationTime',
      'lastUpdated',
      'startTime',
      'endTime',
      'lastPrinting',
      'lastVisit',
    ];
    for (let i = 0; i < data.length; i++) {
      dateProperties.forEach((propName) => {
        if (!!data[i][propName]) {
          data[i][propName] = new Date(data[i][propName]);
        }
      });
    }
    return data;
  }

  private bulkImport(
    dataToBeImported: any[],
    importActionType: any,
    importActionFieldName: string,
    successActionType: any
  ): Observable<any> {
    const subject = new Subject();

    if (dataToBeImported && dataToBeImported.length > 0) {
      this.actions$
        .pipe(
          ofType(successActionType),
          take(1),
          tap(() => subject.next()),
          tap(() => subject.complete())
        )
        .subscribe();

      this.store.dispatch(importActionType({ [importActionFieldName]: dataToBeImported }));
    } else {
      setTimeout(() => {
        subject.next();
        subject.complete();
      }, 100);
    }

    return subject;
  }
}
