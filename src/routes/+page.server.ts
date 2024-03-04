import { isInDictionary } from "$lib/components/dictionary/isInDictionary";
import { decrypt } from "$lib/crypto/crypto";
import { redis } from "$lib/redis";
import { compareWords } from "$lib/util/compareWords";
import { getPartialWord } from "$lib/util/getPartialWord";
import { fail, redirect } from "@sveltejs/kit";
import { Leaderboard } from "redis-rank";
import type { PageServerLoad } from "./$types";

const TRY_COUNTS = 6;

export const load: PageServerLoad = async ({ cookies, url }) => {
  const iv = url.searchParams.get("iv");
  const encryptedWord = url.searchParams.get("encryptedWord");

  if (!encryptedWord || !iv) {
    redirect(302, "/generate");
  }

  const word = decrypt({ iv, encryptedMessage: encryptedWord });

  const guess = cookies.get("guess") || "";

  const serializedGuesses = cookies.get(`${encryptedWord}-guesses`);

  const guesses = serializedGuesses
    ? serializedGuesses.split("/").map((serializedGuess) => {
        const deserializedGuess = serializedGuess.split("-");
        const guess = deserializedGuess[0];
        const match = deserializedGuess[1];
        return guess.split("").map((letter, index) => ({
          letter,
          match: match.at(index) as "x" | "?" | "!",
        }));
      })
    : [];

  const leaderboard = new Leaderboard(redis, `lb:${encryptedWord}`, {
    sortPolicy: "low-to-high",
    updatePolicy: "best",
    limitTopN: 10,
  });

  const scores = await leaderboard.top(10);
  const scoreName = cookies.get("score");

  const lettersCount = word.length;

  // The word with "?" in place of all letter that hasn't been found yet
  const partialWord =
    word.at(0) + getPartialWord(lettersCount, guesses).substring(1);
  const won = partialWord === word;

  const wrongLetters = guesses
    .flatMap((guess) => guess)
    .filter(
      ({ letter, match }) => match === "x" && !partialWord.includes(letter),
    )
    .map(({ letter }) => letter);

  const uniqueWrongLetters = [...new Set(wrongLetters)];

  return {
    guess,
    guesses,
    lettersCount,
    partialWord,
    won,
    wrongLetters: uniqueWrongLetters,
    tryCounts: TRY_COUNTS,
    lost: guesses.length === TRY_COUNTS,
    iv,
    encryptedWord,
    scores,
    scoreName,
  };
};

export const actions = {
  input: async ({ request, cookies }) => {
    const data = await request.formData();

    const letter = data.get("letter") as string;
    const guess = data.get("guess") as string;
    const partialWord = data.get("partialWord") as string;

    const firstLetter = partialWord.at(0) as string;

    cookies.set(
      "guess",
      guess.length === 0 && firstLetter !== letter
        ? partialWord.at(0) + letter
        : guess + letter,
      { path: "/" },
    );
  },
  return: async ({ request, cookies }) => {
    const data = await request.formData();
    const guess = data.get("guess") as string;

    if (!guess || guess === "") {
      return;
    }

    cookies.set("guess", guess.substring(0, guess.length - 1), { path: "/" });
  },
  submit: async ({ request, cookies, url }) => {
    const data = await request.formData();
    const guess = data.get("guess") as string;

    const iv = url.searchParams.get("iv");
    const encryptedWord = url.searchParams.get("encryptedWord");

    if (!encryptedWord || !iv) {
      redirect(302, "/generate");
    }

    cookies.set("guess", "", { path: "/" });

    const word = decrypt({ iv, encryptedMessage: encryptedWord });

    const validWord = guess === word || (await isInDictionary(guess));

    if (!validWord) {
      return fail(400, {
        message: "Ce mot n'est pas dans notre dictionnaire :/",
      });
    }

    const match = compareWords(word, guess);

    const guesses = cookies.get(`${encryptedWord}-guesses`);
    cookies.set(
      `${encryptedWord}-guesses`,
      guesses ? `${guesses}/${guess}-${match}` : `${guess}-${match}`,
      { path: "/" },
    );
  },
  score: async ({ request, url, cookies }) => {
    const data = await request.formData();

    const name = data.get("name") as string;
    const score = data.get("score") as string;
    const encryptedWord = url.searchParams.get("encryptedWord");

    const leaderboard = new Leaderboard(redis, `lb:${encryptedWord}`, {
      sortPolicy: "low-to-high",
      updatePolicy: "best",
      limitTopN: 10,
    });

    await leaderboard.update([{ id: name, value: Number(score) }]);

    cookies.set("score", name, { path: "/" });
  },
};
