import { TranslateService } from '@ngx-translate/core';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {v4 as uuid} from 'uuid';
import {select, Store} from '@ngrx/store';
import {ApplicationState} from '../../../core/store/index.reducers';
import {
  DeletePublisher,
  DeletePublisherSuccess,
  UpsertPublisher,
  UpsertPublisherSuccess
} from '../../../core/store/publishers/publishers.actions';
import {ActivatedRoute, Router} from '@angular/router';
import {Actions, ofType} from '@ngrx/effects';
import {map, take, takeUntil, tap} from 'rxjs/operators';
import {selectPublisherById} from '../../../core/store/publishers/publishers.selectors';
import {Observable, Subject} from 'rxjs';
import {LastDoingsService} from "../../../core/services/common/last-doings.service";
import {
  selectAssignmentsByPublisherId,
  selectTerritoriesByPublisher
} from "../../../core/store/assignments/assignments.selectors";
import {BulkUpsertAssignments} from "../../../core/store/assignments/assignments.actions";
import {TerritoryMapsService} from "../../../core/services/territory/territory-maps.service";
import {Assignment, LastDoingActionsEnum, Publisher, Territory} from "@territory-offline-workspace/api";

@Component({
  selector: 'app-create-publisher',
  templateUrl: './publisher.component.html',
  styleUrls: ['./publisher.component.scss']
})
export class PublisherComponent implements OnInit, OnDestroy
{
  public readOnly: boolean;
  public publisher: FormGroup;
  public publisherTerritories$: Observable<{t: Territory, durationPhrase: string}[]>;
  public isCreation: boolean;
  private destroyer = new Subject();

  constructor(private fb: FormBuilder,
              private router: Router,
              private lastDoingsService: LastDoingsService,
              private activatedRoute: ActivatedRoute,
              private actions$: Actions,
              private territoryMapsService: TerritoryMapsService,
              private store: Store<ApplicationState>,
              private translate: TranslateService)
  {
  }

  public ngOnInit(): void
  {
    this.activatedRoute.params
      .pipe(
        takeUntil(this.destroyer),
        tap((params) => this.considerInitialisingFromPublisher(params.id))
      ).subscribe();
  }

  public ngOnDestroy(): void
  {
    this.destroyer.next();
    this.destroyer.complete();
    this.territoryMapsService.focusOnDrawingIds(null);
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
      this.considerInitialisingFromPublisher();
    }
  }

  public createPublisher()
  {
    const rawValue = this.publisher.getRawValue();
    const lastDoingAction = this.isCreation ? LastDoingActionsEnum.CREATE : LastDoingActionsEnum.UPDATE;

    this.actions$.pipe(
      ofType(UpsertPublisherSuccess),
      take(1),
      tap((action) => this.lastDoingsService.createLastDoing(lastDoingAction, action.publisher.firstName + " " + action.publisher.name)),
      tap(() => this.isCreation ? this.back() : this.considerInitialisingFromPublisher())
    ).subscribe();

    this.store.dispatch(UpsertPublisher({publisher: rawValue}));
  }

  public tryToDeletePublisher()
  {
    this.translate.get(['publisher.reallyDelete', 'publisher.canNotDelete'], {firstName: this.publisher.get("firstName").value, name: this.publisher.get("name").value}).pipe(take(1)).subscribe((translations: {[key: string]: string}) => {
      const canDelete = confirm(translations['publisher.reallyDelete']);

      if (canDelete)
      {
        this.canDeletePublisher()
          .subscribe(canDelete =>
          {
            if (canDelete)
            {
              this.deletePublisher();
            }
            else
            {
              alert(translations['publisher.canNotDelete']);
            }
          });
      }
    });
  }

  public navigateToTerritory(territory: Territory)
  {
    this.router.navigate([{outlets: {'second-thread': ['territory', territory.id]}}]);
  }

  private considerInitialisingFromPublisher(id?: string)
  {
    const snapshotId = id || this.activatedRoute.snapshot.params.id;

    if (snapshotId)
    {
      this.readOnly = true;
      this.isCreation = false;
      this.store
        .pipe(
          select(selectPublisherById, snapshotId),
          take(1),
          tap(publisher => this.initFormGroup(publisher))
        ).subscribe();

      this.getPublisherTerritories(snapshotId);
    }
    else
    {
      this.readOnly = false;
      this.isCreation = true;
      this.initFormGroup(null);
    }
  }

  private initFormGroup(p: Publisher)
  {
    this.publisher = this.fb.group({
      id: [p ? p.id : uuid(), Validators.required],
      name: [p ? p.name : '', Validators.required],
      firstName: [p ? p.firstName : '', Validators.required],
      email: [p ? p.email : ''],
      phone: [p ? p.phone : ''],
      tags: [p ? p.tags : []],
      dsgvoSignature: [p ? p.dsgvoSignature : ''],
      creationTime: [p && p.creationTime ? p.creationTime : new Date()],
      lastUpdated: [new Date()]
    });
  }

  private canDeletePublisher()
  {
    return this.store
      .pipe(
        select(selectAssignmentsByPublisherId, this.publisher.get("id").value),
        take(1),
        map((assignments: Assignment[]) => assignments.filter(a => !a.endTime).length === 0)
      );
  }

  private deletePublisher()
  {
    this.actions$.pipe(
      ofType(DeletePublisherSuccess),
      take(1),
      tap(action =>
        this.store.pipe(
          select(selectAssignmentsByPublisherId, action.publisher.id),
          take(1),
          tap((assignments: Assignment[]) => this.store.dispatch(BulkUpsertAssignments({
            assignments: assignments.map(a => ({
              ...a,
              removedPublisherLabel: `${action.publisher.firstName} ${action.publisher.name}`
            }))
          })))
        ).subscribe()
      ),
      tap(() => this.back())
    ).subscribe();

    this.store.dispatch(DeletePublisher({publisher: this.publisher.getRawValue()}));
  }

  private getPublisherTerritories(publisherId: string)
  {
    this.publisherTerritories$ = this.store.pipe(
      select(selectTerritoriesByPublisher, publisherId),
      take(1),
      tap((territories) => this.territoryMapsService.focusOnDrawingIds(territories.map(dto => dto.t.territoryDrawingId)))
    );
  }
}
