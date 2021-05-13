import {TranslateService} from '@ngx-translate/core';
import {Component, HostBinding, HostListener, OnInit} from '@angular/core';
import {environment} from '../../../environments/environment';
import {select, Store} from '@ngrx/store';
import {ApplicationState} from '../../core/store/index.reducers';
import {selectSettings} from '../../core/store/settings/settings.selectors';
import {catchError, concatMap, first, map, take, tap, withLatestFrom} from 'rxjs/operators';
import {UnlockApp} from '../../core/store/settings/settings.actions';
import {Router} from '@angular/router';
import {CryptoService} from '../../core/services/encryption/crypto.service';
import {Actions, ofType} from '@ngrx/effects';
import {LoadTags, LoadTagsSuccess} from '../../core/store/tags/tags.actions';
import {LoadPublishers, LoadPublishersSuccess} from '../../core/store/publishers/publishers.actions';
import {LoadTerritories, LoadTerritoriesSuccess} from '../../core/store/territories/territories.actions';
import {LoadDrawings, LoadDrawingsSuccess} from '../../core/store/drawings/drawings.actions';
import {LoadAssignments, LoadAssignmentsSuccess} from '../../core/store/assignments/assignments.actions';
import {LoadVisitBans, LoadVisitBansSuccess} from '../../core/store/visit-bans/visit-bans.actions';
import {
  LoadCongregations,
  LoadCongregationsSuccess,
  UseCongregation
} from '../../core/store/congregation/congregations.actions';
import {of} from 'rxjs';
import {DataSecurityService} from "../../core/services/common/data-security.service";
import {LoadLastDoings, LoadLastDoingsSuccess} from "../../core/store/last-doings/last-doings.actions";
import {DataImportService} from "../../core/services/import/data-import.service";

@Component({
  selector: 'app-lock-screen',
  templateUrl: './lock-screen.component.html',
  styleUrls: ['./lock-screen.component.scss']
})
export class LockScreenComponent implements OnInit
{
  @HostBinding("class.app-lock-screen")
  public appLockScreenClass = true;

  public passwordNeeded: boolean;
  public coolDown: boolean;
  public appPassword: string;
  public unLockError: string;
  public encryptingNow: string;
  private readonly devPasswordKey = '[TO] dev password';

  constructor(private store: Store<ApplicationState>,
              private router: Router,
              private dataImportService: DataImportService,
              private actions$: Actions,
              private dataSecurityService: DataSecurityService,
              private cryptoService: CryptoService,
              private translate: TranslateService)
  {
  }

  public ngOnInit(): void
  {
    if (!environment.production)
    {
      this.appPassword = JSON.parse(localStorage.getItem(this.devPasswordKey));
      setTimeout(() => this.tryToUnLockWithPassword(), 500);
    }

    this.passwordNeeded = this.dataSecurityService.mustUsePassword();

    console.log("passwordNeeded=" + this.passwordNeeded);

    if (!this.passwordNeeded)
    {
      this.dataSecurityService.verify().then(() => this.unlockApp());
    }
  }

  @HostListener('document:keydown', ['$event.key'])
  public onEnter(event: string)
  {
    if (event === 'Enter' && this.appPassword && !this.coolDown)
    {
      this.tryToUnLockWithPassword();
    }
  }

  public tryToUnLockWithPassword()
  {
    if (this.passwordNeeded && this.appPassword && !this.coolDown)
    {
      this.unLockError = null;
      this.coolDown = true;

      this.cryptoService
        .isPasswordCorrect(this.appPassword)
        .subscribe((isCorrect) =>
        {
          if (isCorrect)
          {
            this.unlockApp(this.appPassword);
          }
          else
          {
            console.warn('Falsches Password.');
            this.unLockError = 'wrong password animation';
            setTimeout(() => (this.coolDown = false), 5000);
          }
        });
    }
  }

  private unlockApp(password?: string)
  {
    this.loadAllDataListeners();

    if (!!password)
    {
      this.store
        .pipe(
          select(selectSettings),
          first(),
          map(settings => this.cryptoService.decryptSecretKey(password, settings.publicKey, settings.encryptedSecretKey)),
          tap(() => this.encryptingNow = this.translate.instant('lockScreen.decryptTags')),
          tap(() => this.store.dispatch(LoadTags()))
        ).subscribe();
    }
    else
    {
      this.store.dispatch(LoadTags());
    }
  }

  private loadAllDataListeners(showEncryptionProgress?: boolean)
  {
    this.actions$.pipe(
      ofType(LoadTagsSuccess),
      take(1),
      tap(() => this.encryptingNow = this.translate.instant('lockScreen.decryptPublishers')),
      tap(() => this.store.dispatch(LoadPublishers())),
      catchError((e) => this.catchLoadDataError(e))
    ).subscribe();

    this.actions$.pipe(
      ofType(LoadPublishersSuccess),
      take(1),
      tap(() => this.encryptingNow = this.translate.instant('lockScreen.decryptTerritories')),
      tap(() => this.store.dispatch(LoadTerritories())),
      catchError((e) => this.catchLoadDataError(e))
    ).subscribe();

    this.actions$.pipe(
      ofType(LoadTerritoriesSuccess),
      take(1),
      tap(() => this.encryptingNow = this.translate.instant('lockScreen.decryptAssignments')),
      tap(() => this.store.dispatch(LoadAssignments())),
      catchError((e) => this.catchLoadDataError(e))
    ).subscribe();

    this.actions$.pipe(
      ofType(LoadAssignmentsSuccess),
      take(1),
      tap(() => this.encryptingNow = this.translate.instant('lockScreen.decryptAddresses')),
      tap(() => this.store.dispatch(LoadVisitBans())),
      catchError((e) => this.catchLoadDataError(e))
    ).subscribe();

    this.actions$.pipe(
      ofType(LoadVisitBansSuccess),
      take(1),
      tap(() => this.store.dispatch(LoadLastDoings())),
      catchError((e) => this.catchLoadDataError(e))
    ).subscribe();

    this.actions$.pipe(
      ofType(LoadLastDoingsSuccess),
      take(1),
      tap(() => this.encryptingNow = this.translate.instant('lockScreen.decryptDrawings')),
      tap(() => this.store.dispatch(LoadDrawings())),
      catchError((e) => this.catchLoadDataError(e))
    ).subscribe();

    this.actions$.pipe(
      ofType(LoadDrawingsSuccess),
      take(1),
      tap(() => this.encryptingNow = this.translate.instant('lockScreen.decryptCongregations')),
      tap(() => this.store.dispatch(LoadCongregations())),
      catchError((e) => this.catchLoadDataError(e))
    ).subscribe();

    this.actions$.pipe(
      ofType(LoadCongregationsSuccess),
      take(1),
      concatMap(action => of(action).pipe(
        withLatestFrom(this.store.pipe(select(selectSettings)))
      )),
      tap(([action, settings]) => this.store.dispatch(UseCongregation({congregationId: settings.currentCongregationId}))),
      tap(() => this.store.dispatch(UnlockApp())),
      tap(() => this.dataImportService.checkCongregationCopy()),
      catchError((e) => this.catchLoadDataError(e))
    ).subscribe();
  }

  private catchLoadDataError(error)
  {
    console.log("[LockScreen] load data error:", error)
    return of([]);
  }
}
