import {createAction, props} from '@ngrx/store';
import {Assignment} from "@territory-offline-workspace/api";

export const LoadAssignments = createAction('[Assignments] load assignments');
export const LoadAssignmentsSuccess = createAction('[Assignments] load assignments success', props<{assignments: Assignment[]}>());

export const BulkImportAssignments = createAction('[Assignments] bulk import assignments', props<{assignments: Assignment[]}>());
export const BulkImportAssignmentsSuccess = createAction('[Assignments] bulk import assignments success', props<{assignments: Assignment[]}>());

export const UpsertAssignment = createAction('[Assignments] upsert assignment', props<{assignment: Assignment}>());
export const UpsertAssignmentSuccess = createAction('[Assignments] upsert assignment success', props<{assignment: Assignment}>());

export const BulkUpsertAssignments = createAction('[Assignments] bulk upsert assignments', props<{assignments: Assignment[]}>());
export const BulkUpsertAssignmentsSuccess = createAction('[Assignments] bulk upsert assignments success', props<{assignments: Assignment[]}>());

export const DeleteAssignment = createAction('[Assignments] delete assignment', props<{assignment: Assignment}>());
export const DeleteAssignmentSuccess = createAction('[Assignments] delete assignment success', props<{assignment: Assignment}>());

export const DeleteAssignmentsByTerritory = createAction('[Assignments] delete assignments by territory', props<{territoryId: string}>());
export const DeleteAssignmentsByTerritorySuccess = createAction('[Assignments] delete assignments by territory success', props<{assignments: Assignment[]}>());
