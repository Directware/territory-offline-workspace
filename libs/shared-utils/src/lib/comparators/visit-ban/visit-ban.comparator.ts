import { VisitBan } from '@territory-offline-workspace/shared-interfaces';
import { normalizeStreetName, normalizeStreetSuffix } from './../../deprecated/usefull.functions';

export function compareVisitBans(visitBan1: VisitBan, visitBan2: VisitBan): boolean {
  if (!visitBan1 || !visitBan2) {
    return false;
  }

  const street1 = normalizeStreetName(visitBan1.street).toLocaleLowerCase();
  const street2 = normalizeStreetName(visitBan2.street).toLocaleLowerCase();

  const streetSuffix1 = normalizeStreetSuffix(visitBan1.streetSuffix).toLocaleLowerCase();
  const streetSuffix2 = normalizeStreetSuffix(visitBan2.streetSuffix).toLocaleLowerCase();

  const sameStreet = street1 === street2;
  const sameStreetSuffix = streetSuffix1 === streetSuffix2;

  return sameStreet && sameStreetSuffix;
}

export function compareVisitBansWithNames(visitBan1: VisitBan, visitBan2: VisitBan): boolean {
  if (!visitBan1 || !visitBan2) {
    return false;
  }

  const sameAddress = compareVisitBans(visitBan1, visitBan2);

  const name1 = visitBan1.name;
  const name2 = visitBan2.name;
  const sameName = name1 === name2;

  return sameName && sameAddress;
}
