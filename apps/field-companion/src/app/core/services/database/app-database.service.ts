import { Injectable } from "@angular/core";
import { Device } from "@capacitor/device";
import { TimedEntity } from "@territory-offline-workspace/shared-interfaces";
import * as CDSSPlugin from "capacitor-data-storage-sqlite";
import { CapacitorDataStorageSqlite } from "capacitor-data-storage-sqlite";

@Injectable({ providedIn: "root" })
export class AppDatabaseService {
  private _storage;
  private readonly FC_DB_NAME = "field-companion";

  constructor() {}

  public async initAppropriateSQLite() {
    const info = await Device.getInfo();
    if (info.platform === "ios" || info.platform === "android") {
      this._storage = CapacitorDataStorageSqlite;
    } else {
      this._storage = CDSSPlugin.CapacitorDataStorageSqlite;
    }

    await this._storage.openStore({ database: this.FC_DB_NAME });
  }

  public async load(prefix: string): Promise<TimedEntity[]> {
    const allValuesResult = await this._storage.values();
    const stringifyValues = allValuesResult.values;
    const entities = [];

    for (let i = 0; i < stringifyValues.length; i++) {
      const entity: TimedEntity = JSON.parse(stringifyValues[i]);

      if (entity.prefix === prefix) {
        entities.push({
          ...entity,
          creationTime: new Date(entity.creationTime),
          lastUpdated: entity.lastUpdated ? new Date(entity.lastUpdated) : null,
        });
      }
    }

    return entities;
  }

  public async bulkUpsert(
    prefix: string,
    entities: TimedEntity[]
  ): Promise<TimedEntity[]> {
    for (let i = 0; i < entities.length; i++) {
      await this.upsert(prefix, entities[i]);
    }

    return entities;
  }

  public async upsert(
    prefix: string,
    entity: TimedEntity
  ): Promise<TimedEntity> {
    await this._storage.set({
      key: `${prefix}:${entity.id}`,
      value: JSON.stringify({ ...entity, prefix: prefix }),
    });
    return entity;
  }

  public async delete(
    prefix: string,
    entity: TimedEntity
  ): Promise<TimedEntity> {
    await this._storage.remove({ key: `${prefix}:${entity.id}` });
    return entity;
  }

  public async clearAll() {
    await this._storage.clear();
  }
}
