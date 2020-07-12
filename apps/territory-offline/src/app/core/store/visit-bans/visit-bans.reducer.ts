import {Action, createReducer, on} from '@ngrx/store';
import {createEntityAdapter, EntityState} from '@ngrx/entity';
import {VisitBan} from './model/visit-ban.model';
import {BulkImportVisitBansSuccess, DeleteVisitBanSuccess, LoadVisitBansSuccess, UpsertVisitBanSuccess} from './visit-bans.actions';

export const visitBansAdapter = createEntityAdapter<VisitBan>();

export interface VisitBansState extends EntityState<VisitBan>
{
}

const initialState: VisitBansState = visitBansAdapter.getInitialState();

const visitBansReducer = createReducer(
  initialState,
  on(LoadVisitBansSuccess, (state, action) => visitBansAdapter.addAll(action.visitBans, state)),
  on(UpsertVisitBanSuccess, (state, action) => visitBansAdapter.upsertOne(action.visitBan, state)),
  on(BulkImportVisitBansSuccess, (state, action) => visitBansAdapter.upsertMany(action.visitBans, state)),
  on(DeleteVisitBanSuccess, (state, action) => visitBansAdapter.removeOne(action.visitBan.id, state))
);

export function visitBansReducerFunction(state: VisitBansState | undefined, action: Action)
{
  return visitBansReducer(state, action);
}
