import {Pipe, PipeTransform} from '@angular/core';
import {select, Store} from "@ngrx/store";
import {ApplicationState} from "../../store/index.reducers";
import {selectTags} from "../../store/tags/tags.selectors";
import {map} from "rxjs/operators";
import {Observable, of} from "rxjs";
import {Router} from "@angular/router";
import {Tag, VisitBan} from "@territory-offline-workspace/shared-interfaces";

@Pipe({
  name: 'searchVisitBan'
})
export class SearchVisitBanPipe implements PipeTransform
{
  constructor(private store: Store<ApplicationState>,
              private router: Router)
  {
  }

  public transform(visitBans: VisitBan[], search: { value: string }): Observable<VisitBan[]>
  {
    if (!search || !search.value || search.value.length === 0)
    {
      return of(visitBans);
    }

    return this.store
      .pipe(
        select(selectTags),
        map((tags: Tag[]) => visitBans
          .filter(vb => this.filterVisitBan(vb, tags, search.value.toLowerCase()))
        )
      );
  }

  private filterVisitBan(vb: VisitBan, tags: Tag[], searchValue: string)
  {
    return vb.name.toLowerCase().includes(searchValue.toLowerCase())
      || vb.street.toLowerCase().includes(searchValue.toLowerCase())
      || this.hasTagWithSearchValue(vb, tags, searchValue);
  }

  private hasTagWithSearchValue(vb: VisitBan, tags: Tag[], searchValue: string)
  {
    const foundTags = tags.filter(t => t.name.toLowerCase().includes(searchValue));
    return vb.tags.filter(tId => foundTags.map(t => t.id).includes(tId)).length > 0;
  }
}
