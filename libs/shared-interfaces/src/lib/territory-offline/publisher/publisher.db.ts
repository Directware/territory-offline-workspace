export const PUBLISHER_TABLE_NAME = 'publishers';
export const HASHED_PUBLISHER_TABLE_NAME = btoa('publishers');
export const SQL_CREATE_PUBLISHER = `
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
  ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?);
`;
export const SQL_DELETE_PUBLISHER = `DELETE FROM ${PUBLISHER_TABLE_NAME} WHERE id='{id}';`;
