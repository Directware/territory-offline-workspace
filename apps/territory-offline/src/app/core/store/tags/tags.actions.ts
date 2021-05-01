import {createAction, props} from '@ngrx/store';
import {Tag} from "@territory-offline-workspace/shared-interfaces";

export const LoadTags = createAction("[Tags] load tags");
export const LoadTagsSuccess = createAction("[Tags] load tags success", props<{tags: Tag[]}>());

export const BulkImportTags = createAction("[Tags] bulk import tags", props<{tags: Tag[]}>());
export const BulkImportTagsSuccess = createAction("[Tags] bulk import tags success", props<{tags: Tag[]}>());

export const UpsertTag = createAction("[Tags] upsert tag", props<{tag: Tag}>());
export const UpsertTagSuccess = createAction("[Tags] upsert tag success", props<{tag: Tag}>());

export const DeleteTag = createAction("[Tags] delete tag", props<{tag: Tag}>());
export const DeleteTagSuccess = createAction("[Tags] delete tag success", props<{tag: Tag}>());
