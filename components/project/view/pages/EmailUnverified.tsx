import { post } from "../../../../utils/restClient";

const sendEmailVerify = () => {
  post(`sendEmailVerify`);
};

const EmailUnverified: React.FC<{}> = ({}) => {
  return (
    <div>
      Email unverified. Click here to resend verification email:{" "}
      <button onClick={sendEmailVerify}>Resend</button>
    </div>
  );
};

export default EmailUnverified;
