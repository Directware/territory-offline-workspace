import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { select, Store } from '@ngrx/store';
import { ApplicationState } from '../../../core/store/index.reducers';
import { Observable, Subject } from 'rxjs';
import { selectAllVisitBans } from '../../../core/store/visit-bans/visit-bans.selectors';
import { map, takeUntil, tap } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';
import { VisitBan } from '@territory-offline-workspace/shared-interfaces';
import { TerritoryMapsService } from '../../../core/services/territory/territory-maps.service';
import { TranslateService } from '@ngx-translate/core';
import { sortBy } from 'lodash';
import { isInLocationPath } from '@territory-offline-workspace/shared-utils';

@Component({
  selector: 'app-whole-visit-bans',
  templateUrl: './whole-visit-bans.component.html',
  styleUrls: ['./whole-visit-bans.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WholeVisitBansComponent implements OnInit, OnDestroy {
  public search: { value: string };
  public currentVisitBanId: string;
  public visitBans$: Observable<VisitBan[]>;
  public sort: 'alphabetic' | 'lastVisit' = 'alphabetic';
  public sortFunction: Function;
  public sliceAddressLength = 30;

  public visibleVisitBanMarkers = {};

  private destroyer = new Subject();

  constructor(
    private store: Store<ApplicationState>,
    private translate: TranslateService,
    private territoryMapsService: TerritoryMapsService,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router
  ) {}

  public ngOnInit(): void {
    this.router.navigate([{ outlets: { 'second-thread': null } }]);
    this.considerSortFunction(this.sort);
    this.territoryMapsService.setShouldBlockMapSynchronizer(true);
    this.territoryMapsService.wholeVisitBansView();

    this.router.events
      .pipe(
        takeUntil(this.destroyer),
        tap((test) => {
          if (test instanceof NavigationEnd) {
            if (!isInLocationPath('(second-thread:visit-ban/')) {
              this.currentVisitBanId = null;
              this.changeDetectorRef.detectChanges();
            }
          }
        })
      )
      .subscribe();
  }

  public ngOnDestroy() {
    this.destroyer.next();
    this.destroyer.complete();
    this.territoryMapsService.setShouldBlockMapSynchronizer(false);
    this.territoryMapsService.leaveWholeVisitBansView();
    this.territoryMapsService.clearMarkers();
    this.territoryMapsService.focusOnDrawingIds();
  }

  public createVisitBan() {
    this.router.navigate([{ outlets: { 'second-thread': ['visit-ban'] } }]);
  }

  public showVisitBanMarker(event, visitBan: VisitBan) {
    event.stopPropagation();
    this.visibleVisitBanMarkers[visitBan.id] = visitBan;
    const position = [visitBan.gpsPosition.lng, visitBan.gpsPosition.lat];
    const text = `${visitBan.street} ${visitBan.streetSuffix} <br /> ${
      visitBan.name || this.translate.instant('visitBan.noName')
    }`;
    this.territoryMapsService.setMarker(visitBan.id, position, text);
    setTimeout(() => this.territoryMapsService.focusOnMarkers(), 0);
  }

  public removeVisitBanMarker(event, visitBan: VisitBan) {
    event.stopPropagation();
    delete this.visibleVisitBanMarkers[visitBan.id];
    this.territoryMapsService.clearMarker(visitBan.id);

    if (Object.values(this.visibleVisitBanMarkers).length > 0) {
      setTimeout(() => this.territoryMapsService.focusOnMarkers(), 0);
    } else {
      this.territoryMapsService.focusOnDrawingIds();
      this.territoryMapsService.wholeVisitBansView();
    }
  }

  public editVisitBan(vb: VisitBan) {
    this.currentVisitBanId = vb.id;
    this.router.navigate([
      { outlets: { 'second-thread': ['visit-ban', vb.territoryId || '', vb.id] } },
    ]);
  }

  public changeSorting(sort: 'alphabetic' | 'lastVisit') {
    this.sort = sort;
    this.considerSortFunction(this.sort);
  }

  public visibleVisitBans(visitBans: VisitBan[]) {
    const tmp = visitBans.filter((vb) => !!this.visibleVisitBanMarkers[vb.id]);
    return tmp.length > 0 ? tmp : null;
  }

  public notVisibleVisitBans(visitBans: VisitBan[]) {
    return visitBans.filter((vb) => !this.visibleVisitBanMarkers[vb.id]);
  }

  private considerSortFunction(sort: string) {
    this.visitBans$ = null;
    this.visitBans$ = this.store.pipe(
      select(selectAllVisitBans),
      map((visitBans) => {
        switch (sort) {
          case 'lastVisit': {
            return visitBans.sort(this.sortLastVisit);
          }
          default: {
            return sortBy(visitBans, ['street', 'streetSuffix']);
          }
        }
      }),
      map((visitBans) => [...visitBans])
    );
  }

  private sortLastVisit(vb1: VisitBan, vb2: VisitBan) {
    const firstDate = vb1.lastVisit ? vb1.lastVisit : vb1.creationTime;
    const secondDate = vb2.lastVisit ? vb2.lastVisit : vb2.creationTime;

    return firstDate < secondDate ? -1 : 1;
  }
}
