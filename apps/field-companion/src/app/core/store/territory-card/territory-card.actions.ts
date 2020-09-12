import {createAction, props} from '@ngrx/store';
import {TerritoryCard} from "@territory-offline-workspace/api";

export const LoadTerritoryCards = createAction('[TerritoryCard] load territory cards');
export const LoadTerritoryCardsSuccess = createAction('[TerritoryCard] load territory cards success', props<{ territoryCards: TerritoryCard[] }>());

export const BulkImportTerritoryCards = createAction('[TerritoryCard] bulk import territory cards', props<{ territoryCards: TerritoryCard[] }>());
export const BulkImportTerritoryCardsSuccess = createAction('[TerritoryCard] bulk import territory cards success', props<{ territoryCards: TerritoryCard[] }>());

export const UpsertTerritoryCard = createAction('[TerritoryCard] upsert territory card', props<{ territoryCard: TerritoryCard }>());
export const UpsertTerritoryCardSuccess = createAction('[TerritoryCard] upsert territory card success', props<{ territoryCard: TerritoryCard }>());

export const DeleteTerritoryCard = createAction('[TerritoryCard] delete territory card', props<{ territoryCard: TerritoryCard }>());
export const DeleteTerritoryCardSuccess = createAction('[TerritoryCard] delete territory card success', props<{ territoryCard: TerritoryCard }>());
