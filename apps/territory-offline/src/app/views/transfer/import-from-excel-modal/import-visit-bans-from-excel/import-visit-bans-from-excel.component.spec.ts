import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ImportVisitBansFromExcelComponent} from './import-visit-bans-from-excel.component';
import {APP_BASE_HREF, CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AppRoutingModule} from "../../../../app-routing.module";
import {HttpClientModule} from "@angular/common/http";
import {MatDialogModule, MatDialogRef} from "@angular/material/dialog";
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
import {provideMockStore} from "@ngrx/store/testing";
import {createVisitBan} from "@territory-offline-workspace/shared-interfaces";

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
      declarations: [ImportVisitBansFromExcelComponent],
      providers: [
        provideMockStore({}),
        {provide: APP_BASE_HREF, useValue: "/"},
        {
          provide: MatDialogRef,
          useValue: {}
        },
      ]
    }).compileComponents();
  }));

  beforeEach(() =>
  {
    fixture = TestBed.createComponent(ImportVisitBansFromExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => expect(component).toBeTruthy());

  it('should not override existing visit bans', () =>
  {
    const existingVisitBans = [
      createVisitBan({name: "vb1"}),
      createVisitBan({name: "vb2"}),
      createVisitBan({name: "vb3"})
    ];

    const newVisitBans = [createVisitBan({name: "vb4"})];

    const result = component.overrideExistingVisitBans(existingVisitBans, newVisitBans);

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("vb4");
  })

  it('should override existing visit bans with the same street', () =>
  {
    const street = "Prinz-Regenten-Str."
    const streetSuffix = "125e"
    const existingVisitBans = [
      createVisitBan({name: "vb1"}),
      createVisitBan({name: "vb2", street, streetSuffix}),
      createVisitBan({name: "vb3"})
    ];

    const newVisitBans = [createVisitBan({name: "vb4", street, streetSuffix})];

    const result = component.overrideExistingVisitBans(existingVisitBans, newVisitBans);

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("vb4");
  })
});

