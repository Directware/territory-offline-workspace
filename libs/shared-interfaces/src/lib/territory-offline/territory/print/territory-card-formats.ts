import { TerritoryCardFormat } from './territory-card-format.interface';

export const TerritoryCardFormats: TerritoryCardFormat[] = [
  {
    id: 'TerritoryCardFormat.s12',
    label: 'S12',
    visitBansRows: {
      blank: 11,
      withComment: 9,
    },
    dimensions: {
      w: 148,
      h: 94,
      dim: 'mm',
    },
  },
  {
    id: 'TerritoryCardFormat.a6',
    label: 'DIN A6',
    visitBansRows: {
      blank: 13,
      withComment: 11,
    },
    dimensions: {
      w: 148,
      h: 105,
      dim: 'mm',
    },
  },
];
