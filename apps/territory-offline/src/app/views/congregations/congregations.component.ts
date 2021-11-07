import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { ApplicationState } from '../../core/store/index.reducers';
import { selectAllCongregationsWithActiveFirst } from '../../core/store/congregation/congregations.selectors';
import { Router } from '@angular/router';
import { selectCurrentCongregationId } from '../../core/store/settings/settings.selectors';
import {
  selectTerritoriesCount,
  selectWholePopulationCount,
} from '../../core/store/territories/territories.selectors';
import { selectPublishersCount } from '../../core/store/publishers/publishers.selectors';
import { selectVisitBansCount } from '../../core/store/visit-bans/visit-bans.selectors';
import { Congregation } from '@territory-offline-workspace/shared-interfaces';

@Component({
  selector: 'app-congregations',
  templateUrl: './congregations.component.html',
  styleUrls: ['./congregations.component.scss'],
})
export class CongregationsComponent implements OnInit {
  public currentCongregationId$: Observable<string>;
  public congregations$: Observable<Congregation[]>;

  public allTerritoriesCount$: Observable<string>;
  public wholePopulationCount$: Observable<string>;
  public allPublishersCount$: Observable<string>;
  public allVisitBansCount$: Observable<string>;

  public searchValue: string;

  constructor(private router: Router, private store: Store<ApplicationState>) {}

  public ngOnInit(): void {
    this.currentCongregationId$ = this.store.pipe(select(selectCurrentCongregationId));
    this.congregations$ = this.store.pipe(select(selectAllCongregationsWithActiveFirst));

    this.allTerritoriesCount$ = this.store.pipe(select(selectTerritoriesCount));
    this.wholePopulationCount$ = this.store.pipe(select(selectWholePopulationCount));
    this.allPublishersCount$ = this.store.pipe(select(selectPublishersCount));
    this.allVisitBansCount$ = this.store.pipe(select(selectVisitBansCount));
    this.router.navigate([{ outlets: { 'second-thread': null } }]);
  }

  public createCongregation() {
    this.router.navigate([{ outlets: { 'second-thread': ['congregation'] } }]);
  }

  public editCongregation(congregation: Congregation) {
    this.router.navigate([{ outlets: { 'second-thread': ['congregation', congregation.id] } }]);
  }
}
