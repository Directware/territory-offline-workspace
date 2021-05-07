import {mergeDrawings, normalizeStreetName, normalizeStreetSuffix} from "./usefull.functions";
import {createDrawing} from "@territory-offline-workspace/shared-interfaces";

describe("Testsuite for use full functions", () =>
{
  it('should parse street name', () =>
  {
    expect(normalizeStreetName("Calmbergstraße")).toBe("Calmbergstraße")
    expect(normalizeStreetName("   Musterstr.   ")).toBe("Musterstr.")
    expect(normalizeStreetName("Carl-Zeiss-Straße")).toBe("Carl-Zeiss-Straße")
    expect(normalizeStreetName("Sommerstr.")).toBe("Sommerstr.")
    expect(normalizeStreetName(" ")).toBe("")
    expect(normalizeStreetName(null)).toBe("")
    expect(normalizeStreetName(42 as any)).toBe("42")
    expect(normalizeStreetName("Allgäuer Straße")).toBe("Allgäuer Straße")
    expect(normalizeStreetName("Am Webereck")).toBe("Am Webereck")
    expect(normalizeStreetName("")).toBe("")
  });

  it("should parse street suffix", () =>
  {
    expect(normalizeStreetSuffix("42a")).toBe("42a")
    expect(normalizeStreetSuffix("20 dfsdfsdf")).toBe("20")
    expect(normalizeStreetSuffix("28 1/2")).toBe("28 1/2")
    expect(normalizeStreetSuffix("28 1/2 sdfsdfsdf")).toBe("28 1/2")
    expect(normalizeStreetSuffix("111/21")).toBe("11 1/21")
    expect(normalizeStreetSuffix("111/141 sdfdsfdsf")).toBe("11 1/141")
    expect(normalizeStreetSuffix("111/141d dfdfdfd")).toBe("11 1/141d")
    expect(normalizeStreetSuffix(42 as any)).toBe("42")
    expect(normalizeStreetSuffix(null)).toBe("")
    expect(normalizeStreetSuffix("")).toBe("")
  })

  it("should merge drawing", () => {
    const drawingsToBeMerged = [createDrawing(), createDrawing(), createDrawing(), createDrawing()];

    const merged = mergeDrawings(drawingsToBeMerged)

    expect(merged.featureCollection.features.length).toBe(4);
    expect(merged.featureCollection.features[0].properties.drawingId).toBe(drawingsToBeMerged[0].id);
  })
})
