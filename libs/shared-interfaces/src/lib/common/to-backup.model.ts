import {Territory} from "../territory-offline/territory/territory.model";
import {Drawing} from "../territory-offline/drawing/drawing.model";
import {Publisher} from "../territory-offline/publisher/publisher.model";
import {Assignment} from "../territory-offline/assignment/assignment.model";
import {VisitBan} from "../territory-offline/visit-ban/visit-ban.model";
import {Tag} from "../territory-offline/tag/tag.model";
import {ExportableTypesEnum} from "./exportable-types.enum";

export interface ToBackup
{
  territories: Territory[];
  drawings: Drawing[];
  publisher: Publisher[];
  assignments: Assignment[];
  visitBans: VisitBan[];
  tags: Tag[];
  type: ExportableTypesEnum;
}
