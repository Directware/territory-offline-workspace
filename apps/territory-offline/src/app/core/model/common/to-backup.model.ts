import {Tag} from "../../store/tags/model/tag.model";
import {VisitBan} from "../../store/visit-bans/model/visit-ban.model";
import {Assignment} from "../../store/assignments/model/assignment.model";
import {Publisher} from "../../store/publishers/model/publisher.model";
import {Drawing} from "../../store/drawings/model/drawing.model";
import {Territory} from "../../store/territories/model/territory.model";
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
