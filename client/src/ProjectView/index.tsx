import React, { useEffect, useState } from "react";

import * as ROUTES from "../Constants/routes";

import { Route, Switch } from "react-router-dom";

import Project from "./Project";
import Selection from "./Selection";
import { getNotifications, markNotifications } from "../Firebase";
import { poll } from "../Constants";
import Fail from "../Fail";
import { Notification } from "../../../.shared/src";
import { Result } from "../Constants/types";
import useAuthUser from "../Session/useAuthUser";
import firebase from "firebase";

const markNotifs = async (
  number: number,
  notifications: Result<Notification[]>,
  setNotifications: React.Dispatch<
    React.SetStateAction<Result<Notification[]>>
  >,
  authUser?: firebase.User | null
) => {
  if (!authUser) return;

  // equivalent of a "client side action"
  const previousNotifsSnapshot = notifications;
  if (notifications.success) {
    setNotifications((notifs) => {
      if (!notifs.success) return notifs;

      // copy the notifications array
      const newNotifs: Result<Notification[]> = {
        success: true,
        value: [...notifs.value.map((notif) => ({ ...notif }))],
      };
      for (let i = 0; i < Math.min(number, newNotifs.value.length); i++) {
        newNotifs.value[i].read = true;
      }
      return newNotifs;
    });
  }

  const attempt = await markNotifications(authUser, number);

  // undo on error
  if (!attempt.success) {
    setNotifications(previousNotifsSnapshot);
  }
};

const ProjectView: React.FC<{}> = () => {
  // get user object
  const authUser = useAuthUser();

  const [notifsLoading, setnotifsLoading] = useState(true);
  const [notifications, setNotifications] = useState<Result<Notification[]>>({
    success: true,
    value: [],
  });
  const [fail, setFail] = useState(false);

  useEffect(() => {
    if (!authUser) return;

    let backgroundFetch = -1;

    const fetchNotifications = async () => {
      if (!authUser) return;

      let success = false;

      try {
        let notifications = await getNotifications(authUser);
        setNotifications(notifications);

        if (notifications.success) {
          setnotifsLoading(false);
          success = true;
        }
      } catch (e) {
      } finally {
        return success;
      }
    };

    (async () => {
      try {
        await poll(fetchNotifications, (o) => !!o, 1500, 200);
        backgroundFetch = window.setInterval(fetchNotifications, 30000);
      } catch (e) {
        console.log(e);
        setFail(true);
      }
    })();

    return () => {
      if (backgroundFetch !== -1) {
        window.clearInterval(backgroundFetch);
      }
    };
  }, [authUser]);

  if (fail) {
    return <Fail />;
  }

  // still loading session
  if (authUser === undefined) {
    return <></>;
  }

  // not logged in
  if (authUser === null) {
    return <>Not logged in</>;
  }

  return (
    <div>
      <div
        style={{
          position: "relative",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Switch>
          <Route
            path={ROUTES.PROJECT_VIEW}
            render={() => (
              <Project
                authUser={authUser}
                fail={() => setFail(true)}
                notifs={notifications}
                notifsLoading={notifsLoading}
                markNotifications={(number) =>
                  markNotifs(number, notifications, setNotifications, authUser)
                }
              />
            )}
          />
          <Route
            render={() => (
              <Selection
                authUser={authUser}
                fail={() => setFail(true)}
                notifs={notifications}
                notifsLoading={notifsLoading}
                markNotifications={(number) =>
                  markNotifs(number, notifications, setNotifications, authUser)
                }
              />
            )}
          />
        </Switch>
      </div>
    </div>
  );
};

export default ProjectView;
