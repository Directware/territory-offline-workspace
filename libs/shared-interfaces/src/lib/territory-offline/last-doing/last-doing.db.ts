export const LAST_DOING_TABLE_NAME = 'lastDoings';
export const HASHED_LAST_DOING_TABLE_NAME = btoa('lastDoings');
export const SQL_CREATE_LAST_DOING = `
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
  ) VALUES (?,?,?,?,?,?,?);
`;
export const SQL_DELETE_LAST_DOING = `DELETE FROM ${LAST_DOING_TABLE_NAME} WHERE id='{id}';`;
