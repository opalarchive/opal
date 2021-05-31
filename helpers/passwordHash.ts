import crypto from "crypto";
import { passwordKeyLength, passwordSaltLength } from "./constants";
import { randomHex } from "./crypto";

export const hash = (password: string): Promise<string> => {
  const salt = randomHex(passwordSaltLength);

  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, passwordKeyLength, (err, derivedKey) => {
      if (!!err) {
        reject(err);
      }
      resolve(`${salt}:${derivedKey.toString("hex")}`);
    });
  });
};

export const verify = (password: string, hash: string): Promise<boolean> => {
  const [salt, keyString] = hash.split(":");

  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, passwordKeyLength, (err, derivedKey) => {
      if (!!err) {
        reject(err);
      }

      resolve(
        crypto.timingSafeEqual(Buffer.from(keyString, "hex"), derivedKey)
      );
    });
  });
};
