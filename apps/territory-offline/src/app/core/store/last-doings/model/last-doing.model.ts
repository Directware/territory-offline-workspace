import {TimedEntity} from "../../../model/db/timed-entity.interface";
import {LastDoingActionsEnum} from "./last-doing-actions.enum";

export interface LastDoing extends TimedEntity
{
  action: LastDoingActionsEnum;
  label: string;
}
