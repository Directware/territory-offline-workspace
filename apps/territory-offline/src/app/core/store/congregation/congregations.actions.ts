import {createAction, props} from '@ngrx/store';
import {Congregation} from "@territory-offline-workspace/shared-interfaces";

export const LoadCongregations = createAction('[Congregations] load congregations');
export const LoadCongregationsSuccess = createAction('[Congregations] load congregations success', props<{ congregations: Congregation[] }>());

export const BulkImportCongregations = createAction('[Congregations] bulk import congregations', props<{ congregations: Congregation[] }>());
export const BulkImportCongregationsSuccess = createAction('[Congregations] bulk import congregations success', props<{ congregations: Congregation[] }>());

export const UpsertCongregation = createAction('[Congregations] upsert congregation', props<{ congregation: Congregation }>());
export const UpsertCongregationSuccess = createAction('[Congregations] upsert congregation success', props<{ congregation: Congregation }>());

export const DeleteCongregation = createAction('[Congregations] delete congregation', props<{ congregation: Congregation }>());
export const DeleteCongregationSuccess = createAction('[Congregations] delete congregation success', props<{ congregationId: string }>());

export const UseCongregation = createAction('[Congregations] use congregation', props<{ congregationId: string }>());
