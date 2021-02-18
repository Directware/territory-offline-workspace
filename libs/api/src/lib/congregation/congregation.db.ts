export const CONGREGATION_TABLE_NAME = "congregations";
export const HASHED_CONGREGATION_TABLE_NAME = btoa("congregations");
export const SQL_CREATE_CONGREGATION = `
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
`;
export const SQL_INSERT_CONGREGATION = `
  INSERT OR REPLACE INTO ${CONGREGATION_TABLE_NAME} (
    id,
    prefix,
    creationTime,
    lastUpdated,
    name,
    languageCode,
    language,
    hashedName
  ) VALUES (?,?,?,?,?,?,?,?);
`;
export const SQL_DELETE_CONGREGATION = `DELETE FROM ${CONGREGATION_TABLE_NAME} WHERE id='{id}';`;
