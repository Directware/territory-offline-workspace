import { MobileDatabaseService } from "./mobile-database.service";
import { StoreModule } from "@ngrx/store";
import { of } from "rxjs";
import { fakeAsync, flushMicrotasks, TestBed } from "@angular/core/testing";
import { CommonModule } from "@angular/common";
import { provideMockStore } from "@ngrx/store/testing";
import {
  HASHED_ASSIGNMENT_TABLE_NAME,
  HASHED_CONGREGATION_TABLE_NAME,
  HASHED_DRAWING_TABLE_NAME,
  HASHED_LAST_DOING_TABLE_NAME,
  HASHED_PUBLISHER_TABLE_NAME,
  HASHED_TAG_TABLE_NAME,
  HASHED_TERRITORY_TABLE_NAME,
  HASHED_VISIT_BAN_TABLE_NAME,
  TimedEntity,
} from "@territory-offline-workspace/shared-interfaces";
import { environment } from "../../../../environments/environment";

xdescribe("TO - MobileDatabaseService", () => {
  const currentCongregationId = "480014e4-4e16-4c85-9ccc-d08c4504587c";
  let databaseService: MobileDatabaseService;
  let timedEntity: TimedEntity;
  let db_connection_mock;

  function mockSQLite(values) {
    db_connection_mock = {
      execute: jest.fn(() => of({ values: values }).toPromise()),
      executeSet: jest.fn(() =>
        of({
          values: values,
          changes: { changes: 0 },
        }).toPromise()
      ),
      query: jest.fn(() => of({ values: values }).toPromise()),
    };

    return () => of(db_connection_mock).toPromise();
  }

  beforeEach(async () => {
    environment.production = true; // disabled logging

    TestBed.configureTestingModule({
      imports: [CommonModule, StoreModule.forRoot({})],
      providers: [
        MobileDatabaseService,
        provideMockStore({
          initialState: {
            settings: {
              currentCongregationId,
            },
          },
        }),
      ],
    });

    databaseService = TestBed.inject(MobileDatabaseService);

    timedEntity = {
      id: "random-uuid",
      creationTime: new Date(),
      lastUpdated: new Date(),
    };

    await databaseService.init();
  });

  it("should check congregations SELECT", fakeAsync(() => {
    const congregation = {
      name: "Name",
      languageCode: "de",
      language: "Deutsch",
      hashedName: "blablabla",
    };
    const mock = mockSQLite([congregation]);
    databaseService.retrieveConnection = mock;

    const result = databaseService.load(HASHED_CONGREGATION_TABLE_NAME, true);
    flushMicrotasks();

    expect(db_connection_mock.query).toHaveBeenCalled();
    expect(db_connection_mock.query).toHaveBeenCalledWith(
      "SELECT * FROM congregations;"
    );

    expect(result).resolves.toMatchObject([congregation]);
  }));

  it("should check congregations INSERT", fakeAsync(() => {
    const mock = mockSQLite([""]);
    databaseService.retrieveConnection = mock;
    databaseService.upsert(
      HASHED_CONGREGATION_TABLE_NAME,
      { ...timedEntity },
      true
    );
    flushMicrotasks();

    expect(db_connection_mock.executeSet).toHaveBeenCalled();
    // expect(db_connection_mock.executeSet).toHaveBeenCalledWith([{statements: `INSERT OR REPLACE INTO congregations ( id, congregationId, prefix, creationTime, lastUpdated, name, languageCode, language, hashedName ) VALUES ("random-uuid","null","undefined","${timedEntity.creationTime.toISOString()}","${timedEntity.lastUpdated.toISOString()}","undefined","undefined","undefined","undefined");`}]);
  }));

  it("should check assignments SELECT", fakeAsync(() => {
    const mock = mockSQLite([
      {
        publisherId: "publisherId",
        territoryId: "territoryId",
        startTime: "2021-02-10T12:09:57.483Z",
      },
    ]);
    databaseService.retrieveConnection = mock;
    const result = databaseService.load(HASHED_ASSIGNMENT_TABLE_NAME);
    flushMicrotasks();

    expect(db_connection_mock.query).toHaveBeenCalled();
    expect(db_connection_mock.query).toHaveBeenCalledWith(
      `SELECT * FROM assignments WHERE congregationId = '${currentCongregationId}';`
    );

    expect(result).resolves.toMatchObject([
      {
        congregationId: undefined,
        creationTime: null,
        endTime: null,
        lastUpdated: null,
        publisherId: "publisherId",
        startTime: new Date("2021-02-10T12:09:57.483Z"),
        territoryId: "territoryId",
      },
    ]);
  }));

  it("should check drawings SELECT", fakeAsync(() => {
    const mock = mockSQLite([{ featureCollection: "{}" }]);
    databaseService.retrieveConnection = mock;
    const result = databaseService.load(HASHED_DRAWING_TABLE_NAME);
    flushMicrotasks();

    expect(db_connection_mock.query).toHaveBeenCalled();
    expect(db_connection_mock.query).toHaveBeenCalledWith(
      `SELECT * FROM drawings WHERE congregationId = '${currentCongregationId}';`
    );

    expect(result).resolves.toMatchObject([{ featureCollection: {} }]);
  }));

  it("should check last doings SELECT", fakeAsync(() => {
    const mock = mockSQLite([{ action: "action", label: "label" }]);
    databaseService.retrieveConnection = mock;
    const result = databaseService.load(HASHED_LAST_DOING_TABLE_NAME);
    flushMicrotasks();

    expect(db_connection_mock.query).toHaveBeenCalled();
    expect(db_connection_mock.query).toHaveBeenCalledWith(
      `SELECT * FROM lastDoings WHERE congregationId = '${currentCongregationId}';`
    );

    expect(result).resolves.toMatchObject([
      { action: "action", label: "label" },
    ]);
  }));

  it("should check last publishers SELECT", fakeAsync(() => {
    const mock = mockSQLite([
      {
        name: "name",
        firstName: "firstName",
        email: "email",
        phone: "phone",
        tags: "[]",
      },
    ]);
    databaseService.retrieveConnection = mock;
    const result = databaseService.load(HASHED_PUBLISHER_TABLE_NAME);
    flushMicrotasks();

    expect(db_connection_mock.query).toHaveBeenCalled();
    expect(db_connection_mock.query).toHaveBeenCalledWith(
      `SELECT * FROM publishers WHERE congregationId = '${currentCongregationId}';`
    );

    expect(result).resolves.toMatchObject([
      {
        name: "name",
        firstName: "firstName",
        email: "email",
        phone: "phone",
        tags: [],
      },
    ]);
  }));

  it("should check tags SELECT", fakeAsync(() => {
    const mock = mockSQLite([
      { name: "name", color: "color", symbol: "symbol" },
    ]);
    databaseService.retrieveConnection = mock;
    const result = databaseService.load(HASHED_TAG_TABLE_NAME);
    flushMicrotasks();

    expect(db_connection_mock.query).toHaveBeenCalled();
    expect(db_connection_mock.query).toHaveBeenCalledWith(
      `SELECT * FROM tags WHERE congregationId = '${currentCongregationId}';`
    );

    expect(result).resolves.toMatchObject([
      {
        name: "name",
        color: "color",
        symbol: "symbol",
      },
    ]);
  }));

  it("should check territories SELECT", fakeAsync(() => {
    const mock = mockSQLite([
      {
        name: "name",
        key: "key",
        populationCount: "12",
        tags: "[]",
        territoryDrawingId: "territoryDrawingId",
        boundaryNames: "[]",
        deactivated: "false",
        isCreation: "false",
        comment: "comment",
      },
    ]);
    databaseService.retrieveConnection = mock;
    const result = databaseService.load(HASHED_TERRITORY_TABLE_NAME);
    flushMicrotasks();

    expect(db_connection_mock.query).toHaveBeenCalled();
    expect(db_connection_mock.query).toHaveBeenCalledWith(
      `SELECT * FROM territories WHERE congregationId = '${currentCongregationId}';`
    );

    expect(result).resolves.toMatchObject([
      {
        name: "name",
        key: "key",
        populationCount: 12,
        tags: [],
        territoryDrawingId: "territoryDrawingId",
        boundaryNames: [],
        deactivated: false,
        isCreation: false,
        comment: "comment",
      },
    ]);
  }));

  it("should check visit bans SELECT", fakeAsync(() => {
    const mock = mockSQLite([
      {
        name: "name",
        street: "street",
        streetSuffix: "streetSuffix",
        territoryId: "territoryId",
        tags: "[]",
        city: "city",
        floor: "1",
        lastVisit: "2021-02-10T12:09:57.483Z",
        comment: "comment",
        gpsPosition: "{}",
      },
    ]);
    databaseService.retrieveConnection = mock;
    const result = databaseService.load(HASHED_VISIT_BAN_TABLE_NAME);
    flushMicrotasks();

    expect(db_connection_mock.query).toHaveBeenCalled();
    expect(db_connection_mock.query).toHaveBeenCalledWith(
      `SELECT * FROM visitBans WHERE congregationId = '${currentCongregationId}';`
    );

    expect(result).resolves.toMatchObject([
      {
        name: "name",
        street: "street",
        streetSuffix: "streetSuffix",
        territoryId: "territoryId",
        tags: [],
        city: "city",
        floor: 1,
        lastVisit: new Date("2021-02-10T12:09:57.483Z"),
        comment: "comment",
        gpsPosition: {},
      },
    ]);
  }));
});
