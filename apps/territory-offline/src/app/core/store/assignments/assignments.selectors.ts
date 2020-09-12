import {ApplicationState} from '../index.reducers';
import {createSelector} from '@ngrx/store';
import {assignmentsAdapter} from './assignments.reducer';
import {selectAllTerritories} from '../territories/territories.selectors';
import {selectSettings} from '../settings/settings.selectors';
import {Assignment, Territory} from "@territory-offline-workspace/api";
import {createDurationPhrase, pastDateByMonths} from '../../utils/usefull.functions';
import {selectPublisherEntities, selectPublishersFeature} from '../publishers/publishers.selectors';
import {SettingsState} from '../settings/settings.reducer';
import {selectTagsFeature} from "../tags/tags.selectors";

export const selectAssignmentsFeature = (state: ApplicationState) => state.assignments;

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = assignmentsAdapter.getSelectors(selectAssignmentsFeature);

export const selectAllAssignmentEntities = createSelector(
  selectEntities,
  (assignments) => assignments
);

export const selectAllAssignments = createSelector(
  selectAll,
  (assignments) => assignments
);

export const selectAssignmentById = createSelector(
  selectAssignmentsFeature,
  (assignmentState, id) => assignmentState.entities[id]
);

export const selectAssignmentsByPublisherId = createSelector(
  selectAll,
  (assignments, id) => assignments.filter(a => a.publisherId === id)
);

export const selectAssignmentsByTerritoryId = createSelector(
  selectAll,
  (assignments, id) => assignments.filter(a => a.territoryId === id).sort((a1, a2) => a1.startTime < a2.startTime ? 1 : -1)
);

export const selectLastAssignmentOfEachTerritory = createSelector(
  selectAll,
  selectAllTerritories,
  (assignments: Assignment[], territories) =>
  {
    const lastAssignments = [];
    territories.forEach((t) =>
    {
      const lastAssignment = assignments.filter(a => a.territoryId === t.id).sort((a1, a2) => a1.startTime > a2.startTime ? -1 : 1)[0];
      lastAssignments.push(lastAssignment || {});
    });

    return lastAssignments;
  }
);

export const selectDashboardData = createSelector(
  selectLastAssignmentOfEachTerritory,
  selectAllTerritories,
  selectSettings,
  (lastAssignments, territories, settings) =>
  {
    const currentlyDone = lastAssignments.filter(a => a && !!a.startTime && !!a.endTime && a.endTime > pastDateByMonths(12));
    const currentlyInProgress = lastAssignments.filter(a => a && !!a.startTime && !a.endTime);

    const totalPopulationCount = territories && territories.length > 0 ? territories.map(t => t.populationCount).reduce((total, current) => total + current, 0) : 0;

    const currentlyDonePopulationCount = territories && territories.length > 0 ? territories.filter(t => currentlyDone.map(a => a.territoryId).includes(t.id))
      .map(t => t.populationCount).reduce((total, current) => total + current, 0) : 0;

    return {
      currentlyDoneCount: currentlyDone.length,
      currentlyInProgressCount: currentlyInProgress.length,
      assignmentsTotal: territories.length,

      currentlyDonePopulationCount: currentlyDonePopulationCount,
      totalPopulationCount: totalPopulationCount,

      currentlyAssignedTerritoriesCount: currentlyInProgress.length,
      currentlyNotAssignedTerritoriesCount: currentlyDone.length,
      territoriesTotal: territories.length
    };
  }
);

export const selectOverdueAssignments = createSelector(
  selectLastAssignmentOfEachTerritory,
  selectSettings,
  selectPublisherEntities,
  (lastAssignments, settings, publisherEntities) =>
  {
    const overdueDtos = {};
    const currentlyInProgress = lastAssignments.filter(a => !a.endTime);

    currentlyInProgress.filter(a => a.startTime < pastDateByMonths(settings.processingPeriodInMonths))
      .forEach((a: Assignment) =>
      {
        if (!overdueDtos[a.publisherId])
        {
          overdueDtos[a.publisherId] = {
            publisher: publisherEntities[a.publisherId],
            assignments: []
          };
        }
        overdueDtos[a.publisherId].assignments.push(a);
      });

    return Object.values(overdueDtos);
  }
);

export const selectOverdueAssignmentsByPreacher = createSelector(
  selectOverdueAssignments,
  (dtos, publisherId) =>
  {
    const filteredDto = dtos.filter(dto => dto.publisher.id === publisherId)[0];

    if (filteredDto)
    {
      return filteredDto.assignments;
    }

    return null;
  }
);

export const selectOverdueTerritories = createSelector(
  selectAllTerritories,
  selectLastAssignmentOfEachTerritory,
  selectSettings,
  (territories: Territory[], lastAssignments: Assignment[], settings: SettingsState) =>
  {
    const overdue = [];
    territories.forEach(t =>
    {
      const lastAssignment = lastAssignments.filter(a => a.territoryId === t.id)[0];

      if (!lastAssignment || (!!lastAssignment.endTime && lastAssignment.endTime < pastDateByMonths(settings.overdueBreakInMonths)))
      {
        overdue.push({
          territory: t,
          durationPhrase: createDurationPhrase(lastAssignment ? lastAssignment.endTime : null)
        });
      }
    });

    return overdue;
  }
);

export const selectAllAssignmentsOrderedByRelevantTags = createSelector(
  selectAll,
  selectAllTerritories,
  selectPublishersFeature,
  selectTagsFeature,
  (assignments: Assignment[], territories, publisher, tagState) =>
  {
    /* Zuteilungen anhand des Gebiets sammeln */
    const assignmentsByTerritory = new Map<string, any>();
    territories.filter(territory => !territory.deactivated).forEach((territory: Territory) =>
    {
      assignmentsByTerritory.set(territory.id, {
        territory: territory,
        showCount: 4,
        initialShowCount: 4,
        assignmentDtos: assignments.filter(a => a.territoryId === territory.id)
          .map(a => ({
            assignment: a,
            publisher: publisher.entities[a.publisherId],
            removedPublisherLabel: a.removedPublisherLabel
          }))
      });
    });

    /* Zuteilungen sortieren (neuste zuerst) */
    Array.from(assignmentsByTerritory.values())
      .forEach(dto =>
        dto.assignmentDtos.sort((dto1, dto2) =>
        {
          if (!dto1 || !dto1.assignment || !dto2 || !dto2.assignment)
          {
            return -1;
          }
          return dto1.assignment.startTime.getTime() > dto2.assignment.startTime.getTime() ? -1 : 1;
        }));

    /* ShowCount anpassen */
    Array.from(assignmentsByTerritory.values()).forEach(dto =>
    {
      const firstAssignmentDto = dto.assignmentDtos[0];
      if (firstAssignmentDto && firstAssignmentDto.assignment.endTime)
      {
        dto.showCount = 3;
        dto.initialShowCount = 3;
      }
    });

    /* Tags-Struktur erstellen */
    const dtosByTag = new Map<string, any>();

    /* Zur Gesamtstruktur zusammenfügen */
    Array.from(assignmentsByTerritory.values())
      .forEach((dto) =>
      {
        const firstTagId = dto.territory.tags[0];

        if (!dtosByTag.get(dto.territory.tags[0]))
        {
          dtosByTag.set(firstTagId, {
            tag: tagState.entities[firstTagId],
            territoryDtos: []
          });
        }

        dtosByTag.get(firstTagId).territoryDtos.push(dto);
      });

    /* Gebiete sortieren (Nummer aufsteigend) */
    Array.from(dtosByTag.values())
      .forEach((dto) => dto.territoryDtos.sort((d1, d2) => parseInt(d1.territory.key, 10) < parseInt(d2.territory.key, 10) ? -1 : 1));

    return Array.from(dtosByTag.values())
      .filter(dto => dto.territoryDtos && dto.territoryDtos.length > 0)
      /* DTOs sortieren anhand des ersten Gebiets-keys (100, 200, 300 usw.) */
      .sort((dto1, dto2) => parseInt(dto1.territoryDtos[0].territory.key, 10) < parseInt(dto2.territoryDtos[0].territory.key, 10) ? -1 : 1);
  }
);

/* Es ist hier wegen circular dependency error */
export const selectTerritoriesByPublisher = createSelector(
  selectAllAssignments,
  selectAllTerritories,
  (assignments, territories, publisherId) =>
  {
    const currentAssignments = assignments.filter(a => a.publisherId === publisherId && !a.endTime);
    const publishersTerritoryIds = currentAssignments.map(a => a.territoryId);

    const pTerritories = territories.filter(t => publishersTerritoryIds.includes(t.id));

    return pTerritories.map(ter => ({
      durationPhrase: createDurationPhrase(currentAssignments.filter(a => a.territoryId)[0] ? currentAssignments.filter(a => a.territoryId)[0].startTime : null),
      t: ter,
    }));
  }
);
