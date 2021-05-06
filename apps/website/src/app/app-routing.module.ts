import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'home', loadChildren: () => import('./home/home.module').then((m) => m.HomeModule)},
  {path: 'features', loadChildren: () => import('./features/features.module').then((m) => m.FeaturesModule)},
  {path: 'features/:feature', loadChildren: () => import('./features/features.module').then((m) => m.FeaturesModule)},
  {path: 'imprint', loadChildren: () => import('./imprint/imprint.module').then((m) => m.ImprintModule)},
  {path: '**', redirectTo: '/home'}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
    anchorScrolling: 'enabled',
    relativeLinkResolution: 'legacy'
})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule
{
}
