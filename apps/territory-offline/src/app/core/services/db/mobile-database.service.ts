import {Injectable} from "@angular/core";
import {Plugins} from '@capacitor/core';
import '@capacitor-community/sqlite';
import {TimedEntity} from "@territory-offline-workspace/api";
import {AbstractDatabase} from "./abstract-database.interface";
import {
  SQL_CREATE_ASSIGNMENTS,
  SQL_CREATE_CONGREGATION,
  SQL_CREATE_DRAWING,
  SQL_CREATE_LAST_DOING,
  SQL_CREATE_PUBLISHER,
  SQL_CREATE_TAG,
  SQL_CREATE_TERRITORY,
  SQL_CREATE_VISIT_BAN,
  TABLE_NAME_MAPPINGS
} from "./mobile-db-schemas/schemas.db";

const {CapacitorSQLite, Device} = Plugins;

@Injectable({providedIn: "root"})
export class MobileDatabaseService implements AbstractDatabase
{
  public readonly database: any;
  private sqlite: any;
  public platform;

  constructor()
  {
    this.database = CapacitorSQLite;
  }

  public async init()
  {
    const info = await Device.getInfo();
    this.platform = info.platform;

    if (info.platform === "android")
    {
      try
      {
        await this.database.requestPermissions();
      } catch (e)
      {
        throw new Error("User declined database permission request!");
      }
    }
  }

  public async open()
  {
    const info = await Device.getInfo();
    this.platform = info.platform;
    this.sqlite = CapacitorSQLite;

    // TODO encrypted mode
    const test = await this.sqlite.open({
      database: "territory-offline",
      version: 1
    });

    console.log("########### DB Opened:");
    console.log(test);

    await this.initSchemas();
  }

  public async load(hashedTableName: string, excludeCongregationPrefix?: boolean): Promise<TimedEntity[]>
  {
    const entities: TimedEntity[] = [];
    const result: any = await this.database.query({
      statement: `SELECT * FROM ${TABLE_NAME_MAPPINGS[hashedTableName].tableName}`,
      values: []
    });

    for (let i = 0; i < result.values.length; i++)
    {
      const entity = result.values[i];
      const parsedEntity = TABLE_NAME_MAPPINGS[hashedTableName].parseEntity(entity);
      entities.push(parsedEntity);
    }

    return entities;
  }

  public async upsert(hashedTableName: string, entity: TimedEntity, excludeCongregationPrefix?: boolean): Promise<TimedEntity>
  {
    const tmp = TABLE_NAME_MAPPINGS[hashedTableName].insertQuery(entity);
    await this.database.execute({statements: tmp});
    return entity;
  }

  public async bulkUpsert(hashedTableName: string, entities: TimedEntity[]): Promise<TimedEntity[]>
  {
    const set = [];

    entities.forEach(entity => set.push({
      statement: TABLE_NAME_MAPPINGS[hashedTableName].insertQuery(entity),
      values: []
    }));

    await this.database.executeSet({set: set});
    return entities;
  }

  public async bulkDelete(hashedTableName: string, entities: TimedEntity[], excludeCongregationPrefix?: boolean): Promise<TimedEntity[]>
  {
    // TODO implement
    return entities;
  }


  public async delete(hashedTableName: string, entity: TimedEntity, excludeCongregationPrefix?: boolean): Promise<TimedEntity>
  {
    // TODO implement
    return entity;
  }

  public async clear()
  {
    // TODO delete also settings
    return await this.database.deleteDatabase({database: "territory-offline"});
  }

  public async clearAllWithPrefix(prefix: string)
  {
    // TODO implement
    return prefix;
  }

  private async initSchemas()
  {
    await this.database.execute({statements: SQL_CREATE_ASSIGNMENTS});
    await this.database.execute({statements: SQL_CREATE_CONGREGATION});
    await this.database.execute({statements: SQL_CREATE_DRAWING});
    await this.database.execute({statements: SQL_CREATE_LAST_DOING});
    await this.database.execute({statements: SQL_CREATE_PUBLISHER});
    await this.database.execute({statements: SQL_CREATE_TAG});
    await this.database.execute({statements: SQL_CREATE_TERRITORY});
    await this.database.execute({statements: SQL_CREATE_VISIT_BAN});
  }
}
