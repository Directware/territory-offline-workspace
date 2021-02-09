import {HttpClientModule} from '@angular/common/http';
import {BrowserModule, HAMMER_GESTURE_CONFIG, HammerModule} from '@angular/platform-browser';
import {APP_INITIALIZER, ErrorHandler, NgModule, NgZone} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {FeatherIconsModule} from './core/shared/feather-icons/feather-icons.module';
import {DashboardComponent} from './views/dashboard/dashboard.component';
import {TerritoriesComponent} from './views/territories/territories.component';
import {PublishersComponent} from './views/publishers/publishers.component';
import {TagsComponent} from './views/tags/tags.component';
import {CongregationsComponent} from './views/congregations/congregations.component';
import {TransferComponent} from './views/transfer/transfer.component';
import {SettingsComponent} from './views/settings/settings.component';
import {LockScreenComponent} from './views/lock-screen/lock-screen.component';
import {Store, StoreModule} from '@ngrx/store';
import {Actions, EffectsModule, ofType} from '@ngrx/effects';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {ApplicationState, reducers} from './core/store/index.reducers';
import {effects} from './core/store/index.effects';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {InitialConfigurationComponent} from './views/initial-configuration/initial-configuration.component';
import {AppInitializerService} from './core/services/app-initialiser.service';
import {HammerConfig} from './core/services/common/hammer-config.service';
import {MainSearchComponent} from './views/shared/main-search/main-search.component';
import {AddTagComponent} from './views/tags/add-tag/add-tag.component';
import {SearchTagPipe} from './core/pipes/tags/search-tag.pipe';
import {PublisherComponent} from './views/publishers/publisher/publisher.component';
import {SecondThreadHeaderComponent} from './views/shared/second-thread-header/second-thread-header.component';
import {SearchPublisherPipe} from './core/pipes/publishers/search-publisher.pipe';
import {AssignedTagsComponent} from './views/tags/assigned-tags/assigned-tags.component';
import {PublisherSignatureComponent} from './views/publishers/publisher-signature/publisher-signature.component';
import {TerritoryComponent} from './views/territories/territory/territory.component';
import {AssignmentsComponent} from './views/assignments/assignments.component';
import {AssignmentComponent} from './views/assignments/assignment/assignment.component';
import {AddPublisherComponent} from './views/publishers/add-publisher/add-publisher.component';
import {PublisherIdToNamePipe} from './core/pipes/publishers/publisher-id-to-name.pipe';
import {VisitBansComponent} from './views/visit-bans/visit-bans.component';
import {VisitBanComponent} from './views/visit-bans/visit-ban/visit-ban.component';
import {CongregationComponent} from './views/congregations/congregation/congregation.component';
import {FitMap} from './core/directives/map/fit-map.directive';
import {OverdueAssignmentsComponent} from './views/assignments/overdue-assignments/overdue-assignments.component';
import {TerritoryIdToNamePipe} from './core/pipes/territories/territory-id-to-name.pipe';
import {PrintTerritoryComponent} from './views/territories/print-territory/print-territory.component';
import {PrintTerritoryBackComponent} from './views/territories/print-territory/print-territory-back/print-territory-back.component';
import {PrintTerritoryHeadingComponent} from './views/territories/print-territory/print-territory-heading/print-territory-heading.component';
import {ChooseOriginComponent} from './views/initial-configuration/choose-origin/choose-origin.component';
import {SearchTerritoryPipe} from "./core/pipes/territories/search-territory.pipe";
import {SearchCongregationPipe} from "./core/pipes/comgregations/search-congregation.pipe";
import {MatDialogModule} from "@angular/material/dialog";
import {BackupImportProgressComponent} from './views/shared/modals/backup-import-progress/backup-import-progress.component';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {ProcessingDueAfterComponent} from './views/settings/processing-due-after/processing-due-after.component';
import {ReassignAfterComponent} from './views/settings/reassign-after/reassign-after.component';
import {ReassignDueAfterComponent} from './views/settings/reassign-due-after/reassign-due-after.component';
import {GlobalErrorHandlerService} from "./core/services/common/global-error-handler.service";
import {TerritoryHelperImportComponent} from './views/transfer/territory-helper-import/territory-helper-import.component';
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {DatePipe} from "@angular/common";
import {WaitingModalComponent} from './views/shared/modals/waiting-modal/waiting-modal.component';
import {SyncDataComponent} from './views/transfer/sync-data/sync-data.component';
import {ChangelogModalComponent} from './views/settings/changelog-modal/changelog-modal.component';
import {ImportFromExcelModalComponent} from './views/transfer/import-from-excel-modal/import-from-excel-modal.component';
import {ImportVisitBansFromExcelComponent} from './views/transfer/import-from-excel-modal/import-visit-bans-from-excel/import-visit-bans-from-excel.component';
import {UiSwitchModule} from "ngx-ui-switch";
import {TagsPreviewComponent} from './views/tags/tags-preview/tags-preview.component';
import {ColorPickerModule} from "ngx-color-picker";
import {WholeVisitBansComponent} from './views/visit-bans/whole-visit-bans/whole-visit-bans.component';
import {SearchVisitBanPipe} from "./core/pipes/visit-bans/search-visit-ban.pipe";
import {VisitBanLastVisitTimePipe} from "./core/pipes/visit-bans/visit-ban-last-visit-time.pipe";
import {BackupImportChangesComponent} from './views/shared/modals/backup-import-changes/backup-import-changes.component';
import {TerritoryLanguageService, UiComponentsModule} from "@territory-offline-workspace/ui-components";
import {AVAILABLE_LANGUAGES} from "./core/i18n/all.i18n";
import {first, tap} from "rxjs/operators";
import {LoadSettingsSuccess} from "./core/store/settings/settings.actions";
import {Plugins} from '@capacitor/core';
import {DurationPhrasePipe} from './core/pipes/duration-phrase.pipe';
import {ImportGeoJsonComponent} from './views/transfer/import-geo-json/import-geo-json.component';
import {Router} from "@angular/router";
import {MatStepperModule} from "@angular/material/stepper";
import {RedundantVisitBanPipe} from "./core/pipes/visit-bans/redundant-visit-ban.pipe";
import {OrphanVisitBanPipe} from "./core/pipes/visit-bans/orphan-visit-ban.pipe";
import {MatSliderModule} from "@angular/material/slider";

declare const sourceMapSupport: any;
const {Device} = Plugins;

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    TerritoriesComponent,
    PublishersComponent,
    TagsComponent,
    CongregationsComponent,
    TransferComponent,
    SettingsComponent,
    LockScreenComponent,
    InitialConfigurationComponent,
    MainSearchComponent,
    AddTagComponent,
    SearchTagPipe,
    PublisherComponent,
    SecondThreadHeaderComponent,
    SearchPublisherPipe,
    AssignedTagsComponent,
    PublisherSignatureComponent,
    TerritoryComponent,
    AssignmentsComponent,
    AssignmentComponent,
    AddPublisherComponent,
    PublisherIdToNamePipe,
    VisitBansComponent,
    VisitBanComponent,
    CongregationComponent,
    OverdueAssignmentsComponent,
    TerritoryIdToNamePipe,
    CongregationComponent,
    FitMap,
    PrintTerritoryComponent,
    PrintTerritoryBackComponent,
    PrintTerritoryHeadingComponent,
    ChooseOriginComponent,
    SearchTerritoryPipe,
    SearchCongregationPipe,
    BackupImportProgressComponent,
    ProcessingDueAfterComponent,
    ReassignAfterComponent,
    ReassignDueAfterComponent,
    TerritoryHelperImportComponent,
    WaitingModalComponent,
    SyncDataComponent,
    ChangelogModalComponent,
    ImportFromExcelModalComponent,
    ImportVisitBansFromExcelComponent,
    TagsPreviewComponent,
    WholeVisitBansComponent,
    SearchVisitBanPipe,
    VisitBanLastVisitTimePipe,
    BackupImportChangesComponent,
    DurationPhrasePipe,
    ImportGeoJsonComponent,
    RedundantVisitBanPipe,
    OrphanVisitBanPipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    UiSwitchModule.forRoot({
      size: 'medium',
      defaultBgColor: '#c8cacc',
      defaultBoColor: 'transparent'
    }),
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    FeatherIconsModule,
    UiComponentsModule,
    HammerModule,
    ColorPickerModule,
    MatStepperModule,
    MatSliderModule,
    TranslateModule.forRoot(),
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot(effects),
    StoreDevtoolsModule.instrument({logOnly: true, maxAge: 25}),
  ],
  providers: [
    DatePipe,
    {provide: APP_INITIALIZER, useFactory: startupServiceFactory, deps: [AppInitializerService], multi: true},
    {provide: ErrorHandler, useClass: GlobalErrorHandlerService},
    {provide: HAMMER_GESTURE_CONFIG, useClass: HammerConfig}
  ],
  bootstrap: [AppComponent]
})
export class AppModule
{
  constructor(private store: Store<ApplicationState>,
              private actions$: Actions,
              private ngZone: NgZone,
              private router: Router,
              private languageService: TerritoryLanguageService,
              private translateService: TranslateService)
  {
    if(!!window["Cypress"])
    {
      window["store"] = this.store;
      window["actions"] = this.actions$;
      window["angularRouting"] = this.navigateByUrl.bind(this);
    }

    if(sourceMapSupport && sourceMapSupport.install)
    {
      sourceMapSupport.install();
      console.log("[AppModule] sourceMapSupport:", sourceMapSupport);
    }

    AVAILABLE_LANGUAGES.forEach(lang => this.translateService.setTranslation(lang.key, lang.translations));
    this.translateService.addLangs(AVAILABLE_LANGUAGES.map(lang => lang.key));

    this.actions$
      .pipe(
        ofType(LoadSettingsSuccess),
        first(),
        tap(async ({settings}) =>
        {
          let language = "en";
          if (settings && settings.initialConfigurationDone)
          {
            const translationsExists = settings?.appLanguage && this.translateService.getLangs().includes(settings.appLanguage.languageCode)
            if (translationsExists && settings.appLanguage && settings.appLanguage.languageCode)
            {
              language = settings.appLanguage.languageCode;
            }
          }
          else
          {
            const langCode = await Device.getLanguageCode();
            let systemLang = this.languageService.getLanguageByCode(langCode.value);

            if (systemLang && this.translateService.getLangs().includes(systemLang.languageCode))
            {
              language = systemLang.languageCode;
            }
          }
          setTimeout(() => this.translateService.use(language), 300);
        })
      ).subscribe();
  }

  // Method Cypress will call
  private navigateByUrl(url: string)
  {
    this.ngZone.run(() => this.router.navigateByUrl(url));
  }
}

export function startupServiceFactory(startupService: AppInitializerService): Function
{
  return () => startupService.load();
}
