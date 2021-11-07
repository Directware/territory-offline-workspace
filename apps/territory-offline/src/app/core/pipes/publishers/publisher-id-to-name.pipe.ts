import { Pipe, PipeTransform } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { ApplicationState } from '../../store/index.reducers';
import { selectPublisherById } from '../../store/publishers/publishers.selectors';
import { map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Publisher } from '@territory-offline-workspace/shared-interfaces';

@Pipe({
  name: 'publisherIdToName',
})
export class PublisherIdToNamePipe implements PipeTransform {
  constructor(private store: Store<ApplicationState>) {}

  public transform(publisherId: string, ...args: any): Observable<string> {
    if (!publisherId || publisherId.length === 0) {
      return of('????');
    }

    return this.store.pipe(
      select(selectPublisherById, publisherId),
      map((publisher: Publisher) => (publisher ? `${publisher.name} ${publisher.firstName}` : null))
    );
  }
}
