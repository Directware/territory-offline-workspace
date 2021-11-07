import { ActionReducerMap } from '@ngrx/store';
import { settingsReducerFunction, SettingsState } from './settings/settings.reducer';
import { assignmentsReducerFunction, AssignmentsState } from './assignments/assignments.reducer';
import { drawingsReducerFunction, DrawingsState } from './drawings/drawings.reducer';
import { publishersReducerFunction, PublishersState } from './publishers/publishers.reducer';
import { tagsReducerFunction, TagsState } from './tags/tags.reducer';
import { territoriesReducerFunction, TerritoriesState } from './territories/territories.reducer';
import { visitBansReducerFunction, VisitBansState } from './visit-bans/visit-bans.reducer';
import {
  congregationsReducerFunction,
  CongregationsState,
} from './congregation/congregations.reducer';
import { lastDoingsReducerFunction, LastDoingsState } from './last-doings/last-doings.reducer';

export interface ApplicationState {
  assignments: AssignmentsState;
  congregations: CongregationsState;
  drawings: DrawingsState;
  publishers: PublishersState;
  settings: SettingsState;
  tags: TagsState;
  territories: TerritoriesState;
  visitBans: VisitBansState;
  lastDoings: LastDoingsState;
}

export const reducers: ActionReducerMap<ApplicationState> = {
  assignments: assignmentsReducerFunction,
  congregations: congregationsReducerFunction,
  drawings: drawingsReducerFunction,
  publishers: publishersReducerFunction,
  settings: settingsReducerFunction,
  tags: tagsReducerFunction,
  territories: territoriesReducerFunction,
  visitBans: visitBansReducerFunction,
  lastDoings: lastDoingsReducerFunction,
};
