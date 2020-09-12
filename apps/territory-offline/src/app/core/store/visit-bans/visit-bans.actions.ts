import {createAction, props} from '@ngrx/store';
import {VisitBan} from "@territory-offline-workspace/api";

export const LoadVisitBans = createAction('[Visit bans] load visit bans');
export const LoadVisitBansSuccess = createAction('[Visit bans] load visit bans success', props<{visitBans: VisitBan[]}>());

export const BulkImportVisitBans = createAction('[Visit bans] bulk import visit bans', props<{visitBans: VisitBan[]}>());
export const BulkImportVisitBansSuccess = createAction('[Visit bans] bulk import visit bans success', props<{visitBans: VisitBan[]}>());

export const UpsertVisitBan = createAction('[Visit bans] upsert visit ban', props<{visitBan: VisitBan}>());
export const UpsertVisitBanSuccess = createAction('[Visit bans] upsert visit ban success', props<{visitBan: VisitBan}>());

export const DeleteVisitBan = createAction('[Visit bans] delete visit ban', props<{visitBan: VisitBan}>());
export const DeleteVisitBanSuccess = createAction('[Visit bans] delete visit ban success', props<{visitBan: VisitBan}>());
