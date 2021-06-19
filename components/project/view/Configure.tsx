import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import Router from "next/router";
import { UserData } from "../../../models/User";
import { UserId, UUID } from "../../../utils/constants";
import { post } from "../../../utils/restClient";

interface ConfigureProps {
  uuid: UUID;
  user: UserData;
  owner: UserId;
}

const configure = async (uuid: UUID, password: string) => {
  const config = {
    apiKey: "AIzaSyB3qc8GB3uw9Tnjd8CreIgim_ygAp0EtLE",
    authDomain: "opal-test-7c795.firebaseapp.com",
    databaseURL: "https://opal-test-7c795-default-rtdb.firebaseio.com",
    projectId: "opal-test-7c795",
    storageBucket: "opal-test-7c795.appspot.com",
    messagingSenderId: "399693606120",
    appId: "1:399693606120:web:f76ac4da5cad1362a22d5d",
  };
  const response = await post<string>(`configure`, { uuid, config });

  if (response.success) {
    firebase.initializeApp(config, "opal");

    const auth = firebase.app("opal").auth();
    const db = firebase.app("opal").database();

    auth
      .createUserWithEmailAndPassword(
        "onlineproblemarchivallocation@gmail.com",
        password
      )
      .then(() => {
        auth
          .signInWithEmailAndPassword(
            "onlineproblemarchivallocation@gmail.com",
            password
          )
          .then(async ({ user }) => {
            if (!!user) {
              await db.ref(`${user.uid}/count`).set(0);

              Router.reload();
            }
          });
      });
  }
};

const Configure: React.FC<ConfigureProps> = ({ uuid, user, owner }) => {
  if (user.userId === owner) {
    return (
      <>
        <div>
          This project isn't configured! Configure it with firebase blah blah
          steps below
        </div>
        <button onClick={() => configure(uuid, "test-password")}>
          Configure with Hardcoded Data
        </button>
      </>
    );
  }
  return (
    <>
      This project isn't configured! Tell the owner to configure it with
      firebase so it can be used.
    </>
  );
};

export default Configure;
