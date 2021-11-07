import { ExcelColumn } from './excel-column';

export class ExcelToEntityMapper {
  private readonly _sheetName: string;
  private readonly _entityProperties: Map<string, ExcelColumn>;

  constructor(sheetName: string) {
    this._entityProperties = new Map<string, ExcelColumn>();
    this._sheetName = sheetName;
  }

  public get sheetName(): string {
    return this._sheetName;
  }

  public setValueOf(propertyName: string, column: ExcelColumn) {
    this._entityProperties.set(propertyName, column);
  }

  public hasValue(propertyName: string): boolean {
    return this._entityProperties.has(propertyName);
  }

  public getColumnOf(propertyName: string): ExcelColumn {
    return this._entityProperties.get(propertyName);
  }

  public getColumnValueOf(propertyName: string): any {
    const column = this._entityProperties.get(propertyName);
    return column ? column.value : null;
  }

  public getColumnIndexOf(propertyName: string): any {
    const column = this._entityProperties.get(propertyName);
    return column ? column.index : null;
  }

  public isValueAlreadyInUse(column: ExcelColumn): boolean {
    return (
      Array.from(this._entityProperties.values()).filter((col) => col.value === column.value)
        .length > 0
    );
  }
}
