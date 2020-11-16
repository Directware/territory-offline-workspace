/*
    Create schema for assignments
 */
import {
  Assignment,
  Congregation,
  Drawing,
  LastDoing,
  Publisher,
  Tag, Territory,
  TimedEntity, VisitBan
} from "@territory-offline-workspace/api";

export const ASSIGNMENT_TABLE_NAME = "assignments";
export const HASHED_ASSIGNMENT_TABLE_NAME = btoa("assignments");
export const SQL_CREATE_ASSIGNMENTS = `
  BEGIN TRANSACTION;
  CREATE TABLE IF NOT EXISTS ${ASSIGNMENT_TABLE_NAME} (
    id TEXT PRIMARY KEY NOT NULL,
    congregationId TEXT,
    prefix TEXT,
    creationTime TEXT NOT NULL,
    lastUpdated TEXT,
    publisherId TEXT NOT NULL,
    territoryId TEXT NOT NULL,
    startTime TEXT NOT NULL,
    endTime TEXT,
    statusColor TEXT,
    removedPublisherLabel TEXT
  );
  PRAGMA ${ASSIGNMENT_TABLE_NAME}_version = 1;
  COMMIT TRANSACTION;
`;

export const SQL_INSERT_ASSIGNMENT = `
  INSERT OR REPLACE INTO ${ASSIGNMENT_TABLE_NAME} (
    id,
    congregationId,
    prefix,
    creationTime,
    lastUpdated,
    publisherId,
    territoryId,
    startTime,
    endTime,
    statusColor,
    removedPublisherLabel
  ) VALUES ({id},{congregationId},{prefix},{creationTime},{lastUpdated},{publisherId},{territoryId},{startTime},{endTime},{statusColor},{removedPublisherLabel});
`;

export const SQL_DELETE_ASSIGNMENT = `DELETE FROM ${ASSIGNMENT_TABLE_NAME} WHERE id='{id}';`;

/*
    Create schema for congregation
 */
export const CONGREGATION_TABLE_NAME = "congregations";
export const HASHED_CONGREGATION_TABLE_NAME = btoa("congregations");
export const SQL_CREATE_CONGREGATION = `
  BEGIN TRANSACTION;
  CREATE TABLE IF NOT EXISTS ${CONGREGATION_TABLE_NAME} (
    id TEXT PRIMARY KEY NOT NULL,
    congregationId TEXT,
    prefix TEXT,
    creationTime TEXT NOT NULL,
    lastUpdated TEXT,
    name TEXT NOT NULL,
    languageCode TEXT NOT NULL,
    language TEXT NOT NULL,
    hashedName TEXT NOT NULL
  );
  PRAGMA ${CONGREGATION_TABLE_NAME}_version = 1;
  COMMIT TRANSACTION;
`;
export const SQL_INSERT_CONGREGATION = `
  INSERT OR REPLACE INTO ${CONGREGATION_TABLE_NAME} (
    id,
    congregationId,
    prefix,
    creationTime,
    lastUpdated,
    name,
    languageCode,
    language,
    hashedName
  ) VALUES ({id},{congregationId},{prefix},{creationTime},{lastUpdated},{name},{languageCode},{language},{hashedName});
`;
export const SQL_DELETE_CONGREGATION = `DELETE FROM ${CONGREGATION_TABLE_NAME} WHERE id='{id}';`;

/*
    Create schema for drawings
 */
export const DRAWING_TABLE_NAME = "drawings";
export const HASHED_DRAWING_TABLE_NAME = btoa("drawings");
export const SQL_CREATE_DRAWING = `
  BEGIN TRANSACTION;
  CREATE TABLE IF NOT EXISTS ${DRAWING_TABLE_NAME} (
    id TEXT PRIMARY KEY NOT NULL,
    congregationId TEXT,
    prefix TEXT,
    creationTime TEXT NOT NULL,
    lastUpdated TEXT,
    featureCollection TEXT NOT NULL,
    printConfiguration TEXT
  );
  PRAGMA ${DRAWING_TABLE_NAME}_version = 1;
  COMMIT TRANSACTION;
`;
export const SQL_INSERT_DRAWING = `
  INSERT OR REPLACE INTO ${DRAWING_TABLE_NAME} (
    id,
    congregationId,
    prefix,
    creationTime,
    lastUpdated,
    featureCollection,
    printConfiguration
  ) VALUES ({id},{congregationId},{prefix},{creationTime},{lastUpdated},{featureCollection},{printConfiguration});
`;
export const SQL_DELETE_DRAWING = `DELETE FROM ${DRAWING_TABLE_NAME} WHERE id='{id}';`;

/*
    Create schema for last doings
 */
export const LAST_DOING_TABLE_NAME = "lastDoings";
export const HASHED_LAST_DOING_TABLE_NAME = btoa("lastDoings");
export const SQL_CREATE_LAST_DOING = `
  BEGIN TRANSACTION;
  CREATE TABLE IF NOT EXISTS ${LAST_DOING_TABLE_NAME} (
    id TEXT PRIMARY KEY NOT NULL,
    congregationId TEXT,
    prefix TEXT,
    creationTime TEXT NOT NULL,
    lastUpdated TEXT,
    action TEXT NOT NULL,
    label TEXT NOT NULL
  );
  PRAGMA ${LAST_DOING_TABLE_NAME}_version = 1;
  COMMIT TRANSACTION;
`;

export const SQL_INSERT_LAST_DOING = `
  INSERT OR REPLACE INTO ${LAST_DOING_TABLE_NAME} (
    id,
    congregationId,
    prefix,
    creationTime,
    lastUpdated,
    action,
    label
  ) VALUES ({id},{congregationId},{prefix},{creationTime},{lastUpdated},{action},{label});
`;
export const SQL_DELETE_LAST_DOING = `DELETE FROM ${LAST_DOING_TABLE_NAME} WHERE id='{id}';`;

/*
    Create schema for publishers
 */
export const PUBLISHER_TABLE_NAME = "publishers";
export const HASHED_PUBLISHER_TABLE_NAME = btoa("publishers");
export const SQL_CREATE_PUBLISHER = `
  BEGIN TRANSACTION;
  CREATE TABLE IF NOT EXISTS ${PUBLISHER_TABLE_NAME} (
    id TEXT PRIMARY KEY NOT NULL,
    congregationId TEXT,
    prefix TEXT,
    creationTime TEXT NOT NULL,
    lastUpdated TEXT,
    name TEXT NOT NULL,
    firstName TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    tags TEXT,
    dsgvoSignature TEXT,
    isDeactivated TEXT
  );
  PRAGMA ${PUBLISHER_TABLE_NAME}_version = 1;
  COMMIT TRANSACTION;
`;

export const SQL_INSERT_PUBLISHER = `
  INSERT OR REPLACE INTO ${PUBLISHER_TABLE_NAME} (
    id,
    congregationId,
    prefix,
    creationTime,
    lastUpdated,
    name,
    firstName,
    email,
    phone,
    tags,
    dsgvoSignature,
    isDeactivated
  ) VALUES ({id},{congregationId},{prefix},{creationTime},{lastUpdated},{name},{firstName},{email},{phone},{tags},{dsgvoSignature},{isDeactivated});
`;
export const SQL_DELETE_PUBLISHER = `DELETE FROM ${PUBLISHER_TABLE_NAME} WHERE id='{id}';`;

/*
    Create schema for tags
 */
export const TAG_TABLE_NAME = "tags";
export const HASHED_TAG_TABLE_NAME = btoa("tags");
export const SQL_CREATE_TAG = `
  BEGIN TRANSACTION;
  CREATE TABLE IF NOT EXISTS ${TAG_TABLE_NAME} (
    id TEXT PRIMARY KEY NOT NULL,
    congregationId TEXT,
    prefix TEXT,
    creationTime TEXT NOT NULL,
    lastUpdated TEXT,
    name TEXT NOT NULL,
    color TEXT NOT NULL,
    symbol TEXT,
    metaInfos TEXT
  );
  PRAGMA ${TAG_TABLE_NAME}_version = 1;
  COMMIT TRANSACTION;
`;

export const SQL_INSERT_TAG = `
  INSERT OR REPLACE INTO ${TAG_TABLE_NAME} (
    id,
    congregationId,
    prefix,
    creationTime,
    lastUpdated,
    name,
    color,
    symbol,
    metaInfos
  ) VALUES ({id},{congregationId},{prefix},{creationTime},{lastUpdated},{name},{color},{symbol},{metaInfos});
`;
export const SQL_DELETE_TAG = `DELETE FROM ${TAG_TABLE_NAME} WHERE id='{id}';`;

/*
    Create schema for territories
 */
export const TERRITORY_TABLE_NAME = "territories";
export const HASHED_TERRITORY_TABLE_NAME = btoa("territories");
export const SQL_CREATE_TERRITORY = `
  BEGIN TRANSACTION;
  CREATE TABLE IF NOT EXISTS ${TERRITORY_TABLE_NAME} (
    id TEXT PRIMARY KEY NOT NULL,
    congregationId TEXT,
    prefix TEXT,
    creationTime TEXT NOT NULL,
    lastUpdated TEXT,
    name TEXT NOT NULL,
    key TEXT NOT NULL,
    populationCount TEXT,
    tags TEXT,
    territoryDrawingId TEXT NOT NULL,
    boundaryNames TEXT,
    deactivated TEXT,
    isCreation TEXT,
    comment TEXT
  );
  PRAGMA ${TERRITORY_TABLE_NAME}_version = 1;
  COMMIT TRANSACTION;
`;
export const SQL_INSERT_TERRITORY = `
  INSERT OR REPLACE INTO ${TERRITORY_TABLE_NAME} (
    id,
    congregationId,
    prefix,
    creationTime,
    lastUpdated,
    name,
    key,
    populationCount,
    tags,
    territoryDrawingId,
    boundaryNames,
    deactivated,
    isCreation,
    comment
  ) VALUES ({id},{congregationId},{prefix},{creationTime},{lastUpdated},{name},{key},{populationCount},{tags},{territoryDrawingId},{boundaryNames},{deactivated},{isCreation},{comment});
`;
export const SQL_DELETE_TERRITORY = `DELETE FROM ${TERRITORY_TABLE_NAME} WHERE id='{id}';`;

/*
    Create schema for visit bans
 */
export const VISIT_BAN_TABLE_NAME = "visitBans";
export const HASHED_VISIT_BAN_TABLE_NAME = btoa("visitBans");
export const SQL_CREATE_VISIT_BAN = `
  BEGIN TRANSACTION;
  CREATE TABLE IF NOT EXISTS ${VISIT_BAN_TABLE_NAME} (
    id TEXT PRIMARY KEY NOT NULL,
    congregationId TEXT,
    prefix TEXT,
    creationTime TEXT NOT NULL,
    lastUpdated TEXT,
    name TEXT,
    street TEXT,
    streetSuffix TEXT,
    territoryId TEXT NOT NULL,
    tags TEXT,
    city TEXT,
    floor TEXT,
    lastVisit TEXT,
    comment TEXT,
    gpsPosition TEXT
  );
  PRAGMA ${VISIT_BAN_TABLE_NAME}_version = 1;
  COMMIT TRANSACTION;
`;
export const SQL_INSERT_VISIT_BAN = `
  INSERT OR REPLACE INTO ${VISIT_BAN_TABLE_NAME} (
    id,
    congregationId,
    prefix,
    creationTime,
    lastUpdated,
    name,
    street,
    streetSuffix,
    territoryId,
    tags,
    city,
    floor,
    lastVisit,
    comment,
    gpsPosition
  ) VALUES ({id},{congregationId},{prefix},{creationTime},{lastUpdated},{name},{street},{streetSuffix},{territoryId},{tags},{city},{floor},{lastVisit},{comment},{gpsPosition});
`;
export const SQL_DELETE_VISIT_BAN = `DELETE FROM ${VISIT_BAN_TABLE_NAME} WHERE id='{id}';`;
/*
  Table names mappings
 */

export const TABLE_NAME_MAPPINGS = {
  [HASHED_ASSIGNMENT_TABLE_NAME]: {
    tableName: ASSIGNMENT_TABLE_NAME,
    deleteByIdQuery: (entityId: string): string => SQL_DELETE_ASSIGNMENT.replace("{id}", entityId),
    insertQuery: (entity: TimedEntity): string =>
    {
      const assignment = entity as Assignment;
      return SQL_INSERT_ASSIGNMENT
        .replace("{id}", '"' + entity.id + '"')
        .replace("{congregationId}", '"' + entity.congregationId + '"')
        .replace("{prefix}", '"' + assignment.prefix + '"')
        .replace("{creationTime}", '"' + assignment.creationTime?.toISOString() + '"')
        .replace("{lastUpdated}", '"' + assignment.lastUpdated?.toISOString() + '"')
        .replace("{publisherId}", '"' + assignment.publisherId + '"')
        .replace("{territoryId}", '"' + assignment.territoryId + '"')
        .replace("{startTime}", '"' + assignment.startTime?.toISOString() + '"')
        .replace("{endTime}", '"' + assignment.endTime?.toISOString() + '"')
        .replace("{statusColor}", '"' + assignment.statusColor + '"')
        .replace("{removedPublisherLabel}", '"' + assignment.removedPublisherLabel + '"');
    },
    parseEntity: (entity: TimedEntity) =>
    {
      const assignment = entity as any;
      return {
        ...assignment,
        congregationId: undefined,
        creationTime: parseDateIfPossible(assignment.creationTime),
        lastUpdated: parseDateIfPossible(assignment.lastUpdated),
        startTime: parseDateIfPossible(assignment.startTime),
        endTime: parseDateIfPossible(assignment.endTime)
      };
    }
  },
  [HASHED_CONGREGATION_TABLE_NAME]: {
    tableName: CONGREGATION_TABLE_NAME,
    deleteByIdQuery: (entityId: string): string => SQL_DELETE_CONGREGATION.replace("{id}", entityId),
    insertQuery: (entity: TimedEntity): string =>
    {
      const congregation = entity as Congregation;
      return SQL_INSERT_CONGREGATION
        .replace("{id}", '"' + entity.id + '"')
        .replace("{congregationId}", '"' + entity.congregationId + '"')
        .replace("{prefix}", '"' + congregation.prefix + '"')
        .replace("{creationTime}", '"' + congregation.creationTime?.toISOString() + '"')
        .replace("{lastUpdated}", '"' + congregation.lastUpdated?.toISOString() + '"')
        .replace("{name}", '"' + congregation.name + '"')
        .replace("{languageCode}", '"' + congregation.languageCode + '"')
        .replace("{language}", '"' + congregation.language + '"')
        .replace("{hashedName}", '"' + congregation.hashedName + '"');
    },
    parseEntity: (entity: TimedEntity) =>
    {
      const congregation = entity as any;
      return {
        ...congregation,
        congregationId: undefined,
        creationTime: parseDateIfPossible(congregation.creationTime),
        lastUpdated: parseDateIfPossible(congregation.lastUpdated)
      };
    }
  },
  [HASHED_DRAWING_TABLE_NAME]: {
    tableName: DRAWING_TABLE_NAME,
    deleteByIdQuery: (entityId: string): string => SQL_DELETE_DRAWING.replace("{id}", entityId),
    insertQuery: (entity: TimedEntity): string =>
    {
      const drawing = entity as Drawing;
      return SQL_INSERT_DRAWING
        .replace("{id}", '"' + entity.id + '"')
        .replace("{congregationId}", '"' + entity.congregationId + '"')
        .replace("{prefix}", '"' + drawing.prefix + '"')
        .replace("{creationTime}", '"' + drawing.creationTime?.toISOString() + '"')
        .replace("{lastUpdated}", '"' + drawing.lastUpdated?.toISOString() + '"')
        .replace("{featureCollection}", "'" + JSON.stringify(drawing.featureCollection) + "'")
        .replace("{printConfiguration}", "'" + JSON.stringify(drawing.printConfiguration) + "'");
    },
    parseEntity: (entity: TimedEntity) =>
    {
      const drawing = entity as any;
      return {
        ...drawing,
        congregationId: undefined,
        creationTime: parseDateIfPossible(drawing.creationTime),
        lastUpdated: parseDateIfPossible(drawing.lastUpdated),
        featureCollection: parseJsonIfPossible(drawing.featureCollection),
        printConfiguration: parseJsonIfPossible(drawing.printConfiguration)
      };
    }
  },
  [HASHED_LAST_DOING_TABLE_NAME]: {
    tableName: LAST_DOING_TABLE_NAME,
    deleteByIdQuery: (entityId: string): string => SQL_DELETE_LAST_DOING.replace("{id}", entityId),
    insertQuery: (entity: TimedEntity): string =>
    {
      const lastDoing = entity as LastDoing;
      return SQL_INSERT_LAST_DOING
        .replace("{id}", '"' + entity.id + '"')
        .replace("{congregationId}", '"' + entity.congregationId + '"')
        .replace("{prefix}", '"' + lastDoing.prefix + '"')
        .replace("{creationTime}", '"' + lastDoing.creationTime?.toISOString() + '"')
        .replace("{lastUpdated}", '"' + lastDoing.lastUpdated?.toISOString() + '"')
        .replace("{action}", '"' + lastDoing.action + '"')
        .replace("{label}", '"' + lastDoing.label + '"');
    },
    parseEntity: (entity: TimedEntity) =>
    {
      const lastDoing = entity as any;
      return {
        ...lastDoing,
        congregationId: undefined,
        creationTime: parseDateIfPossible(lastDoing.creationTime),
        lastUpdated: parseDateIfPossible(lastDoing.lastUpdated)
      };
    }
  },
  [HASHED_PUBLISHER_TABLE_NAME]: {
    tableName: PUBLISHER_TABLE_NAME,
    deleteByIdQuery: (entityId: string): string => SQL_DELETE_PUBLISHER.replace("{id}", entityId),
    insertQuery: (entity: TimedEntity): string =>
    {
      const publisher = entity as Publisher;
      return SQL_INSERT_PUBLISHER
        .replace("{id}", '"' + entity.id + '"')
        .replace("{congregationId}", '"' + entity.congregationId + '"')
        .replace("{prefix}", '"' + publisher.prefix + '"')
        .replace("{creationTime}", '"' + publisher.creationTime?.toISOString() + '"')
        .replace("{lastUpdated}", '"' + publisher.lastUpdated?.toISOString() + '"')
        .replace("{name}", '"' + publisher.name + '"')
        .replace("{firstName}", '"' + publisher.firstName + '"')
        .replace("{email}", '"' + publisher.email + '"')
        .replace("{phone}", '"' + publisher.phone + '"')
        .replace("{tags}", "'" + JSON.stringify(publisher.tags) + "'")
        .replace("{dsgvoSignature}", '"' + publisher.dsgvoSignature + '"')
        .replace("{isDeactivated}", "'" + JSON.stringify(!!publisher.isDeactivated) + "'");
    },
    parseEntity: (entity: TimedEntity) =>
    {
      const publisher = entity as any;
      return {
        ...publisher,
        congregationId: undefined,
        creationTime: parseDateIfPossible(publisher.creationTime),
        lastUpdated: parseDateIfPossible(publisher.lastUpdated),
        tags: parseJsonIfPossible(publisher.tags),
        isDeactivated: parseJsonIfPossible(publisher.isDeactivated)
      };
    }
  },
  [HASHED_TAG_TABLE_NAME]: {
    tableName: TAG_TABLE_NAME,
    deleteByIdQuery: (entityId: string): string => SQL_DELETE_TAG.replace("{id}", entityId),
    insertQuery: (entity: TimedEntity): string =>
    {
      const tag = entity as Tag;
      return SQL_INSERT_TAG
        .replace("{id}", '"' + entity.id + '"')
        .replace("{congregationId}", '"' + entity.congregationId + '"')
        .replace("{prefix}", '"' + tag.prefix + '"')
        .replace("{creationTime}", '"' + tag.creationTime?.toISOString() + '"')
        .replace("{lastUpdated}", '"' + tag.lastUpdated?.toISOString() + '"')
        .replace("{name}", '"' + tag.name + '"')
        .replace("{color}", '"' + tag.color + '"')
        .replace("{symbol}", '"' + tag.symbol + '"')
        .replace("{metaInfos}", '"' + JSON.stringify(tag.metaInfos) + '"');
    },
    parseEntity: (entity: TimedEntity) =>
    {
      const tag = entity as any;
      return {
        ...tag,
        congregationId: undefined,
        creationTime: parseDateIfPossible(tag.creationTime),
        lastUpdated: parseDateIfPossible(tag.lastUpdated),
        metaInfos: parseJsonIfPossible(tag.metaInfos)
      };
    }
  },
  [HASHED_TERRITORY_TABLE_NAME]: {
    tableName: TERRITORY_TABLE_NAME,
    deleteByIdQuery: (entityId: string): string => SQL_DELETE_TERRITORY.replace("{id}", entityId),
    insertQuery: (entity: TimedEntity): string =>
    {
      const territory = entity as Territory;
      return SQL_INSERT_TERRITORY
        .replace("{id}", '"' + entity.id + '"')
        .replace("{congregationId}", '"' + entity.congregationId + '"')
        .replace("{prefix}", '"' + territory.prefix + '"')
        .replace("{creationTime}", '"' + territory.creationTime?.toISOString() + '"')
        .replace("{lastUpdated}", '"' + territory.lastUpdated?.toISOString() + '"')
        .replace("{name}", '"' + territory.name + '"')
        .replace("{key}", '"' + territory.key + '"')
        .replace("{populationCount}", '"' + territory.populationCount + '"')
        .replace("{tags}", "'" + JSON.stringify(territory.tags) + "'")
        .replace("{territoryDrawingId}", '"' + territory.territoryDrawingId + '"')
        .replace("{boundaryNames}", "'" + JSON.stringify(territory.boundaryNames) + "'")
        .replace("{deactivated}", '"' + territory.deactivated + '"')
        .replace("{isCreation}", '"' + territory.isCreation + '"')
        .replace("{comment}", '"' + territory.comment + '"');
    },
    parseEntity: (entity: TimedEntity) =>
    {
      const territory = entity as any;
      return {
        ...territory,
        congregationId: undefined,
        deactivated: parseJsonIfPossible(territory.deactivated),
        populationCount: parseInt(territory.populationCount, 10),
        creationTime: parseDateIfPossible(territory.creationTime),
        lastUpdated: parseDateIfPossible(territory.lastUpdated),
        tags: parseJsonIfPossible(territory.tags),
        boundaryNames: parseJsonIfPossible(territory.boundaryNames)
      };
    }
  },
  [HASHED_VISIT_BAN_TABLE_NAME]: {
    tableName: VISIT_BAN_TABLE_NAME,
    deleteByIdQuery: (entityId: string): string => SQL_DELETE_VISIT_BAN.replace("{id}", entityId),
    insertQuery: (entity: TimedEntity): string =>
    {
      const visitBan = entity as VisitBan;
      return SQL_INSERT_VISIT_BAN
        .replace("{id}", '"' + entity.id + '"')
        .replace("{congregationId}", '"' + entity.congregationId + '"')
        .replace("{prefix}", '"' + visitBan.prefix + '"')
        .replace("{creationTime}", '"' + visitBan.creationTime?.toISOString() + '"')
        .replace("{lastUpdated}", '"' + visitBan.lastUpdated?.toISOString() + '"')
        .replace("{name}", '"' + visitBan.name + '"')
        .replace("{street}", '"' + visitBan.street + '"')
        .replace("{streetSuffix}", '"' + visitBan.streetSuffix + '"')
        .replace("{territoryId}", '"' + visitBan.territoryId + '"')
        .replace("{tags}", "'" + JSON.stringify(visitBan.tags) + "'")
        .replace("{city}", '"' + visitBan.city + '"')
        .replace("{floor}", '"' + visitBan.floor + '"')
        .replace("{lastVisit}", '"' + visitBan.lastVisit?.toISOString() + '"')
        .replace("{comment}", '"' + visitBan.comment + '"')
        .replace("{gpsPosition}", "'" + JSON.stringify(visitBan.gpsPosition) + "'");
    },
    parseEntity: (entity: TimedEntity) =>
    {
      const territory = entity as any;
      return {
        ...territory,
        congregationId: undefined,
        floor: parseInt(territory.floor, 10) || null,
        creationTime: parseDateIfPossible(territory.creationTime),
        lastUpdated: parseDateIfPossible(territory.lastUpdated),
        tags: parseJsonIfPossible(territory.tags),
        lastVisit: parseDateIfPossible(territory.lastVisit),
        gpsPosition: parseJsonIfPossible(territory.boundaryNames)
      };
    }
  },
};

function parseJsonIfPossible(stringifyProperty: string)
{
  if (!stringifyProperty || stringifyProperty === "undefined" || stringifyProperty === "null")
  {
    return undefined;
  }

  try
  {
    return JSON.parse(stringifyProperty);
  }
  catch (e)
  {
    console.log("[parseJsonIfPossible]", e);
    return undefined;
  }
}

function parseDateIfPossible(stringifyDate: string)
{
  if (!stringifyDate || stringifyDate === "undefined" || stringifyDate === "null")
  {
    return undefined;
  }

  try
  {
    return new Date(stringifyDate)
  }
  catch (e)
  {
    console.log("[parseDateIfPossible]", e);
    return undefined;
  }
}
