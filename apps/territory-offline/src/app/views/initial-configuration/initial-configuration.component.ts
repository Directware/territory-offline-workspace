import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Actions, ofType} from '@ngrx/effects';
import {CryptoService} from '../../core/services/encryption/crypto.service';
import {Store} from '@ngrx/store';
import {ApplicationState} from '../../core/store/index.reducers';
import {v4 as uuid} from 'uuid';
import {SettingsState} from '../../core/store/settings/settings.reducer';
import {UnlockApp, UpsertSettings, UpsertSettingsSuccess} from '../../core/store/settings/settings.actions';
import {take, tap} from 'rxjs/operators';
import {
  UpsertCongregation,
  UpsertCongregationSuccess,
  UseCongregation
} from '../../core/store/congregation/congregations.actions';
import {LoadDrawings} from "../../core/store/drawings/drawings.actions";
import {DataSecurityService} from "../../core/services/common/data-security.service";
import {environment} from "../../../environments/environment";
import {TerritoryLanguageService, ToLanguage} from "@territory-offline-workspace/ui-components";
import {Congregation} from "@territory-offline-workspace/api";
import {Plugins} from '@capacitor/core';
import {TranslateService} from "@ngx-translate/core";

const {Device} = Plugins;

@Component({
  selector: 'app-initial-configuration',
  templateUrl: './initial-configuration.component.html',
  styleUrls: ['./initial-configuration.component.scss']
})
export class InitialConfigurationComponent implements OnInit
{
  public currentStep = 0;
  public initialConfigFormGroup: FormGroup;
  public isPasswordNeeded: boolean;

  constructor(private actions$: Actions,
              private cryptoService: CryptoService,
              private fb: FormBuilder,
              private languageService: TerritoryLanguageService,
              private translateService: TranslateService,
              private dataSecurityService: DataSecurityService,
              private store: Store<ApplicationState>)
  {
  }

  public ngOnInit()
  {
    this.isPasswordNeeded = !this.dataSecurityService.canAvoidPassword();
    const passwordValidators = [];

    if (this.isPasswordNeeded)
    {
      passwordValidators.push(Validators.required, Validators.minLength(7));
    }

    this.initialConfigFormGroup = this.fb.group({
      id: [uuid()],
      lockPassword: ['', passwordValidators],
      lockPasswordRepetition: ['', passwordValidators],
      congregation: ['', [Validators.required]],
      language: ['', [Validators.required]],
      languageCode: ['', [Validators.required]],
      isAppLocked: [false]
    }, {validator: this.isPasswordNeeded ? this.checkPasswords : null});

    if (!environment.production)
    {
      this.initialConfigFormGroup.patchValue({congregation: "Augsburg West"});
    }
  }

  public setLanguage(language: ToLanguage)
  {
    this.initialConfigFormGroup.patchValue({
      language: language ? language.nativeName : null,
      languageCode: language ? language.languageCode : null,
    });
  }

  public async createInitialConfiguration(center)
  {
    const tmp = this.initialConfigFormGroup.getRawValue();

    const currentCongregationId = uuid();

    const langCode = await Device.getLanguageCode();
    let systemLang = this.languageService.getLanguageByCode(langCode.value);

    if (!this.translateService.getLangs().includes(systemLang.languageCode))
    {
      systemLang = this.languageService.getLanguageByCode("en");
    }

    const createdSettings: SettingsState = {
      id: tmp.id,
      currentCongregationId: currentCongregationId,
      territoryOrigin: center,
      initialConfigurationDone: true,
      passwordHash: null,
      encryptedSecretKey: null,
      publicKey: null,
      secretKey: null,
      isAppLocked: true,
      processingPeriodInMonths: 4,
      processingBreakInMonths: 4,
      overdueBreakInMonths: 8,
      autoAppLockingInMinutes: 0,
      releaseInfo: null,
      appLanguage: systemLang
    };

    const congregation: Congregation = {
      id: currentCongregationId,
      name: tmp.congregation,
      language: tmp.language,
      languageCode: tmp.languageCode,
      hashedName: btoa(tmp.congregation),
      creationTime: new Date()
    };

    if (this.isPasswordNeeded)
    {
      const encryptionConfig = this.cryptoService.generateInitialConfig(tmp.lockPassword);
      createdSettings.passwordHash = encryptionConfig.hash;
      createdSettings.encryptedSecretKey = encryptionConfig.encryptedSecretKey;
      createdSettings.publicKey = new Uint8Array(Object.values(encryptionConfig.publicKey));
      createdSettings.secretKey = new Uint8Array(Object.values(encryptionConfig.secretKey));
    }

    this.firstOpenSequence(congregation);

    this.store.dispatch(UpsertSettings({settings: createdSettings}));
  }

  private firstOpenSequence(congregation)
  {
    this.actions$
      .pipe(
        ofType(UpsertSettingsSuccess),
        take(1),
        tap(() => this.store.dispatch(UpsertCongregation({congregation: congregation})))
      ).subscribe();

    this.actions$
      .pipe(
        ofType(UpsertCongregationSuccess),
        take(1),
        tap(() => this.store.dispatch(UseCongregation({congregationId: congregation.id})))
      ).subscribe();

    this.actions$
      .pipe(
        ofType(UseCongregation),
        take(1),
        tap(() => this.store.dispatch(UnlockApp()))
      ).subscribe();

    this.actions$
      .pipe(
        ofType(UnlockApp),
        take(1),
        tap(() => this.store.dispatch(LoadDrawings())) // Wichtig für die Initialisierung der Landkarte!
      ).subscribe();
  }

  private checkPasswords(group: FormGroup)
  {
    const pass = group.controls.lockPassword.value;
    const confirmPass = group.controls.lockPasswordRepetition.value;

    return pass === confirmPass || !pass || !confirmPass ? null : {notSame: true};
  }
}
