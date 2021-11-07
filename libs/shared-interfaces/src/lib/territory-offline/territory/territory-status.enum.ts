export enum TerritoryStatus {
  DONE = '#15C880',
  IN_PROGRESS = '#2079C2',
  READY_FOR_ASSIGN = '#FF9F1B',
  DUE = '#FF5F1B',
  NEVER_ASSIGNED = '#721ed0',
}

export function allTerritoryStatus() {
  return [
    TerritoryStatus.DONE,
    TerritoryStatus.IN_PROGRESS,
    TerritoryStatus.DUE,
    TerritoryStatus.READY_FOR_ASSIGN,
    TerritoryStatus.NEVER_ASSIGNED,
  ];
}
