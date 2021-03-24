import {LastDoingActionsEnum} from "./last-doing-actions.enum";
import {TimedEntity} from "./../../common/timed-entity.model";

export interface LastDoing extends TimedEntity
{
  action: LastDoingActionsEnum;
  label: string;
}
