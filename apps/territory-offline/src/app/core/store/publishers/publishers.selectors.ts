import {ApplicationState} from '../index.reducers';
import {publishersAdapter} from './publishers.reducer';
import {createSelector} from '@ngrx/store';

export const selectPublishersFeature = (state: ApplicationState) => state.publishers;

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = publishersAdapter.getSelectors(selectPublishersFeature);

export const selectPublishers = createSelector(
  selectAll,
  (publishers) => publishers.sort((p1, p2) => p1.name.toLowerCase() > p2.name.toLowerCase() ? 1 : -1)
);

export const selectPublisherEntities = createSelector(
  selectEntities,
  (publishers) => publishers
);

export const selectPublisherById = createSelector(
  selectPublishersFeature,
  (publishersState, id) => publishersState.entities[id]
);

export const selectPublishersCount = createSelector(
  selectTotal,
  (total) => "" + total
);

export const selectPublishersByFirstNameLetter = createSelector(
  selectPublishers,
  (publishers) =>
  {
    const letterMap = new Map();

    publishers.forEach((publisher) =>
    {
      if (!letterMap.get(publisher.name.charAt(0)))
      {
        letterMap.set(publisher.name.charAt(0), []);
      }

      letterMap.get(publisher.name.charAt(0)).push(publisher);
    });

    return Array.from(letterMap.values());
  }
);
