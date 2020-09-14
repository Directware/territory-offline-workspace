import {Component, ComponentRef, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MapService} from "../../../core/services/map/map.service";
import {select, Store} from "@ngrx/store";
import {ApplicationState} from "../../../core/store/index.reducers";
import {Observable} from "rxjs";
import {TerritoryCard} from "@territory-offline-workspace/api";
import {selectAllTerritoryCards} from "../../../core/store/territory-card/territory-card.selectors";
import {Router} from "@angular/router";
import {HideablePanelComponent} from "@territory-offline-workspace/ui-components";

@Component({
  selector: 'fc-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit
{
  @ViewChild("hideablePanelComponent", {static: false})
  public hideablePanelComponent: HideablePanelComponent;

  public territoryCards$: Observable<TerritoryCard[]>;
  public hideMainNavigation = true;

  public constructor(private store: Store<ApplicationState>,
                     private router: Router,
                     private mapService: MapService)
  {
  }

  public ngOnInit(): void
  {
    this.mapService.init();
    this.territoryCards$ = this.store.pipe(select(selectAllTerritoryCards));
  }

  public focusOn(territoryCard: TerritoryCard)
  {
    this.mapService.focusOn(territoryCard.drawing);
    this.hideablePanelComponent.close();
  }

  public close()
  {
    this.router.navigate(["/territories"]);
  }
}