import React, { useEffect, useMemo, useState } from "react";

import * as ROUTES from "../../Constants/routes";

import { Route } from "react-router-dom";

import Sidebar from "./Sidebar";
import Loading from "../../Loading";
import Table from "./Table";
import {
  getVisibleProjects,
  starProject,
  tryProjectActionAdmin,
} from "../../Firebase";
import ScrollBase from "../Template/ScrollBase";
import { poll, projectViewTypes } from "../../Constants";
import {
  Client,
  isProjectActionAdmin,
  isProjectActionEditor,
  projectAction,
  ProjectActionAdmin,
  ProjectActionEditor,
  ProjectRole,
} from "../../../../.shared/src";
import {
  ProjectViewSort,
  ProjectDataPoint,
  ProjectViewType,
  ProjectViewFilter,
  Result,
} from "../../Constants/types";
import SidebaredBase from "../Template/SidebaredBase";
import { NotificationsProps } from "../Template/Notifications";
import SelectionAppbar from "./SelectionAppbar";

interface SelectionBaseProps {
  tryProjectAction: (
    uuid: string,
    type: projectAction,
    data?: string
  ) => Promise<boolean>;
  type: ProjectViewType;
  visibleProjects: Client.Publico;
  authUser: firebase.User;
}

const SelectionBase: React.FC<SelectionBaseProps> = ({
  tryProjectAction,
  type,
  visibleProjects,
  authUser,
}) => {
  const isProjectSelectable = (
    project: Client.ProjectPublic,
    filter: ProjectViewFilter
  ) => {
    if (project.trashed) {
      return filter.includeTrash;
    }
    if (project.starred && filter.includeAllStarred) {
      return true;
    }
    if (project.owner === authUser.displayName) {
      if (filter.includeMine) {
        return true;
      }
    } else if (
      Object.keys(project.editors).includes(authUser.displayName!) &&
      filter.includeShared
    ) {
      return true;
    }
    return false;
  };

  let projects: Client.Publico = {};
  let data: ProjectDataPoint[] = [];
  let fixed: boolean = false; // whether we can't sort (i.e. fixed => no sorting)
  let defaultSort: ProjectViewSort = {
    dataPoint: "name",
    direction: "asc",
  };

  let projectsKeys = Object.keys(visibleProjects).filter((id) =>
    isProjectSelectable(visibleProjects[id], projectViewTypes[type].filter)
  );

  if (projectsKeys.length > 0) {
    projects = Object.fromEntries(
      projectsKeys.map((id) => [id, visibleProjects[id]])
    );
  }
  data = projectViewTypes[type].data;
  fixed = projectViewTypes[type].fixed;
  defaultSort = projectViewTypes[type].defaultSort;

  return (
    <Table
      projects={projects}
      tryProjectAction={tryProjectAction}
      data={data}
      fixed={fixed}
      defaultSort={defaultSort}
      authUser={authUser}
      name={type}
    />
  );
};

interface SelectionProps extends NotificationsProps {
  authUser: firebase.User;
  fail: () => void;
}

const Selection: React.FC<SelectionProps> = ({
  notifs,
  notifsLoading,
  markNotifications,
  authUser,
  fail,
}) => {
  const [visibleProjects, setVisibleProjects] = useState<Client.Publico>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let backgroundFetch: number = -1;

    const setProjects = async () => {
      if (!authUser) return;

      let success = false;

      try {
        const visibleProjects = await getVisibleProjects(authUser);
        if (visibleProjects.success) {
          setVisibleProjects(visibleProjects.value);
          setLoading(false);
          success = true;
        }
      } catch (e) {
      } finally {
        return success;
      }
    };

    (async () => {
      try {
        await poll(setProjects, (o) => !!o, 1500, 200);

        backgroundFetch = window.setInterval(() => {
          setProjects();
        }, 30000);
      } catch (e) {
        fail();
      }
    })();

    return () => {
      if (backgroundFetch !== -1) {
        window.clearInterval(backgroundFetch);
      }
    };
  }, [authUser, fail]);

  const tryProjectAction = useMemo(() => {
    // does a temporary "client sided action"
    // occurs right before sending command to server so that
    // users sees results from their actions instantaneously
    // even if the true update isn't
    const clientSideAction = (
      projects: Client.Publico,
      uuid: string,
      type: projectAction,
      data?: string
    ): Client.Publico => {
      if (isProjectActionAdmin(type)) {
        // this is a public edit, so set last edit to now
        projects = {
          ...projects,
          [uuid]: {
            ...projects[uuid],
            editors: {
              [authUser.displayName!]: {
                ...projects[uuid].editors[authUser.displayName!],
                lastEdit: Date.now(),
              },
            },
          },
        };

        switch (ProjectActionAdmin[type]) {
          case ProjectActionAdmin.CHANGE_NAME:
            if (!!data) {
              return {
                ...projects,
                [uuid]: {
                  ...projects[uuid],
                  name: data,
                },
              };
            }
            break;
          case ProjectActionAdmin.DELETE:
            return {
              ...projects,
              [uuid]: {
                ...projects[uuid],
                trashed: true,
              },
            };
          case ProjectActionAdmin.RESTORE:
            return {
              ...projects,
              [uuid]: {
                ...projects[uuid],
                trashed: false,
              },
            };
          case ProjectActionAdmin.SHARE:
            if (!!data) {
              // the enum is (should) be arranged in order of decreasing power
              if (
                !!projects[uuid].editors[data] &&
                ProjectRole[projects[uuid].editors[data].role] <=
                  ProjectRole.EDITOR
              ) {
                console.log("Error: user is already shared");
                // TODO: some kind of snackbar thing here
              } else {
                return {
                  ...projects,
                  [uuid]: {
                    ...projects[uuid],
                    editors: {
                      ...projects[uuid].editors,
                      [data]: {
                        lastEdit: Date.now(),
                        shareDate: Date.now(),
                        role: "EDITOR",
                      },
                    },
                  },
                };
              }
            }
            break;
          case ProjectActionAdmin.UNSHARE:
            if (!!data) {
              if (
                !projects[uuid].editors[data] ||
                ProjectRole[projects[uuid].editors[data].role] ===
                  ProjectRole.REMOVED
              ) {
                console.log("Error: user is not shared");
                // TODO: some kind of snackbar thing here
              } else {
                return {
                  ...projects,
                  [uuid]: {
                    ...projects[uuid],
                    editors: {
                      ...projects[uuid].editors,
                      [data]: {
                        ...projects[uuid].editors[data],
                        role: "REMOVED",
                      },
                    },
                  },
                };
              }
            }
            break;
          case ProjectActionAdmin.PROMOTE:
            if (!!data) {
              if (
                !projects[uuid].editors[data] ||
                ProjectRole[projects[uuid].editors[data].role] !==
                  ProjectRole.EDITOR
              ) {
                console.log("Error: user is not editor");
                // TODO: some kind of snackbar thing here
              } else {
                return {
                  ...projects,
                  [uuid]: {
                    ...projects[uuid],
                    editors: {
                      ...projects[uuid].editors,
                      [data]: {
                        ...projects[uuid].editors[data],
                        role: "ADMIN",
                      },
                    },
                  },
                };
              }
            }
            break;
          case ProjectActionAdmin.DEMOTE:
            if (!!data) {
              if (
                !projects[uuid].editors[data] ||
                ProjectRole[projects[uuid].editors[data].role] ===
                  ProjectRole.ADMIN
              ) {
                console.log("Error: user is not admin");
                // TODO: some kind of snackbar thing here
              } else {
                return {
                  ...projects,
                  [uuid]: {
                    ...projects[uuid],
                    editors: {
                      ...projects[uuid].editors,
                      [data]: {
                        ...projects[uuid].editors[data],
                        role: "EDITOR",
                      },
                    },
                  },
                };
              }
            }
            break;
          default:
            break;
        }
      } else if (isProjectActionEditor(type)) {
        switch (ProjectActionEditor[type]) {
          case ProjectActionEditor.STAR:
            return {
              ...projects,
              [uuid]: {
                ...projects[uuid],
                starred: !projects[uuid].starred,
              },
            };
          default:
            break;
        }
      } else {
        console.log("Undefined");
      }

      return projects;
    };
    return async (
      uuid: string,
      type: projectAction,
      data?: string
    ): Promise<boolean> => {
      const previousProjectsSnapshot = visibleProjects;
      setVisibleProjects((projects) =>
        clientSideAction(projects, uuid, type, data)
      );

      let attempt: Result<string> = { success: false, value: "" };

      if (isProjectActionAdmin(type)) {
        attempt = await tryProjectActionAdmin(uuid, authUser, type, data);
      } else if (isProjectActionEditor(type)) {
        // currently this is the only trivial action, but this may change
        // TODO: generalize this
        attempt = await starProject(uuid, authUser);
      } else {
        console.log("Undefined");
      }

      if (!attempt.success) {
        setVisibleProjects(previousProjectsSnapshot);
      }

      return attempt.success;
    };
  }, [visibleProjects, authUser]);

  if (loading) {
    return <Loading background="white" />;
  }
  return (
    <>
      <SelectionAppbar
        notifs={notifs}
        notifsLoading={notifsLoading}
        markNotifications={markNotifications}
        title="Project Selection"
      />
      <div style={{ position: "relative", flexGrow: 1, overflow: "hidden" }}>
        <ScrollBase maxWidth={1320} background="rgb(0, 0, 0, 0.025)">
          <SidebaredBase
            sidebarWidth={15}
            Sidebar={Sidebar}
            fixedSidebar
            authUser={authUser}
          >
            <Route
              exact
              path={ROUTES.PROJECT}
              render={() => (
                <SelectionBase
                  tryProjectAction={tryProjectAction}
                  type="priority"
                  visibleProjects={visibleProjects}
                  authUser={authUser}
                />
              )}
            />
            <Route
              exact
              path={ROUTES.SELECTION_PRIORITY}
              render={() => (
                <SelectionBase
                  tryProjectAction={tryProjectAction}
                  type="priority"
                  visibleProjects={visibleProjects}
                  authUser={authUser}
                />
              )}
            />
            <Route
              exact
              path={ROUTES.SELECTION_MY_PROJECTS}
              render={() => (
                <SelectionBase
                  tryProjectAction={tryProjectAction}
                  type="myProjects"
                  visibleProjects={visibleProjects}
                  authUser={authUser}
                />
              )}
            />
            <Route
              exact
              path={ROUTES.SELECTION_SHARED_WITH_ME}
              render={() => (
                <SelectionBase
                  tryProjectAction={tryProjectAction}
                  type="sharedWithMe"
                  visibleProjects={visibleProjects}
                  authUser={authUser}
                />
              )}
            />
            <Route
              exact
              path={ROUTES.SELECTION_RECENT}
              render={() => (
                <SelectionBase
                  tryProjectAction={tryProjectAction}
                  type="recent"
                  visibleProjects={visibleProjects}
                  authUser={authUser}
                />
              )}
            />
            <Route
              exact
              path={ROUTES.SELECTION_TRASH}
              render={() => (
                <SelectionBase
                  tryProjectAction={tryProjectAction}
                  type="trash"
                  visibleProjects={visibleProjects}
                  authUser={authUser}
                />
              )}
            />
          </SidebaredBase>
        </ScrollBase>
      </div>
    </>
  );
};

export default Selection;
