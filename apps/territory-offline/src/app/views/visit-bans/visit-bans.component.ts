import { TranslateService } from '@ngx-translate/core';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {ApplicationState} from '../../core/store/index.reducers';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {selectVisitBansByTerritoryId} from '../../core/store/visit-bans/visit-bans.selectors';
import {take, tap} from "rxjs/operators";
import {TerritoryMapsService} from "../../core/services/territory/territory-maps.service";
import {VisitBan} from "@territory-offline-workspace/api";

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
              private activatedRoute: ActivatedRoute,
              private translate: TranslateService)
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
    this.translate.get('visitBan.noName').pipe(take(1)).subscribe((translation: string) =>
      this.visitBans$
        .pipe(
          take(1),
          tap((visitBans) =>
            {
              visitBans.forEach((vb) =>
              {
                if (!!vb.gpsPosition)
                {
                  this.mapsService.setMarker(vb.id, [vb.gpsPosition.lng, vb.gpsPosition.lat], vb.name || translation);
                }
              })
            }
          )
        ).subscribe());
  }
}
