import {createAction, props} from '@ngrx/store';
import {LastDoing} from "@territory-offline-workspace/api";

export const LoadLastDoings = createAction('[LastDoing] load lastDoings');
export const LoadLastDoingsSuccess = createAction('[LastDoing] load lastDoings success', props<{ lastDoings: LastDoing[] }>());

export const UpsertLastDoing = createAction('[LastDoing] upsert lastDoing', props<{ lastDoing: LastDoing }>());
export const UpsertLastDoingSuccess = createAction('[LastDoing] upsert lastDoing success', props<{ lastDoing: LastDoing }>());

export const DeleteLastDoing = createAction('[LastDoing] delete lastDoing', props<{ lastDoing: LastDoing }>());
export const DeleteLastDoingSuccess = createAction('[LastDoing] delete lastDoing success', props<{ lastDoing: LastDoing }>());
