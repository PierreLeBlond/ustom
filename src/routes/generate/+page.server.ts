import { isInDictionary } from "$lib/components/dictionary/isInDictionary.js";
import { encrypt } from "$lib/crypto/crypto";

export const actions = {
  default: async ({ request }) => {
    const data = await request.formData();

    const word = data.get("word") as string;

    const { iv, encryptedMessage } = encrypt(word.toLowerCase());

    const validWord = await isInDictionary(word);

    return { word, iv, encryptedMessage, validWord };
  },
};
