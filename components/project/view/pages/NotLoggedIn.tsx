import Link from "next/link";

const NotLoggedIn: React.FC<{}> = ({}) => {
  return (
    <div>
      Not logged in. Click <Link href="/login">here</Link> to login
    </div>
  );
};

export default NotLoggedIn;
