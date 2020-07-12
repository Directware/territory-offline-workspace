import {Injectable} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {ApplicationState} from '../../store/index.reducers';
import {CryptoService} from '../encryption/crypto.service';
import {TimedEntity} from '../../model/db/timed-entity.interface';
import {Actions} from '@ngrx/effects';
import {take} from 'rxjs/operators';
import {selectCurrentCongregationId} from '../../store/settings/settings.selectors';
import {DataSecurityService} from "../common/data-security.service";
import {Plugins} from "@capacitor/core";
import * as CDSSPlugin from 'capacitor-data-storage-sqlite';
const {CapacitorDataStorageSqlite, Device} = Plugins;

@Injectable({providedIn: 'root'})
export class DatabaseService
{
  private _storage;
  private readonly TO_DB_NAME = 'territory-offline';
  private CAN_NOT_AVOID_PASSWORD: boolean;

  constructor(private store: Store<ApplicationState>,
              private actions: Actions,
              private dataSecurityService: DataSecurityService,
              private cryptoService: CryptoService)
  {
  }

  public async initAppropriateSQLite()
  {
    const info = await Device.getInfo();
    this.CAN_NOT_AVOID_PASSWORD = !this.dataSecurityService.canAvoidPassword();
    if (info.platform === "ios" || info.platform === "android")
    {
      this._storage = CapacitorDataStorageSqlite;
    }
    else if (info.platform === "electron")
    {
      this._storage = CDSSPlugin.CapacitorDataStorageSqliteElectron;
    }
    else
    {
      this._storage = CDSSPlugin.CapacitorDataStorageSqlite
    }

    await this._storage.openStore({database: this.TO_DB_NAME});
  }

  public async load(prefix: string, excludeCongregationPrefix?: boolean)
  {
    const congregationPrefix = excludeCongregationPrefix ? '' : await this.getCurrentCongregationPrefix();

    const result = await this._storage.keys();
    const relevantKeys = result.keys.filter((key) => key.startsWith(`${congregationPrefix}:${prefix}`));
    const entities: TimedEntity[] = [];

    for (let i = 0; i < relevantKeys.length; i++)
    {
      const dataStorageResult = await this._storage.get({key: relevantKeys[i]});

      let entity = null;
      if (this.CAN_NOT_AVOID_PASSWORD)
      {
        entity = await this.cryptoService.asymmetricDecryption(dataStorageResult.value) as TimedEntity;
      }
      else
      {
        entity = JSON.parse(dataStorageResult.value);
      }

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

    return entities;
  }

  public async upsert(prefix: string, entity: TimedEntity, excludeCongregationPrefix?: boolean)
  {
    const congregationPrefix = excludeCongregationPrefix ? '' : await this.getCurrentCongregationPrefix();

    if (!entity.creationTime)
    {
      entity.creationTime = new Date();
    }

    entity.lastUpdated = new Date();

    return this.writeToDatabase(`${congregationPrefix}:${prefix}`, entity);
  }

  public async bulkUpsert(prefix: string, entities: TimedEntity[])
  {
    const congregationPrefix = await this.getCurrentCongregationPrefix();

    for (let i = 0; i < entities.length; i++)
    {
      await this.writeToDatabase(`${congregationPrefix}:${prefix}`, entities[i]);
    }

    return entities;
  }

  public async bulkDelete(prefix: string, entities: TimedEntity[], excludeCongregationPrefix?: boolean): Promise<TimedEntity[]>
  {
    const congregationPrefix = excludeCongregationPrefix ? '' : await this.getCurrentCongregationPrefix();

    for (let i = 0; i < entities.length; i++)
    {
      await this._storage.remove({key: `${congregationPrefix}:${prefix}:${entities[i].id}`});
    }
    return entities;
  }

  public async delete(prefix: string, entity: TimedEntity, excludeCongregationPrefix?: boolean): Promise<TimedEntity>
  {
    const congregationPrefix = excludeCongregationPrefix ? '' : await this.getCurrentCongregationPrefix();

    await this._storage.remove({key: `${congregationPrefix}:${prefix}:${entity.id}`});
    return entity;
  }

  public async clear()
  {
    return await this._storage.clear();
  }

  public async clearAllWithPrefix(prefix: string)
  {
    const result = await this._storage.keys();
    const relevantKeys = result.keys.filter((key) => key.startsWith(prefix));

    for (let i = 0; i < relevantKeys.length; i++)
    {
      await this._storage.remove({key: relevantKeys[i]});
    }

    return prefix;
  }

  private async writeToDatabase(prefix: string, entity: TimedEntity): Promise<TimedEntity>
  {
    let dataToBeSaved: any = JSON.stringify(entity);

    if (this.CAN_NOT_AVOID_PASSWORD)
    {
      const encrypted = await this.cryptoService.asymmetricEncryption(entity);
      dataToBeSaved = encrypted.cipher;
    }

    await this._storage.set({
      key: `${prefix}:${entity.id}`,
      value: dataToBeSaved
    });

    return entity;
  }

  private async getCurrentCongregationPrefix(): Promise<string>
  {
    return await this.store.pipe(select(selectCurrentCongregationId), take(1)).toPromise();
  }
}
