import { Pipe, PipeTransform } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { ApplicationState } from '../../store/index.reducers';
import { Observable, of } from 'rxjs';
import { selectTags } from '../../store/tags/tags.selectors';
import { map } from 'rxjs/operators';
import { Publisher, Tag } from '@territory-offline-workspace/shared-interfaces';

@Pipe({
  name: 'searchPublisher',
})
export class SearchPublisherPipe implements PipeTransform {
  constructor(private store: Store<ApplicationState>) {}

  public transform(
    publishersByLetters: Publisher[][],
    search: { value: string }
  ): Observable<Publisher[][]> {
    if (!search || !search.value || search.value.length === 0) {
      return of(publishersByLetters);
    }

    return this.store.pipe(
      select(selectTags),
      map((tags: Tag[]) =>
        publishersByLetters
          .filter(
            (pbl) =>
              pbl.filter((p) => this.filterPublisher(p, tags, search.value.toLowerCase())).length >
              0
          )
          .map((pbl) =>
            pbl.filter((p) => this.filterPublisher(p, tags, search.value.toLowerCase()))
          )
      )
    );
  }

  private filterPublisher(p: Publisher, tags: Tag[], searchValue: string) {
    return (
      p.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      p.firstName.toLowerCase().includes(searchValue.toLowerCase()) ||
      this.hasTagWithSearchValue(p, tags, searchValue)
    );
  }

  private hasTagWithSearchValue(p: Publisher, tags: Tag[], searchValue: string) {
    const foundTags = tags.filter((t) => t.name.toLowerCase().includes(searchValue));
    return p.tags.filter((tId) => foundTags.map((t) => t.id).includes(tId)).length > 0;
  }
}
