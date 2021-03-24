export interface GroupOverseerReport
{
  tags: {
    label: string;
    publishers: {
      label: string;
      territories: {
        label: string;
        assignedSince: Date;
      }[]
    }[]
  }[]
}
