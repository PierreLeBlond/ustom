import { compareWords } from "$lib/compareWords";
import { decrypt } from "$lib/crypto/crypto";
import { redis } from "$lib/redis";
import { redirect } from "@sveltejs/kit";
import { Leaderboard } from "redis-rank";
import type { PageServerLoad } from "./$types";

const TRY_COUNTS = 6;

export const load: PageServerLoad = async ({ cookies, url }) => {
  const iv = url.searchParams.get("iv");
  const encryptedWord = url.searchParams.get("encryptedWord");

  if (!encryptedWord || !iv) {
    throw redirect(302, "/generate");
  }

  const word = decrypt({ iv, encryptedMessage: encryptedWord });

  const guess = cookies.get("guess") || word.at(0);

  if (!guess) {
    throw redirect(302, "/generate");
  }

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

  const wrongLetters = guesses
    .flatMap((guess) => guess)
    .filter(({ match }) => match === "x")
    .map(({ letter }) => letter);

  const uniqueWrongLetters = [...new Set(wrongLetters)];

  const won = guesses.some((guess) =>
    guess.every(({ match }) => match === "!"),
  );

  const leaderboard = new Leaderboard(redis, `lb:${encryptedWord}`, {
    sortPolicy: "low-to-high",
    updatePolicy: "best",
    limitTopN: 10,
  });

  const scores = await leaderboard.top(10);
  const scoreName = cookies.get("score");

  return {
    guess,
    guesses,
    wrongLetters: uniqueWrongLetters,
    lettersCount: word.length,
    tryCounts: TRY_COUNTS,
    won,
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

    const letter = data.get("letter");
    const guess = data.get("guess") as string;

    cookies.set("guess", guess + letter);
  },
  return: async ({ request, cookies }) => {
    const data = await request.formData();
    const guess = data.get("guess") as string;

    if (!guess || guess === "") {
      return;
    }

    cookies.set("guess", guess.substring(0, guess.length - 1));
  },
  submit: async ({ request, cookies, url }) => {
    const data = await request.formData();
    const guess = data.get("guess") as string;

    const iv = url.searchParams.get("iv");
    const encryptedWord = url.searchParams.get("encryptedWord");

    if (!encryptedWord || !iv) {
      throw redirect(302, "/generate");
    }

    const word = decrypt({ iv, encryptedMessage: encryptedWord });

    const match = compareWords(word, guess);

    const guesses = cookies.get(`${encryptedWord}-guesses`);
    cookies.set(
      `${encryptedWord}-guesses`,
      guesses ? `${guesses}/${guess}-${match}` : `${guess}-${match}`,
    );
    cookies.set("guess", "");
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

    cookies.set("score", name);
  },
};
