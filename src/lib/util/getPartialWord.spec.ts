import { describe, expect, test } from "vitest";
import { getPartialWord } from "./getPartialWord";

describe("getting partial word", () => {
  test("perfect", () => {
    expect(
      getPartialWord(4, [
        [
          { letter: "t", match: "!" },
          { letter: "e", match: "!" },
          { letter: "s", match: "!" },
          { letter: "t", match: "!" },
        ],
      ]),
    ).toStrictEqual("test");
  });

  test("partial", () => {
    expect(
      getPartialWord(4, [
        [
          { letter: "t", match: "!" },
          { letter: "e", match: "x" },
          { letter: "s", match: "?" },
          { letter: "t", match: "!" },
        ],
      ]),
    ).toStrictEqual("t..t");
  });
});
