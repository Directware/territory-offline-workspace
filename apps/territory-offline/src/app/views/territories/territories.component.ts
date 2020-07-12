import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {Territory} from '../../core/store/territories/model/territory.model';
import {select, Store} from '@ngrx/store';
import {ApplicationState} from '../../core/store/index.reducers';
import {selectAllTerritories} from '../../core/store/territories/territories.selectors';
import {map} from "rxjs/operators";
import {TerritoryMapsService} from "../../core/services/territory/territory-maps.service";
import {TerritoryStatus} from "../../core/model/territory/territory-status.enum";
import {selectCurrentCongregation} from "../../core/store/congregation/congregations.selectors";

@Component({
  selector: 'app-territories',
  templateUrl: './territories.component.html',
  styleUrls: ['./territories.component.scss']
})
export class TerritoriesComponent implements OnInit, OnDestroy
{
  public territories$: Observable<Territory[]>;
  public currentTerritoryId: string;
  public congregationName$: Observable<string>;

  public search: {value: string};
  public currentlyFilteredDrawings: { [id: string]: boolean };

  public mapFilter = {
    inProgress: {show: true, status: TerritoryStatus.IN_PROGRESS},
    done: {show: true, status: TerritoryStatus.DONE},
    assignable: {show: true, status: TerritoryStatus.READY_FOR_ASSIGN},
    overdueAssignation: {show: true, status: TerritoryStatus.DUE},
  };

  constructor(private router: Router,
              private mapsService: TerritoryMapsService,
              private store: Store<ApplicationState>)
  {
  }

  public ngOnInit(): void
  {
    this.congregationName$ = this.store.pipe(select(selectCurrentCongregation), map(congregation => congregation.name));
    this.territories$ = this.store.pipe(select(selectAllTerritories), map(terr => !terr || terr.length === 0 ? null : terr));
    this.router.navigate([{outlets: {'second-thread': null}}]);
  }

  public ngOnDestroy()
  {
    this.mapsService.resetFilterDrawing();
  }

  public createTerritory()
  {
    this.router.navigate([{outlets: {'second-thread': ['territory']}}]);
  }

  public editTerritory(territory: Territory)
  {
    this.currentTerritoryId = territory.id;
    this.router.navigate([{outlets: {'second-thread': ['territory', territory.id]}}]);
  }

  public toggleMapFilter(propName: string)
  {
    const tmp = {};
    this.mapFilter[propName].show = !this.mapFilter[propName].show;
    const result = this.mapsService.setFilterDrawingsByStatus(this.mapFilter[propName].status, this.mapFilter[propName].show);

    result.drawings.forEach((drawing) =>
      drawing.featureCollection.features.forEach(feature =>
      {
        if (!result.visibleTerritoryStatus.includes(feature.properties.status))
        {
          tmp[drawing.id] = true;
        }
      })
    );

    this.currentlyFilteredDrawings = tmp;
  }

  public considerClearingSearchValue(event)
  {
    if(event === "")
    {
      this.search = null;
    }
  }
}
