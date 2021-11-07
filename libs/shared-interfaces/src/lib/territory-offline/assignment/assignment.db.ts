export const ASSIGNMENT_TABLE_NAME = 'assignments';

export const HASHED_ASSIGNMENT_TABLE_NAME = btoa('assignments');

export const SQL_CREATE_ASSIGNMENTS = `
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
  ) VALUES (?,?,?,?,?,?,?,?,?,?,?);
`;

export const SQL_DELETE_ASSIGNMENT = `DELETE FROM ${ASSIGNMENT_TABLE_NAME} WHERE id='{id}';`;
