import {AfterViewInit, Component, HostListener, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {ApplicationState} from './core/store/index.reducers';
import {LockApp} from './core/store/settings/settings.actions';
import {RouterOutlet} from '@angular/router';
import {lockScreenAnimations} from './core/animations/lock-screen-route-animation';
import {Observable} from 'rxjs';
import {selectInitialConfigurationDone, selectIsAppLocked} from './core/store/settings/settings.selectors';
import {map, tap} from 'rxjs/operators';
import {Actions, ofType} from '@ngrx/effects';
import {TerritoryMapsService} from './core/services/territory/territory-maps.service';
import {BulkImportDrawingsSuccess, LoadDrawingsSuccess} from './core/store/drawings/drawings.actions';
import {DataImportService} from './core/services/import/data-import.service';
import {ToUpdatesService} from "./core/services/common/to-updates.service";

@Component({
  selector: 'territory-offline-workspace-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [lockScreenAnimations]
})
export class AppComponent implements OnInit, AfterViewInit
{
  public showSecondThread: boolean;
  public appAlreadyConfigured$: Observable<boolean>;
  public appIsNotLocked$: Observable<boolean>;
  public newRelease$: Observable<boolean>;
  public fullMap: boolean;

  constructor(private store: Store<ApplicationState>,
              private dataImportService: DataImportService,
              private toUpdatesService: ToUpdatesService,
              private actions$: Actions,
              private territoryMapsService: TerritoryMapsService)
  {
  }

  public ngOnInit(): void
  {
    this.newRelease$ = this.toUpdatesService.getReleaseInfo().pipe(map(ri => ri.shouldUpdate));

    this.appAlreadyConfigured$ = this.store.pipe(
      select(selectInitialConfigurationDone),
      tap((alreadyConfigured) => alreadyConfigured ? this.initMap() : null)
    );

    this.appIsNotLocked$ = this.store.pipe(select(selectIsAppLocked), map(isLocked => !isLocked));
  }

  public ngAfterViewInit()
  {
  }

  @HostListener('window:keypress', ['$event'])
  public keyboardInputListener(e: KeyboardEvent)
  {
    if (e.code === 'KeyL' && e.ctrlKey && e.shiftKey)
    {
      this.store.dispatch(LockApp());
    }
  }

  public toggleFullMap()
  {
    this.fullMap = !this.fullMap;
  }

  public onSecondThreadOutletDeactivation()
  {
    this.showSecondThread = false;

    setTimeout(() =>
    {
      // Only in this case its truly deactivated
      if (!this.showSecondThread)
      {
        // TODO move it to every onDestroy
        // this.territoryMapsService.focusOnDrawingIds();
      }
    }, 300);
  }

  public prepareRoute(outlet: RouterOutlet)
  {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }

  private initMap()
  {
    // return;
    this.actions$
      .pipe(
        ofType(LoadDrawingsSuccess, BulkImportDrawingsSuccess),
        // take(1),
        tap((drawings) =>
        {
          this.territoryMapsService.initMapWithDrawings({
            containerName: 'map',
            cameraOptions: {
              animate: false,
              padding: {right: 5, top: 5, left: 5, bottom: 5}
            }
          }, () => this.territoryMapsService.initMapSynchronizer());
        })
      ).subscribe();
  }
}
