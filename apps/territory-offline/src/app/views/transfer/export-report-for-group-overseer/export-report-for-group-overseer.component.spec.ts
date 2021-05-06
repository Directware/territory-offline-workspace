import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ExportReportForGroupOverseerComponent } from './export-report-for-group-overseer.component';
import {APP_BASE_HREF, CommonModule} from "@angular/common";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {StoreModule} from "@ngrx/store";
import {EffectsModule} from "@ngrx/effects";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AppRoutingModule} from "../../../app-routing.module";
import {HttpClientModule} from "@angular/common/http";
import {MatDialogModule} from "@angular/material/dialog";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {FeatherIconsModule} from "../../../core/shared/feather-icons/feather-icons.module";
import {UiComponentsModule} from "@territory-offline-workspace/ui-components";
import {HammerModule} from "@angular/platform-browser";
import {ColorPickerModule} from "ngx-color-picker";
import {MatStepperModule} from "@angular/material/stepper";
import {TranslateModule} from "@ngx-translate/core";
import {provideMockStore} from "@ngrx/store/testing";
import {SecondThreadHeaderComponent} from "../../shared/second-thread-header/second-thread-header.component";
import {AssignedTagsComponent} from "../../tags/assigned-tags/assigned-tags.component";

describe('ExportReportForGroupOverseerComponent', () => {
  let component: ExportReportForGroupOverseerComponent;
  let fixture: ComponentFixture<ExportReportForGroupOverseerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        NoopAnimationsModule,
        StoreModule.forRoot({}),
        EffectsModule.forRoot([]),
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
        TranslateModule.forRoot()
      ],
      declarations: [ SecondThreadHeaderComponent, AssignedTagsComponent, ExportReportForGroupOverseerComponent ],
      providers: [
        provideMockStore({}),
        {provide: APP_BASE_HREF, useValue: "/"},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportReportForGroupOverseerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
