export const uuidLength = 18;

export const problemTitleMaxLength = 64;
export const problemTextMaxLength = 65536;

export const listNameMaxLength = 16;

export const siteURL = !process.env.PRODUCTION
  ? `http://localhost:${process.env.NEXT_PUBLIC_PORT}`
  : process.env.PRODUCTION_URL;

export const passwordSaltLength = 32; // in nibbles (1/2 bytes or hex chars)
export const passwordKeyLength = 64; // in bytes

export const accessTokenDuration = "5s";
