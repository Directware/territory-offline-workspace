import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {WelcomeComponent} from "./views/onboarding/welcome/welcome.component";
import {InitialConfigurationGuard} from "./core/guards/initial-configuration.guard";
import {FieldServiceComponent} from "./views/field-service/field-service.component";
import {InitialConfigurationNotDoneGuard} from "./core/guards/initial-configuration-not-done.guard";
import {ChooseMonthComponent} from "./views/field-service/choose-month/choose-month.component";
import {StudiesInputComponent} from "./views/field-service/studies-input/studies-input.component";
import {GoalsInputComponent} from "./views/field-service/goals-input/goals-input.component";
import {SendReportComponent} from "./views/field-service/send-report/send-report.component";
import {EditReportBeforeSendComponent} from "./views/field-service/send-report/edit-report-before-send/edit-report-before-send.component";
import {SettingsComponent} from "./views/settings/settings.component";
import {TerritoryPreviewComponent} from "./views/territories/territory-preview/territory-preview.component";
import {TerritoryFeaturePreviewComponent} from "./views/territories/territory-feature-preview/territory-feature-preview.component";
import {ChangeLanguageComponent} from "./views/settings/change-language/change-language.component";
import {AboutAppComponent} from "./views/settings/about-app/about-app.component";

const routes: Routes = [
  {path: 'welcome', component: WelcomeComponent, canActivate: [InitialConfigurationNotDoneGuard], data: {animation: 'Welcome'}},
  {path: 'field-service', component: FieldServiceComponent, canActivate: [InitialConfigurationGuard], data: {animation: 'Time'}},
  {path: 'choose-month', component: ChooseMonthComponent, canActivate: [InitialConfigurationGuard], data: {animation: 'Modal'}},
  {path: 'choose-month-from-modal', component: ChooseMonthComponent, canActivate: [InitialConfigurationGuard], data: {animation: 'ChooseMonth'}},
  {path: 'studies-input', component: StudiesInputComponent, canActivate: [InitialConfigurationGuard], data: {animation: 'Modal'}},
  {path: 'goals-input', component: GoalsInputComponent, canActivate: [InitialConfigurationGuard], data: {animation: 'Modal'}},
  {path: 'send-report', component: SendReportComponent, canActivate: [InitialConfigurationGuard], data: {animation: 'Modal'}},
  {path: 'edit-report', component: EditReportBeforeSendComponent, canActivate: [InitialConfigurationGuard], data: {animation: 'EditReport'}},
  {path: 'settings', component: SettingsComponent, canActivate: [InitialConfigurationGuard], data: {animation: 'Settings'}},
  {path: 'change-language', component: ChangeLanguageComponent, canActivate: [InitialConfigurationGuard]},
  {path: 'about-app', component: AboutAppComponent, canActivate: [InitialConfigurationGuard], data: {animation: 'Modal'}},
  // {path: 'territories', component: TerritoriesComponent, canActivate: [InitialConfigurationGuard], data: {animation: 'Territories'}},
  {path: 'territories', component: TerritoryPreviewComponent, canActivate: [InitialConfigurationGuard], data: {animation: 'Territories'}},
  {path: 'territories-feature', component: TerritoryFeaturePreviewComponent, canActivate: [InitialConfigurationGuard]},

  {path: '**', redirectTo: 'field-service'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
