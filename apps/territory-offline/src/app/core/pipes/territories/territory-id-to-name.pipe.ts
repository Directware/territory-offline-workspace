import { take } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import {Pipe, PipeTransform} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {ApplicationState} from '../../store/index.reducers';
import {map} from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import {selectTerritoryById} from '../../store/territories/territories.selectors';
import {Territory} from "@territory-offline-workspace/api";

@Pipe({
  name: 'territoryIdToName'
})
export class TerritoryIdToNamePipe implements PipeTransform
{
  private translationNone: string;
  constructor(private store: Store<ApplicationState>, private translate: TranslateService)
  {
    this.translate.get('territory.pipeNone').pipe(take(1)).subscribe((translation: string) => this.translationNone = translation);
  }

  public transform(territoryId: string, ...args: any): Observable<string>
  {
    if (!territoryId || territoryId.length === 0)
    {
      return of('????');
    }

    return this.store.pipe(
      select(selectTerritoryById, territoryId),
      map((territory: Territory) => territory ? `${territory.key} ${territory.name}` : this.translationNone)
    );
  }
}
