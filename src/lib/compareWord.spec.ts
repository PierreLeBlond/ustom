import { describe, expect, test } from "vitest";
import { compareWords } from "./compareWords";

describe("comparing words", () => {
  test("perfect match", () => {
    expect(compareWords("abcd", "abcd")).toBe("!!!!");
  });

  test("no match", () => {
    expect(compareWords("abcd", "efgh")).toBe("xxxx");
  });

  test("one match", () => {
    expect(compareWords("abcd", "ebgh")).toBe("x!xx");
  });

  describe("one misplaced match...", () => {
    test("...only", () => {
      expect(compareWords("abcd", "bfgh")).toBe("?xxx");
    });
    test("...with a match before", () => {
      expect(compareWords("abcd", "afah")).toBe("!xxx");
    });
    test("...with a match after", () => {
      expect(compareWords("abcd", "cfch")).toBe("xx!x");
    });
    test("...with another misplaced match", () => {
      expect(compareWords("aacd", "efaa")).toBe("xx??");
    });
  });
});
