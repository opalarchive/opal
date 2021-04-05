/**
 * Quick hook for getting the current user.
 * We return firebase.User if signed in, null if signed out, and undefined if still loading
 */

import firebase from "firebase";
import { useEffect, useState } from "react";

import { auth } from "../Firebase";

const useAuthUser = () => {
  const [authUser, setAuthUser] = useState<firebase.User | null | undefined>(
    undefined
  );

  useEffect(() => {
    const listener = auth.onAuthStateChanged(
      // session status found
      (user) => {
        setAuthUser(user);
      },
      // error
      () => {
        setAuthUser(null);
      }
    );

    return () => {
      if (!!listener) listener();
    };
  }, []);

  return authUser;
};

export default useAuthUser;
