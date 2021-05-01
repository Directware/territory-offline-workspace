import {createAction, props} from '@ngrx/store';
import {Drawing, TerritoryDrawingPrintConfiguration} from "@territory-offline-workspace/shared-interfaces";

export const LoadDrawings = createAction('[Drawings] load drawings');
export const LoadDrawingsSuccess = createAction('[Drawings] load drawings success', props<{ drawings: Drawing[] }>());

export const BulkImportDrawings = createAction('[Drawings] bulk import drawings', props<{ drawings: Drawing[] }>());
export const BulkImportDrawingsSuccess = createAction('[Drawings] bulk import drawings success', props<{ drawings: Drawing[] }>());

export const UpsertDrawing = createAction('[Drawings] upsert drawing', props<{ drawing: Drawing }>());
export const UpsertDrawingSuccess = createAction('[Drawings] upsert drawing success', props<{ drawing: Drawing }>());

export const DeleteDrawing = createAction('[Drawings] delete drawing', props<{ drawing: Drawing }>());
export const DeleteDrawingSuccess = createAction('[Drawings] delete drawing success', props<{ drawing: Drawing }>());

export const SaveDrawingPrintAlignmentConfiguration = createAction('[Drawings] save drawing print alignment configuration', props<{ drawingId: string, config: TerritoryDrawingPrintConfiguration }>());
