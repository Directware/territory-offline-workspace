import { TimedEntity } from './../../common/timed-entity.model';

export interface Territory extends TimedEntity {
  name: string;
  key: string;
  populationCount: number;
  tags: string[];
  territoryDrawingId: string;
  boundaryNames: string[];
  deactivated?: boolean;
  isCreation?: boolean;
  comment?: string;
}
