import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable, Subject} from 'rxjs';
import {select, Store} from '@ngrx/store';
import {ApplicationState} from '../../../core/store/index.reducers';
import {selectOverdueAssignmentsByPreacher} from '../../../core/store/assignments/assignments.selectors';
import {take, takeUntil, tap} from 'rxjs/operators';
import {AssignmentsService} from '../../../core/services/assignment/assignments.service';
import {TerritoryMapsService} from "../../../core/services/territory/territory-maps.service";
import {selectAllTerritories} from "../../../core/store/territories/territories.selectors";
import {Assignment} from "@territory-offline-workspace/api";

@Component({
  selector: 'app-overdue-assignments',
  templateUrl: './overdue-assignments.component.html',
  styleUrls: ['./overdue-assignments.component.scss']
})
export class OverdueAssignmentsComponent implements OnInit, OnDestroy
{
  public assignments$: Observable<Assignment[]>;
  private destroyer = new Subject();

  constructor(private store: Store<ApplicationState>,
              private activatedRoute: ActivatedRoute,
              private assignmentsService: AssignmentsService,
              private territoryMapsService: TerritoryMapsService,
              private router: Router)
  {
  }

  public ngOnInit(): void
  {
    this.activatedRoute.params
      .pipe(
        takeUntil(this.destroyer),
        tap((params) => this.assignments$ = this.store.pipe(
          select(selectOverdueAssignmentsByPreacher, params.publisherId),
          tap((assignments: Assignment[]) =>
          {
            this.store
              .pipe(
                select(selectAllTerritories),
                take(1),
                tap(territories =>
                {
                  if(assignments)
                  {
                    const tmp = territories.filter(t => assignments.map(a => a.territoryId).includes(t.id));
                    this.territoryMapsService.focusOnDrawingIds(tmp.map(t => t.territoryDrawingId));
                  }
                })
              ).subscribe();
          })
        ))
      ).subscribe();
  }

  public ngOnDestroy(): void
  {
    this.territoryMapsService.focusOnDrawingIds(null);
    this.destroyer.next();
    this.destroyer.complete();
  }

  public back()
  {
    this.router.navigate([{outlets: {'second-thread': null}}]);
  }

  public editAssignment(assignment: Assignment)
  {
    this.router.navigate([{outlets: {'second-thread': ['assignment', this.activatedRoute.snapshot.params.territoryId, assignment.id]}}]);
  }

  public giveBack(assignment: Assignment)
  {
    this.assignmentsService.giveBackNow(assignment);
  }

  public giveBackAndAssign(assignment: Assignment)
  {
    this.assignmentsService.giveBackAndAssign(assignment);
  }
}
