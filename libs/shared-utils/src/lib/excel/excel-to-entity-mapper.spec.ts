import { ExcelToEntityMapper } from './excel-to-entity-mapper';

describe('ExcelToEntityMapper', () => {
  let excelToEntityMapper: ExcelToEntityMapper;
  let addedColumn = { label: 'column1', value: 'value1', index: 2 };
  let notAddedColumn = { label: 'not added', value: 'some value', index: 42 };

  beforeEach(() => {
    excelToEntityMapper = new ExcelToEntityMapper('sheet-name');
  });

  it('should create entity mapper with sheet name', () => {
    expect(excelToEntityMapper).not.toBe(null);
    expect(excelToEntityMapper.sheetName).toBe('sheet-name');
  });

  it('should set value for specific property', () => {
    const propertyName = 'testPropertyName';
    excelToEntityMapper.setValueOf(propertyName, addedColumn);

    expect(excelToEntityMapper.hasValue(propertyName)).toBe(true);
    expect(excelToEntityMapper.getColumnIndexOf(propertyName)).toBe(addedColumn.index);
    expect(excelToEntityMapper.getColumnOf(propertyName)).toMatchObject(addedColumn);
    expect(excelToEntityMapper.getColumnValueOf(propertyName)).toBe(addedColumn.value);
    expect(excelToEntityMapper.isValueAlreadyInUse(addedColumn)).toBe(true);
    expect(excelToEntityMapper.isValueAlreadyInUse(notAddedColumn)).toBe(false);
  });
});
