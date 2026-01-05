import { isInDictionary } from "$lib/components/dictionary/isInDictionary.js";
import { encrypt } from "$lib/crypto/crypto";
import { fail } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { z } from "zod/v3";

const schema = z.object({
  word: z
    .string()
    .min(6, { message: "Le mot doit contenir au moins 6 lettres" })
    .max(10, { message: "Le mot doit contenir au plus 10 lettres" })
    .regex(/^[a-zA-Z]+$/, {
      message: "Le mot doit contenir uniquement des lettres, sans accents",
    }),
});

export const load = async () => {
  const form = await superValidate(zod(schema));

  return {
    form,
  };
};

export const actions = {
  default: async ({ request }) => {
    const form = await superValidate(request, zod(schema));

    if (!form.valid) {
      return fail(400, { form });
    }

    const { word } = form.data;

    const { iv, encryptedMessage } = encrypt(word.toLowerCase());

    const validWord = await isInDictionary(word);

    return { form, word, iv, encryptedMessage, validWord };
  },
};
