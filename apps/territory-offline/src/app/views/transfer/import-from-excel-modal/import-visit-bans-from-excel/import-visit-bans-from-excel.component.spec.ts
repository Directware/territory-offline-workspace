import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ImportVisitBansFromExcelComponent} from './import-visit-bans-from-excel.component';
import {CommonModule} from "@angular/common";
import {UiSwitchModule} from "ngx-ui-switch";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AppRoutingModule} from "../../../../app-routing.module";
import {HttpClientModule} from "@angular/common/http";
import {MatDialogModule} from "@angular/material/dialog";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {FeatherIconsModule} from "../../../../core/shared/feather-icons/feather-icons.module";
import {UiComponentsModule} from "@territory-offline-workspace/ui-components";
import {HammerModule} from "@angular/platform-browser";
import {ColorPickerModule} from "ngx-color-picker";
import {MatStepperModule} from "@angular/material/stepper";
import {TranslateModule} from "@ngx-translate/core";
import {StoreModule} from "@ngrx/store";
import {EffectsModule} from "@ngrx/effects";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";

describe('ImportVisitBansFromExcelComponent', () =>
{
  let component: ImportVisitBansFromExcelComponent;
  let fixture: ComponentFixture<ImportVisitBansFromExcelComponent>;

  beforeEach(async(() =>
  {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        NoopAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        AppRoutingModule,
        HttpClientModule,
        MatDialogModule,
        MatProgressSpinnerModule,
        FeatherIconsModule,
        UiComponentsModule,
        HammerModule,
        ColorPickerModule,
        MatStepperModule,
        TranslateModule.forRoot(),
        StoreModule.forRoot({}),
        EffectsModule.forRoot([])
      ],
      declarations: [ImportVisitBansFromExcelComponent]
    }).compileComponents();
  }));

  beforeEach(() =>
  {
    fixture = TestBed.createComponent(ImportVisitBansFromExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () =>
  {
    expect(component).toBeTruthy();
  });
});
