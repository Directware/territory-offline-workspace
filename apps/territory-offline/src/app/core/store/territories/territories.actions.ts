import {createAction, props} from '@ngrx/store';
import {Territory} from "@territory-offline-workspace/shared-interfaces";

export const LoadTerritories = createAction('[Territories] load territories');
export const LoadTerritoriesSuccess = createAction('[Territories] load territories success', props<{territories: Territory[]}>());

export const BulkImportTerritories = createAction('[Territories] bulk import territories', props<{territories: Territory[]}>());
export const BulkImportTerritoriesSuccess = createAction('[Territories] bulk import territories success', props<{territories: Territory[]}>());

export const UpsertTerritory = createAction('[Territories] upsert territory', props<{territory: Territory}>());
export const UpsertTerritorySuccess = createAction('[Territories] upsert territory success', props<{territory: Territory}>());

export const BulkUpsertTerritory = createAction('[Territories] bulk upsert territory', props<{territories: Territory[]}>());
export const BulkUpsertTerritorySuccess = createAction('[Territories] bulk upsert territory success', props<{territories: Territory[]}>());

export const DeleteTerritory = createAction('[Territories] delete territory', props<{territory: Territory}>());
export const DeleteTerritorySuccess = createAction('[Territories] delete territory success', props<{territory: Territory}>());
