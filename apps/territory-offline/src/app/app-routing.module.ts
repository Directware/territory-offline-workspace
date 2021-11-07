import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { TerritoriesComponent } from './views/territories/territories.component';
import { PublishersComponent } from './views/publishers/publishers.component';
import { TagsComponent } from './views/tags/tags.component';
import { CongregationsComponent } from './views/congregations/congregations.component';
import { TransferComponent } from './views/transfer/transfer.component';
import { SettingsComponent } from './views/settings/settings.component';
import { LockScreenComponent } from './views/lock-screen/lock-screen.component';
import { InitialConfigurationGuard } from './core/guards/initial-configuration.guard';
import { AppNotLockedGuard } from './core/guards/app-not-locked.guard';
import { InitialConfigurationComponent } from './views/initial-configuration/initial-configuration.component';
import { AppAlreadyConfiguredGuard } from './core/guards/app-already-configured.guard';
import { PublisherComponent } from './views/publishers/publisher/publisher.component';
import { TerritoryComponent } from './views/territories/territory/territory.component';
import { AssignmentsComponent } from './views/assignments/assignments.component';
import { AssignmentComponent } from './views/assignments/assignment/assignment.component';
import { VisitBansComponent } from './views/visit-bans/visit-bans.component';
import { VisitBanComponent } from './views/visit-bans/visit-ban/visit-ban.component';
import { CongregationComponent } from './views/congregations/congregation/congregation.component';
import { OverdueAssignmentsComponent } from './views/assignments/overdue-assignments/overdue-assignments.component';
import { PrintTerritoryComponent } from './views/territories/print-territory/print-territory.component';
import { ProcessingDueAfterComponent } from './views/settings/processing-due-after/processing-due-after.component';
import { ReassignAfterComponent } from './views/settings/reassign-after/reassign-after.component';
import { ReassignDueAfterComponent } from './views/settings/reassign-due-after/reassign-due-after.component';
import { ChooseOriginComponent } from './views/initial-configuration/choose-origin/choose-origin.component';
import { WholeVisitBansComponent } from './views/visit-bans/whole-visit-bans/whole-visit-bans.component';
import { ImportGeoJsonComponent } from './views/transfer/import-geo-json/import-geo-json.component';
import { ExportReportForGroupOverseerComponent } from './views/transfer/export-report-for-group-overseer/export-report-for-group-overseer.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [InitialConfigurationGuard, AppNotLockedGuard],
  },

  {
    path: 'congregations',
    component: CongregationsComponent,
    canActivate: [InitialConfigurationGuard, AppNotLockedGuard],
  },
  { path: 'congregation', component: CongregationComponent, outlet: 'second-thread' },
  { path: 'congregation/:id', component: CongregationComponent, outlet: 'second-thread' },

  {
    path: 'territories',
    component: TerritoriesComponent,
    canActivate: [InitialConfigurationGuard, AppNotLockedGuard],
  },
  { path: 'territory', component: TerritoryComponent, outlet: 'second-thread' },
  { path: 'territory/:id', component: TerritoryComponent, outlet: 'second-thread' },
  { path: 'print/:territoryId', component: PrintTerritoryComponent, outlet: 'second-thread' },

  {
    path: 'all-visit-bans',
    component: WholeVisitBansComponent,
    canActivate: [InitialConfigurationGuard, AppNotLockedGuard],
  },
  {
    path: 'all-visit-bans/:territoryId/:id',
    component: VisitBanComponent,
    outlet: 'second-thread',
  },
  { path: 'visit-bans/:territoryId', component: VisitBansComponent, outlet: 'second-thread' },
  { path: 'visit-ban', component: VisitBanComponent, outlet: 'second-thread' },
  { path: 'visit-ban/:territoryId', component: VisitBanComponent, outlet: 'second-thread' },
  { path: 'visit-ban/:territoryId/:id', component: VisitBanComponent, outlet: 'second-thread' },

  { path: 'assignments/:territoryId', component: AssignmentsComponent, outlet: 'second-thread' },
  {
    path: 'overdue-assignments/:publisherId',
    component: OverdueAssignmentsComponent,
    outlet: 'second-thread',
  },
  { path: 'assignment/:territoryId', component: AssignmentComponent, outlet: 'second-thread' },
  { path: 'assignment/:territoryId/:id', component: AssignmentComponent, outlet: 'second-thread' },

  {
    path: 'publishers',
    component: PublishersComponent,
    canActivate: [InitialConfigurationGuard, AppNotLockedGuard],
  },
  { path: 'publisher', component: PublisherComponent, outlet: 'second-thread' },
  { path: 'publisher/:id', component: PublisherComponent, outlet: 'second-thread' },

  {
    path: 'transfer',
    component: TransferComponent,
    canActivate: [InitialConfigurationGuard, AppNotLockedGuard],
  },
  { path: 'transfer/import-geo-json', component: ImportGeoJsonComponent, outlet: 'second-thread' },
  {
    path: 'group-overseer-report',
    component: ExportReportForGroupOverseerComponent,
    outlet: 'second-thread',
  },
  {
    path: 'tags',
    component: TagsComponent,
    canActivate: [InitialConfigurationGuard, AppNotLockedGuard],
  },
  {
    path: 'lock-screen',
    component: LockScreenComponent,
    outlet: 'global',
    data: { animation: 'LockScreen' },
  },

  {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [InitialConfigurationGuard, AppNotLockedGuard],
  },
  { path: 'processing-due-after', component: ProcessingDueAfterComponent, outlet: 'second-thread' },
  { path: 'reassign-after', component: ReassignAfterComponent, outlet: 'second-thread' },
  { path: 'reassign-due-after', component: ReassignDueAfterComponent, outlet: 'second-thread' },

  {
    path: 'initial-configuration',
    component: InitialConfigurationComponent,
    outlet: 'global',
    canActivate: [AppAlreadyConfiguredGuard],
  },
  { path: 'choose-origin', component: ChooseOriginComponent, outlet: 'global' },
  { path: '**', redirectTo: 'dashboard' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
