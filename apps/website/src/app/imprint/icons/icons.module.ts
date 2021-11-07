import { NgModule } from '@angular/core';
import { FeatherModule } from 'angular-feather';
import { User, Info } from 'angular-feather/icons';

@NgModule({
  imports: [FeatherModule.pick({ User, Info })],
  exports: [FeatherModule],
})
export class IconsModule {}
