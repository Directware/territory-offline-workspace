import {Injectable} from "@angular/core";
import {Plugins} from '@capacitor/core';
import '@capacitor-community/sqlite';
import * as CDSSPlugin from "capacitor-data-storage-sqlite";
import {Dictionary} from "@ngrx/entity";
import {TimedEntity} from "./../common/timed-entity.model";
import {AbstractDatabase} from "./abstract-database.interface";
import {select, Store} from "@ngrx/store";
import {ApplicationState} from "../../store/index.reducers";
import {selectCurrentCongregationId} from "../../store/settings/settings.selectors";
import {take} from "rxjs/operators";
import {SettingsDatabaseService} from "./settings-database.service";
const {Device} = Plugins;

@Injectable({providedIn: "root"})
export class WebDatabaseService implements AbstractDatabase
{
  public readonly database: any;
  public readonly config;
  public platform;
  private DB_CACHE: Dictionary<TimedEntity> = {};

  constructor(private store: Store<ApplicationState>, private settingsDatabase: SettingsDatabaseService)
  {
    this.database = CDSSPlugin.CapacitorDataStorageSqlite;
    this.config = {databaseName: "territory-offline"};
  }

  public async init()
  {
    const info = await Device.getInfo();
    this.platform = info.platform;
  }

  public async open()
  {
    await this.database.openStore({database: this.config.databaseName});
    await this.cacheStorageDatabaseEntries();
  }

  public async load(prefix: string, excludeCongregationPrefix?: boolean): Promise<TimedEntity[]>
  {
    const congregationPrefix = excludeCongregationPrefix ? '' : await this.getCurrentCongregationPrefix();

    const relevantKeys = Object.keys(this.DB_CACHE).filter((key) => key.startsWith(`${congregationPrefix}:${prefix}`));
    const entities: TimedEntity[] = [];

    for (let i = 0; i < relevantKeys.length; i++)
    {
      const dataStorageResult = await this.database.get({key: relevantKeys[i]});

      try
      {
        const entity = JSON.parse(dataStorageResult.value);

        if (!!entity["startTime"])
        {
          entity["startTime"] = new Date(entity["startTime"]);
        }

        if (!!entity["endTime"])
        {
          entity["endTime"] = new Date(entity["endTime"]);
        }

        if (!!entity["lastVisit"])
        {
          entity["lastVisit"] = new Date(entity["lastVisit"]);
        }

        /* Reperatur */
        if (!!entity["createTime"])
        {
          entity["creationTime"] = new Date(entity["createTime"]);
          delete entity["createTime"];
        }

        /* Reperatur */
        if (!!entity["isCreation"])
        {
          delete entity["isCreation"];
        }

        entities.push({
          ...entity,
          creationTime: entity.creationTime ? new Date(entity.creationTime) : null,
          lastUpdated: entity.lastUpdated ? new Date(entity.lastUpdated) : null
        });
      }
      catch (e)
      {
        continue;
      }
    }

    return entities;
  }

  public async upsert(prefix: string, entity: TimedEntity, excludeCongregationPrefix?: boolean): Promise<TimedEntity>
  {
    const congregationPrefix = excludeCongregationPrefix ? '' : await this.getCurrentCongregationPrefix();

    if (!entity.creationTime)
    {
      entity.creationTime = new Date();
    }

    entity.lastUpdated = new Date();

    const addedEntry = await this.writeToDatabase(`${congregationPrefix}:${prefix}`, entity);

    setTimeout(() => this.cacheStorageDatabaseEntries(), 0);

    return addedEntry;
  }

  public async bulkUpsert(prefix: string, entities: TimedEntity[], excludeCongregationPrefix?: boolean)
  {
    const congregationPrefix = await this.getCurrentCongregationPrefix();

    for (let i = 0; i < entities.length; i++)
    {
      await this.writeToDatabase(`${congregationPrefix}:${prefix}`, entities[i]);
    }

    setTimeout(() => this.cacheStorageDatabaseEntries(), 0);

    return entities;
  }

  public async bulkDelete(prefix: string, entities: TimedEntity[], excludeCongregationPrefix?: boolean): Promise<TimedEntity[]>
  {
    const congregationPrefix = excludeCongregationPrefix ? '' : await this.getCurrentCongregationPrefix();

    for (let i = 0; i < entities.length; i++)
    {
      await this.database.remove({key: `${congregationPrefix}:${prefix}:${entities[i].id}`});
    }
    setTimeout(() => this.cacheStorageDatabaseEntries(), 0);
    return entities;
  }

  public async delete(prefix: string, entity: TimedEntity, excludeCongregationPrefix?: boolean): Promise<TimedEntity>
  {
    const congregationPrefix = excludeCongregationPrefix ? '' : await this.getCurrentCongregationPrefix();

    await this.database.remove({key: `${congregationPrefix}:${prefix}:${entity.id}`});
    setTimeout(() => this.cacheStorageDatabaseEntries(), 0);
    return entity;
  }

  public async clear()
  {
    await this.settingsDatabase.clear();
    return await this.database.clear();
  }

  public async clearAllWithPrefix(prefix: string)
  {
    const result = await this.database.keys();
    const relevantKeys = result.keys.filter((key) => key.startsWith(prefix));

    for (let i = 0; i < relevantKeys.length; i++)
    {
      await this.database.remove({key: relevantKeys[i]});
    }

    setTimeout(() => this.cacheStorageDatabaseEntries(), 0);

    return prefix;
  }

  private async getCurrentCongregationPrefix(): Promise<string>
  {
    return await this.store.pipe(select(selectCurrentCongregationId), take(1)).toPromise();
  }

  private async cacheStorageDatabaseEntries()
  {
    const result = await this.database.keysvalues();
    result.keysvalues.forEach(({key, value}) => this.DB_CACHE[key] = value);
  }

  private async writeToDatabase(prefix: string, entity: TimedEntity): Promise<TimedEntity>
  {
    let dataToBeSaved: any = JSON.stringify(entity);

    await this.database.set({
      key: `${prefix}:${entity.id}`,
      value: dataToBeSaved
    });

    return entity;
  }
}
