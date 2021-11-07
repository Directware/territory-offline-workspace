import { ApplicationState } from '../index.reducers';
import { createSelector } from '@ngrx/store';
import { visitBansAdapter } from './visit-bans.reducer';
import { createDurationPhrase, pastDateByMonths } from '@territory-offline-workspace/shared-utils';

export const selectVisitBansFeature = (state: ApplicationState) => state.visitBans;

export const { selectIds, selectEntities, selectAll, selectTotal } =
  visitBansAdapter.getSelectors(selectVisitBansFeature);

export const selectAllVisitBanEntities = createSelector(selectEntities, (visitBans) => visitBans);

export const selectAllVisitBans = createSelector(selectAll, (visitBans) => visitBans);

export const selectVisitBanById = createSelector(
  selectVisitBansFeature,
  (visitBans, id) => visitBans.entities[id]
);
export const selectVisitBansCount = createSelector(selectTotal, (total) => '' + total);

export const selectVisitBansByTerritoryId = createSelector(selectAll, (visitBans, id) =>
  visitBans
    .filter((vb) => vb.territoryId === id)
    .sort((vb1, vb2) => {
      const street1 = vb1.street ? vb1.street.toLowerCase().trim() : '';
      const street2 = vb2.street ? vb2.street.toLowerCase().trim() : '';
      const streetSuffix1 = vb1.streetSuffix ? parseInt(vb1.streetSuffix, 10) : 0;
      const streetSuffix2 = vb2.streetSuffix ? parseInt(vb2.streetSuffix, 10) : 0;

      if (street1 === street2) {
        return streetSuffix1 < streetSuffix2 ? -1 : 1;
      }
      return street1 < street2 ? -1 : 1;
    })
    .sort((vb1, vb2) => {
      const street1 = vb1.street ? vb1.street.toLowerCase() : '';
      const street2 = vb2.street ? vb2.street.toLowerCase() : '';
      const streetSuffix1 = vb1.streetSuffix ? parseInt(vb1.streetSuffix, 10) : 0;
      const streetSuffix2 = vb2.streetSuffix ? parseInt(vb2.streetSuffix, 10) : 0;
      const name1 = vb1.name ? vb1.name.toLowerCase() : '';
      const name2 = vb2.name ? vb2.name.toLowerCase() : '';

      return street1 === street2 && streetSuffix1 === streetSuffix2 && name1 < name2 ? -1 : 1;
    })
);

export const selectOverdueVisitBans = createSelector(selectAll, (visitBans) => {
  const overdue = visitBans
    .filter((vb) => !vb.lastVisit || vb.lastVisit < pastDateByMonths(12))
    .sort((vb1, vb2) => (vb1.street > vb2.street ? 1 : -1));

  return overdue.map((vb) => ({
    visitBan: vb,
    durationPhrase: createDurationPhrase(vb.lastVisit),
  }));
});
