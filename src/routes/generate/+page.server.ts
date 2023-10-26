import { decrypt, encrypt } from "$lib/crypto/crypto";
import { redirect } from "@sveltejs/kit";

export const load = ({ url }) => {
  const encryptedWord = url.searchParams.get("encryptedWord");
  const iv = url.searchParams.get("iv");

  const word =
    iv && encryptedWord
      ? decrypt({ iv, encryptedMessage: encryptedWord })
      : null;

  return {
    encryptedWord,
    iv,
    word,
  };
};

export const actions = {
  default: async ({ request }) => {
    const data = await request.formData();

    const word = data.get("word") as string;

    const { iv, encryptedMessage } = encrypt(word.toLowerCase());

    throw redirect(302, `generate?encryptedWord=${encryptedMessage}&iv=${iv}`);
  },
};
