import {Pipe, PipeTransform} from '@angular/core';
import {Territory} from "../../store/territories/model/territory.model";
import {select, Store} from "@ngrx/store";
import {ApplicationState} from "../../store/index.reducers";
import {selectTags} from "../../store/tags/tags.selectors";
import {map, tap} from "rxjs/operators";
import {Tag} from "../../store/tags/model/tag.model";
import {Observable, of} from "rxjs";
import {TerritoryMapsService} from "../../services/territory/territory-maps.service";
import {Router} from "@angular/router";

@Pipe({
  name: 'searchTerritory'
})
export class SearchTerritoryPipe implements PipeTransform
{
  constructor(private store: Store<ApplicationState>,
              private router: Router,
              private mapsService: TerritoryMapsService)
  {
  }

  public transform(territories: Territory[], search: { value: string }, filteredDrawings: { [id: string]: boolean }): Observable<Territory[]>
  {
    if (!search || !search.value || search.value.length === 0)
    {
      this.mapsService.focusOnDrawingIds(null);
      return of(territories.filter(t => this.considerFilteredDrawings(t, filteredDrawings)));
    }

    return this.store
      .pipe(
        select(selectTags),
        map((tags: Tag[]) => territories
          .filter(t => this.considerFilteredDrawings(t, filteredDrawings))
          .filter(t => this.filterBySearchValue(t, tags, search.value.toLowerCase()))
        ),
        tap((territories: Territory[]) => this.mapsService.focusOnDrawingIds(territories.map(t => t.territoryDrawingId))),
        tap((territories: Territory[]) => {
          if(territories.length === 1 && !!territories[0] && !!territories[0].id)
          {
            this.router.navigate([{outlets: {'second-thread': ['territory', territories[0].id]}}]);
          }
        })
      );
  }

  private considerFilteredDrawings(territory: Territory, filteredDrawings: { [id: string]: boolean })
  {
    return !filteredDrawings || !filteredDrawings[territory.territoryDrawingId];
  }

  private filterBySearchValue(t: Territory, tags: Tag[], searchValue: string)
  {
    return t.name.toLowerCase().includes(searchValue.toLowerCase())
      || t.key.toLowerCase().includes(searchValue.toLowerCase())
      || this.hasTagWithSearchValue(t, tags, searchValue);
  }

  private hasTagWithSearchValue(t: Territory, tags: Tag[], searchValue: string)
  {
    const foundTags = tags.filter(t => t.name.toLowerCase().includes(searchValue));
    return t.tags.filter(tId => foundTags.map(t => t.id).includes(tId)).length > 0;
  }
}
