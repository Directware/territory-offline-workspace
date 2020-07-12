import {Tag} from "../../store/tags/model/tag.model";
import {VisitBan} from "../../store/visit-bans/model/visit-ban.model";
import {Assignment} from "../../store/assignments/model/assignment.model";
import {Publisher} from "../../store/publishers/model/publisher.model";
import {Drawing} from "../../store/drawings/model/drawing.model";
import {Territory} from "../../store/territories/model/territory.model";

export interface ToBackupEntities
{
  territories: { [id: string]: Territory };
  drawings: { [id: string]: Drawing };
  publisher: { [id: string]: Publisher };
  assignments: { [id: string]: Assignment };
  visitBans: { [id: string]: VisitBan };
  tags: { [id: string]: Tag };
}
