import {Component, ElementRef, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable, Subject} from 'rxjs';
import {select, Store} from '@ngrx/store';
import {ApplicationState} from '../../../core/store/index.reducers';
import {selectOverdueAssignmentsByPreacher} from '../../../core/store/assignments/assignments.selectors';
import {first, map, take, takeUntil, tap} from 'rxjs/operators';
import {AssignmentsService} from '../../../core/services/assignment/assignments.service';
import {TerritoryMapsService} from "../../../core/services/territory/territory-maps.service";
import {selectAllTerritories} from "../../../core/store/territories/territories.selectors";
import {Assignment} from "@territory-offline-workspace/shared-interfaces";
import {PlatformAgnosticActionsService} from "../../../core/services/common/platform-agnostic-actions.service";
import {TranslateService} from "@ngx-translate/core";
import {createDurationPhrase} from "@territory-offline-workspace/shared-utils";

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
              private elementRef: ElementRef,
              private translateService: TranslateService,
              private platformAgnosticActionsService: PlatformAgnosticActionsService,
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
          map(assignments => assignments.sort((dto1, dto2) => dto1.startTime > dto2.startTime ? 1 : -1)),
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

  public async shareList()
  {
    const assignments = await this.assignments$.pipe(first()).toPromise();
    const territories = await this.store.pipe(select(selectAllTerritories), first()).toPromise();

    const messageHelper = [this.translateService.instant("overdueAssigments.shareOverdueFirstSentence") + " \n"];
    assignments.forEach(a => {
      const territory = territories.filter(t => t.id === a.territoryId)[0];
      messageHelper.push(`\t * ${territory.key} ${territory.name} seit ${createDurationPhrase(a.startTime)}`);
    });

    messageHelper.push("\n" + this.translateService.instant("overdueAssigments.shareOverdueLastSentence"))

    const message = messageHelper.join("\n");

    await this.platformAgnosticActionsService.shareText(message);
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
