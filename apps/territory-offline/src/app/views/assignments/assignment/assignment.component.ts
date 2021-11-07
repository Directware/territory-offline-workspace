import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { take, tap } from 'rxjs/operators';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { v4 as uuid } from 'uuid';
import { ApplicationState } from '../../../core/store/index.reducers';
import { selectAssignmentById } from '../../../core/store/assignments/assignments.selectors';
import {
  DeleteAssignment,
  DeleteAssignmentSuccess,
  UpsertAssignment,
  UpsertAssignmentSuccess,
} from '../../../core/store/assignments/assignments.actions';
import { Actions, ofType } from '@ngrx/effects';
import { LastDoingsService } from '../../../core/services/common/last-doings.service';
import { DatePipe } from '@angular/common';
import { AssignmentsService } from '../../../core/services/assignment/assignments.service';
import { Assignment } from '@territory-offline-workspace/shared-interfaces';

@Component({
  selector: 'app-assignment',
  templateUrl: './assignment.component.html',
  styleUrls: ['./assignment.component.scss'],
})
export class AssignmentComponent implements OnInit {
  public assignment: FormGroup;
  public readyToDelete: boolean;
  public isCreation: boolean;
  public existsButNotReturned: boolean;
  public editStartTime: boolean;
  public editEndTime: boolean;
  public sendToPublisher: boolean;

  constructor(
    private fb: FormBuilder,
    private store: Store<ApplicationState>,
    private actions$: Actions,
    private router: Router,
    private datePipe: DatePipe,
    private lastDoingsService: LastDoingsService,
    private assignmentService: AssignmentsService,
    private activatedRoute: ActivatedRoute
  ) {}

  public ngOnInit(): void {
    this.considerInitialisingFromAssignment(this.activatedRoute.snapshot.params);
  }

  public back() {
    window.history.back();
    // TODO back from overdue
    // this.router.navigate([{outlets: {'second-thread': ['assignments', this.activatedRoute.snapshot.params.territoryId]}}]);
  }

  public createAssignment() {
    this.actions$
      .pipe(
        ofType(UpsertAssignmentSuccess),
        take(1),
        tap((action) => {
          if (this.sendToPublisher) {
            this.assignmentService.sendToPublisher(action.assignment);
          }
        }),
        tap(() => this.back())
      )
      .subscribe();

    this.store.dispatch(UpsertAssignment({ assignment: this.assignment.getRawValue() }));
  }

  public deleteAssignment() {
    if (!this.readyToDelete) {
      this.readyToDelete = true;
      setTimeout(() => (this.readyToDelete = false), 1500);
      return;
    }

    this.actions$
      .pipe(
        ofType(DeleteAssignmentSuccess),
        take(1),
        tap(() => this.back())
      )
      .subscribe();

    this.store.dispatch(DeleteAssignment({ assignment: this.assignment.getRawValue() }));
  }

  private considerInitialisingFromAssignment(snapshotParams: Params) {
    if (snapshotParams.id) {
      this.isCreation = false;
      this.store
        .pipe(
          select(selectAssignmentById, snapshotParams.id),
          take(1),
          tap((assignment) => this.initFormGroup(assignment, snapshotParams.territoryId))
        )
        .subscribe();
    } else {
      this.isCreation = true;
      this.initFormGroup(null, snapshotParams.territoryId);
    }
  }

  private initFormGroup(a: Assignment, territoryId: string) {
    this.existsButNotReturned = a && a.startTime && !a.endTime;

    this.assignment = this.fb.group({
      id: [a ? a.id : uuid(), Validators.required],
      publisherId: [a ? a.publisherId : '', Validators.required],
      territoryId: [a ? a.territoryId : territoryId, Validators.required],
      startTime: [a ? a.startTime : new Date(), Validators.required],
      endTime: [a ? a.endTime : null],
      statusColor: [a ? a.statusColor : ''],
      creationTime: [a && a.creationTime ? a.creationTime : new Date()],
    });
  }
}
