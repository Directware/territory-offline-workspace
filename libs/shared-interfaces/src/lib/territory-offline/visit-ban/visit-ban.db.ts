export const VISIT_BAN_TABLE_NAME = 'visitBans';
export const HASHED_VISIT_BAN_TABLE_NAME = btoa('visitBans');
export const SQL_CREATE_VISIT_BAN = `
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
  ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);
`;
export const SQL_DELETE_VISIT_BAN = `DELETE FROM ${VISIT_BAN_TABLE_NAME} WHERE id='{id}';`;
