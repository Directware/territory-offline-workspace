import {ImportVisitBansFromExcelComponent} from './import-visit-bans-from-excel.component';
import {createVisitBan} from "@territory-offline-workspace/shared-interfaces";

describe('ImportVisitBansFromExcelComponent', () =>
{
  let component;

  beforeEach(() =>
  {
    component = new ImportVisitBansFromExcelComponent(null, null, null, null, null, null);
  });

  it('should not override existing visit bans', () =>
  {
    const existingVisitBans = [
      createVisitBan({name: "vb1"}),
      createVisitBan({name: "vb2"}),
      createVisitBan({name: "vb3"})
    ];

    const newVisitBans = [createVisitBan({name: "vb4"})];

    const result = component.overrideExistingVisitBans(existingVisitBans, newVisitBans);

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("vb4");
  })

  it('should override existing visit bans with the same street', () =>
  {
    const street = "Prinz-Regenten-Str."
    const streetSuffix = "125e"
    const existingVisitBans = [
      createVisitBan({name: "vb1"}),
      createVisitBan({name: "vb2", street, streetSuffix}),
      createVisitBan({name: "vb3"})
    ];

    const newVisitBans = [createVisitBan({name: "vb4", street, streetSuffix})];

    const result = component.overrideExistingVisitBans(existingVisitBans, newVisitBans);

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("vb4");
  })
});

