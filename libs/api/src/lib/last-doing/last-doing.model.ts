import {LastDoingActionsEnum} from "./last-doing-actions.enum";
import {TimedEntity} from "@territory-offline-workspace/api";

export interface LastDoing extends TimedEntity
{
  action: LastDoingActionsEnum;
  label: string;
}
