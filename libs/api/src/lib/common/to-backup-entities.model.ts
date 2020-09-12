import {Assignment, Drawing, Publisher, Tag, Territory, VisitBan} from "@territory-offline-workspace/api";

export interface ToBackupEntities
{
  territories: { [id: string]: Territory };
  drawings: { [id: string]: Drawing };
  publisher: { [id: string]: Publisher };
  assignments: { [id: string]: Assignment };
  visitBans: { [id: string]: VisitBan };
  tags: { [id: string]: Tag };
}
