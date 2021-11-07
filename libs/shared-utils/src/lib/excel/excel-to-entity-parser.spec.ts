import { ExcelToEntityParser } from './excel-to-entity-parser';

describe('Test suite for ExcelToEntityParser', () => {
  it('should parse xlsx date', () => {
    expect(ExcelToEntityParser.parseXlsxDate({ t: '', v: 4 })).toBe(null);
    expect(ExcelToEntityParser.parseXlsxDate({ t: 'n', v: 4000 })).toBeInstanceOf(Date);
    expect(ExcelToEntityParser.parseXlsxDate({ t: 'n', v: 43519 })).toMatchObject(
      new Date(2019, 1, 23)
    );
  });
});
