import {compareVisitBansWithNames, createVisitBan} from "@territory-offline-workspace/api";
import {compareVisitBans} from "./visit-ban.comparator";

describe('VisitBan comparator test', () =>
{

  it("should be equal if lastVisit / creationTime are same", () =>
  {
    const sameDate = new Date();
    let vb1 = createVisitBan({creationTime: sameDate});
    let vb2 = createVisitBan({creationTime: sameDate});
    let equality = compareVisitBans(vb1, vb2);
    expect(equality).toBe(true);

    vb1 = createVisitBan({lastVisit: sameDate});
    vb2 = createVisitBan({lastVisit: sameDate});
    equality = compareVisitBans(vb1, vb2);
    expect(equality).toBe(true);

    vb1 = createVisitBan();
    vb2 = createVisitBan();
    equality = compareVisitBans(vb1, vb2);
    expect(equality).toBe(false);
  })

  it("should be equal if street and streetSuffix are same", () =>
  {
    const sameDate = new Date();
    let vb1 = createVisitBan({street: " Musterstr.", streetSuffix: "42a   ", creationTime: sameDate});
    let vb2 = createVisitBan({street: " Musterstr.", streetSuffix: "42a   ", creationTime: sameDate});
    let equality = compareVisitBans(vb1, vb2);
    expect(equality).toBe(true);

    vb1 = createVisitBan({street: " Musterstr.", streetSuffix: "42a   ", creationTime: sameDate});
    vb2 = createVisitBan({street: " Sommerstr.", streetSuffix: "42a   ", creationTime: sameDate});
    equality = compareVisitBans(vb1, vb2);
    expect(equality).toBe(false);

    vb1 = createVisitBan({street: " Musterstr.", streetSuffix: "42a   ", creationTime: sameDate});
    vb2 = createVisitBan({street: " Musterstr.", streetSuffix: "24a   ", creationTime: sameDate});
    equality = compareVisitBans(vb1, vb2);
    expect(equality).toBe(false);
  })

  it("should be equal if name are same", () =>
  {
    const sameDate = new Date();
    let vb1 = createVisitBan({name: "some name", street: "Musterstr.", streetSuffix: "42a", creationTime: sameDate});
    let vb2 = createVisitBan({name: "some name", street: "Musterstr.", streetSuffix: "42a", creationTime: sameDate});
    let equality = compareVisitBans(vb1, vb2);
    expect(equality).toBe(true);

    vb1 = createVisitBan({name: "some name", street: "Musterstr.", streetSuffix: "42a", creationTime: sameDate});
    vb2 = createVisitBan({name: "other name", street: "Musterstr.", streetSuffix: "42a", creationTime: sameDate});
    equality = compareVisitBans(vb1, vb2);
    expect(equality).toBe(false);
  })

  it("should be equal", () =>
  {
    let vb1 = createVisitBan({
      id: "cf7b8c42-477f-48c5-810b-75fa3b9ba6ee",
      name: "",
      street: "Adolph-Kolping-Straße",
      streetSuffix: "14",
      city: "Augsburg",
      comment: "",
      lastVisit: null,
      creationTime: "2016-02-16T17:06:20.000Z" as any,
      tags: [],
      territoryId: "1db22397-731d-49a0-a677-017bbc3a015b",
      lastUpdated: null,
    });

    let vb2 = createVisitBan({
      id: "65a65de9-89bf-4187-8440-5ea0622a5a42",
      name: "",
      street: "Adolph-Kolping-Straße",
      streetSuffix: "14",
      city: "Augsburg",
      comment: "",
      lastVisit: null,
      creationTime: "2016-02-16T17:06:20.000Z" as any,
      tags: [],
      territoryId: "1db22397-731d-49a0-a677-017bbc3a015b",
      lastUpdated: null,
    });

    let equality = compareVisitBans(vb1, vb2);
    expect(equality).toBe(true);
  })

  it("should be equal 2", () =>
  {
    let vb1 = createVisitBan({
      id: '7cc0975e-974b-4714-8706-728c591799ff',
      creationTime: "2021-02-05T15:01:56.469Z" as any,
      name: 'vb2',
      street: 'Prinz-Regenten-Str.',
      streetSuffix: '125e',
      territoryId: null,
      tags: [],
      city: '',
      comment: ''
    });

    let vb2 = createVisitBan({
      id: '76b8e558-c869-43a4-8bc4-a5632bb66bec',
      creationTime: "2021-02-05T15:01:56.469Z" as any,
      name: 'vb4',
      street: 'Prinz-Regenten-Str.',
      streetSuffix: '125e',
      territoryId: null,
      tags: [],
      city: '',
      comment: ''
    });

    let equality = compareVisitBans(vb1, vb2);
    expect(equality).toBe(true);
  })

  it("compareVisitBansWithNames: should be not equal", () =>
  {
    let vb1 = createVisitBan({
      id: '7cc0975e-974b-4714-8706-728c591799ff',
      creationTime: "2021-02-05T15:01:56.469Z" as any,
      name: 'vb2',
      street: 'Prinz-Regenten-Str.',
      streetSuffix: '125e',
      territoryId: null,
      tags: [],
      city: '',
      comment: ''
    });

    let vb2 = createVisitBan({
      id: '76b8e558-c869-43a4-8bc4-a5632bb66bec',
      creationTime: "2021-02-05T15:01:56.469Z" as any,
      name: 'vb4',
      street: 'Prinz-Regenten-Str.',
      streetSuffix: '125e',
      territoryId: null,
      tags: [],
      city: '',
      comment: ''
    });

    let equality = compareVisitBansWithNames(vb1, vb2);
    expect(equality).toBe(false);
  })

});
