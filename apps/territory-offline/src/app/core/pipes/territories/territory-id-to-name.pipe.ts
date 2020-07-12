import {Pipe, PipeTransform} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {ApplicationState} from '../../store/index.reducers';
import {map} from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import {selectTerritoryById} from '../../store/territories/territories.selectors';
import {Territory} from '../../store/territories/model/territory.model';

@Pipe({
  name: 'territoryIdToName'
})
export class TerritoryIdToNamePipe implements PipeTransform
{
  constructor(private store: Store<ApplicationState>)
  {
  }

  public transform(territoryId: string, ...args: any): Observable<string>
  {
    if (!territoryId || territoryId.length === 0)
    {
      return of('????');
    }

    return this.store.pipe(
      select(selectTerritoryById, territoryId),
      map((territory: Territory) => territory ? `${territory.key} ${territory.name}` : "Nicht vorhanden")
    );
  }
}
