import { SettingsEffects } from './settings/settings.effects';
import { AssignmentsEffects } from './assignments/assignments.effects';
import { DrawingsEffects } from './drawings/drawings.effects';
import { PublishersEffects } from './publishers/publishers.effects';
import { TagsEffects } from './tags/tags.effects';
import { TerritoriesEffects } from './territories/territories.effects';
import { VisitBansEffects } from './visit-bans/visit-bans.effects';
import { CongregationsEffects } from './congregation/congregations.effects';
import { LastDoingsEffects } from './last-doings/last-doings.effects';

export const effects = [
  SettingsEffects,
  AssignmentsEffects,
  DrawingsEffects,
  PublishersEffects,
  TagsEffects,
  TerritoriesEffects,
  VisitBansEffects,
  CongregationsEffects,
  LastDoingsEffects,
];
