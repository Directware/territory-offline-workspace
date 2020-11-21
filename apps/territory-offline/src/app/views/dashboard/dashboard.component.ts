import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {select, Store} from '@ngrx/store';
import {ApplicationState} from '../../core/store/index.reducers';
import {
  selectDashboardData,
  selectOverdueAssignments,
  selectOverdueTerritories
} from '../../core/store/assignments/assignments.selectors';
import {Observable, Subject} from 'rxjs';
import {filter, map, takeUntil, tap} from 'rxjs/operators';
import {Territory} from "@territory-offline-workspace/api";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy
{
  public dashboardData$: Observable<any>;
  public currentSecondThreadUuid: string;

  public overdueAssignments$: Observable<any>;
  public showAllOverdueAssignments: boolean;

  public overdueTerritories$: Observable<any>;
  public showAllOverdueTerritories: boolean;

  private destroyer = new Subject();

  constructor(private router: Router,
              private store: Store<ApplicationState>,
              private activatedRoute: ActivatedRoute)
  {
  }

  public ngOnInit(): void
  {
    this.dashboardData$ = this.store.pipe(select(selectDashboardData));
    this.overdueAssignments$ = this.store.pipe(
      select(selectOverdueAssignments),
      map((dtos: any[]) =>
        {
          dtos.forEach(dto => dto.assignments.sort((dto1, dto2) => dto1.startTime > dto2.startTime ? 1 : -1));
          return dtos.sort((dto1, dto2) => dto1.assignments[0].startTime > dto2.assignments[0].startTime ? 1 : -1);
        }
      )
    );
    this.overdueTerritories$ = this.store.pipe(select(selectOverdueTerritories), map(dtos => dtos.sort((dto1, dto2) => dto1.lastAssignmentEndTime > dto2.lastAssignmentEndTime ? 1 : -1)));
    this.router.navigate([{outlets: {'second-thread': null}}]);

    this.router
      .events
      .pipe(
        takeUntil(this.destroyer),
        filter(e => e instanceof NavigationEnd),
        map(() => this.activatedRoute.snapshot.root.children.filter(tmp => tmp.outlet === 'second-thread')[0]),
        tap((child) => this.currentSecondThreadUuid = child && child.params ? (child.params.id || child.params.publisherId || child.params.visitBanId) : null)
      ).subscribe();
  }

  public ngOnDestroy(): void
  {
    this.destroyer.next();
    this.destroyer.complete();
  }

  public showPublisherOverdueAssignments(dto)
  {
    if (this.clickOnSameSecondThreadUuid(dto.publisher.id))
    {
      this.router.navigate([{outlets: {'second-thread': null}}]);
    }
    else
    {
      this.router.navigate([{outlets: {'second-thread': ['overdue-assignments', dto.publisher.id]}}]);
    }
  }

  public overdueAssignmentsCount(dtos: any[]): number
  {
    let count = 0;
    dtos.forEach(dto => count += dto.assignments.length);
    return count;
  }

  public showOverdueTerritory(dto: { territory: Territory })
  {
    if (this.clickOnSameSecondThreadUuid(dto.territory.id))
    {
      this.router.navigate([{outlets: {'second-thread': null}}]);
    }
    else
    {
      this.router.navigate([{outlets: {'second-thread': ['territory', dto.territory.id]}}]);
    }
  }

  private clickOnSameSecondThreadUuid(id: string): boolean
  {
    if (!this.activatedRoute.snapshot.root.children.filter(tmp => tmp.outlet === 'second-thread')[0])
    {
      return false;
    }

    return this.currentSecondThreadUuid === id;
  }
}
