import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { ApplicationState } from "../../../core/store/index.reducers";
import {
  UpsertSettings,
  UpsertSettingsSuccess,
} from "../../../core/store/settings/settings.actions";
import { take, tap } from "rxjs/operators";
import { Router } from "@angular/router";
import { v4 as uuid4 } from "uuid";
import { Actions, ofType } from "@ngrx/effects";
import { TerritoryLanguageService } from "@territory-offline-workspace/ui-components";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DonateHintService } from "@territory-offline-workspace/shared-services";
import { settingsCollectionName } from "@territory-offline-workspace/shared-interfaces";
import { Device } from "@capacitor/device";

@Component({
  selector: "app-welcome",
  templateUrl: "./welcome.component.html",
  styleUrls: ["./welcome.component.scss"],
})
export class WelcomeComponent implements OnInit {
  public formGroup: FormGroup;
  public currentPage = 0;

  constructor(
    private store: Store<ApplicationState>,
    private languageService: TerritoryLanguageService,
    private actions$: Actions,
    private formBuilder: FormBuilder,
    private donateHintService: DonateHintService,
    private router: Router
  ) {}

  public ngOnInit(): void {
    this.donateHintService.blockDonationHint();
    this.formGroup = this.formBuilder.group({
      userName: ["", Validators.required],
      userLanguage: [null, Validators.required],
    });
  }

  public async setUp() {
    this.actions$
      .pipe(
        ofType(UpsertSettingsSuccess),
        take(1),
        tap(() => this.router.navigate(["field-service"]))
      )
      .subscribe();

    const deviceId = await Device.getId();
    const languageCode = await Device.getLanguageCode();

    const lang =
      this.languageService.getLanguageByCode(languageCode.value) ||
      this.languageService.getDefaultLanguage();

    this.store.dispatch(
      UpsertSettings({
        settings: {
          id: uuid4(),
          userId: deviceId?.uuid || uuid4(),
          userName: null,
          userLanguage: lang,
          initialConfigurationDone: true,
          creationTime: new Date(),
          monthlyGoal: 0,
          yearlyGoal: 0,
          monthlyReminder: false,
          prefix: settingsCollectionName,
          durationStep: 30,
          confirmedFeatures: null,
        },
      })
    );
  }
}
