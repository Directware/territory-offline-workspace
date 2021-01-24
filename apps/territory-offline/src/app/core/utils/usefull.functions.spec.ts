import {parseXlsxDate} from "./usefull.functions";

describe("Testsuite for usefull functions", () => {

  it("should parse xlsx date", () => {

    expect(parseXlsxDate({t: "", v: 4})).toBe(null);
    expect(parseXlsxDate({t: "n", v: 4000})).toBeInstanceOf(Date);
    expect(parseXlsxDate({t: "n", v: 43519})).toMatchObject(new Date(2019,1,23));
  })
})
