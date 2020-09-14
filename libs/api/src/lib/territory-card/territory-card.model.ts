import {TimedEntity} from "../common/timed-entity.model";
import {Assignment, Drawing, Publisher, Territory, VisitBan} from "../..";
import {ExportableTypesEnum} from "../common/exportable-types.enum";

export interface TerritoryCard extends TimedEntity
{
  territory: Territory;
  drawing: Drawing;
  publisher: Publisher;
  assignment: Assignment;
  visitBans: VisitBan[];
  type: ExportableTypesEnum.DIGITAL_TERRITORY;
  estimationInMonths: number;
}
