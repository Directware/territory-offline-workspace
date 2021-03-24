import {v4 as uuid} from 'uuid';
import {Assignment} from "./assignment.model";

export function createAssignment(assignmentProperties: Partial<Assignment> = {}): Assignment
{
  return {
    id: uuid(),
    creationTime: new Date(),
    publisherId: "",
    territoryId: "",
    startTime: new Date(),
    endTime: null,
    statusColor: "",
    removedPublisherLabel: "",
    ...assignmentProperties
  };
}
