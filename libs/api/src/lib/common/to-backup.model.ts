import {Assignment, Drawing, Publisher, Tag, Territory, VisitBan} from "@territory-offline-workspace/api";

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
