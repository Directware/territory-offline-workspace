export const TERRITORY_TABLE_NAME = 'territories';
export const HASHED_TERRITORY_TABLE_NAME = btoa('territories');
export const SQL_CREATE_TERRITORY = `
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
  ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?);
`;
export const SQL_DELETE_TERRITORY = `DELETE FROM ${TERRITORY_TABLE_NAME} WHERE id='{id}';`;
