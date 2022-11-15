import { ApplicationState } from "../index.reducers";
import { createSelector } from "@ngrx/store";
import { territoryCardsAdapter } from "./territory-card.reducer";
import * as moment from "moment";
import { TerritoryCard } from "@territory-offline-workspace/shared-interfaces";

export const selectTerritoryCardsFeature = (state: ApplicationState) =>
  state.territoryCards;

export const { selectIds, selectEntities, selectAll, selectTotal } =
  territoryCardsAdapter.getSelectors(selectTerritoryCardsFeature);

export const selectAllTerritoryCards = createSelector(
  selectAll,
  (territoryCards) =>
    territoryCards.map((t) => {
      const features = t.drawing.featureCollection.features.map((f) => {
        const _isExpired = isExpired(t);

        return {
          ...f,
          properties: {
            ...f.properties,
            isExpired: _isExpired,
            color: _isExpired ? "#ff5f1b" : "#4f9cdc",
          },
        };
      });

      return {
        ...t,
        drawing: {
          ...t.drawing,
          featureCollection: {
            ...t.drawing.featureCollection,
            features,
          },
        },
      };
    })
);

export const selectAllExpiredTerritoryCards = createSelector(
  selectAll,
  (territoryCards) => territoryCards.filter((t) => isExpired(t))
);

export const selectAllNotExpiredTerritoryCards = createSelector(
  selectAll,
  (territoryCards) => territoryCards.filter((t) => !isExpired(t))
);

export const selectTerritoryCardById = createSelector(
  selectEntities,
  (entities, id) => entities[id]
);

export const selectTerritoryCardByTerritoryId = createSelector(
  selectAll,
  (entities, id) => entities.filter((e) => e.territory.id === id)[0]
);

function isExpired(territoryCard: TerritoryCard): boolean {
  const today = moment(new Date());
  const end = moment(territoryCard.assignment.startTime).add(
    territoryCard.estimationInMonths,
    "M"
  );

  return today.isAfter(end);
}
