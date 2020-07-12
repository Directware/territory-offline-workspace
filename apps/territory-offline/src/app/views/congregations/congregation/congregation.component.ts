import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Observable, Subject} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {Actions, ofType} from '@ngrx/effects';
import {select, Store} from '@ngrx/store';
import {ApplicationState} from '../../../core/store/index.reducers';
import {map, take, takeUntil, tap} from 'rxjs/operators';
import {selectCongregationById} from '../../../core/store/congregation/congregations.selectors';
import {Congregation} from '../../../core/store/congregation/model/congregation.model';
import {v4 as uuid} from 'uuid';
import {
  DeleteCongregation,
  DeleteCongregationSuccess,
  UpsertCongregation,
  UpsertCongregationSuccess, UseCongregation
} from '../../../core/store/congregation/congregations.actions';
import {selectCurrentCongregationId} from '../../../core/store/settings/settings.selectors';
import {LastDoingActionsEnum} from "../../../core/store/last-doings/model/last-doing-actions.enum";
import {LastDoingsService} from "../../../core/services/common/last-doings.service";
import {LastDoing} from "../../../core/store/last-doings/model/last-doing.model";
import {selectLastDoings} from "../../../core/store/last-doings/last-doings.selectors";
import {ToLanguage} from "territory-offline-ui";
import {uuid4} from "@capacitor/core/dist/esm/util";
import {DataExportService} from "../../../core/services/import/data-export.service";
import {DataImportService} from "../../../core/services/import/data-import.service";

@Component({
  selector: 'app-congregation',
  templateUrl: './congregation.component.html',
  styleUrls: ['./congregation.component.scss']
})
export class CongregationComponent implements OnInit
{
  public currentCongregationId$: Observable<string>;
  public lastDoings$: Observable<LastDoing[]>;
  public readOnly: boolean;
  public congregation: FormGroup;
  public isCreation: boolean;
  private destroyer = new Subject();

  constructor(private fb: FormBuilder,
              private router: Router,
              private lastDoingsService: LastDoingsService,
              private activatedRoute: ActivatedRoute,
              private actions$: Actions,
              private dataExportService: DataExportService,
              private store: Store<ApplicationState>)
  {
  }

  public ngOnInit(): void
  {
    this.currentCongregationId$ = this.store.pipe(select(selectCurrentCongregationId));
    this.lastDoings$ = this.store.pipe(select(selectLastDoings), map(lastDoings => lastDoings.length > 0 ? lastDoings.slice(0, 12) : null));
    this.activatedRoute.params
      .pipe(
        takeUntil(this.destroyer),
        tap((params) => this.considerInitialisingFormCongregation(params.id))
      ).subscribe();
  }

  public back()
  {
    this.router.navigate([{outlets: {'second-thread': null}}]);
  }

  public cancel()
  {
    if (this.isCreation)
    {
      this.back();
    }
    else
    {
      this.considerInitialisingFormCongregation();
    }
  }

  public useCongregation()
  {
    this.store.dispatch(UseCongregation({congregationId: this.congregation.get("id").value}));
  }

  public duplicateCongregation()
  {
    const confirmation = confirm("Möchtest du diese Versammlung wirklich kopieren?");

    if (!confirmation)
    {
      return;
    }

    const newUuid = uuid4();
    this.actions$
      .pipe(
        ofType(UpsertCongregationSuccess),
        take(1),
        tap(() => this.store.dispatch(UseCongregation({congregationId: newUuid})))
      ).subscribe();

    this.dataExportService
      .exportAll()
      .then(dataPackage =>
      {
        localStorage.setItem(DataImportService.CONGREGATION_COPY_KEY, dataPackage);

        this.store
          .pipe(
            select(selectCongregationById, this.activatedRoute.snapshot.params.id),
            take(1),
            tap(congregation =>
            {
              this.store.dispatch(UpsertCongregation({
                congregation: {
                  ...congregation,
                  name: congregation.name + " copy",
                  hashedName: btoa(congregation.name),
                  id: newUuid,
                }
              }));
            })
          ).subscribe();
      });
  }

  public deleteCongregation()
  {
    const canDelete = confirm("Möchtest du diese Versammlung wirklich löschen?");

    if (canDelete)
    {
      this.actions$.pipe(
        ofType(DeleteCongregationSuccess),
        take(1),
        tap(() => this.back())
      ).subscribe();

      this.store.dispatch(DeleteCongregation({congregation: this.congregation.getRawValue()}));
    }
  }

  public setLanguage(language: ToLanguage)
  {
    this.congregation.patchValue({
      language: language ? language.nativeName : null,
      languageCode: language ? language.languageCode : null,
    });
    this.congregation.markAsDirty();
  }

  public createCongregation()
  {
    const rawValue = this.congregation.getRawValue();
    const lastDoingAction = this.isCreation ? LastDoingActionsEnum.CREATE : LastDoingActionsEnum.UPDATE;

    this.actions$.pipe(
      ofType(UpsertCongregationSuccess),
      take(1),
      tap((action) => this.lastDoingsService.createLastDoing(lastDoingAction, action.congregation.name)),
      tap(() => this.isCreation ? this.back() : this.considerInitialisingFormCongregation())
    ).subscribe();

    this.store.dispatch(UpsertCongregation({
      congregation: {
        ...rawValue,
        hashedName: btoa(rawValue.name)
      }
    }));
  }

  private considerInitialisingFormCongregation(id?: string)
  {
    const snapshotId = id || this.activatedRoute.snapshot.params.id;

    if (snapshotId)
    {
      this.readOnly = true;
      this.isCreation = false;
      this.store
        .pipe(
          select(selectCongregationById, snapshotId),
          take(1),
          tap(congregation => this.initFormGroup(congregation))
        ).subscribe();
    }
    else
    {
      this.readOnly = false;
      this.isCreation = true;
      this.initFormGroup(null);
    }
  }

  private initFormGroup(c: Congregation)
  {
    this.congregation = this.fb.group({
      id: [c ? c.id : uuid(), Validators.required],
      name: [c ? c.name : '', Validators.required],
      language: [c ? c.language : '', Validators.required],
      languageCode: [c ? c.languageCode : '', Validators.required],
      hashedName: [c ? c.hashedName : ''],
      creationTime: [c && c.creationTime ? c.creationTime : new Date()]
    });
  }
}
