import {createAction, props} from '@ngrx/store';
import {TerritoryCard} from "@territory-offline-workspace/api";

export const LoadTerritoryCards = createAction('[TerritoryCard] load daily reports');
export const LoadTerritoryCardsSuccess = createAction('[TerritoryCard] load daily reports success', props<{ territoryCards: TerritoryCard[] }>());

export const BulkImportTerritoryCards = createAction('[TerritoryCard] bulk import daily reports', props<{ territoryCards: TerritoryCard[] }>());
export const BulkImportTerritoryCardsSuccess = createAction('[TerritoryCard] bulk import daily reports success', props<{ territoryCards: TerritoryCard[] }>());

export const UpsertTerritoryCard = createAction('[TerritoryCard] upsert daily report', props<{ territoryCard: TerritoryCard }>());
export const UpsertTerritoryCardSuccess = createAction('[TerritoryCard] upsert daily report success', props<{ territoryCard: TerritoryCard }>());

export const DeleteTerritoryCard = createAction('[TerritoryCard] delete daily report', props<{ territoryCard: TerritoryCard }>());
export const DeleteTerritoryCardSuccess = createAction('[TerritoryCard] delete daily report success', props<{ territoryCard: TerritoryCard }>());
