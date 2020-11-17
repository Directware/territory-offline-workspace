import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DatePickerComponent} from "./form-controls/date-picker/date-picker.component";
import {SingleOptionComponent} from "./form-controls/single-option/single-option.component";
import {InfoBlockComponent} from "./info-block/info-block.component";
import {ListComponent} from "./list/list.component";
import {ListItemComponent} from "./list/list-item/list-item.component";
import {PanelComponent} from "./panel/panel.component";
import {LanguageSearchComponent} from "./form-controls/language-search/language-search.component";
import {ReactiveFormsModule} from "@angular/forms";
import {DurationPickerComponent} from "./form-controls/duration-picker/duration-picker.component";
import { HideablePanelComponent } from './hideable-panel/hideable-panel.component';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [
    DatePickerComponent,
    DurationPickerComponent,
    SingleOptionComponent,
    InfoBlockComponent,
    ListComponent,
    ListItemComponent,
    PanelComponent,
    LanguageSearchComponent,
    HideablePanelComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule.forChild()
  ],
  exports: [
    DatePickerComponent,
    DurationPickerComponent,
    SingleOptionComponent,
    InfoBlockComponent,
    ListComponent,
    ListItemComponent,
    PanelComponent,
    LanguageSearchComponent,
    HideablePanelComponent
  ]
})
export class UiComponentsModule {}
