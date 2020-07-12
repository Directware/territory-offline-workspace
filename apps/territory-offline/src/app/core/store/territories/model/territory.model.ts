import {TimedEntity} from '../../../model/db/timed-entity.interface';

export interface Territory extends TimedEntity
{
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
