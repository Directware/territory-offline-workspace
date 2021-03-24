
import {createDurationPhrase} from "./../../deprecated/usefull.functions";
import {
  Assignment,
  GroupOverseerReport,
  Publisher,
  Tag,
  Territory
} from "@territory-offline-workspace/shared-interfaces";


export function groupOverseerFactory(tags: Tag[], publishers: Publisher[], territories: Territory[], assignments: Assignment[]): GroupOverseerReport
{
  const report = {} as GroupOverseerReport;
  report.tags = [];

  const combineAssignmentWithTerritory = (assignment: Assignment, territories: Territory[]) =>
  {
    const territory = territories.find(t => t.id === assignment.territoryId);
    return {
      label: `${territory.key} ${territory.name}`,
      assignedSince: assignment.startTime
    };
  };

  tags.forEach((tag) =>
    report.tags.push({
      label: tag.name,
      publishers: publishers
        .filter(p => p.tags && p.tags.indexOf(tag.id) > -1)
        .map(p => ({
          label: `${p.firstName} ${p.name}`,
          territories: assignments.filter(a => a.publisherId === p.id).map(a => combineAssignmentWithTerritory(a, territories))
        }))
    })
  );

  return report;
}

export function groupOverseerPdfMakeContentFactory(groupOverseerReport: GroupOverseerReport, translations: { since: string, noTerritory: string })
{
  const content = [];
  for (let i = 0; i < groupOverseerReport.tags.length; i++)
  {
    content.push({
      text: groupOverseerReport.tags[i].label,
      pageBreak: i > 0 ? "before" : undefined,
      fontSize: 18,
      bold: true
    });
    content.push({canvas: [{ type: 'line', x1: 0, y1: 5, x2: 595-2*40, y2: 5, lineWidth: 1 }]});

    for (let j = 0; j < groupOverseerReport.tags[i].publishers.length; j++)
    {
      content.push({
        text: `• ${groupOverseerReport.tags[i].publishers[j].label}:`,
        margin: [20, 10, 0, 0],
        bold: true
      });

      for (let k = 0; k < groupOverseerReport.tags[i].publishers[j].territories.length; k++)
      {
        const territory = groupOverseerReport.tags[i].publishers[j].territories[k].label;
        const since = groupOverseerReport.tags[i].publishers[j].territories[k].assignedSince;
        content.push({
          text: `${territory} ${translations.since} ${createDurationPhrase(since)}`,
          margin: [50, 5, 0, 0]
        })
      }

      if (groupOverseerReport.tags[i].publishers[j].territories.length === 0)
      {
        content.push({text: `${translations.noTerritory}`, margin: [50, 5, 0, 0]});
      }
    }
  }

  return content;
}
