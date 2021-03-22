import {NgModule} from "@angular/core";
import {DonateHintService} from "./donate-hint.service";
import {DonateHintDialogComponent} from "./donate-hint-dialog/donate-hint-dialog.component";
import {FeatherModule} from "angular-feather";
import {Settings} from "angular-feather/icons";
import {CommonModule} from "@angular/common";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {UiComponentsModule} from "@territory-offline-workspace/ui-components";
import {donateTranslationDE} from "./i18n/de-DE";
import {donateTranslationEN} from "./i18n/en-US";
import {donateTranslationPL} from "./i18n/pl-PL";

@NgModule({
  declarations: [DonateHintDialogComponent],
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    UiComponentsModule,
    FeatherModule.pick({Settings})
  ],
  providers: []
})
export class DonateModule
{
  constructor(private donateHintService: DonateHintService, private translateService: TranslateService)
  {
    this.translateService.setTranslation("de", donateTranslationDE, true);
    this.translateService.setTranslation("pl", donateTranslationPL, true);
    this.translateService.setTranslation("en", donateTranslationEN, true);

    this.donateHintService.considerShowHintForDonate();
  }
}
