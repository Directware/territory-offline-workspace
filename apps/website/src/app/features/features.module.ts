import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeaturesHeadComponent } from './components/features-head/features-head.component';
import { FeaturesGetStartedComponent } from './components/features-get-started/features-get-started.component';
import { FeaturesStartNowComponent } from './components/features-start-now/features-start-now.component';
import { FeaturesMainComponent } from './components/features-main/features-main.component';
import { FeaturesMainItemComponent } from './components/features-main/features-main-item/features-main-item.component';
import { FeaturesMainModalComponent } from './components/features-main/features-main-modal/features-main-modal.component';
import { FeaturesRoutingModule } from './features-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { IconsModule } from './icons/icons.module';
import { FeaturesComponent } from './components/features/features.component';

@NgModule({
  declarations: [
    FeaturesComponent,
    FeaturesHeadComponent,
    FeaturesGetStartedComponent,
    FeaturesMainComponent,
    FeaturesStartNowComponent,
    FeaturesMainItemComponent,
    FeaturesMainModalComponent,
  ],
  imports: [CommonModule, FeaturesRoutingModule, TranslateModule.forChild(), IconsModule],
})
export class FeaturesModule {}
