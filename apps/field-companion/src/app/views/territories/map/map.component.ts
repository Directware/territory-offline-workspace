import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { select, Store } from "@ngrx/store";
import { TerritoryCard } from "@territory-offline-workspace/shared-interfaces";
import { HideablePanelComponent } from "@territory-offline-workspace/ui-components";
import { Observable } from "rxjs";
import { MapService } from "../../../core/services/map/map.service";
import { ApplicationState } from "../../../core/store/index.reducers";
import { selectAllTerritoryCards } from "../../../core/store/territory-card/territory-card.selectors";

@Component({
  selector: "fc-map",
  templateUrl: "./map.component.html",
  styleUrls: ["./map.component.scss"],
})
export class MapComponent implements OnInit, AfterViewInit {
  @ViewChild("hideablePanelComponent", { static: false })
  public hideablePanelComponent: HideablePanelComponent;

  public territoryCards$: Observable<TerritoryCard[]>;
  public hideMainNavigation = true;

  public constructor(
    private store: Store<ApplicationState>,
    private router: Router,
    private mapService: MapService
  ) {}

  public ngOnInit(): void {
    this.territoryCards$ = this.store.pipe(select(selectAllTerritoryCards));
  }

  public ngAfterViewInit() {
    this.mapService.initWithAllTerritories();
  }

  public focusOn(territoryCard: TerritoryCard) {
    this.mapService.focusOn(territoryCard.drawing);
    this.hideablePanelComponent.close();
  }

  public close() {
    this.router.navigate(["/territories"]);
  }
}
