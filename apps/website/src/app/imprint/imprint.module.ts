import { ImprintRoutingModule } from './imprint-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { IconsModule } from './icons/icons.module';
import { ImprintComponent } from './components/imprint/imprint.component';

@NgModule({
  declarations: [ImprintComponent],
  imports: [CommonModule, ImprintRoutingModule, TranslateModule.forChild(), IconsModule],
})
export class ImprintModule {}
