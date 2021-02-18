import {
  Assignment,
  ASSIGNMENT_TABLE_NAME,
  Congregation,
  CONGREGATION_TABLE_NAME, deserializeDate,
  Drawing,
  DRAWING_TABLE_NAME,
  HASHED_ASSIGNMENT_TABLE_NAME,
  HASHED_CONGREGATION_TABLE_NAME,
  HASHED_DRAWING_TABLE_NAME,
  HASHED_LAST_DOING_TABLE_NAME,
  HASHED_PUBLISHER_TABLE_NAME,
  HASHED_TAG_TABLE_NAME, HASHED_TERRITORY_TABLE_NAME, HASHED_VISIT_BAN_TABLE_NAME,
  LAST_DOING_TABLE_NAME,
  LastDoing,
  Publisher,
  PUBLISHER_TABLE_NAME, serializeArray, serializeBoolean, serializeDate, serializeObject,
  SQL_DELETE_ASSIGNMENT,
  SQL_DELETE_CONGREGATION,
  SQL_DELETE_DRAWING,
  SQL_DELETE_LAST_DOING,
  SQL_DELETE_PUBLISHER, SQL_DELETE_TAG, SQL_DELETE_TERRITORY, SQL_DELETE_VISIT_BAN,
  SQL_INSERT_ASSIGNMENT,
  SQL_INSERT_CONGREGATION,
  SQL_INSERT_DRAWING,
  SQL_INSERT_LAST_DOING,
  SQL_INSERT_PUBLISHER, SQL_INSERT_TAG, SQL_INSERT_TERRITORY, SQL_INSERT_VISIT_BAN,
  Tag, TAG_TABLE_NAME,
  Territory, TERRITORY_TABLE_NAME,
  TimedEntity, VISIT_BAN_TABLE_NAME,
  VisitBan
} from "@territory-offline-workspace/api";
import {capSQLiteSet} from "@capacitor-community/sqlite";

export const TABLE_NAME_MAPPINGS = {
  [HASHED_ASSIGNMENT_TABLE_NAME]: {
    tableName: ASSIGNMENT_TABLE_NAME,
    deleteByIdQuery: (entityId: string): string => SQL_DELETE_ASSIGNMENT.replace("{id}", entityId),
    insertQuery: (entities: TimedEntity[]): capSQLiteSet =>
    {
      return {
        statement: SQL_INSERT_ASSIGNMENT,
        values: entities.map((assignment: Assignment) => ([
          assignment.id,
          assignment.congregationId,
          assignment.prefix || "",
          serializeDate(assignment.creationTime),
          serializeDate(assignment.lastUpdated),
          assignment.publisherId,
          assignment.territoryId,
          serializeDate(assignment.startTime),
          serializeDate(assignment.endTime),
          assignment.statusColor || "",
          assignment.removedPublisherLabel || ""
        ]))
      };
    },
    parseEntity: (assignment: Assignment) =>
    {
      return {
        id: assignment.id,
        congregationId: assignment.congregationId,
        creationTime: deserializeDate(assignment.creationTime as unknown as string),
        lastUpdated: deserializeDate(assignment.lastUpdated as unknown as string),
        publisherId: assignment.publisherId,
        territoryId: assignment.territoryId,
        startTime: deserializeDate(assignment.startTime as unknown as string),
        endTime: deserializeDate(assignment.endTime as unknown as string),
        statusColor: assignment.statusColor,
        removedPublisherLabel: assignment.removedPublisherLabel
      };
    }
  },
  [HASHED_CONGREGATION_TABLE_NAME]: {
    tableName: CONGREGATION_TABLE_NAME,
    deleteByIdQuery: (entityId: string): string => SQL_DELETE_CONGREGATION.replace("{id}", entityId),
    insertQuery: (entities: TimedEntity[]): capSQLiteSet =>
    {
      return {
        statement: SQL_INSERT_CONGREGATION,
        values: entities.map((congregation: Congregation) => ([
          congregation.id,
          congregation.prefix || "",
          serializeDate(congregation.creationTime),
          serializeDate(congregation.lastUpdated),
          congregation.name,
          congregation.languageCode,
          congregation.language,
          congregation.hashedName
        ]))
      };
    },
    parseEntity: (congregation: Congregation) =>
    {
      return {
        id: congregation.id,
        congregationId: congregation.congregationId,
        creationTime: deserializeDate(congregation.creationTime as unknown as string),
        lastUpdated: deserializeDate(congregation.lastUpdated as unknown as string),
        name: congregation.name,
        languageCode: congregation.languageCode,
        language: congregation.language,
        hashedName: congregation.hashedName
      };
    }
  },
  [HASHED_DRAWING_TABLE_NAME]: {
    tableName: DRAWING_TABLE_NAME,
    deleteByIdQuery: (entityId: string): string => SQL_DELETE_DRAWING.replace("{id}", entityId),
    insertQuery: (entities: TimedEntity[]): capSQLiteSet =>
    {
      return {
        statement: SQL_INSERT_DRAWING,
        values: entities.map((drawing: Drawing) => ([
          drawing.id,
          drawing.congregationId,
          drawing.prefix || "",
          serializeDate(drawing.creationTime),
          serializeDate(drawing.lastUpdated),
          serializeObject(drawing.featureCollection),
          serializeObject(drawing.printConfiguration)
        ]))
      };
    },
    parseEntity: (drawing: Drawing) =>
    {
      return {
        id: drawing.id,
        congregationId: drawing.congregationId,
        creationTime: deserializeDate(drawing.creationTime as unknown as string),
        lastUpdated: deserializeDate(drawing.lastUpdated as unknown as string),
        featureCollection: JSON.parse(drawing.featureCollection as unknown as string || "null"),
        printConfiguration: JSON.parse(drawing.printConfiguration as unknown as string || "{}")
      };
    }
  },
  [HASHED_LAST_DOING_TABLE_NAME]: {
    tableName: LAST_DOING_TABLE_NAME,
    deleteByIdQuery: (entityId: string): string => SQL_DELETE_LAST_DOING.replace("{id}", entityId),
    insertQuery: (entities: TimedEntity[]): capSQLiteSet =>
    {
      return {
        statement: SQL_INSERT_LAST_DOING,
        values: entities.map((lastDoing: LastDoing) => ([
          lastDoing.id,
          lastDoing.congregationId,
          lastDoing.prefix || "",
          serializeDate(lastDoing.creationTime),
          serializeDate(lastDoing.lastUpdated),
          lastDoing.action,
          lastDoing.label
        ]))
      };
    },
    parseEntity: (lastDoing: LastDoing) =>
    {
      return {
        id: lastDoing.id,
        congregationId: lastDoing.congregationId,
        creationTime: deserializeDate(lastDoing.creationTime as unknown as string),
        lastUpdated: deserializeDate(lastDoing.lastUpdated as unknown as string),
        action: lastDoing.action,
        label: lastDoing.label
      };
    }
  },
  [HASHED_PUBLISHER_TABLE_NAME]: {
    tableName: PUBLISHER_TABLE_NAME,
    deleteByIdQuery: (entityId: string): string => SQL_DELETE_PUBLISHER.replace("{id}", entityId),
    insertQuery: (entities: TimedEntity[]): capSQLiteSet =>
    {
      return {
        statement: SQL_INSERT_PUBLISHER,
        values: entities.map((publisher: Publisher) => ([
          publisher.id,
          publisher.congregationId,
          publisher.prefix || "",
          serializeDate(publisher.creationTime),
          serializeDate(publisher.lastUpdated),
          publisher.name,
          publisher.firstName,
          publisher.email,
          publisher.phone,
          serializeArray(publisher.tags),
          publisher.dsgvoSignature || "",
          serializeBoolean(publisher.isDeactivated)
        ]))
      };
    },
    parseEntity: (publisher: Publisher) =>
    {
      return {
        id: publisher.id,
        congregationId: publisher.congregationId,
        creationTime: deserializeDate(publisher.creationTime as unknown as string),
        lastUpdated: deserializeDate(publisher.lastUpdated as unknown as string),
        name: publisher.name,
        firstName: publisher.firstName,
        email: publisher.email,
        phone: publisher.phone,
        tags: JSON.parse(publisher.tags as unknown as string || "[]"),
        dsgvoSignature: publisher.dsgvoSignature,
        isDeactivated: JSON.parse(publisher.isDeactivated as unknown as string || "false"),
      };
    }
  },
  [HASHED_TAG_TABLE_NAME]: {
    tableName: TAG_TABLE_NAME,
    deleteByIdQuery: (entityId: string): string => SQL_DELETE_TAG.replace("{id}", entityId),
    insertQuery: (entities: TimedEntity[]): capSQLiteSet =>
    {
      return {
        statement: SQL_INSERT_TAG,
        values: entities.map((tag: Tag) => ([
          tag.id,
          tag.congregationId,
          tag.prefix || "",
          serializeDate(tag.creationTime),
          serializeDate(tag.lastUpdated),
          tag.name,
          tag.color || "",
          tag.symbol || "",
          serializeObject(tag.metaInfos)
        ]))
      };
    },
    parseEntity: (tag: Tag) =>
    {
      return {
        id: tag.id,
        congregationId: tag.congregationId,
        creationTime: deserializeDate(tag.creationTime as unknown as string),
        lastUpdated: deserializeDate(tag.lastUpdated as unknown as string),
        name: tag.name,
        color: tag.color,
        symbol: tag.symbol,
        metaInfos: JSON.parse(tag.metaInfos as unknown as string || "null")
      };
    }
  },
  [HASHED_TERRITORY_TABLE_NAME]: {
    tableName: TERRITORY_TABLE_NAME,
    deleteByIdQuery: (entityId: string): string => SQL_DELETE_TERRITORY.replace("{id}", entityId),
    insertQuery: (entities: TimedEntity[]): capSQLiteSet =>
    {
      return {
        statement: SQL_INSERT_TERRITORY,
        values: entities.map((territory: Territory) => ([
          territory.id,
          territory.congregationId,
          territory.prefix || "",
          serializeDate(territory.creationTime),
          serializeDate(territory.lastUpdated),
          territory.name,
          territory.key,
          territory.populationCount,
          serializeArray(territory.tags),
          territory.territoryDrawingId,
          serializeArray(territory.boundaryNames),
          serializeBoolean(territory.deactivated),
          serializeBoolean(territory.isCreation),
          territory.comment || ""
        ]))
      };
    },
    parseEntity: (territory: Territory) =>
    {
      return {
        id: territory.id,
        congregationId: territory.congregationId,
        creationTime: deserializeDate(territory.creationTime as unknown as string),
        lastUpdated: deserializeDate(territory.lastUpdated as unknown as string),
        name: territory.name,
        key: territory.key,
        populationCount: JSON.parse(territory.populationCount as unknown as string || "0"),
        tags: JSON.parse(territory.tags as unknown as string || "[]"),
        territoryDrawingId: territory.territoryDrawingId,
        boundaryNames: JSON.parse(territory.boundaryNames as unknown as string || "[]"),
        deactivated: JSON.parse(territory.deactivated as unknown as string || "false"),
        isCreation: JSON.parse(territory.isCreation as unknown as string || "false"),
        comment: territory.comment,
      };
    }
  },
  [HASHED_VISIT_BAN_TABLE_NAME]: {
    tableName: VISIT_BAN_TABLE_NAME,
    deleteByIdQuery: (entityId: string): string => SQL_DELETE_VISIT_BAN.replace("{id}", entityId),
    insertQuery: (entities: TimedEntity[]): capSQLiteSet =>
    {
      return {
        statement: SQL_INSERT_VISIT_BAN,
        values: entities.map((visitBan: VisitBan) => ([
          visitBan.id,
          visitBan.congregationId,
          visitBan.prefix || "",
          serializeDate(visitBan.creationTime),
          serializeDate(visitBan.lastUpdated),
          visitBan.name || "",
          visitBan.street,
          visitBan.streetSuffix,
          visitBan.territoryId,
          serializeArray(visitBan.tags),
          visitBan.city || "",
          visitBan.floor || "",
          serializeDate(visitBan.lastVisit),
          visitBan.comment || "",
          serializeObject(visitBan.gpsPosition)
        ]))
      };
    },
    parseEntity: (visitBan: VisitBan) =>
    {
      return {
        id: visitBan.id,
        congregationId: visitBan.congregationId,
        creationTime: deserializeDate(visitBan.creationTime as unknown as string),
        lastUpdated: deserializeDate(visitBan.lastUpdated as unknown as string),
        name: visitBan.name,
        street: visitBan.street,
        streetSuffix: visitBan.streetSuffix,
        territoryId: visitBan.territoryId,
        tags: JSON.parse(visitBan.tags as unknown as string || "[]"),
        city: visitBan.city,
        floor: JSON.parse(visitBan.floor as unknown as string || "null"),
        lastVisit: deserializeDate(visitBan.lastVisit as unknown as string),
        comment: visitBan.comment,
        gpsPosition: JSON.parse(visitBan.gpsPosition as unknown as string || "null")
      };
    }
  },
};
