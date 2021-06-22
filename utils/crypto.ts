import { customAlphabet } from "nanoid";

const alphabet = "1234567890abcdef";
export const randomHex = (length: number) => customAlphabet(alphabet, length)();
