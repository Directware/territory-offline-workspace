import {Component, HostListener, OnInit} from '@angular/core';
import {environment} from '../../../environments/environment';
import {select, Store} from '@ngrx/store';
import {ApplicationState} from '../../core/store/index.reducers';
import {selectSettings} from '../../core/store/settings/settings.selectors';
import {concatMap, map, take, tap, withLatestFrom} from 'rxjs/operators';
import {UnlockApp, UnlockSecretKey} from '../../core/store/settings/settings.actions';
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
              private cryptoService: CryptoService)
  {
  }

  public ngOnInit(): void
  {
    if (!environment.production)
    {
      this.appPassword = JSON.parse(localStorage.getItem(this.devPasswordKey));
      setTimeout(() => this.tryToUnLockWithPassword(), 500);
    }

    if (this.dataSecurityService.canAvoidPassword())
    {
      this.dataSecurityService.verify("App entsperren").then(() => this.unlockApp());
    }
    else
    {
      this.passwordNeeded = true;
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
      this.actions$.pipe(
        ofType(UnlockSecretKey),
        take(1),
        tap(() => this.encryptingNow = 'Tags werden entschlüsselt......'),
        tap(() => this.store.dispatch(LoadTags()))
      ).subscribe();

      this.store
        .pipe(
          select(selectSettings),
          take(1),
          map(settings => this.cryptoService.decryptSecretKey(password, settings.encryptedSecretKey)),
          tap(decryptedSecretKey => this.store.dispatch(UnlockSecretKey({secretKey: decryptedSecretKey}))),
          tap(() =>
          {
            if (!environment.production)
            {
              localStorage.setItem(this.devPasswordKey, JSON.stringify(password));
            }
          })
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
      tap(() => this.encryptingNow = 'Verkündiger werden entschlüsselt......'),
      tap(() => this.store.dispatch(LoadPublishers()))
    ).subscribe();

    this.actions$.pipe(
      ofType(LoadPublishersSuccess),
      take(1),
      tap(() => this.encryptingNow = 'Gebiete werden entschlüsselt...'),
      tap(() => this.store.dispatch(LoadTerritories()))
    ).subscribe();

    this.actions$.pipe(
      ofType(LoadTerritoriesSuccess),
      take(1),
      tap(() => this.encryptingNow = 'Zuteilungen werden entschlüsselt...'),
      tap(() => this.store.dispatch(LoadAssignments()))
    ).subscribe();

    this.actions$.pipe(
      ofType(LoadAssignmentsSuccess),
      take(1),
      tap(() => this.encryptingNow = 'Adressen werden entschlüsselt...'),
      tap(() => this.store.dispatch(LoadVisitBans()))
    ).subscribe();

    this.actions$.pipe(
      ofType(LoadVisitBansSuccess),
      take(1),
      tap(() => this.store.dispatch(LoadLastDoings()))
    ).subscribe();

    this.actions$.pipe(
      ofType(LoadLastDoingsSuccess),
      take(1),
      tap(() => this.encryptingNow = 'Zeichnungen werden entschlüsselt...'),
      tap(() => this.store.dispatch(LoadDrawings()))
    ).subscribe();

    this.actions$.pipe(
      ofType(LoadDrawingsSuccess),
      take(1),
      tap(() => this.encryptingNow = 'Versammlungen werden entschlüsselt...'),
      tap(() => this.store.dispatch(LoadCongregations()))
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
    ).subscribe();
  }
}
