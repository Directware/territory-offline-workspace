import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {v4 as uuid} from 'uuid';
import {first, map, take, takeUntil, tap} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';
import {Actions, ofType} from '@ngrx/effects';
import {select, Store} from '@ngrx/store';
import {ApplicationState} from '../../../core/store/index.reducers';
import {Observable, Subject} from 'rxjs';
import {selectTerritoryById} from '../../../core/store/territories/territories.selectors';
import {
  DeleteTerritory,
  DeleteTerritorySuccess,
  UpsertTerritory,
  UpsertTerritorySuccess
} from '../../../core/store/territories/territories.actions';
import {TerritoryMapsService} from '../../../core/services/territory/territory-maps.service';
import {DeleteDrawing, UpsertDrawing} from '../../../core/store/drawings/drawings.actions';
import {selectDrawingById} from '../../../core/store/drawings/drawings.selectors';
import {LastDoingsService} from "../../../core/services/common/last-doings.service";
import {FeatureCollection, Geometry} from '@turf/turf';
import {DeleteAssignmentsByTerritory} from "../../../core/store/assignments/assignments.actions";
import {selectAssignmentsByTerritoryId} from "../../../core/store/assignments/assignments.selectors";
import {AssignmentsService} from "../../../core/services/assignment/assignments.service";
import {Assignment, LastDoingActionsEnum, Territory} from "@territory-offline-workspace/api";

@Component({
  selector: 'app-territory',
  templateUrl: './territory.component.html',
  styleUrls: ['./territory.component.scss']
})
export class TerritoryComponent implements OnInit, OnDestroy
{
  @Input()
  public readOnly: boolean;

  @ViewChild("boundaryNameInput", {static: false})
  public boundaryNameInput: ElementRef;

  public assignment$: Observable<Assignment>;

  public territory: FormGroup;
  public isCreation: boolean;
  public allCurrentDrawings: FeatureCollection<Geometry>;
  private destroyer = new Subject();

  constructor(private fb: FormBuilder,
              private assignmentsService: AssignmentsService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private actions$: Actions,
              private lastDoingsService: LastDoingsService,
              private assignmentService: AssignmentsService,
              private territoryMapsService: TerritoryMapsService,
              private store: Store<ApplicationState>)
  {
  }

  public ngOnInit(): void
  {
    this.activatedRoute.params
      .pipe(
        takeUntil(this.destroyer),
        tap((params) => this.considerInitialisingFromTerritory(params.id))
      ).subscribe();
  }

  public ngOnDestroy(): void
  {
    this.destroyer.next();
    this.destroyer.complete();
  }

  public back()
  {
    if (window.location.href.includes("territories"))
    {
      this.router.navigate([{outlets: {'second-thread': null}}]);
    }
    else
    {
      window.history.back();
    }
  }

  public cancel()
  {
    if (this.isCreation)
    {
      this.back();
    }
    else
    {
      this.considerInitialisingFromTerritory();
    }
    this.territoryMapsService.setShouldBlockMapSynchronizer(false);
    this.territoryMapsService.destroyDrawMode();
  }

  public async sendToPublisher()
  {
    const assignment = await this.assignment$.pipe(first()).toPromise();
    this.assignmentService.sendToPublisher(assignment);
  }

  public editTerritory()
  {
    this.readOnly = false;
    this.territoryMapsService.setShouldBlockMapSynchronizer(true);
    this.initDrawMode();
  }

  public saveTerritory()
  {
    const rawValue = this.territory.getRawValue();
    const lastDoingAction = this.isCreation ? LastDoingActionsEnum.CREATE : LastDoingActionsEnum.UPDATE;

    this.actions$.pipe(
      ofType(UpsertTerritorySuccess),
      take(1),
      tap((action) => this.lastDoingsService.createLastDoing(lastDoingAction, action.territory.key + " " + action.territory.name)),
      tap(() => this.isCreation ? this.back() : this.considerInitialisingFromTerritory())
    ).subscribe();

    this.territoryMapsService.destroyDrawMode(true);

    this.store.dispatch(UpsertTerritory({territory: rawValue}));

    this.store.dispatch(UpsertDrawing({
      drawing: {
        id: rawValue.territoryDrawingId,
        featureCollection: this.allCurrentDrawings,
        creationTime: new Date()
      }
    }));
  }

  public printTerritory(territoryId: string)
  {
    this.router.navigate([{outlets: {'second-thread': ['print', territoryId]}}]);
  }

  public openAssignments(territoryId: string)
  {
    this.router.navigate([{outlets: {'second-thread': ['assignments', territoryId]}}]);
  }

  public openVisitBans(territoryId: string)
  {
    this.router.navigate([{outlets: {'second-thread': ['visit-bans', territoryId]}}]);
  }

  public removeBoundaryName(boundaryName: string)
  {
    const confirmed = confirm(`Möchtest du '${boundaryName}' wirklich löschen?`);

    if (confirmed)
    {
      const boundaryNames: string[] = this.territory.get("boundaryNames").value;

      this.territory.patchValue({
        boundaryNames: boundaryNames.filter(b => b !== boundaryName)
      });

      this.territory.markAsDirty();
    }
  }

  public addBoundaryName(boundaryName: string)
  {
    if (boundaryName && boundaryName.length > 0)
    {
      const alreadyAddedBoundaries: any[] = !!this.territory.get('boundaryNames').value ? this.territory.get('boundaryNames').value : [];

      const alreadyExists = alreadyAddedBoundaries.map(b => b.toLowerCase().trim()).filter(b => b === boundaryName.toLowerCase().trim())[0];

      if (!alreadyExists)
      {
        this.territory.patchValue({
          boundaryNames: [...alreadyAddedBoundaries, boundaryName]
        });

        this.territory.markAsDirty();

        this.boundaryNameInput.nativeElement.value = "";
      }
      else
      {
        alert(`Die Straße '${boundaryName}' ist bereits vorhanden!`);
      }
    }
  }

  public deleteTerritory()
  {
    const canDelete = confirm("Möchtest du dieses Gebiet wirklich löschen?");

    if (canDelete)
    {
      this.actions$.pipe(
        ofType(DeleteTerritorySuccess),
        take(1),
        tap((action) =>
          this.store.pipe(
            select(selectDrawingById, action.territory.territoryDrawingId),
            take(1),
            tap(drawing => this.territoryMapsService.destroyDrawMode()),
            tap(drawing => this.store.dispatch(DeleteDrawing({drawing: drawing}))),
            tap(drawing => this.store.dispatch(DeleteAssignmentsByTerritory({territoryId: action.territory.id}))),
            tap(drawing => this.territoryMapsService.deleteDrawingFromCache(drawing.id)),
          ).subscribe()
        ),
        tap(() => this.back())
      ).subscribe();

      this.store.dispatch(DeleteTerritory({territory: this.territory.getRawValue()}));
    }
  }

  public editAssignment(a)
  {
    this.router.navigate([{outlets: {'second-thread': ['assignment', this.territory.get("id").value, a.id]}}]);
  }

  public giveBack(a)
  {
    this.assignmentsService.giveBackNow(a)
  }

  public giveBackAndAssign(a)
  {
    this.assignmentsService.giveBackAndAssign(a)
  }

  private considerInitialisingFromTerritory(id?: string)
  {
    const snapshotId = id || this.activatedRoute.snapshot.params.id;

    if (snapshotId)
    {
      this.getCurrentAssignment(snapshotId);
      this.readOnly = true;
      this.isCreation = false;
      this.store
        .pipe(
          select(selectTerritoryById, snapshotId),
          take(1),
          tap(territory => this.initFormGroup(territory))
        ).subscribe();
    }
    else
    {
      this.readOnly = false;
      this.isCreation = true;
      this.initFormGroup(null);
      this.initDrawMode();
    }
  }

  private initDrawMode()
  {
    this.territoryMapsService.initDrawMode(this.territory.get('territoryDrawingId').value, (e, drawManager) =>
    {
      this.allCurrentDrawings = drawManager.getAll();

      if (e !== "initial")
      {
        this.territory.markAsDirty();
      }
    });
  }

  private initFormGroup(t: Territory)
  {
    this.focusTerritory(t);
    this.territory = this.fb.group({
      id: [t ? t.id : uuid(), Validators.required],
      name: [t ? t.name : '', Validators.required],
      key: [t ? t.key : '', Validators.required],
      populationCount: [t ? t.populationCount : 0],
      tags: [t ? t.tags : []],
      territoryDrawingId: [(t && t.territoryDrawingId) ? t.territoryDrawingId : uuid()],
      boundaryNames: [t ? t.boundaryNames : []],
      deactivated: [t ? t.deactivated : false],
      comment: [t ? t.comment : ''],
      creationTime: [t && t.creationTime ? t.creationTime : new Date()]
    });
  }

  private focusTerritory(territory: Territory)
  {
    if (territory)
    {
      this.territoryMapsService.focusOnDrawingIds([territory.territoryDrawingId]);
    }
  }

  private getCurrentAssignment(territoryId: string)
  {
    this.assignment$ = this.store.pipe(
      select(selectAssignmentsByTerritoryId, territoryId),
      map((assignments: Assignment[]) =>
      {
        if (assignments[0] && !assignments[0].endTime)
        {
          return assignments[0]
        }

        return null;
      })
    );
  }
}
