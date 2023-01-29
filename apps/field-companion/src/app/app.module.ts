import { APP_INITIALIZER, LOCALE_ID, NgModule } from "@angular/core";
import { BrowserModule, HammerModule } from "@angular/platform-browser";

import { registerLocaleData } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import localeDe from "@angular/common/locales/de";
import localePl from "@angular/common/locales/pl";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatDialogModule } from "@angular/material/dialog";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { Device } from "@capacitor/device";
import { EffectsModule } from "@ngrx/effects";
import { select, Store, StoreModule } from "@ngrx/store";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import {
  AppUrlOpenService,
  DonateModule,
} from "@territory-offline-workspace/shared-services";
import { UiComponentsModule } from "@territory-offline-workspace/ui-components";
import * as _ from "lodash";
import { UiSwitchModule } from "ngx-ui-switch";
import { tap } from "rxjs/operators";
import { environment } from "../environments/environment";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { deDE } from "./core/i18n/de-DE";
import { enUS } from "./core/i18n/en-US";
import { plPL } from "./core/i18n/pl-PL";
import { AppInitializerService } from "./core/services/app-initialiser.service";
import { TerritoryCardService } from "./core/services/territory-card.service";
import { FeatherIconsModule } from "./core/shared/feather-icons/feather-icons.module";
import { effects } from "./core/store/index.effects";
import { ApplicationState, reducers } from "./core/store/index.reducers";
import { selectUserLanguage } from "./core/store/settings/settings.selectors";
import { ReportUpToTheMinuteComponent } from "./views/feature-confirmation-modals/report-up-to-the-minute/report-up-to-the-minute.component";
import { TerritoryFeatureComponent } from "./views/feature-confirmation-modals/territory-feature/territory-feature.component";
import { ChooseMonthComponent } from "./views/field-service/choose-month/choose-month.component";
import { FieldServiceInputsComponent } from "./views/field-service/field-service-inputs/field-service-inputs.component";
import { FieldServiceComponent } from "./views/field-service/field-service.component";
import { GoalsInputComponent } from "./views/field-service/goals-input/goals-input.component";
import { InputDurationComponent } from "./views/field-service/input-duration/input-duration.component";
import { EditReportBeforeSendComponent } from "./views/field-service/send-report/edit-report-before-send/edit-report-before-send.component";
import { SendReportComponent } from "./views/field-service/send-report/send-report.component";
import { StudiesInputComponent } from "./views/field-service/studies-input/studies-input.component";
import { WelcomeComponent } from "./views/onboarding/welcome/welcome.component";
import { AboutAppComponent } from "./views/settings/about-app/about-app.component";
import { ChangeLanguageComponent } from "./views/settings/change-language/change-language.component";
import { SettingsComponent } from "./views/settings/settings.component";
import { BackupImportProgressComponent } from "./views/shared/backup-import-progress/backup-import-progress.component";
import { CalendarComponent } from "./views/shared/calendar/calendar.component";
import { CircleProgressComponent } from "./views/shared/circle-progress/circle-progress.component";
import { MainNavigationComponent } from "./views/shared/main-navigation/main-navigation.component";
import { StackPanelComponent } from "./views/shared/stack-panel/stack-panel.component";
import { MapControlsComponent } from "./views/territories/map/map-controls/map-controls.component";
import { MapComponent } from "./views/territories/map/map.component";
import { DurationLeftForTerritoryCardPipe } from "./views/territories/pipe/duration-left-for-territory-card.pipe";
import { TerritoriesComponent } from "./views/territories/territories.component";
import { ReturnTerritoryCardComponent } from "./views/territories/territory/return-territory-card/return-territory-card.component";
import { TerritoryComponent } from "./views/territories/territory/territory.component";
import { VisitBanManualChooserComponent } from "./views/territories/territory/visit-bans/visit-ban-manual-chooser/visit-ban-manual-chooser.component";
import { VisitBanComponent } from "./views/territories/territory/visit-bans/visit-ban/visit-ban.component";
import { VisitBansComponent } from "./views/territories/territory/visit-bans/visit-bans.component";

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    FieldServiceComponent,
    CalendarComponent,
    MainNavigationComponent,
    FieldServiceInputsComponent,
    ChooseMonthComponent,
    StudiesInputComponent,
    GoalsInputComponent,
    SendReportComponent,
    EditReportBeforeSendComponent,
    SettingsComponent,
    TerritoriesComponent,
    StackPanelComponent,
    ChangeLanguageComponent,
    AboutAppComponent,
    BackupImportProgressComponent,
    CircleProgressComponent,
    InputDurationComponent,
    ReportUpToTheMinuteComponent,
    DurationLeftForTerritoryCardPipe,
    TerritoryComponent,
    VisitBansComponent,
    VisitBanComponent,
    MapComponent,
    MapControlsComponent,
    VisitBanManualChooserComponent,
    ReturnTerritoryCardComponent,
    TerritoryFeatureComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    UiComponentsModule,
    FeatherIconsModule,
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot(effects),
    TranslateModule.forRoot(),
    HammerModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    DonateModule,
    UiSwitchModule.forRoot({
      size: "medium",
      defaultBgColor: "#c8cacc",
      defaultBoColor: "transparent",
    }),
    !environment.production
      ? StoreDevtoolsModule.instrument({ logOnly: true, maxAge: 25 })
      : [],
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: startupServiceFactory,
      deps: [AppInitializerService],
      multi: true,
    },
    {
      provide: LOCALE_ID,
      deps: [TranslateService], //some service handling global settings
      useFactory: (translateService) => translateService.currentLang, //returns locale string
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(
    private translateService: TranslateService,
    private appUrlOpenService: AppUrlOpenService,
    private territoryCardService: TerritoryCardService,
    private store: Store<ApplicationState>
  ) {
    this.appUrlOpenService.init([
      {
        extension: ".territory",
        handler: (blob) =>
          this.territoryCardService.importTerritoryFromFileSystem(blob),
      },
    ]);

    registerLocaleData(localeDe, "de");
    registerLocaleData(localePl, "pl");
    this.initLanguage();

    if (!environment.production) {
      checkTranslationFiles();
    }
  }

  private async initLanguage() {
    this.translateService.setTranslation("de", deDE, true);
    this.translateService.setTranslation("pl", plPL, true);
    this.translateService.setTranslation("en", enUS, true);

    const info = await Device.getLanguageCode();
    const systemLanguage = info.value;

    this.store
      .pipe(
        select(selectUserLanguage),
        tap((settingsLang) => {
          let lang = settingsLang;
          if (!settingsLang) {
            lang = systemLanguage;
          }
          const langIsAvailable = this.translateService
            .getLangs()
            .includes(lang);
          this.translateService.currentLang = langIsAvailable ? lang : "en";
        })
      )
      .subscribe();
  }
}

export function startupServiceFactory(
  startupService: AppInitializerService
): Function {
  return () => startupService.load();
}

export function checkTranslationFiles() {
  const deKeysSet = new Set<string>();
  const enKeysSet = new Set<string>();
  const plKeysSet = new Set<string>();

  deepKeys(deDE, deKeysSet, "");
  deepKeys(enUS, enKeysSet, "");
  deepKeys(plPL, plKeysSet, "");

  console.group("Translation checks:");
  const missingEnKeys = compareKeys(deKeysSet, enKeysSet);
  console.log("Missing english translations: ", missingEnKeys);

  const missingPlKeys = compareKeys(deKeysSet, plKeysSet);
  console.log("Missing polish translations: ", missingPlKeys);
  console.groupEnd();
}

export function deepKeys(object, keysSet: Set<string>, propPath: string) {
  const keys = _.keys(object);
  keys.forEach((key) => {
    const currentPropPath = `${propPath ? propPath + "." : ""}${key}`;
    keysSet.add(currentPropPath);
    if (typeof object[key] === "object") {
      deepKeys(object[key], keysSet, currentPropPath);
    }
  });
}

export function compareKeys(set1: Set<string>, set2: Set<string>) {
  return Array.from(set1.values()).filter((e) => !set2.has(e));
}
