import {utils, WorkBook} from 'xlsx';
import {ExcelToEntityMapper} from "./excel-to-entity-mapper";
import * as Turf from "@turf/turf";
import {VisitBan} from "@territory-offline-workspace/api";
import {uuid4} from "@capacitor/core/dist/esm/util";

export class ExcelToEntityParser
{
  constructor(private excelToEntityMapper: ExcelToEntityMapper, private workBook: WorkBook)
  {
  }

  public static parseXlsxDate(data: { t: string, v: number }): Date
  {
    if (data && data.t === "n")
    {
      const serial = data.v;
      const utc_days = Math.floor(serial - 25569);
      const utc_value = utc_days * 86400;
      const date_info = new Date(utc_value * 1000);

      const fractional_day = serial - Math.floor(serial) + 0.0000001;

      let total_seconds = Math.floor(86400 * fractional_day);

      const seconds = total_seconds % 60;

      total_seconds -= seconds;

      const hours = Math.floor(total_seconds / (60 * 60));
      const minutes = Math.floor(total_seconds / 60) % 60;

      return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate(), hours, minutes, seconds);
    }

    return null
  }

  public extractVisitBans(): VisitBan[]
  {
    const sheet = this.workBook.Sheets[this.excelToEntityMapper.sheetName];
    const range = utils.decode_range(sheet["!ref"]);
    const extractedData: VisitBan[] = [];

    for (let rowNum = range.s.r; rowNum <= range.e.r; rowNum++)
    {
      const name = sheet[utils.encode_cell({r: rowNum, c: this.excelToEntityMapper.getColumnIndexOf("name")})];
      const street = sheet[utils.encode_cell({r: rowNum, c: this.excelToEntityMapper.getColumnIndexOf("street")})];
      const streetSuffix = sheet[utils.encode_cell({
        r: rowNum,
        c: this.excelToEntityMapper.getColumnIndexOf("streetSuffix")
      })];
      const city = sheet[utils.encode_cell({r: rowNum, c: this.excelToEntityMapper.getColumnIndexOf("city")})];
      const comment = sheet[utils.encode_cell({r: rowNum, c: this.excelToEntityMapper.getColumnIndexOf("comment")})];
      const latitude = sheet[utils.encode_cell({r: rowNum, c: this.excelToEntityMapper.getColumnIndexOf("latitude")})];
      const longitude = sheet[utils.encode_cell({
        r: rowNum,
        c: this.excelToEntityMapper.getColumnIndexOf("longitude")
      })];

      const lat = latitude ? parseFloat(latitude["v"]) : null;
      const lng = longitude ? parseFloat(longitude["v"]) : null;

      extractedData.push({
        id: uuid4(),
        name: name ? name["v"] : "",
        street: street ? street["v"] : "",
        streetSuffix: streetSuffix ? streetSuffix["v"] : "",
        city: city ? city["v"] : "",
        comment: comment ? comment["v"] : "",
        lastVisit: ExcelToEntityParser.parseXlsxDate(sheet[utils.encode_cell({
          r: rowNum,
          c: this.excelToEntityMapper.getColumnIndexOf("lastVisit")
        })]),
        creationTime: ExcelToEntityParser.parseXlsxDate(sheet[utils.encode_cell({
          r: rowNum,
          c: this.excelToEntityMapper.getColumnIndexOf("creationTime")
        })]),
        gpsPosition: {lat: lat, lng: lng},
        tags: [],
        territoryId: null
      });
    }
    return extractedData;
  }
}
