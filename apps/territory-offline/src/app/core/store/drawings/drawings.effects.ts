import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {concatMap, map, switchMap, tap, withLatestFrom} from 'rxjs/operators';
import {TimedEntity} from '../../model/db/timed-entity.interface';
import {from, of} from 'rxjs';
import {DatabaseService} from '../../services/db/database.service';
import {
  BulkImportDrawings,
  BulkImportDrawingsSuccess,
  DeleteDrawing,
  DeleteDrawingSuccess,
  LoadDrawings,
  LoadDrawingsSuccess,
  SaveDrawingPrintAlignmentConfiguration,
  UpsertDrawing,
  UpsertDrawingSuccess
} from './drawings.actions';
import {Drawing} from './model/drawing.model';
import {select, Store} from '@ngrx/store';
import {ApplicationState} from '../index.reducers';
import {selectDrawingById} from './drawings.selectors';
import {LastDoingsService} from "../../services/common/last-doings.service";
import {LastDoingActionsEnum} from "../last-doings/model/last-doing-actions.enum";

@Injectable({providedIn: 'root'})
export class DrawingsEffects
{
  private readonly drawingsCollectionName = btoa('drawings');

  private loadDrawings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LoadDrawings),
      map((action) => this.database.load(this.drawingsCollectionName)),
      switchMap((promise: Promise<TimedEntity[]>) => from(promise)),
      map((drawings: Drawing[]) => LoadDrawingsSuccess({drawings: drawings}))
    )
  );

  private upsertDrawing$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UpsertDrawing),
      map((action) => this.database.upsert(this.drawingsCollectionName, action.drawing)),
      switchMap((promise: Promise<TimedEntity>) => from(promise)),
      map((drawing: Drawing) => UpsertDrawingSuccess({drawing: drawing}))
    )
  );

  private bulkImportDrawings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BulkImportDrawings),
      map((action) => this.database.bulkUpsert(this.drawingsCollectionName, action.drawings)),
      switchMap((promise: Promise<TimedEntity[]>) => from(promise)),
      map((drawings: Drawing[]) => BulkImportDrawingsSuccess({drawings: drawings}))
    )
  );

  private savePrintConfiguration$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SaveDrawingPrintAlignmentConfiguration),
      concatMap(action => of(action).pipe(
        withLatestFrom(this.store.pipe(select(selectDrawingById, action.drawingId)))
      )),
      map(([action, drawing]) => UpsertDrawing({drawing: {...drawing, printConfiguration: action.config}}))
    )
  );

  private deleteDrawing$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DeleteDrawing),
      map((action) => this.database.delete(this.drawingsCollectionName, action.drawing)),
      switchMap((promise: Promise<TimedEntity>) => from(promise)),
      map((drawing: Drawing) => DeleteDrawingSuccess({drawing: drawing}))
    )
  );

  constructor(private actions$: Actions,
              private store: Store<ApplicationState>,
              private database: DatabaseService,
              private lastDoingsService: LastDoingsService) {}
}
