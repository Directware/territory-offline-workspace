import {TimedEntity} from "./../../common/timed-entity.model";
import {Drawing} from "../../territory-offline/drawing/drawing.model";
import {Territory} from "../../territory-offline/territory/territory.model";
import {Publisher} from "../../territory-offline/publisher/publisher.model";
import {Assignment} from "../../territory-offline/assignment/assignment.model";
import {VisitBan} from "../../territory-offline/visit-ban/visit-ban.model";
import {ExportableTypesEnum} from "../../common/exportable-types.enum";

export interface TerritoryCard extends TimedEntity
{
  territory: Territory;
  drawing: Drawing;
  publisher: Publisher;
  assignment: Assignment;
  visitBans: VisitBan[];
  type: ExportableTypesEnum.DIGITAL_TERRITORY;
  estimationInMonths: number;
  deactivated?: boolean
}
