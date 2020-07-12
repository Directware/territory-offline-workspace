import {Component, OnDestroy, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {ApplicationState} from '../../core/store/index.reducers';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {VisitBan} from '../../core/store/visit-bans/model/visit-ban.model';
import {selectVisitBansByTerritoryId} from '../../core/store/visit-bans/visit-bans.selectors';
import {take, tap} from "rxjs/operators";
import {TerritoryMapsService} from "../../core/services/territory/territory-maps.service";

@Component({
  selector: 'app-visit-bans',
  templateUrl: './visit-bans.component.html',
  styleUrls: ['./visit-bans.component.scss']
})
export class VisitBansComponent implements OnInit, OnDestroy
{
  public visitBans$: Observable<VisitBan[]>;
  public territoryId: string;

  constructor(private store: Store<ApplicationState>,
              private router: Router,
              private mapsService: TerritoryMapsService,
              private activatedRoute: ActivatedRoute)
  {
  }

  public ngOnInit(): void
  {
    this.territoryId = this.activatedRoute.snapshot.params.territoryId;
    this.visitBans$ = this.store.pipe(select(selectVisitBansByTerritoryId, this.territoryId));
    this.setMarkersOnMap();
  }

  public ngOnDestroy()
  {
    this.mapsService.clearMarkers();
  }

  public back()
  {
    this.router.navigate([{outlets: {'second-thread': ['territory', this.territoryId]}}]);
  }

  public editVisitBan(visitBan: VisitBan)
  {
    this.router.navigate([{outlets: {'second-thread': ['visit-ban', this.territoryId, visitBan.id]}}]);
  }

  public createVisitBan()
  {
    this.router.navigate([{outlets: {'second-thread': ['visit-ban', this.territoryId]}}]);
  }

  private setMarkersOnMap()
  {
    this.visitBans$
      .pipe(
        take(1),
        tap((visitBans) =>
          {
            visitBans.forEach((vb) =>
            {
              if (!!vb.gpsPosition)
              {
                this.mapsService.setMarker([vb.gpsPosition.lng, vb.gpsPosition.lat], `<p>${vb.name || 'kein Name'}</p>`)
              }
            })
          }
        )
      ).subscribe();
  }
}
