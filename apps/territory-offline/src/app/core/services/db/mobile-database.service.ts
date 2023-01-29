import { Injectable } from "@angular/core";
import { Plugins } from "@capacitor/core";
import "@capacitor-community/sqlite";
import {
  ASSIGNMENT_TABLE_NAME,
  DRAWING_TABLE_NAME,
  LAST_DOING_TABLE_NAME,
  PUBLISHER_TABLE_NAME,
  SQL_CREATE_ASSIGNMENTS,
  SQL_CREATE_CONGREGATION,
  SQL_CREATE_DRAWING,
  SQL_CREATE_LAST_DOING,
  SQL_CREATE_PUBLISHER,
  SQL_CREATE_TAG,
  SQL_CREATE_TERRITORY,
  SQL_CREATE_VISIT_BAN,
  TAG_TABLE_NAME,
  TERRITORY_TABLE_NAME,
  TimedEntity,
  VISIT_BAN_TABLE_NAME,
} from "@territory-offline-workspace/shared-interfaces";
import { AbstractDatabase } from "./abstract-database.interface";

import { select, Store } from "@ngrx/store";
import { selectCurrentCongregationId } from "../../store/settings/settings.selectors";
import { take } from "rxjs/operators";
import { ApplicationState } from "../../store/index.reducers";
import { SettingsDatabaseService } from "./settings-database.service";
import {
  capSQLiteSet,
  SQLiteConnection,
  CapacitorSQLite,
} from "@capacitor-community/sqlite";
import { TABLE_NAME_MAPPINGS } from "./mobile-db-schemas/schemas.db";
import { environment } from "../../../../environments/environment";
import { capSQLiteChanges } from "@capacitor-community/sqlite/dist/esm/definitions";

@Injectable({ providedIn: "root" })
export class MobileDatabaseService implements AbstractDatabase {
  private readonly databaseName = "territory-offline";
  public database: SQLiteConnection;
  public platform;

  constructor(
    private store: Store<ApplicationState>,
    private settingsDatabase: SettingsDatabaseService
  ) {}

  public async init() {
    this.logDatabaseActions("[MobileDatabaseService.init] start", "log");

    this.database = new SQLiteConnection(CapacitorSQLite);
    await this.database.createConnection(
      this.databaseName,
      true,
      "secret",
      1,
      false
    );

    this.logDatabaseActions("[MobileDatabaseService.init] end", "log");
  }

  public async open() {
    this.logDatabaseActions("[MobileDatabaseService.open] start", "log");
    const db = await this.retrieveConnection();
    await db.open();
    await this.considerToInitSchemas();
    this.logDatabaseActions("[MobileDatabaseService.open] end", "log");
  }

  public retrieveConnection() {
    this.logDatabaseActions(
      "[MobileDatabaseService.retrieveConnection]",
      "log"
    );
    return this.database.retrieveConnection(this.databaseName, false);
  }

  public async load(
    hashedTableName: string,
    excludeCongregationPrefix?: boolean
  ): Promise<TimedEntity[]> {
    const db = await this.retrieveConnection();
    let statement = `SELECT * FROM ${TABLE_NAME_MAPPINGS[hashedTableName].tableName}`;

    if (!excludeCongregationPrefix) {
      const congregationPrefix = await this.getCurrentCongregationPrefix();
      statement += ` WHERE congregationId = '${congregationPrefix}'`;
    }

    statement += ";";

    this.logDatabaseActions(
      `[MobileDatabase.execute]: statement=>${statement}<.`,
      "log",
      "start"
    );

    const result = await db.query(statement);

    this.logDatabaseActions(
      `[MobileDatabase.execute]: values=>${JSON.stringify(result.values)}<.`,
      "log"
    );

    if (result.values) {
      this.logDatabaseActions(
        `[MobileDatabase.execute]: message=>${JSON.stringify(
          result,
          null,
          4
        )}<.`,
        "error"
      );
    }

    this.logDatabaseActions("", "", "end");

    return result.values.map((value) =>
      TABLE_NAME_MAPPINGS[hashedTableName].parseEntity(value)
    );
  }

  public async upsert(
    hashedTableName: string,
    entity: TimedEntity,
    excludeCongregationPrefix?: boolean
  ): Promise<TimedEntity> {
    const congregationPrefix = excludeCongregationPrefix
      ? null
      : await this.getCurrentCongregationPrefix();
    const statement = TABLE_NAME_MAPPINGS[hashedTableName].insertQuery([
      {
        ...entity,
        congregationId: congregationPrefix,
      },
    ]);

    await this.executeSet([statement]);

    return entity;
  }

  public async bulkUpsert(
    hashedTableName: string,
    entities: TimedEntity[],
    excludeCongregationPrefix?: boolean
  ): Promise<TimedEntity[]> {
    const congregationPrefix = excludeCongregationPrefix
      ? null
      : await this.getCurrentCongregationPrefix();
    const entitiesWithCongregationId = entities.map((entity) => ({
      ...entity,
      congregationId: congregationPrefix,
    }));
    const set = TABLE_NAME_MAPPINGS[hashedTableName].insertQuery(
      entitiesWithCongregationId
    );

    await this.executeSet([set]);

    return entities;
  }

  public async bulkDelete(
    hashedTableName: string,
    entities: TimedEntity[],
    excludeCongregationPrefix?: boolean
  ): Promise<TimedEntity[]> {
    // TODO so wie bulk upsert
    const statements = [];

    entities.forEach((entity) =>
      statements.push({
        statement: TABLE_NAME_MAPPINGS[hashedTableName].deleteByIdQuery(
          entity.id
        ),
        values: [],
      })
    );

    await this.executeSet(statements);
    return entities;
  }

  public async delete(
    hashedTableName: string,
    entity: TimedEntity,
    excludeCongregationPrefix?: boolean
  ): Promise<TimedEntity> {
    const statement = TABLE_NAME_MAPPINGS[hashedTableName].deleteByIdQuery(
      entity.id
    );
    await this.execute(statement);
    return entity;
  }

  public async clear() {
    const result = await this.execute(`
      DELETE * FROM ${ASSIGNMENT_TABLE_NAME};
      DELETE * FROM ${DRAWING_TABLE_NAME};
      DELETE * FROM ${LAST_DOING_TABLE_NAME};
      DELETE * FROM ${PUBLISHER_TABLE_NAME};
      DELETE * FROM ${TAG_TABLE_NAME};
      DELETE * FROM ${TERRITORY_TABLE_NAME};
      DELETE * FROM ${VISIT_BAN_TABLE_NAME};
    `);
    await this.settingsDatabase.clear();

    return { result: result.changes.changes > -1 };
  }

  public async clearAllWithPrefix(prefix: string) {
    const result = await this.execute(`
      DELETE * FROM ${ASSIGNMENT_TABLE_NAME} WHERE congregationId = '${prefix}:';
      DELETE * FROM ${DRAWING_TABLE_NAME} WHERE congregationId = '${prefix}:';
      DELETE * FROM ${LAST_DOING_TABLE_NAME} WHERE congregationId = '${prefix}:';
      DELETE * FROM ${PUBLISHER_TABLE_NAME} WHERE congregationId = '${prefix}:';
      DELETE * FROM ${TAG_TABLE_NAME} WHERE congregationId = '${prefix}:';
      DELETE * FROM ${TERRITORY_TABLE_NAME} WHERE congregationId = '${prefix}:';
      DELETE * FROM ${VISIT_BAN_TABLE_NAME} WHERE congregationId = '${prefix}:';
    `);

    return prefix;
  }

  private async getCurrentCongregationPrefix(): Promise<string> {
    return await this.store
      .pipe(select(selectCurrentCongregationId), take(1))
      .toPromise();
  }

  public async considerToInitSchemas() {
    await this.execute(`
      ${SQL_CREATE_ASSIGNMENTS}
      ${SQL_CREATE_CONGREGATION}
      ${SQL_CREATE_DRAWING}
      ${SQL_CREATE_LAST_DOING}
      ${SQL_CREATE_PUBLISHER}
      ${SQL_CREATE_TAG}
      ${SQL_CREATE_TERRITORY}
      ${SQL_CREATE_VISIT_BAN}
    `);
  }

  private async execute(statement: string): Promise<capSQLiteChanges> {
    this.logDatabaseActions(
      `[MobileDatabase.execute]: statement=>|${statement}|<`,
      "log",
      "start"
    );
    const database = await this.retrieveConnection();
    const result = await database.execute(statement);

    const hasError = result.changes.changes < 0;
    this.logDatabaseActions(
      `[MobileDatabase.execute]: changes=>|${JSON.stringify(result.changes)}|<`,
      hasError ? "error" : "log"
    );
    this.logDatabaseActions(
      `[MobileDatabase.execute]: message="${JSON.stringify(result, null, 4)}"`,
      hasError ? "error" : "log"
    );
    this.logDatabaseActions("", "", "end");

    return result;
  }

  /*
    https://github.com/capacitor-community/sqlite/issues/82#issuecomment-781116465
   */
  private async executeSet(
    statements: capSQLiteSet[]
  ): Promise<capSQLiteChanges> {
    this.logDatabaseActions(``, "log", "start");
    statements.forEach((s, i) =>
      this.logDatabaseActions(
        `[MobileDatabase.executeSet]: statement(${i})=>|${s.statement}|<`,
        "log"
      )
    );

    const database = await this.retrieveConnection();
    const result = await database.executeSet(statements);

    const hasError = result.changes.changes < 0;
    this.logDatabaseActions(
      `[MobileDatabase.executeSet]: changes=>|${JSON.stringify(
        result.changes
      )}|<`,
      hasError ? "error" : "log"
    );
    this.logDatabaseActions(
      `[MobileDatabase.executeSet]: message="${JSON.stringify(
        result,
        null,
        4
      )}"`,
      hasError ? "error" : "log"
    );
    this.logDatabaseActions("", "", "end");

    return result;
  }

  private logDatabaseActions(
    log: string,
    severity: string,
    grouping?: "start" | "end"
  ) {
    if (!environment.production) {
      if (grouping === "start") {
        console.warn(`\n\n########## DB Group ${severity}:`);
      }

      if (
        severity &&
        console[severity] &&
        typeof console[severity] === "function"
      ) {
        console[severity](log);
      }

      if (grouping === "end") {
        console.warn(`\n\n########## DB Group ${severity} END\n\n.`);
      }
    }
  }
}
