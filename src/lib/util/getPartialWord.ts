import type { LetterGuess } from "./LetterGuess";

export const getPartialWord = (
  lettersCount: number,
  guesses: LetterGuess[][],
) => {
  return guesses
    .reduce(
      (partialWord, guess) =>
        guess.reduce((partialWord, letterGuess, index) => {
          if (letterGuess.match !== "!") {
            return partialWord;
          }
          return partialWord.toSpliced(index, 1, letterGuess.letter);
        }, partialWord),
      new Array(lettersCount).fill("."),
    )
    .join("");
};
