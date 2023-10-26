import { ENCRYPTING_KEY } from "$env/static/private";
import crypto from "crypto";

const algorithm = "aes-256-ctr";

// From https://attacomsian.com/blog/nodejs-encrypt-decrypt-data

export const encrypt = (message: string) => {
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv(algorithm, ENCRYPTING_KEY, iv);

  const encrypted = Buffer.concat([cipher.update(message), cipher.final()]);

  return {
    iv: iv.toString("hex"),
    encryptedMessage: encrypted.toString("hex"),
  };
};

export const decrypt = ({
  iv,
  encryptedMessage,
}: {
  iv: string;
  encryptedMessage: string;
}) => {
  const decipher = crypto.createDecipheriv(
    algorithm,
    ENCRYPTING_KEY,
    Buffer.from(iv, "hex"),
  );

  const decrpyted = Buffer.concat([
    decipher.update(Buffer.from(encryptedMessage, "hex")),
    decipher.final(),
  ]);

  return decrpyted.toString();
};
