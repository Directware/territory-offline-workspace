import {Injectable} from "@angular/core";
import {Plugins} from '@capacitor/core';
import '@capacitor-community/sqlite';
import {TimedEntity} from "@territory-offline-workspace/api";
import {AbstractDatabase} from "./abstract-database.interface";
import {
  ASSIGNMENT_TABLE_NAME, DRAWING_TABLE_NAME, LAST_DOING_TABLE_NAME, PUBLISHER_TABLE_NAME,
  SQL_CREATE_ASSIGNMENTS,
  SQL_CREATE_CONGREGATION,
  SQL_CREATE_DRAWING,
  SQL_CREATE_LAST_DOING,
  SQL_CREATE_PUBLISHER,
  SQL_CREATE_TAG,
  SQL_CREATE_TERRITORY,
  SQL_CREATE_VISIT_BAN,
  TABLE_NAME_MAPPINGS, TAG_TABLE_NAME, TERRITORY_TABLE_NAME, VISIT_BAN_TABLE_NAME
} from "./mobile-db-schemas/schemas.db";
import {select, Store} from "@ngrx/store";
import {selectCurrentCongregationId} from "../../store/settings/settings.selectors";
import {take} from "rxjs/operators";
import {ApplicationState} from "../../store/index.reducers";
import {SettingsDatabaseService} from "./settings-database.service";

const {CapacitorSQLite, Device} = Plugins;

@Injectable({providedIn: "root"})
export class MobileDatabaseService implements AbstractDatabase
{
  public readonly database: any;
  private sqlite: any;
  public platform;

  constructor(private store: Store<ApplicationState>, private settingsDatabase: SettingsDatabaseService)
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

    await this.sqlite.open({
      database: "territory-offline",
      version: 1,
      encrypted: true,
      mode: "secret"
    });

    await this.initSchemas();
  }

  public async load(hashedTableName: string, excludeCongregationPrefix?: boolean): Promise<TimedEntity[]>
  {
    const entities: TimedEntity[] = [];
    let query;
    const congregationPrefix = excludeCongregationPrefix ? `SELECT * FROM ${TABLE_NAME_MAPPINGS[hashedTableName].tableName}` : await this.getCurrentCongregationPrefix();

    query = excludeCongregationPrefix
      ? `SELECT * FROM ${TABLE_NAME_MAPPINGS[hashedTableName].tableName}`
      : `SELECT * FROM ${TABLE_NAME_MAPPINGS[hashedTableName].tableName} WHERE congregationId='${congregationPrefix}'`;

    const result: any = await this.database.query({
      statement: query,
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
    const congregationPrefix = excludeCongregationPrefix ? null : await this.getCurrentCongregationPrefix();

    const tmp = TABLE_NAME_MAPPINGS[hashedTableName].insertQuery({...entity, congregationId: congregationPrefix});
    await this.database.execute({statements: tmp});
    return entity;
  }

  public async bulkUpsert(hashedTableName: string, entities: TimedEntity[], excludeCongregationPrefix?: boolean): Promise<TimedEntity[]>
  {
    const set = [];
    const congregationPrefix = excludeCongregationPrefix ? null : await this.getCurrentCongregationPrefix();

    entities.forEach(entity => set.push({
      statement: TABLE_NAME_MAPPINGS[hashedTableName].insertQuery({...entity, congregationId: congregationPrefix}),
      values: []
    }));

    await this.database.executeSet({set: set});
    return entities;
  }

  public async bulkDelete(hashedTableName: string, entities: TimedEntity[], excludeCongregationPrefix?: boolean): Promise<TimedEntity[]>
  {
    const set = [];

    entities.forEach(entity => set.push({
      statement: TABLE_NAME_MAPPINGS[hashedTableName].deleteByIdQuery(entity.id),
      values: []
    }));

    await this.database.executeSet({set: set});
    return entities;
  }

  public async delete(hashedTableName: string, entity: TimedEntity, excludeCongregationPrefix?: boolean): Promise<TimedEntity>
  {
    const tmp = TABLE_NAME_MAPPINGS[hashedTableName].deleteByIdQuery(entity.id);
    await this.database.execute({statements: tmp});
    return entity;
  }

  public async clear()
  {
    await this.settingsDatabase.clear();
    return await this.database.deleteDatabase({database: "territory-offline"});
  }

  public async clearAllWithPrefix(prefix: string)
  {
    const set = [
      {statement: `DELETE FROM ${ASSIGNMENT_TABLE_NAME} WHERE congregationId = '${prefix}:';`, values: []},
      {statement: `DELETE FROM ${DRAWING_TABLE_NAME} WHERE congregationId = '${prefix}:';`, values: []},
      {statement: `DELETE FROM ${LAST_DOING_TABLE_NAME} WHERE congregationId = '${prefix}:';`, values: []},
      {statement: `DELETE FROM ${PUBLISHER_TABLE_NAME} WHERE congregationId = '${prefix}:';`, values: []},
      {statement: `DELETE FROM ${TAG_TABLE_NAME} WHERE congregationId = '${prefix}:';`, values: []},
      {statement: `DELETE FROM ${TERRITORY_TABLE_NAME} WHERE congregationId = '${prefix}:';`, values: []},
      {statement: `DELETE FROM ${VISIT_BAN_TABLE_NAME} WHERE congregationId = '${prefix}:';`, values: []}
    ];

    await this.database.executeSet({set: set});

    return prefix;
  }

  private async getCurrentCongregationPrefix(): Promise<string>
  {
    return await this.store.pipe(select(selectCurrentCongregationId), take(1)).toPromise();
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
