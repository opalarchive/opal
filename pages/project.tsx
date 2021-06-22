import { GetServerSideProps } from "next";
import { NextRouter, useRouter } from "next/router";
import { Dispatch, SetStateAction, useState } from "react";
import User, { IUser, UserData } from "../models/User";
import { useAuth } from "../utils/jwt";
import { post } from "../utils/restClient";

interface ProjectProps {
  user: UserData | null;
  emailVerified: boolean;
}

const sendEmailVerify = () => {
  post(`sendEmailVerify`);
};

const logout = async (router: NextRouter) => {
  const response = await post<string>(`logout`);

  if (response.success) {
    router.push("/");
  }
};

const ping = async (setPingResult: Dispatch<SetStateAction<number[]>>) => {
  // idk if this even works
  const timeBefore = Date.now();
  const response = await post<string>(`ping`);
  const timeAfter = Date.now();

  if (response.success) {
    setPingResult((pingResults) => [timeAfter - timeBefore, ...pingResults]);
  }
};

const Project: React.FC<ProjectProps> = ({ user, emailVerified }) => {
  const router = useRouter();
  const [pingResult, setPingResult] = useState<number[]>([]);

  if (!user) {
    return <div>Not logged in.</div>;
  }
  if (!emailVerified) {
    return (
      <div>
        Email unverified. Click here to resend verification email:{" "}
        <button onClick={sendEmailVerify}>Resend</button>
      </div>
    );
  }

  return (
    <div>
      <div>User ID: {user.userId}.</div>
      <button onClick={() => ping(setPingResult)}>ping</button>
      <button onClick={() => logout(router)}>logout</button>

      <div>
        {pingResult.map((ping, ind) => (
          <div key={`ping ${ind}th last`}>Pong! {ping}ms.</div>
        ))}
      </div>
    </div>
  );
};

export default Project;

export const getServerSideProps: GetServerSideProps<ProjectProps> = async ({
  req,
  res,
}) => {
  const user = await useAuth(req, res);

  let emailVerified = false;

  if (!!user) {
    const userDoc: IUser = await User.findOne({ userId: user.userId });
    emailVerified = userDoc.emailVerified;
  }

  return { props: { user, emailVerified } };
};
