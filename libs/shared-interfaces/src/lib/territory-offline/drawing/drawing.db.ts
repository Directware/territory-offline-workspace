export const DRAWING_TABLE_NAME = 'drawings';
export const HASHED_DRAWING_TABLE_NAME = btoa('drawings');
export const SQL_CREATE_DRAWING = `
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
  ) VALUES (?,?,?,?,?,?,?);
`;
export const SQL_DELETE_DRAWING = `DELETE FROM ${DRAWING_TABLE_NAME} WHERE id='{id}';`;
