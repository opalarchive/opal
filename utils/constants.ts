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

export interface UserData {
  userId: string;
  email: string;
  emailVerified: boolean;
  username: string;
}

// take only these props from an object with these props and possibly more
export const getUserData = (user: object & UserData) => {
  return {
    userId: user.userId,
    email: user.email,
    emailVerified: user.emailVerified,
    username: user.username,
  };
};
