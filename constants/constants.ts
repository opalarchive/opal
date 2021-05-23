export const uuidLength = 18;

export const problemTitleMaxLength = 64;
export const problemTextMaxLength = 65536;

export const listNameMaxLength = 16;

export const siteURL = !!process.env.PRODUCTION
  ? `http://localhost:${process.env.PORT}`
  : process.env.PRODUCTION_URL;
