import {Action, createReducer, on} from '@ngrx/store';
import {createEntityAdapter, EntityState} from '@ngrx/entity';
import {UpsertTagSuccess, DeleteTagSuccess, LoadTagsSuccess, BulkImportTagsSuccess} from './tags.actions';
import {Tag} from "@territory-offline-workspace/shared-interfaces";

export const tagsAdapter = createEntityAdapter<Tag>();

export interface TagsState extends EntityState<Tag>
{
}

const initialState: TagsState = tagsAdapter.getInitialState();

const tagsReducer = createReducer(
  initialState,
  on(LoadTagsSuccess, (state, action) => tagsAdapter.addAll(action.tags, state)),
  on(UpsertTagSuccess, (state, action) => tagsAdapter.upsertOne(action.tag, state)),
  on(BulkImportTagsSuccess, (state, action) => tagsAdapter.upsertMany(action.tags, state)),
  on(DeleteTagSuccess, (state, action) => tagsAdapter.removeOne(action.tag.id, state))
);

export function tagsReducerFunction(state: TagsState | undefined, action: Action)
{
  return tagsReducer(state, action);
}
