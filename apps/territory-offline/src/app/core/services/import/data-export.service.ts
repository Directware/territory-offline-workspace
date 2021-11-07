import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { ApplicationState } from '../../store/index.reducers';
import { combineLatest } from 'rxjs';
import { take } from 'rxjs/operators';
import { selectAllTerritories } from '../../store/territories/territories.selectors';
import { selectAllDrawings } from '../../store/drawings/drawings.selectors';
import { selectPublishers } from '../../store/publishers/publishers.selectors';
import { selectTags } from '../../store/tags/tags.selectors';
import { selectAllAssignments } from '../../store/assignments/assignments.selectors';
import { selectAllVisitBans } from '../../store/visit-bans/visit-bans.selectors';
import * as Pako from 'pako';
import { selectCurrentCongregation } from '../../store/congregation/congregations.selectors';
import { PlatformAgnosticActionsService } from '../common/platform-agnostic-actions.service';
import { ExportableTypesEnum } from '@territory-offline-workspace/shared-interfaces';

@Injectable({ providedIn: 'root' })
export class DataExportService {
  constructor(
    private store: Store<ApplicationState>,
    private platformAgnosticActionsService: PlatformAgnosticActionsService
  ) {}

  public async getFileName(): Promise<string> {
    const currentCongregation = await this.store
      .pipe(select(selectCurrentCongregation), take(1))
      .toPromise();
    const today = new Date();
    const minutes = today.getMinutes().toString(10).padStart(2, '0');
    return `${currentCongregation.name} ${today.getFullYear()}-${
      today.getMonth() + 1
    }-${today.getDate()} ${today.getHours()}-${minutes}.territoryoffline`;
  }

  public async exportAll() {
    const allData = await combineLatest([
      this.store.pipe(select(selectAllTerritories), take(1)),
      this.store.pipe(select(selectAllDrawings), take(1)),
      this.store.pipe(select(selectPublishers), take(1)),
      this.store.pipe(select(selectAllAssignments), take(1)),
      this.store.pipe(select(selectAllVisitBans), take(1)),
      this.store.pipe(select(selectTags), take(1)),
    ]).toPromise();

    const allDataDictionary = {
      territories: allData[0],
      drawings: allData[1],
      publisher: allData[2],
      assignments: allData[3],
      visitBans: allData[4],
      tags: allData[5],
      type: ExportableTypesEnum.ALL,
    };

    const gzippedData = Pako.gzip(JSON.stringify(allDataDictionary), { to: 'string' });

    return gzippedData;
  }

  public async exportAllAndShare() {
    const data = await this.exportAll();
    const fileName = await this.getFileName();
    await this.platformAgnosticActionsService.share(data, fileName, 'backup');
  }
}
