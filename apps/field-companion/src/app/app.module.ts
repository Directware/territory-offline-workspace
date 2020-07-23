import {BrowserModule, HammerModule} from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {WelcomeComponent} from './views/onboarding/welcome/welcome.component';
import {AppInitializerService} from "./core/services/app-initialiser.service";
import {select, Store, StoreModule} from "@ngrx/store";
import {EffectsModule} from "@ngrx/effects";
import {StoreDevtoolsModule} from "@ngrx/store-devtools";
import {ApplicationState, reducers} from "./core/store/index.reducers";
import {effects} from "./core/store/index.effects";
import {environment} from "../environments/environment";
import {FieldServiceComponent} from './views/field-service/field-service.component';
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {deDE} from "./core/i18n/de-DE";
import {enUS} from "./core/i18n/en-US";
import {CalendarComponent} from './views/shared/calendar/calendar.component';
import {FeatherIconsModule} from "./core/shared/feather-icons/feather-icons.module";
import {MainNavigationComponent} from './views/shared/main-navigation/main-navigation.component';
import {FieldServiceInputsComponent} from './views/field-service/field-service-inputs/field-service-inputs.component';
import {ChooseMonthComponent} from './views/field-service/choose-month/choose-month.component';
import {StudiesInputComponent} from './views/field-service/studies-input/studies-input.component';
import {GoalsInputComponent} from './views/field-service/goals-input/goals-input.component';
import {SendReportComponent} from './views/field-service/send-report/send-report.component';
import {EditReportBeforeSendComponent} from './views/field-service/send-report/edit-report-before-send/edit-report-before-send.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SettingsComponent} from './views/settings/settings.component';
import {TerritoriesComponent} from './views/territories/territories.component';
import {StackPanelComponent} from './views/shared/stack-panel/stack-panel.component';
import {TerritoryPreviewComponent} from './views/territories/territory-preview/territory-preview.component';
import {TerritoryFeaturePreviewComponent} from './views/territories/territory-feature-preview/territory-feature-preview.component';
import {Plugins} from '@capacitor/core';
import {plPL} from "./core/i18n/pl-PL";
import {selectUserLanguage} from "./core/store/settings/settings.selectors";
import {tap} from "rxjs/operators";
import {ChangeLanguageComponent} from './views/settings/change-language/change-language.component';
import {AboutAppComponent} from './views/settings/about-app/about-app.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {UiSwitchModule} from "ngx-ui-switch";
import {MatDialogModule} from "@angular/material/dialog";
import {BackupImportProgressComponent} from "./views/shared/backup-import-progress/backup-import-progress.component";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {CircleProgressComponent} from './views/shared/circle-progress/circle-progress.component';
import { InputDurationComponent } from './views/field-service/input-duration/input-duration.component';
import {UiComponentsModule} from "@territory-offline-workspace/ui-components";
import { ReportUpToTheMinuteComponent } from './views/feature-confirmation-modals/report-up-to-the-minute/report-up-to-the-minute.component';

const {Device} = Plugins;

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
    TerritoryPreviewComponent,
    TerritoryFeaturePreviewComponent,
    ChangeLanguageComponent,
    AboutAppComponent,
    BackupImportProgressComponent,
    CircleProgressComponent,
    InputDurationComponent,
    ReportUpToTheMinuteComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    UiComponentsModule,
    FeatherIconsModule,
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot(effects),
    TranslateModule.forRoot(),
    HammerModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    UiSwitchModule.forRoot({
      size: 'medium',
      defaultBgColor: '#c8cacc',
      defaultBoColor: 'transparent'
    }),
    !environment.production ? StoreDevtoolsModule.instrument({logOnly: true, maxAge: 25}) : [],
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: startupServiceFactory,
      deps: [AppInitializerService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule
{
  constructor(private translateService: TranslateService, private store: Store<ApplicationState>)
  {
    this.initLanguage();
  }

  private async initLanguage()
  {
    this.translateService.setTranslation("de", deDE);
    this.translateService.setTranslation("pl", plPL);
    this.translateService.setTranslation("en", enUS);

    const info = await Device.getLanguageCode();
    const systemLanguage = info.value;

    this.store
      .pipe(
        select(selectUserLanguage),
        tap((settingsLang) =>
        {
          let lang = settingsLang;
          if (!settingsLang)
          {
            lang = systemLanguage;
          }
          const langIsAvailable = this.translateService.getLangs().includes(lang);
          this.translateService.currentLang = langIsAvailable ? lang : "en";
        })
      ).subscribe();
  }
}

export function startupServiceFactory(startupService: AppInitializerService): Function
{
  return () => startupService.load();
}
