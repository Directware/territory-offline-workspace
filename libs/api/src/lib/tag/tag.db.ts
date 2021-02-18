export const TAG_TABLE_NAME = "tags";
export const HASHED_TAG_TABLE_NAME = btoa("tags");
export const SQL_CREATE_TAG = `
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
  ) VALUES (?,?,?,?,?,?,?,?,?);
`;
export const SQL_DELETE_TAG = `DELETE FROM ${TAG_TABLE_NAME} WHERE id='{id}';`;
