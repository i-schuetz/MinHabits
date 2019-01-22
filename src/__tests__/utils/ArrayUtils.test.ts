import { associateBy } from "../../utils/ArrayUtils"

describe("ArrayUtils", () => {
  it("Associate by", () => {
    expect(associateBy(item => item.foo, [{ foo: "a", bar: "a1" }, { foo: "b", bar: "b1" }])).toEqual(
      new Map([["a", { foo: "a", bar: "a1" }], ["b", { foo: "b", bar: "b1" }]])
    )

    expect(() =>
      associateBy(item => item.foo, [
        { foo: "a", bar: "a1" },
        { foo: "b", bar: "b1" },
        { foo: "a", bar: "a2" },
        { foo: "b", bar: "b2" }
      ])
    ).toThrow()
  })
})
