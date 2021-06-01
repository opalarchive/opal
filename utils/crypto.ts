import * as crypto from "crypto";
import { customAlphabet } from "nanoid";

export const encrypt = (val: string): string => {
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    process.env.ENCRYPTION_KEY as string,
    process.env.ENCRYPTION_IV as string
  );

  let encrypted: string = cipher.update(val, "utf8", "base64");
  encrypted += cipher.final("base64");
  return encrypted;
};

export const decrypt = (encrypted: string): string => {
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    process.env.ENCRYPTION_KEY as string,
    process.env.ENCRYPTION_IV as string
  );

  let decrypted = decipher.update(encrypted, "base64", "utf8");
  return decrypted + decipher.final("utf8");
};

export const convertToURL = (toEncrypt: string): string => {
  let string = encrypt(toEncrypt);
  return string.replace(/\+/g, "-").replace(/\//g, "_").replace(/\=/g, "");
};

export const convertFromURL = (toDecrypt: string): string => {
  let string: string = toDecrypt.replace(/\-/g, "+").replace(/\_/g, "/");
  while (string.length % 4 !== 0) string += "=";
  return decrypt(string);
};

const alphabet = "1234567890abcdef";
export const randomHex = (length: number) => customAlphabet(alphabet, length)();
