import {utils, WorkBook} from 'xlsx';
import {ExcelToEntityMapper} from "./excel-to-entity-mapper";
import { v4 as uuid4 } from 'uuid';
import {normalizeStreetName, normalizeStreetSuffix} from "./../deprecated/usefull.functions";
import {VisitBan} from "@territory-offline-workspace/shared-interfaces";

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
      const name = this.getValueFrom(rowNum, "name");
      const street = this.getValueFrom(rowNum, "street");
      const streetSuffix = this.getValueFrom(rowNum, "streetSuffix");
      const city = this.getValueFrom(rowNum, "city");
      const comment = this.getValueFrom(rowNum, "comment");
      const latitude = this.getValueFrom(rowNum, "latitude");
      const longitude = this.getValueFrom(rowNum, "longitude");
      const lat = latitude ? parseFloat(latitude["v"]) : null;
      const lng = longitude ? parseFloat(longitude["v"]) : null;

      extractedData.push({
        id: uuid4(),
        name: name ? name["v"] : "",
        street: street ? normalizeStreetName(street["v"]) : "",
        streetSuffix: streetSuffix ? normalizeStreetSuffix(streetSuffix["v"]) : "",
        city: city ? city["v"] : "",
        comment: comment ? comment["v"] : "",
        lastVisit: ExcelToEntityParser.parseXlsxDate(this.getValueFrom(rowNum, "lastVisit")),
        creationTime: ExcelToEntityParser.parseXlsxDate(this.getValueFrom(rowNum, "creationTime")),
        gpsPosition: {lat: lat, lng: lng},
        tags: [],
        territoryId: null
      });
    }
    return extractedData;
  }

  private getValueFrom(rowNum, propertyName: string)
  {
    const columnIndex = this.excelToEntityMapper.getColumnIndexOf(propertyName);
    if(!columnIndex)
    {
      return "";
    }

    const sheet = this.workBook.Sheets[this.excelToEntityMapper.sheetName];
    return sheet[utils.encode_cell({r: rowNum, c: columnIndex})]
  }
}
