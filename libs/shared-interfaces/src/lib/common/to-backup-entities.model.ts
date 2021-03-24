import {Territory} from "../territory-offline/territory/territory.model";
import {Drawing} from "../territory-offline/drawing/drawing.model";
import {Publisher} from "../territory-offline/publisher/publisher.model";
import {Assignment} from "../territory-offline/assignment/assignment.model";
import {VisitBan} from "../territory-offline/visit-ban/visit-ban.model";
import {Tag} from "../territory-offline/tag/tag.model";

export interface ToBackupEntities
{
  territories: { [id: string]: Territory };
  drawings: { [id: string]: Drawing };
  publisher: { [id: string]: Publisher };
  assignments: { [id: string]: Assignment };
  visitBans: { [id: string]: VisitBan };
  tags: { [id: string]: Tag };
}
