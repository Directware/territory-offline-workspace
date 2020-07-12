export interface TerritoryCardFormat
{
  id: string;
  label: string;
  visitBansRows: {
    blank: number,
    withComment: number;
  },
  dimensions: {
    w: number,
    h: number,
    dim: string
  };
}
