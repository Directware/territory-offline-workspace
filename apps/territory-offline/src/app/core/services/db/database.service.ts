import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ApplicationState } from '../../store/index.reducers';
import { Actions } from '@ngrx/effects';
import { Plugins } from '@capacitor/core';
import { MobileDatabaseService } from './mobile-database.service';
import { WebDatabaseService } from './web-database.service';
import { ElectronDatabaseService } from './electron-database.service';
import { environment } from '../../../../environments/environment';
import { TimedEntity } from '@territory-offline-workspace/shared-interfaces';
const { Device } = Plugins;

@Injectable({ providedIn: 'root' })
export class DatabaseService {
  private platform: 'ios' | 'android' | 'electron' | 'web';

  private readonly appropriateDatabase = {
    ios: this.mobileDatabaseService,
    android: this.mobileDatabaseService,
    electron: this.electronDatabaseService,
    web: this.webDatabaseService,
  };

  constructor(
    private store: Store<ApplicationState>,
    private actions: Actions,
    private mobileDatabaseService: MobileDatabaseService,
    private webDatabaseService: WebDatabaseService,
    private electronDatabaseService: ElectronDatabaseService
  ) {}

  public async init() {
    const info = await Device.getInfo();
    this.platform = info.platform;

    if (environment.production && this.platform === 'web') {
      this.platform = 'electron';
    }

    await this.appropriateDatabase[this.platform].init();
    await this.appropriateDatabase[this.platform].open();
  }

  public async load(prefix: string, excludeCongregationPrefix?: boolean): Promise<TimedEntity[]> {
    return await this.appropriateDatabase[this.platform].load(prefix, excludeCongregationPrefix);
  }

  public async upsert(
    prefix: string,
    entity: TimedEntity,
    excludeCongregationPrefix?: boolean
  ): Promise<TimedEntity> {
    return await this.appropriateDatabase[this.platform].upsert(
      prefix,
      entity,
      excludeCongregationPrefix
    );
  }

  public async bulkUpsert(prefix: string, entities: TimedEntity[]) {
    return await this.appropriateDatabase[this.platform].bulkUpsert(prefix, entities);
  }

  public async bulkDelete(
    prefix: string,
    entities: TimedEntity[],
    excludeCongregationPrefix?: boolean
  ): Promise<TimedEntity[]> {
    return await this.appropriateDatabase[this.platform].bulkDelete(
      prefix,
      entities,
      excludeCongregationPrefix
    );
  }

  public async delete(
    prefix: string,
    entity: TimedEntity,
    excludeCongregationPrefix?: boolean
  ): Promise<TimedEntity> {
    return await this.appropriateDatabase[this.platform].delete(
      prefix,
      entity,
      excludeCongregationPrefix
    );
  }

  public async clear() {
    return await this.appropriateDatabase[this.platform].clear();
  }

  public async clearAllWithPrefix(prefix: string) {
    return await this.appropriateDatabase[this.platform].clearAllWithPrefix(prefix);
  }
}
