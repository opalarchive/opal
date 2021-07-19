import { GetServerSideProps } from "next";
import Link from "next/link";
import EmailVerifyToken, {
  IEmailVerfiyToken,
} from "../../models/EmailVerifyToken";
import User, { IUser, UserData } from "../../models/User";
import { emailVerifyTokenLifespan } from "../../utils/constants";
import { useAuth } from "../../utils/jwt";
import { post } from "../../utils/restClient";

interface EmailVerifyProps {
  user: UserData | null;
  tokenExists: boolean;
  tokenExpired: boolean;
}

const sendEmailVerify = () => {
  post(`sendEmailVerify`);
};

const EmailVerify: React.FC<EmailVerifyProps> = ({
  user,
  tokenExists,
  tokenExpired,
}) => {
  if (!user) {
    return <div>Not logged in.</div>;
  }

  if (!tokenExists) {
    return (
      <div>
        Invalid email verification link. Click here to resend verification
        email: <button onClick={sendEmailVerify}>Resend</button>
      </div>
    );
  }

  if (tokenExpired) {
    return (
      <div>
        Email verification link expired. Click here to resend verification
        email: <button onClick={sendEmailVerify}>Resend</button>
      </div>
    );
  }

  return (
    <div>
      Successfully verified your email!{" "}
      <Link href="/project">Click here to back to project</Link>
    </div>
  );
};

export default EmailVerify;

export const getServerSideProps: GetServerSideProps<EmailVerifyProps> = async ({
  req,
  res,
}) => {
  const user = await useAuth(req, res);

  if (!user) {
    return { props: { user, tokenExists: false, tokenExpired: false } };
  }

  const maybeToken: IEmailVerfiyToken = await EmailVerifyToken.findOne({
    userId: user.userId,
  });

  if (!maybeToken) {
    return { props: { user, tokenExists: false, tokenExpired: false } };
  }
  // token expired
  if (maybeToken.creationDate < Date.now() - emailVerifyTokenLifespan) {
    return { props: { user, tokenExists: true, tokenExpired: true } };
  }

  const userDoc: IUser = await User.findOne({ userId: user.userId });
  userDoc.emailVerified = true;
  await userDoc.save();

  return { props: { user, tokenExists: true, tokenExpired: false } };
};
