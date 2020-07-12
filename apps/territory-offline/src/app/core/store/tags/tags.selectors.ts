import {ApplicationState} from '../index.reducers';
import {createSelector} from '@ngrx/store';
import {tagsAdapter} from './tags.reducer';

export const selectTagsFeature = (state: ApplicationState) => state.tags;

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = tagsAdapter.getSelectors(selectTagsFeature);

export const selectTagEntities = createSelector(
  selectEntities,
  (entities) => entities
);

export const selectTags = createSelector(
  selectAll,
  (tags) => tags.sort((t1, t2) => t1.name.toLowerCase() > t2.name.toLowerCase() ? 1 : -1)
);

export const selectTagsByIds = createSelector(
  selectEntities,
  (entities, ids: string[]) =>
  {
    const tmp = [];
    ids.forEach(id => tmp.push(entities[id]));
    return tmp;
  }
);
