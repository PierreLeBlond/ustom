export const compareWords = (word: string, guess: string) => {
  if (guess.length != word.length) {
    return "";
  }

  const guessLetters = guess.split("");
  const wordLetters = word.split("");

  const { match } = wordLetters.reduce(
    ({ match, matchingWordLetters }, letter, index) => {
      const guessedLetter = guessLetters.at(index);

      if (!guessedLetter) {
        return { match: match + "x", matchingWordLetters };
      }

      if (guessedLetter === letter) {
        return { match: match + "!", matchingWordLetters };
      }

      const matchIndices = wordLetters.reduce(
        (accu: number[], letter, index) => {
          if (
            letter !== guessedLetter ||
            matchingWordLetters.at(index) === "?" || // misplaced match with this letter has already been signaled for this position
            guessLetters.at(index) === wordLetters.at(index) // match with this letter has been or will be found at this position
          ) {
            return accu;
          }
          return [...accu, index];
        },
        [],
      );

      if (matchIndices.length > 0) {
        return {
          match: match + "?",
          matchingWordLetters: matchingWordLetters.toSpliced(
            matchIndices[0],
            1,
            "?",
          ),
        };
      }

      return { match: match + "x", matchingWordLetters };
    },
    { match: "", matchingWordLetters: wordLetters.slice(0) },
  );

  return match;
};
