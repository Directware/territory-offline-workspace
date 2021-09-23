import {TranslateService} from '@ngx-translate/core';
import {Injectable} from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfMakeFonts from "pdfmake/build/vfs_fonts.js";
import {select, Store} from "@ngrx/store";
import {ApplicationState} from "../../store/index.reducers";
import {selectCurrentCongregation} from "../../store/congregation/congregations.selectors";
import {first, take} from "rxjs/operators";
import {
  selectAllAssignmentsOrderedByRelevantTags,
  selectCurrentlyOpenAssignments
} from "../../store/assignments/assignments.selectors";
import {Assignment, Publisher, VisitBan} from "@territory-offline-workspace/shared-interfaces";
import {selectTagsByIds} from "../../store/tags/tags.selectors";
import {selectPublishers} from "../../store/publishers/publishers.selectors";
import {selectAllTerritories} from "../../store/territories/territories.selectors";
import {groupOverseerFactory, groupOverseerPdfMakeContentFactory} from "@territory-offline-workspace/shared-utils";
import {PlatformAgnosticActionsService} from "../common/platform-agnostic-actions.service";

@Injectable({
  providedIn: 'root'
})
export class PdfDataExportService
{
  constructor(private store: Store<ApplicationState>,
              private platformAgnosticActionsService: PlatformAgnosticActionsService,
              private translate: TranslateService)
  {
    /* Die Fonts werden in der vfs_fonts.js nicht an die richtige Stelle gebunden(durch webpack)
       daher dieser Workaround
    */
    pdfMake.vfs = pdfMakeFonts.pdfMake.vfs;
  }

  public exportPublisher(publisher: Publisher[])
  {
    this.translate.get(["transfer.export.firstName", "transfer.export.lastName", "transfer.export.mail", "transfer.export.phone"]).pipe(take(1)).subscribe((translations: { [key: string]: string }) =>
    {
      const body = [];
      publisher.forEach((p, index) =>
        body[index] = [p.firstName, p.name, p.email || "-", p.phone || "-"]);

      const table = {
        layout: 'lightHorizontalLines',
        table: {
          headerRows: 1,
          widths: ['auto', 'auto', 'auto', '*'],
          body: [
            [translations["transfer.export.firstName"], translations["transfer.export.lastName"], translations["transfer.export.mail"], translations["transfer.export.phone"]],
            ...body
          ]
        }
      };

      const docDefinition = {
        footer: this.pdfFooter,
        pageMargins: [25, 20, 30, 30],
        content: table
      };

      const createdPdf = pdfMake.createPdf(docDefinition);
      this.save(createdPdf, "to-publishers");
    });
  }

  public exportVisitBans(visitBans: VisitBan[])
  {
    this.translate.get(["transfer.export.bellPosition", "transfer.export.level", "transfer.export.street", "transfer.export.numberShort", "transfer.export.city", "transfer.export.lastVisit"]).pipe(take(1)).subscribe((translations: { [key: string]: string }) =>
    {
      const body = [];
      visitBans.forEach((a, index) =>
        body[index] = [a.name, a.floor, a.street, a.streetSuffix, a.city, !!a.lastVisit ? new Date(a.lastVisit).toLocaleDateString() : ""]);

      const table = {
        layout: 'lightHorizontalLines',
        table: {
          headerRows: 1,
          widths: ['auto', 'auto', '*', 'auto', 'auto', 'auto'],
          body: [
            [translations["transfer.export.bellPosition"], translations["transfer.export.level"], translations["transfer.export.street"], translations["transfer.export.numberShort"], translations["transfer.export.city"], translations["transfer.export.lastVisit"]],
            ...body
          ]
        }
      };

      const docDefinition = {
        footer: this.pdfFooter,
        pageOrientation: 'landscape',
        pageMargins: [25, 20, 30, 20],
        content: table
      };

      const createdPdf = pdfMake.createPdf(docDefinition);
      this.save(createdPdf, "to-visit-bans");
    });
  }

  public async exportGroupOverseerReport(tagIds: string[])
  {
    const tags = await this.store.pipe(select(selectTagsByIds, tagIds), first()).toPromise();
    const publishers = await this.store.pipe(select(selectPublishers), first()).toPromise();
    const territories = await this.store.pipe(select(selectAllTerritories), first()).toPromise();
    const assignments = await this.store.pipe(select(selectCurrentlyOpenAssignments), first()).toPromise();

    const groupOverseerReport = groupOverseerFactory(tags, publishers, territories, assignments);

    const docDefinition = {
      footer: this.pdfFooter,
      pageMargins: [30, 30, 30, 30],
      content: groupOverseerPdfMakeContentFactory(groupOverseerReport, {
        since: "seit",
        noTerritory: "Kein Gebiet zugeteilt"
      })
    };

    const createdPdf = pdfMake.createPdf(docDefinition);
    this.save(createdPdf, "group overseers.pdf");
  }

  public async exportS13()
  {
    const data = await this.store.pipe(select(selectAllAssignmentsOrderedByRelevantTags), take(1)).toPromise();
    const content = [];
    const rowCountForWholePage = 37;

    let territoryIndex = 0; // Nötig, weil der index in forEach wird wegen den Tags immer wieder zurückgesetzt
    let columnsPerPageIndex = 0;

    data.forEach(dto =>
      dto.territoryDtos
        .filter(td => td.assignmentDtos.length > 0 && !td.territory.deactivated)
        .sort((dto1, dto2) => dto1.territory.key > dto2.territory.key ? 1 : -1)
        .forEach((td) =>
        {
          if (!content[territoryIndex])
          {
            content[territoryIndex] = {
              layout: 's13Layout',
              table: {
                widths: [81, 81, 81, 81, 81, 81],
                body: [[]]
              },
              fontSize: 13,
              alignment: 'center',
              pageBreak: "after"
            };
          }

          content[territoryIndex].table.body[0].push({colSpan: 2, text: td.territory.key});
          content[territoryIndex].table.body[0].push("");

          const reverseSortedAssignments = [...td.assignmentDtos];
          reverseSortedAssignments.sort((a1, a2) => a1.assignment.startTime > a2.assignment.startTime ? 1 : -1);

          if (reverseSortedAssignments.length > ((rowCountForWholePage + 1) / 2))
          {
            const deletionCount = reverseSortedAssignments.length - ((rowCountForWholePage + 1) / 2);
            reverseSortedAssignments.splice(0, deletionCount);
          }

          for (let i = 0, cellIndex = 0; i <= rowCountForWholePage; i++)
          {
            if (!content[territoryIndex].table.body[i + 1])
            {
              content[territoryIndex].table.body[i + 1] = [];
            }

            const aDto = reverseSortedAssignments[cellIndex];
            if (aDto)
            {
              if (i % 2 === 0)
              {
                const publisherName = aDto.publisher ? `${aDto.publisher.name} ${aDto.publisher.firstName}` : aDto.removedPublisherLabel;
                content[territoryIndex].table.body[i + 1].push({colSpan: 2, text: publisherName});
                content[territoryIndex].table.body[i + 1].push(" ");
              }
              else
              {
                content[territoryIndex].table.body[i + 1].push(...this.assignmentS13DateEntry(aDto.assignment));
                cellIndex++;
              }
            }
            else
            {
              if (i % 2 === 0)
              {
                content[territoryIndex].table.body[i + 1].push({colSpan: 2, text: " "});
                content[territoryIndex].table.body[i + 1].push(" ");
              }
              else
              {
                content[territoryIndex].table.body[i + 1].push(" ", " ");
              }

            }
          }


          if (columnsPerPageIndex < 2)
          {
            columnsPerPageIndex++;
          }
          else
          {
            columnsPerPageIndex = 0;
            territoryIndex++;
          }
        })
    );

    pdfMake.tableLayouts = {
      s13Layout: {
        hLineWidth: function (i, node)
        {
          if (i === 0 || i === 1 || i === node.table.body.length)
          {
            return 2;
          }
          return 0.5;
        },
        vLineWidth: function (i)
        {
          return i % 2 === 0 ? 2 : 0.5;
        }
      }
    };

    const docDefinition = {
      footer: this.pdfFooter,
      pageMargins: [25, 40, 30, 20],
      content: content
    };

    const createdPdf = pdfMake.createPdf(docDefinition);

    this.save(createdPdf, "S-13.pdf");
  }

  private assignmentS13DateEntry(assignment: Assignment)
  {
    const start = assignment.startTime.toLocaleDateString();

    if (assignment.endTime)
    {
      return [start, assignment.endTime.toLocaleDateString()];
    }

    return [start, ""];
  }

  private pdfFooter(currentPage, pageCount)
  {
    return [
      {
        alignment: 'center',
        color: "#777777",
        fontSize: 10,
        text: `${currentPage.toString()} / ${pageCount}`
      },
      {
        alignment: 'right',
        color: "#777777",
        fontSize: 10,
        margin: [0, 0, 20, 40],
        text: `${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`
      }
    ];
  }

  private async save(createdPdf, name: string)
  {
    const congregation = await this.store.pipe(select(selectCurrentCongregation), first()).toPromise();
    createdPdf.getBase64((data) => this.platformAgnosticActionsService.share(data, `${congregation.name} - ${name}`));
  }
}
