import {MobileDatabaseService} from "./mobile-database.service";
import {StoreModule} from "@ngrx/store";
import {of} from "rxjs";
import {
  HASHED_ASSIGNMENT_TABLE_NAME,
  HASHED_CONGREGATION_TABLE_NAME,
  HASHED_DRAWING_TABLE_NAME,
  HASHED_LAST_DOING_TABLE_NAME,
  HASHED_PUBLISHER_TABLE_NAME,
  HASHED_TAG_TABLE_NAME,
  HASHED_TERRITORY_TABLE_NAME, HASHED_VISIT_BAN_TABLE_NAME
} from "./mobile-db-schemas/schemas.db";
import {fakeAsync, flushMicrotasks, TestBed} from "@angular/core/testing";
import {CommonModule} from "@angular/common";
import {provideMockStore} from "@ngrx/store/testing";
import {TimedEntity} from "@territory-offline-workspace/api";

describe("TO - MobileDatabaseService", () =>
{
  const currentCongregationId = "480014e4-4e16-4c85-9ccc-d08c4504587c";
  let databaseService: MobileDatabaseService;
  let timedEntity: TimedEntity;

  beforeEach(async () =>
  {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        StoreModule.forRoot({})
      ],
      providers: [
        MobileDatabaseService,
        provideMockStore({
          initialState: {
            settings: {
              currentCongregationId
            }
          }
        })
      ]
    });

    databaseService = TestBed.inject(MobileDatabaseService);

    timedEntity = {
      id: "random-uuid",
      creationTime: new Date(),
      lastUpdated: new Date()
    }
  })

  const mockSQLite = (values) => {

    return () => of({
      execute: jest.fn(() => of({values: values}).toPromise()),
      query: jest.fn(() => of({values: values}).toPromise())
    }).toPromise() as any;

  }

  it("should check congregations SELECT", fakeAsync(() =>
  {
    const mock = mockSQLite(['{"name":"Name", "languageCode":"de", "language":"Deutsch", "hashedName":"blablabla"}']);
    databaseService.retrieveConnection = mock;

    const result = databaseService.load(HASHED_CONGREGATION_TABLE_NAME, true);
    flushMicrotasks();

    expect(databaseService.database.query).toHaveBeenCalled();
    expect(databaseService.database.query).toHaveBeenCalledWith({
      "statement": "SELECT * FROM congregations;",
      "values": []
    });

    expect(result).resolves.toMatchObject([{
      name: 'Name',
      languageCode: 'de',
      language: 'Deutsch',
      hashedName: 'blablabla'
    }])
  }))

  it("should check congregations INSERT", fakeAsync(() =>
  {
    databaseService.upsert(HASHED_CONGREGATION_TABLE_NAME, {...timedEntity}, true);
    flushMicrotasks();

    expect(databaseService.database.execute).toHaveBeenCalled();
    expect(databaseService.database.execute).toHaveBeenCalledWith({statements: `INSERT OR REPLACE INTO congregations ( id, congregationId, prefix, creationTime, lastUpdated, name, languageCode, language, hashedName ) VALUES ("random-uuid","null","undefined","${timedEntity.creationTime.toISOString()}","${timedEntity.lastUpdated.toISOString()}","undefined","undefined","undefined","undefined");`});
  }))

  it("should check assignments SELECT", fakeAsync(() =>
  {
    databaseService.database = {query: jest.fn((config) => of({values: ['{"publisherId":"publisherId", "territoryId":"territoryId", "startTime":"2021-02-10T12:09:57.483Z"}']}).toPromise())};
    const result = databaseService.load(HASHED_ASSIGNMENT_TABLE_NAME);
    flushMicrotasks();

    expect(databaseService.database.query).toHaveBeenCalled();
    expect(databaseService.database.query).toHaveBeenCalledWith({
      "statement": `SELECT * FROM assignments WHERE congregationId='${currentCongregationId}';`,
      "values": []
    });

    expect(result).resolves.toMatchObject([{
      "congregationId": undefined,
      "creationTime": undefined,
      "endTime": undefined,
      "lastUpdated": undefined,
      "publisherId": "publisherId",
      "startTime": new Date("2021-02-10T12:09:57.483Z"),
      "territoryId": "territoryId"
    }]);
  }))

  it("should check drawings SELECT", fakeAsync(() =>
  {
    databaseService.database = {query: jest.fn((config) => of({values: ['{"featureCollection": "{}"}']}).toPromise())};
    const result = databaseService.load(HASHED_DRAWING_TABLE_NAME);
    flushMicrotasks();

    expect(databaseService.database.query).toHaveBeenCalled();
    expect(databaseService.database.query).toHaveBeenCalledWith({
      "statement": `SELECT * FROM drawings WHERE congregationId='${currentCongregationId}';`,
      "values": []
    });

    expect(result).resolves.toMatchObject([{"featureCollection": {}}]);
  }))

  it("should check last doings SELECT", fakeAsync(() =>
  {
    databaseService.database = {query: jest.fn((config) => of({values: ['{"action": "action", "label": "label"}']}).toPromise())};
    const result = databaseService.load(HASHED_LAST_DOING_TABLE_NAME);
    flushMicrotasks();

    expect(databaseService.database.query).toHaveBeenCalled();
    expect(databaseService.database.query).toHaveBeenCalledWith({
      "statement": `SELECT * FROM lastDoings WHERE congregationId='${currentCongregationId}';`,
      "values": []
    });

    expect(result).resolves.toMatchObject([{action: "action", label: "label"}])
  }))

  it("should check last publishers SELECT", fakeAsync(() =>
  {
    databaseService.database = {query: jest.fn((config) => of({values: ['{"name":"name", "firstName":"firstName", "email":"email", "phone":"phone", "tags":"[]"}']}).toPromise())};
    const result = databaseService.load(HASHED_PUBLISHER_TABLE_NAME);
    flushMicrotasks();

    expect(databaseService.database.query).toHaveBeenCalled();
    expect(databaseService.database.query).toHaveBeenCalledWith({
      "statement": `SELECT * FROM publishers WHERE congregationId='${currentCongregationId}';`,
      "values": []
    });

    expect(result).resolves.toMatchObject([{
      "name": "name",
      "firstName": "firstName",
      "email": "email",
      "phone": "phone",
      "tags": []
    }])
  }))

  it("should check tags SELECT", fakeAsync(() =>
  {
    databaseService.database = {query: jest.fn((config) => of({values: ['{"name": "name", "color": "color", "symbol": "symbol"}']}).toPromise())};
    const result = databaseService.load(HASHED_TAG_TABLE_NAME);
    flushMicrotasks();

    expect(databaseService.database.query).toHaveBeenCalled();
    expect(databaseService.database.query).toHaveBeenCalledWith({
      "statement": `SELECT * FROM tags WHERE congregationId='${currentCongregationId}';`,
      "values": []
    });

    expect(result).resolves.toMatchObject([{
      "name": "name",
      "color": "color",
      "symbol": "symbol"
    }])
  }))

  it("should check territories SELECT", fakeAsync(() =>
  {
    databaseService.database = {query: jest.fn((config) => of({values: ['{"name":"name", "key":"key", "populationCount":"12", "tags":"[]", "territoryDrawingId":"territoryDrawingId", "boundaryNames":"[]", "deactivated":"false", "isCreation":"false", "comment":"comment"}']}).toPromise())};
    const result = databaseService.load(HASHED_TERRITORY_TABLE_NAME);
    flushMicrotasks();

    expect(databaseService.database.query).toHaveBeenCalled();
    expect(databaseService.database.query).toHaveBeenCalledWith({
      "statement": `SELECT * FROM territories WHERE congregationId='${currentCongregationId}';`,
      "values": []
    });

    expect(result).resolves.toMatchObject([{
      "name": "name",
      "key": "key",
      "populationCount": 12,
      "tags": [],
      "territoryDrawingId": "territoryDrawingId",
      "boundaryNames": [],
      "deactivated": false,
      "isCreation": false,
      "comment": "comment"
    }])
  }))

  it("should check visit bans SELECT", fakeAsync(() =>
  {
    databaseService.database = {query: jest.fn((config) => of({values: ['{"name": "name", "street": "street", "streetSuffix": "streetSuffix", "territoryId": "territoryId", "tags": "[]", "city": "city", "floor": "1", "lastVisit": "2021-02-10T12:09:57.483Z", "comment": "comment", "gpsPosition": "{}"}']}).toPromise())};
    const result = databaseService.load(HASHED_VISIT_BAN_TABLE_NAME);
    flushMicrotasks();

    expect(databaseService.database.query).toHaveBeenCalled();
    expect(databaseService.database.query).toHaveBeenCalledWith({
      "statement": `SELECT * FROM visitBans WHERE congregationId='${currentCongregationId}';`,
      "values": []
    });

    expect(result).resolves.toMatchObject([{
      "name": "name",
      "street": "street",
      "streetSuffix": "streetSuffix",
      "territoryId": "territoryId",
      "tags": [],
      "city": "city",
      "floor": 1,
      "lastVisit": new Date("2021-02-10T12:09:57.483Z"),
      "comment": "comment",
      "gpsPosition": {}
    }])
  }))
});
