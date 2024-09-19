const {
  calculateSize,
  compress,
  decompress,
  pack,
  unpack,
  parse,
  stringify,
  gzip,
  gunzip,
} = require("../index");

describe("main compression module", () => {
  let jsonObject;
  let jsonString;
  let complexJson;

  beforeEach(() => {
    jsonObject = [
      {
        id: 1,
        content:
          "Duis bibendum, felis sed interdum venenatis, turpis enim blandit mi",
        createdAt: "3/12/2023",
        updatedAt: "10/23/2022",
      },
      {
        id: 2,
        content:
          "Duis bibendum, felis sed sinterdum venenatis, turpis enim sblandit mis",
        createdAt: "3/12/2023",
        updatedAt: "10/23/2022",
      },
    ];
    jsonString = JSON.stringify(jsonObject);
    complexJson = {
      products: [
        {
          id: 11,
          title: "perfume Oil",
          price: 13,
        },
        {
          id: 12,
          title: "Brown Perfume",
          price: 40,
        },
        {
          id: 13,
          title: "Fog Scent Xpressio Perfume",
          price: 13,
        },
        {
          id: 14,
          title: "Non-Alcoholic Concentrated Perfume Oil",
          price: 120,
        },
        {
          id: 15,
          title: "Eau De Perfume Spray",
          price: 30,
        },
        {
          id: 16,
          title: "Hyaluronic Acid Serum",
          price: 19,
        },
        {
          id: 17,
          title: "Tree Oil 30ml",
          price: 12,
        },
        {
          id: 18,
          title: "Oil Free Moisturizer 100ml",
          price: 40,
        },
        {
          id: 19,
          title: "Skin Beauty Serum.",
          price: 46,
        },
        {
          id: 20,
          title: "Freckle Treatment Cream- 15gm",
          price: 70,
        },
      ],
      total: 100,
      skip: 10,
      limit: 10,
    };
  });

  it("calculateSize returns the correct byte length", () => {
    const buffer = Buffer.from("hello, world");
    expect(calculateSize("hello, world")).toBe(12);
    expect(calculateSize([1, 2, 3])).toBe(7);
    expect(calculateSize({ foo: "bar" })).toBe(13);
    expect(calculateSize(buffer)).toBe(12);
  });

  it("compress and decompress work correctly", () => {
    const decompressed = decompress(compress(jsonObject));
    expect(decompressed).toEqual(jsonObject);
  });
  it("pack and unpack work correctly", () => {
    const unpacked = unpack(pack(jsonObject));
    expect(unpacked).toEqual(jsonObject);
  });
  it("parse and stringify work correctly", () => {
    const parsed = parse(stringify(jsonObject));
    expect(parsed).toEqual(jsonObject);
  });
  it("gzip and gunzip work correctly", () => {
    const buffer = Buffer.from(jsonString, "utf-8");
    const gunzipped = gunzip(gzip(buffer));
    expect(gunzipped.toString()).toEqual(buffer.toString());
  });
  it("complex json compress", () => {
    const decompressed = decompress(compress(complexJson));
    expect(() => decompressed === complexJson).toBeTruthy();
  });
});
