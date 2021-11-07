import { createAction, props } from '@ngrx/store';
import { Publisher } from '@territory-offline-workspace/shared-interfaces';

export const LoadPublishers = createAction('[Publisher] load publishers');
export const LoadPublishersSuccess = createAction(
  '[Publisher] load publishers success',
  props<{ publishers: Publisher[] }>()
);

export const BulkImportPublishers = createAction(
  '[Publisher] bulk import publishers',
  props<{ publishers: Publisher[] }>()
);
export const BulkImportPublishersSuccess = createAction(
  '[Publisher] bulk import publishers success',
  props<{ publishers: Publisher[] }>()
);

export const UpsertPublisher = createAction(
  '[Publisher] upsert publisher',
  props<{ publisher: Publisher }>()
);
export const UpsertPublisherSuccess = createAction(
  '[Publisher] upsert publisher success',
  props<{ publisher: Publisher }>()
);

export const BulkUpsertPublisher = createAction(
  '[Publisher] bulk upsert publisher',
  props<{ publisher: Publisher[] }>()
);
export const BulkUpsertPublisherSuccess = createAction(
  '[Publisher] bulk upsert publisher success',
  props<{ publisher: Publisher[] }>()
);

export const DeletePublisher = createAction(
  '[Publisher] delete publisher',
  props<{ publisher: Publisher }>()
);
export const DeletePublisherSuccess = createAction(
  '[Publisher] delete publisher success',
  props<{ publisher: Publisher }>()
);
