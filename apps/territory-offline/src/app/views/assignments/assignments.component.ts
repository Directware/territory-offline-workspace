import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { ApplicationState } from '../../core/store/index.reducers';
import { selectAssignmentsByTerritoryId } from '../../core/store/assignments/assignments.selectors';
import { AssignmentsService } from '../../core/services/assignment/assignments.service';
import { Assignment } from '@territory-offline-workspace/shared-interfaces';

@Component({
  selector: 'app-assignments',
  templateUrl: './assignments.component.html',
  styleUrls: ['./assignments.component.scss'],
})
export class AssignmentsComponent implements OnInit {
  public assignments$: Observable<Assignment[]>;
  public territoryId: string;

  constructor(
    private store: Store<ApplicationState>,
    private router: Router,
    private assignmentsService: AssignmentsService,
    private activatedRoute: ActivatedRoute
  ) {}

  public ngOnInit(): void {
    this.territoryId = this.activatedRoute.snapshot.params.territoryId;
    this.assignments$ = this.store.pipe(select(selectAssignmentsByTerritoryId, this.territoryId));
  }

  public back() {
    this.router.navigate([{ outlets: { 'second-thread': ['territory', this.territoryId] } }]);
  }

  public editAssignment(assignment: Assignment) {
    this.router.navigate([
      { outlets: { 'second-thread': ['assignment', this.territoryId, assignment.id] } },
    ]);
  }

  public createAssignment() {
    this.router.navigate([{ outlets: { 'second-thread': ['assignment', this.territoryId] } }]);
  }

  public giveBack(assignment: Assignment) {
    this.assignmentsService.giveBackNow(assignment);
  }

  public giveBackAndAssign(assignment: Assignment) {
    this.assignmentsService.giveBackAndAssign(assignment);
  }
}
