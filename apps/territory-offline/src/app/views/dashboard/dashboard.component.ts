import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Params, Router} from '@angular/router';
import {select, Store} from '@ngrx/store';
import {ApplicationState} from '../../core/store/index.reducers';
import {selectDashboardData, selectOverdueAssignments, selectOverdueTerritories} from '../../core/store/assignments/assignments.selectors';
import {Observable, Subject} from 'rxjs';
import {selectOverdueVisitBans} from '../../core/store/visit-bans/visit-bans.selectors';
import {Territory} from '../../core/store/territories/model/territory.model';
import {filter, map, takeUntil, tap} from 'rxjs/operators';
import {VisitBan} from '../../core/store/visit-bans/model/visit-ban.model';

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
    this.activatedRoute.params.pipe(tap(t => console.log(this.activatedRoute)));
    this.overdueAssignments$ = this.store.pipe(select(selectOverdueAssignments));
    this.overdueTerritories$ = this.store.pipe(select(selectOverdueTerritories));
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
