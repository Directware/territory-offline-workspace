import {createTag} from "../tag/tag.factory";
import {createPublisher} from "../publisher/publisher.factory";
import {groupOverseerFactory} from "../report/group-overseer-report.factory";
import {createTerritory} from "../territory/territory.factory";
import {createAssignment} from "../assignment/assignment.factory";

describe("Test group overseer report structure", () =>
{
  it("should create full group overseer report structure", () =>
  {
    const startTime = new Date();

    const tag1 = createTag({name: "Tag 1"});
    const tag2 = createTag({name: "Tag 2"});
    const tag3 = createTag({name: "Tag 3"});

    const publisher1 = createPublisher({name: "1", firstName: "Publisher", tags: [tag1.id]});
    const publisher2 = createPublisher({name: "2", firstName: "Publisher", tags: [tag2.id]});
    const publisher3 = createPublisher({name: "3", firstName: "Publisher", tags: [tag3.id]});

    const territory1 = createTerritory({name: "Territory", key: "1"});
    const territory2 = createTerritory({name: "Territory", key: "2"});
    const territory3 = createTerritory({name: "Territory", key: "3"});

    const lastAssignment1 = createAssignment({publisherId: publisher1.id, territoryId: territory1.id, startTime: startTime});
    const lastAssignment2 = createAssignment({publisherId: publisher2.id, territoryId: territory2.id, startTime: startTime});
    const lastAssignment3 = createAssignment({publisherId: publisher3.id, territoryId: territory3.id, startTime: startTime});

    const report = groupOverseerFactory(
      [tag1, tag2, tag3],
      [publisher1, publisher2, publisher3],
      [territory1, territory2, territory3],
      [lastAssignment1, lastAssignment2, lastAssignment3]
    );

    expect(report).toMatchObject({
      tags: [{
        label: "Tag 1",
        publishers: [{
          label: "Publisher 1",
          territories: [{
            label: "1 Territory",
            assignedSince: startTime
          }]
        }],
      }, {
        label: "Tag 2",
        publishers: [{
          label: "Publisher 2",
          territories: [{
            label: "2 Territory",
            assignedSince: startTime
          }]
        }],
      }, {
        label: "Tag 3",
        publishers: [{
          label: "Publisher 3",
          territories: [{
            label: "3 Territory",
            assignedSince: startTime
          }]
        }],
      }]
    });
  })
})
