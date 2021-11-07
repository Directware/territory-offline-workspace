import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { HomeDownloadComponent } from './components/home-download/home-download.component';
import { HomeFeatureItemComponent } from './components/home-main/home-feature-item/home-feature-item.component';
import { HomeHeadComponent } from './components/home-head/home-head.component';
import { HomeMainComponent } from './components/home-main/home-main.component';
import { HomeMoreComponent } from './components/home-more/home-more.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { IconsModule } from './icons/icons.module';
import { HomeRoutingModule } from './home-routing.module';

@NgModule({
  declarations: [
    HomeComponent,
    HomeDownloadComponent,
    HomeFeatureItemComponent,
    HomeHeadComponent,
    HomeMainComponent,
    HomeMoreComponent,
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    TranslateModule.forChild(),
    FormsModule,
    HttpClientModule,
    IconsModule,
  ],
  exports: [HomeDownloadComponent],
})
export class HomeModule {}
