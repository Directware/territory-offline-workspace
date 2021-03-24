import {Injectable} from '@angular/core';
import * as XLSX from 'xlsx';
import {select, Store} from "@ngrx/store";
import {take, tap} from "rxjs/operators";
import {ApplicationState} from "../store/index.reducers";
import {Plugins} from "@capacitor/core";
import {selectAllDailyReports} from "../store/reports/daily-reports.selectors";
import {DailyReport} from "@territory-offline-workspace/shared-interfaces";
import {TranslateService} from "@ngx-translate/core";

@Injectable({
  providedIn: 'root'
})
export class ExcelDataExportService
{
  constructor(private store: Store<ApplicationState>,
              private translateService: TranslateService)
  {
  }

  public exportReports()
  {
    this.store.pipe(
      select(selectAllDailyReports),
      take(1),
      tap((reports: DailyReport[]) =>
      {
        const wb = this.craeteWorkBook(this.translateService.instant("service.report"));
        const relevantYears = {};

        reports.forEach(r => relevantYears[r.creationTime.getFullYear()] = r.creationTime.getFullYear())

        Object.values(relevantYears)
          .sort((y1, y2) => y1 > y2 ? 1 : -1)
          .forEach(year =>
          {
            wb.SheetNames.push(`${year}`);
            const tmp = [[
              this.translateService.instant("service.day"),
              this.translateService.instant("service.videos"),
              this.translateService.instant("service.returnVisits"),
              this.translateService.instant("service.deliveries"),
              this.translateService.instant("service.studies"),
              this.translateService.instant("service.minutes"),
              this.translateService.instant("service.duration")
            ]];

            reports.filter(r => r.creationTime.getFullYear() === year)
              .forEach((p, index) => tmp[index + 1] = [
                `${p.creationTime.toLocaleString()}`,
                `${p.videos}`,
                `${p.returnVisits}`,
                `${p.deliveries}`,
                `${p.studies}`,
                `${p.duration}`,
                `${this.timeConvert(p.duration)}`,
                ]
              );
            const ws = XLSX.utils.aoa_to_sheet(tmp);

            wb.Sheets[`${year}`] = ws;
          });

        this.saveWorkBook(wb, this.translateService.instant("service.report"));
      })
    ).subscribe();
  }

  private craeteWorkBook(subject: string)
  {
    const wb = XLSX.utils.book_new();
    wb.Props = {
      Title: "Field Companion",
      Subject: subject,
      Author: "to",
      CreatedDate: new Date()
    };

    return wb;
  }

  private async saveWorkBook(workBook: any, fileName: string)
  {
    const today = new Date();
    const wbout = XLSX.write(workBook, {bookType: 'xlsx', type: 'binary'});
    await this.save(wbout, `${fileName} - ${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}.xlsx`);
  }

  private async save(file: any, fileName: string)
  {
    await Plugins.FileSharer.share({
      filename: fileName,
      base64Data: btoa(file),
      contentType: "text/plain;charset=utf-8",
      android: {
        chooserTitle: "Field Companion excel export"
      }
    }).catch(error => console.error("File sharing failed", error.message));
  }

  private timeConvert(n)
  {
    const num = n;
    const hours = (num / 60);
    const rhours = Math.floor(hours);
    const minutes = (hours - rhours) * 60;
    const rminutes = Math.round(minutes);
    return rhours + "h " + rminutes + "m";
  }
}
