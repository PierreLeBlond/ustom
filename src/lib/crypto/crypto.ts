import { env } from "$env/dynamic/private";
import crypto from "crypto";

const algorithm = "aes-256-ctr";

// From https://attacomsian.com/blog/nodejs-encrypt-decrypt-data

export const encrypt = (message: string) => {
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv(algorithm, env.ENCRYPTING_KEY, iv);

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
    env.ENCRYPTING_KEY,
    Buffer.from(iv, "hex"),
  );

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedMessage, "hex")),
    decipher.final(),
  ]);

  return decrypted.toString();
};
