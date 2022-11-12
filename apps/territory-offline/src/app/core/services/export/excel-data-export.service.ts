import { Injectable } from "@angular/core";
import { select, Store } from "@ngrx/store";
import { TranslateService } from "@ngx-translate/core";
import {
  Assignment,
  VisitBan,
} from "@territory-offline-workspace/shared-interfaces";
import * as moment from "moment";
import { first, map, take, tap } from "rxjs/operators";
import * as XLSX from "xlsx";
import {
  selectAssignmentsByTerritoryId,
  selectCurrentlyOpenAssignments,
  selectLastEndedAssignmentOfEachTerritory,
} from "../../store/assignments/assignments.selectors";
import { ApplicationState } from "../../store/index.reducers";
import { selectPublishers } from "../../store/publishers/publishers.selectors";
import { selectSettings } from "../../store/settings/settings.selectors";
import { selectAllTerritories } from "../../store/territories/territories.selectors";
import { selectAllVisitBans } from "../../store/visit-bans/visit-bans.selectors";
import { PlatformAgnosticActionsService } from "../common/platform-agnostic-actions.service";

@Injectable({
  providedIn: "root",
})
export class ExcelDataExportService {
  constructor(
    private store: Store<ApplicationState>,
    private platformAgnosticActionsService: PlatformAgnosticActionsService,
    private translate: TranslateService
  ) {}

  public exportPublishers() {
    this.translate
      .get([
        "transfer.export.publisher",
        "transfer.export.firstName",
        "transfer.export.lastName",
        "transfer.export.mail",
        "transfer.export.phone",
      ])
      .pipe(take(1))
      .subscribe((translations: { [key: string]: string }) =>
        this.store
          .pipe(
            select(selectPublishers),
            take(1),
            tap((publishers) => {
              const wb = this.craeteWorkBook(
                translations["transfer.export.publisher"]
              );
              wb.SheetNames.push(translations["transfer.export.publisher"]);

              const tmp = [
                [
                  translations["transfer.export.firstName"],
                  translations["transfer.export.lastName"],
                  translations["transfer.export.mail"],
                  translations["transfer.export.phone"],
                ],
              ];
              publishers.forEach(
                (p, index) =>
                  (tmp[index + 1] = [
                    p.firstName,
                    p.name,
                    p.email || "-",
                    p.phone || "-",
                  ])
              );
              const ws = XLSX.utils.aoa_to_sheet(tmp);
              wb.Sheets[translations["transfer.export.publisher"]] = ws;
              this.saveWorkBook(wb, translations["transfer.export.publisher"]);
            })
          )
          .subscribe()
      );
  }

  public async exportTerritories() {
    const translations = this.translate.instant([
      "transfer.export.territories",
      "transfer.export.number",
      "transfer.export.name",
      "transfer.export.mail",
      "transfer.export.phone",
      "transfer.export.populationCount",
      "transfer.export.lastReturnDate",
      "transfer.export.lastPublisher",
      "transfer.export.currentlyAssignedSince",
      "transfer.export.currentPublisher",
    ]);

    const territories = await this.store
      .pipe(select(selectAllTerritories), first())
      .toPromise();

    const lastEndedAssignments = await this.store
      .pipe(select(selectLastEndedAssignmentOfEachTerritory), first())
      .toPromise();

    const lastEndedAssignmentsByTerritoryId = lastEndedAssignments.reduce(
      (all, a) => ({ ...all, [a.territoryId]: a }),
      {}
    );

    const openAssignments = await this.store
      .pipe(select(selectCurrentlyOpenAssignments), first())
      .toPromise();

    const openAssignmentsByTerritoryId = openAssignments.reduce(
      (all, a) => ({ ...all, [a.territoryId]: a }),
      {}
    );

    const publishers = await this.store
      .pipe(select(selectPublishers), first())
      .toPromise();

    const publisherMap = publishers.reduce(
      (all, pub) => ({ ...all, [pub.id]: pub }),
      {}
    );

    const sheetColumns = [];

    const sheetColumnNames = [
      translations["transfer.export.number"],
      translations["transfer.export.name"],
      translations["transfer.export.populationCount"],
      translations["transfer.export.lastReturnDate"],
      translations["transfer.export.lastPublisher"],
      translations["transfer.export.currentlyAssignedSince"],
      translations["transfer.export.currentPublisher"],
    ];

    // Create excel structure
    sheetColumns.push(sheetColumnNames);

    territories.forEach((t, index) => {
      const lastPublisher = lastEndedAssignmentsByTerritoryId[t.id].endTime
        ? publisherMap[lastEndedAssignmentsByTerritoryId[t.id].publisherId]
        : null;

      const currentPublisher =
        publisherMap[openAssignmentsByTerritoryId[t.id]?.publisherId];

      sheetColumns[index + 1] = [
        t.key,
        t.name,
        t.populationCount,
        lastEndedAssignmentsByTerritoryId[t.id].endTime || "-", // z.B. neue Gebiete sind aktuell zugeteilt aber haben noch keine früheren Einträge
        lastPublisher
          ? `${lastPublisher.name} ${lastPublisher.firstName}`
          : "-",
        openAssignmentsByTerritoryId[t.id]?.startTime || "-",
        currentPublisher
          ? `${currentPublisher.name} ${currentPublisher.firstName}`
          : "-",
      ];
    });

    // Create Excel file
    const wb = this.craeteWorkBook(translations["transfer.export.territories"]);
    wb.SheetNames.push(translations["transfer.export.territories"]);

    const ws = XLSX.utils.aoa_to_sheet(sheetColumns);

    // Column widths
    ws["!cols"] = [
      { wch: 10 },
      { wch: 10 },
      { wch: 14 },
      { wch: 18 },
      { wch: 20 },
      { wch: 18 },
      { wch: 20 },
    ];

    wb.Sheets[translations["transfer.export.territories"]] = ws;
    this.saveWorkBook(wb, translations["transfer.export.territories"]);

    // TODO: remove
    XLSX.writeFile(wb, "das-ist-ein-test.xlsx");
  }

  /*
  Anzahl Gebiete, die:
    - Stand jetzt nicht bearbeitet sind
    - länger als 1.5 Jahren nicht bearbeitet sind
    - länger als 3 Jahre nicht bearbeitet sind
    - länger als 5 Jahre nicht bearbeitet sind
    - länger als 10 Jahre nicht bearbeitet sind
* */
  public async exportTerritoryState() {
    const translations = await this.translate
      .get([
        "transfer.export.territoryState",
        "transfer.export.monthNotProceed",
        "transfer.export.yearsNotProceed",
      ])
      .toPromise();
    const assignments = await this.store
      .pipe(select(selectLastEndedAssignmentOfEachTerritory), first())
      .toPromise();
    const settings = await this.store
      .pipe(select(selectSettings), first())
      .toPromise();
    const today = moment(new Date());

    const countOfAllNotProcessed = assignments
      .map((a) => moment(a.endTime))
      .filter(
        (endTime) =>
          today.diff(endTime, "months") > settings.processingPeriodInMonths
      ).length;

    const oneYear = assignments
      .map((a) => moment(a.endTime))
      .filter((endTime) => today.diff(endTime, "months") >= 12).length;

    const oneAndHalfYear = assignments
      .map((a) => moment(a.endTime))
      .filter((endTime) => today.diff(endTime, "months") >= 18).length;

    const threeYears = assignments
      .map((a) => moment(a.endTime))
      .filter((endTime) => today.diff(endTime, "months") >= 36).length;

    const fiveYears = assignments
      .map((a) => moment(a.endTime))
      .filter((endTime) => today.diff(endTime, "months") >= 60).length;

    const tenYears = assignments
      .map((a) => moment(a.endTime))
      .filter((endTime) => today.diff(endTime, "months") >= 120).length;

    const wb = this.craeteWorkBook(
      translations["transfer.export.territoryState"]
    );
    wb.SheetNames.push(translations["transfer.export.territoryState"]);

    const tmp = [
      [
        `${settings.processingPeriodInMonths} ${translations["transfer.export.monthNotProceed"]}`,
        "1 " + translations["transfer.export.yearsNotProceed"],
        "1.5 " + translations["transfer.export.yearsNotProceed"],
        "3 " + translations["transfer.export.yearsNotProceed"],
        "5 " + translations["transfer.export.yearsNotProceed"],
        "10 " + translations["transfer.export.yearsNotProceed"],
      ],
      [
        countOfAllNotProcessed,
        oneYear,
        oneAndHalfYear,
        threeYears,
        fiveYears,
        tenYears,
      ],
    ];

    const ws = XLSX.utils.aoa_to_sheet(tmp);
    wb.Sheets[translations["transfer.export.territoryState"]] = ws;
    this.saveWorkBook(wb, translations["transfer.export.territoryState"]);
  }

  public exportVisitBans() {
    this.translate
      .get([
        "transfer.export.visitBans",
        "transfer.export.name",
        "transfer.export.level",
        "transfer.export.street",
        "transfer.export.numberShort",
        "transfer.export.city",
        "transfer.export.lastVisit",
        "transfer.export.comment",
        "transfer.export.latitude",
        "transfer.export.longitude",
      ])
      .pipe(take(1))
      .subscribe((translations: { [key: string]: string }) =>
        this.store
          .pipe(
            select(selectAllVisitBans),
            take(1),
            tap((visitBans: VisitBan[]) => {
              const wb = this.craeteWorkBook(
                translations["transfer.export.visitBans"]
              );
              wb.SheetNames.push(translations["transfer.export.visitBans"]);

              const tmp = [
                [
                  translations["transfer.export.name"],
                  translations["transfer.export.level"],
                  translations["transfer.export.street"],
                  translations["transfer.export.numberShort"],
                  translations["transfer.export.city"],
                  translations["transfer.export.lastVisit"],
                  translations["transfer.export.comment"],
                  translations["transfer.export.latitude"],
                  translations["transfer.export.longitude"],
                ],
              ];
              visitBans.forEach((a, index) => (tmp[index + 1] = this.tmp(a)));
              const ws = XLSX.utils.aoa_to_sheet(tmp);
              wb.Sheets[translations["transfer.export.visitBans"]] = ws;

              this.saveWorkBook(wb, translations["transfer.export.visitBans"]);
            })
          )
          .subscribe()
      );
  }

  private tmp(visitBan: VisitBan) {
    const name = visitBan.name || "";
    const floor = visitBan.floor ? `${visitBan.floor}` : "";
    const lastVisit = visitBan.lastVisit
      ? new Date(visitBan.lastVisit).toLocaleDateString()
      : "";
    const latitude =
      visitBan.gpsPosition && visitBan.gpsPosition.lat
        ? `${visitBan.gpsPosition.lat}`
        : "";
    const longitude =
      visitBan.gpsPosition && visitBan.gpsPosition.lng
        ? `${visitBan.gpsPosition.lng}`
        : "";
    return [
      name,
      floor,
      visitBan.street,
      visitBan.streetSuffix,
      visitBan.city || "",
      lastVisit,
      visitBan.comment || "",
      latitude,
      longitude,
    ];
  }

  private craeteWorkBook(subject: string) {
    const wb = XLSX.utils.book_new();
    wb.Props = {
      Title: "Territory Offline",
      Subject: subject,
      Author: "to",
      CreatedDate: new Date(),
    };

    return wb;
  }

  private async saveWorkBook(workBook: any, fileName: string) {
    const today = new Date();
    const wbout = XLSX.write(workBook, { bookType: "xlsx", type: "binary" });
    await this.platformAgnosticActionsService.share(
      wbout,
      `${fileName} - ${today.getDate()}-${
        today.getMonth() + 1
      }-${today.getFullYear()}.xlsx`
    );
  }
}
