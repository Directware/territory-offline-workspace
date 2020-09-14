import {Component, OnInit} from '@angular/core';
import {select, Store} from "@ngrx/store";
import {ApplicationState} from "../../../../core/store/index.reducers";
import {Router} from "@angular/router";
import {MapService} from "../../../../core/services/map/map.service";
import {selectAllTerritoryCards} from "../../../../core/store/territory-card/territory-card.selectors";
import {first} from "rxjs/operators";
import {VisitBan} from "@territory-offline-workspace/api";
import { Plugins } from '@capacitor/core';

const { Geolocation } = Plugins;

@Component({
  selector: 'fc-map-controls',
  templateUrl: './map-controls.component.html',
  styleUrls: ['./map-controls.component.scss']
})
export class MapControlsComponent implements OnInit
{
  public areVisitBansActive: boolean;
  public isTracingEnabled: boolean;
  private tracingWatchId: string;

  public constructor(private store: Store<ApplicationState>,
                     private router: Router,
                     private mapService: MapService)
  {
  }

  public ngOnInit(): void
  {
  }

  public async toggleVisitBans()
  {
    const territoryCards = await this.store.pipe(select(selectAllTerritoryCards), first()).toPromise();
    if (this.areVisitBansActive)
    {
      this.areVisitBansActive = false;
      this.mapService.clearAllMarkers();
    }
    else
    {
      this.areVisitBansActive = true;
      const visitBans = [] as VisitBan[];
      territoryCards.map(tc => tc.visitBans).forEach(vbs => visitBans.push(...vbs));
      visitBans.forEach(vb => this.mapService.setMarker([vb.gpsPosition.lng, vb.gpsPosition.lat], `<p>${vb.name || (vb.street + ' ' + vb.streetSuffix)}</p>`));
    }
  }

  public async toggleTracing()
  {
    if (this.isTracingEnabled)
    {
      this.isTracingEnabled = false;
      this.mapService.removeUserMarker();
      await Geolocation.clearWatch({id: this.tracingWatchId});
    }
    else
    {
      this.isTracingEnabled = true;

      this.tracingWatchId = Geolocation.watchPosition({enableHighAccuracy: true}, (position, err) => {
        console.log(position);
        this.mapService.showUserMarker([position.coords.longitude, position.coords.latitude])
      });


      console.log(this.tracingWatchId);

    }
  }
}
