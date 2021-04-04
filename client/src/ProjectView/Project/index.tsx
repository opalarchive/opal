import React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import {
  ProjectPrivate,
  Problem,
  actionData,
  vote,
  problemAction,
  ReplyType,
  problemActionPrivileged,
  Server,
  replyAction,
  projectRole,
  Client,
  List,
} from "../../../../.shared";
import { poll } from "../../Constants";
import { Result } from "../../Constants/types";
import {
  getProjectPrivate,
  tryProblemAction,
  tryProblemActionPrivileged,
  newProblem,
  tryReplyAction,
  getProjectName,
  post,
  newList,
} from "../../Firebase";
import { NotificationsProps } from "../Template/Notifications";

import Loading from "../../Loading";
import Configure from "./Configure";
import View from "./View";
import ProjectAppbar from "./ProjectAppbar";

interface ProjectMatch {
  uuid: string;
}

interface ProjectProps
  extends RouteComponentProps<ProjectMatch>,
    NotificationsProps {
  authUser: firebase.User;
  setNotifications: () => Promise<void>;
  fail: () => void;
}

interface ProjectState {
  project: Result<ProjectPrivate | string>;
  editors: Result<Client.Editors>;
  name: Result<string>;
  bodyHeight: number;
  loading: boolean;
  myRole: projectRole;
}

class Project extends React.Component<ProjectProps, ProjectState> {
  state = {
    project: {
      success: false,
      value: "",
    } as Result<ProjectPrivate | string>,
    editors: {
      success: false,
      value: {},
    } as Result<Server.Editors>,
    name: {
      success: false,
      value: "",
    },
    bodyHeight: 0,
    loading: true,
    myRole: "EDITOR" as projectRole,
  };
  private interval: number = -1;
  private bodyRef = React.createRef<HTMLDivElement>();
  private bodyRendered = false;

  constructor(props: ProjectProps) {
    super(props);

    this.setProject = this.setProject.bind(this);
    this.tryProblemAction = this.tryProblemAction.bind(this);
    this.tryProblemActionPrivileged = this.tryProblemActionPrivileged.bind(
      this
    );
    this.tryReplyAction = this.tryReplyAction.bind(this);
    this.newProblem = this.newProblem.bind(this);
    this.newList = this.newList.bind(this);
  }

  async setProject(uuid: string, authUser: firebase.User) {
    try {
      const project = await getProjectPrivate(uuid, authUser);
      //note that the editors we receive from server has uids converted to usernames
      const editors = await post<Client.Editors>(
        "private/getEditors",
        {
          uuid,
        },
        authUser
      );
      const name = await getProjectName(uuid, authUser);
      const myRole: projectRole =
        editors.success && !!authUser.displayName
          ? editors.value[authUser.displayName].role
          : "EDITOR";

      this.setState({ project, editors, name, myRole, loading: false });
    } catch (e) {}
  }

  async componentDidMount() {
    try {
      await poll(
        () =>
          this.setProject(this.props.match.params.uuid, this.props.authUser),
        () => !this.state.loading,
        1500,
        200
      );
      this.interval = window.setInterval(() => {
        this.setProject(this.props.match.params.uuid, this.props.authUser);
      }, 30000);
    } catch (e) {
      this.props.fail();
    } finally {
      this.setState({ bodyHeight: this.bodyRef.current?.clientHeight || 0 });
    }
  }

  componentWillUnmount() {
    if (this.interval !== -1) {
      window.clearInterval(this.interval);
    }
  }

  clientSideAction(ind: number, data: actionData, type: problemAction) {
    let project = this.state.project;
    const displayName = !!this.props.authUser.displayName
      ? this.props.authUser.displayName
      : "";

    if (!project.success || typeof project.value === "string") {
      return project;
    }

    const now = new Date();
    var tags = project.value.problems[ind].tags;
    var index = 0;

    switch (type) {
      case "vote":
        if (data !== 1 && data !== -1) {
          break;
        }
        if (!project.value.problems[ind].votes) {
          project.value.problems[ind].votes = {};
        }

        const newVote: vote =
          project.value.problems[ind].votes[displayName] === data ? 0 : data;
        project.value.problems[ind].votes[displayName] = newVote;

        break;
      case "comment":
        if (typeof data !== "string") {
          break;
        }

        index = 0;
        if (!!project.value.problems[ind].replies) {
          index = project.value.problems[ind].replies.length;
        } else {
          project.value.problems[ind].replies = [];
        }

        project.value.problems[ind].replies[index] = {
          author: displayName,
          text: data,
          time: now.getTime(),
          type: ReplyType.COMMENT,
          lastEdit: now.getTime(),
        };

        break;
      case "solution":
        if (typeof data !== "string") {
          break;
        }

        index = 0;
        if (!!project.value.problems[ind].replies) {
          index = project.value.problems[ind].replies.length;
        } else {
          project.value.problems[ind].replies = [];
        }

        project.value.problems[ind].replies[index] = {
          author: displayName,
          text: data,
          time: now.getTime(),
          type: ReplyType.SOLUTION,
          lastEdit: now.getTime(),
        };

        break;
      case "removeTag":
        if (typeof data !== "string") {
          break;
        }

        project.value.problems[ind].tags = tags.filter((tag) => tag !== data);

        break;
      case "addTag":
        if (typeof data !== "object") {
          break;
        }

        if (data.length === 0) {
          break;
        }

        for (let i = 0; i < data.length; i++) {
          if (data[i].length > 0 && !tags.includes(data[i])) {
            project.value.problems[ind].tags.push(data[i]);
          }
        }

        break;
      default:
        break;
    }
    return project;
  }

  async tryProblemAction(ind: number, data: actionData, type: problemAction) {
    const oldProject = this.state.project;
    this.setState({ project: this.clientSideAction(ind, data, type) });

    const result = await tryProblemAction(
      this.props.match.params.uuid,
      ind,
      data,
      type,
      this.props.authUser
    );

    if (!result.success) {
      this.setState({ project: oldProject });
    }
  }

  clientSideActionPrivileged(
    ind: number,
    data: actionData,
    type: problemActionPrivileged
  ) {
    let project = this.state.project;
    if (!project.success || typeof project.value === "string") {
      return project;
    }

    switch (type) {
      case "editTitle":
        if (typeof data !== "string") {
          break;
        }

        project.value.problems[ind].title = data;

        break;
      case "editText":
        if (typeof data !== "string") {
          break;
        }

        project.value.problems[ind].text = data;

        break;
      case "editCategory":
        if (typeof data !== "string") {
          break;
        }

        project.value.problems[ind].category = data;

        break;
      case "editDifficulty":
        if (typeof data !== "number") {
          break;
        }

        //these two checks usually wont pass through since there's a slider, but its just in case

        if (data < 0) {
          data = 0;
        }

        if (data > 100) {
          data = 100;
        }

        project.value.problems[ind].difficulty = data;

        break;
      default:
        break;
    }
    return project;
  }

  async tryProblemActionPrivileged(
    ind: number,
    data: actionData,
    type: problemActionPrivileged
  ) {
    const oldProject = this.state.project;
    this.setState({
      project: this.clientSideActionPrivileged(ind, data, type),
    });

    const result = await tryProblemActionPrivileged(
      this.props.match.params.uuid,
      ind,
      data,
      type,
      this.props.authUser
    );

    if (!result.success) {
      this.setState({ project: oldProject });
    }
  }

  clientSideReplyAction(
    ind: number,
    replyInd: number,
    data: actionData,
    type: replyAction
  ) {
    let project = this.state.project;
    const displayName = !!this.props.authUser.displayName
      ? this.props.authUser.displayName
      : "";
    const now = new Date();

    if (!project.success || typeof project.value === "string") {
      return project;
    }

    switch (type) {
      case "editText":
        if (typeof data !== "string") {
          break;
        }

        if (
          displayName !== project.value.problems[ind].replies[replyInd].author
        ) {
          break;
        }

        project.value.problems[ind].replies[replyInd].text = data;
        project.value.problems[ind].replies[replyInd].lastEdit = now.getTime();

        break;
      case "editType":
        if (typeof data !== "string") {
          break;
        }

        if (
          displayName !== project.value.problems[ind].replies[replyInd].author
        ) {
          break;
        }

        if (!(data in ReplyType)) {
          break;
        }

        if (data === project.value.problems[ind].replies[replyInd].type) {
          break;
        }

        switch (data) {
          case ReplyType.COMMENT:
            project.value.problems[ind].replies[replyInd].type =
              ReplyType.COMMENT;
            break;
          case ReplyType.SOLUTION:
            project.value.problems[ind].replies[replyInd].type =
              ReplyType.SOLUTION;
            break;
          default:
            break;
        }
        project.value.problems[ind].replies[replyInd].lastEdit = now.getTime();

        break;
      case "delete":
        if (
          displayName !== project.value.problems[ind].replies[replyInd].author
        ) {
          break;
        }

        project.value.problems[ind].replies.splice(replyInd, 1);

        break;
      default:
        break;
    }
    return project;
  }

  async tryReplyAction(
    ind: number,
    replyInd: number,
    data: actionData,
    type: replyAction
  ) {
    const oldProject = this.state.project;
    this.setState({
      project: this.clientSideReplyAction(ind, replyInd, data, type),
    });

    const result = await tryReplyAction(
      this.props.match.params.uuid,
      ind,
      replyInd,
      data,
      type,
      this.props.authUser
    );

    if (!result.success) {
      this.setState({ project: oldProject });
    }
  }

  async newProblem(problem: Omit<Problem, "ind">) {
    const oldProject = this.state.project;
    let project = this.state.project;
    if (project.success && typeof project.value != "string") {
      let problemWithInd: Problem = {
        ...problem,
        ind: project.value.problems.length,
      };
      project.value.problems = [...project.value.problems, problemWithInd];
    }

    this.setState({ project });

    const result = await newProblem(
      this.props.match.params.uuid,
      problem,
      this.props.authUser
    );

    if (!result.success) {
      this.setState({ project: oldProject });
    }
  }

  async newList(list: List) {
    const oldProject = this.state.project;
    let project = this.state.project;
    if (project.success && typeof project.value != "string") {
      project.value.lists = [...project.value.lists, list];
    }

    this.setState({ project });

    const result = await newList(
      this.props.match.params.uuid,
      list,
      this.props.authUser
    );

    if (!result.success) {
      this.setState({ project: oldProject });
    }
  }

  // componentDidUpdate() {
  //   if (this.bodyRendered) {
  //     this.setState({});
  //   }
  // }

  render() {
    this.bodyRendered = false;

    const background = "rgb(0, 0, 0, 0.025)";

    const uuid = this.props.match.params.uuid;
    if (this.state.loading) {
      return <Loading background="white" />;
    }
    if (!this.state.project.success || !this.state.editors.success) {
      if (
        this.state.project.value === "does-not-exist" ||
        this.state.editors.value === "does-not-exist"
      ) {
        return "does not exist";
      }
      if (
        this.state.project.value === "forbidden" ||
        this.state.editors.value === "forbidden"
      ) {
        return "forbidden";
      }
      if (
        this.state.project.value === "trashed" ||
        this.state.editors.value === "trashed"
      ) {
        return "trashed";
      }
    } else {
      if (this.state.project.value === "unconfigured") {
        return (
          <>
            <ProjectAppbar
              notifs={this.props.notifs}
              notifsLoading={this.props.notifsLoading}
              markNotifications={this.props.markNotifications}
              title={this.state.name.success ? this.state.name.value : ""}
              uuid={uuid}
              disabled
            />
            <div
              style={{ position: "relative", flexGrow: 1, overflow: "hidden" }}
            >
              <Configure
                uuid={uuid}
                background={background}
                authUser={this.props.authUser}
                refresh={this.setProject}
              />
            </div>
          </>
        );
      }
    }
    if (typeof this.state.project.value === "string") {
      return "???";
    }
    if (!this.state.editors.success) return "???"; // obviously impossible, but it shuts lint up

    this.bodyRendered = true;
    return (
      <>
        <ProjectAppbar
          notifs={this.props.notifs}
          notifsLoading={this.props.notifsLoading}
          markNotifications={this.props.markNotifications}
          title={this.state.name.success ? this.state.name.value : ""}
          uuid={uuid}
        />
        <div
          style={{ position: "relative", flexGrow: 1, overflow: "hidden" }}
          ref={this.bodyRef}
        >
          <View
            background={background}
            bodyHeight={this.state.bodyHeight}
            project={this.state.project.value}
            editors={this.state.editors.value}
            uuid={uuid}
            tryProblemAction={this.tryProblemAction}
            tryProblemActionPrivileged={this.tryProblemActionPrivileged}
            tryReplyAction={this.tryReplyAction}
            fail={this.props.fail}
            authUser={this.props.authUser}
            myRole={this.state.myRole}
            newProblem={this.newProblem}
            newList={this.newList}
          />
        </div>
      </>
    );
  }
}

export default withRouter(Project);
