import React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import {
  ProjectPrivate,
  Problem,
  data,
  vote,
  problemAction,
  ReplyType,
} from "../../../../.shared";
import { poll } from "../../Constants";
import { Result } from "../../Constants/types";
import { getProjectPrivate, tryProblemAction } from "../../Firebase";
import { getProjectName } from "../../Firebase";

import Loading from "../../Loading";
import Unconfigured from "./unconfigured";
import View from "./View";

interface ProjectMatch {
  uuid: string;
}

interface ProjectProps extends RouteComponentProps<ProjectMatch> {
  authUser: firebase.User;
  setNotifications: () => Promise<void>;
  setTitle: (title: string) => void;
  fail: () => void;
}

interface ProjectState {
  project: Result<ProjectPrivate | string>;
  loading: boolean;
}

class Project extends React.Component<ProjectProps, ProjectState> {
  state = {
    project: {
      success: true,
      value: { problems: [] as Problem[] },
    } as Result<ProjectPrivate | string>,
    loading: true,
  };
  private interval: number = -1;

  constructor(props: ProjectProps) {
    super(props);

    this.tryProblemAction = this.tryProblemAction.bind(this);
  }

  async setProject(uuid: string, authUser: firebase.User) {
    try {
      const project = await getProjectPrivate(uuid, authUser);
      const name = await getProjectName(uuid, authUser);

      if (name.success) {
        this.props.setTitle(name.value);
      }

      this.setState({ project, loading: false });
    } catch (e) {
      return e;
    }
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
    }
  }

  componentWillUnmount() {
    if (this.interval !== -1) {
      window.clearInterval(this.interval);
    }
  }

  clientSideAction(ind: number, data: data, type: problemAction) {
    let project = this.state.project;
    const displayName = !!this.props.authUser.displayName
      ? this.props.authUser.displayName
      : "";

    if (!project.success || typeof project.value === "string") {
      return project;
    }

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

        let index = 0;
        if (!!project.value.problems[ind].replies) {
          index = project.value.problems[ind].replies.length;
        } else {
          project.value.problems[ind].replies = [];
        }

        const now = new Date();
        project.value.problems[ind].replies[index] = {
          author: displayName,
          text: data,
          time: now.getTime(),
          type: ReplyType.COMMENT,
        };

        break;
      default:
        break;
    }
    return project;
  }

  async tryProblemAction(ind: number, data: data, type: problemAction) {
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

  render() {
    if (this.state.loading) {
      return <Loading background="white" />;
    }
    if (!this.state.project.success) {
      if (this.state.project.value === "does-not-exist") {
        return "does not exist";
      }
      if (this.state.project.value === "forbidden") {
        return "forbidden";
      }
      if (this.state.project.value === "trashed") {
        return "trashed";
      }
    } else {
      if (this.state.project.value === "unconfigured") {
        return <Unconfigured />;
      }
    }
    if (typeof this.state.project.value === "string") {
      return "???";
    }
    return (
      <View
        project={this.state.project.value}
        uuid={this.props.match.params.uuid}
        tryProblemAction={this.tryProblemAction}
        fail={this.props.fail}
        authUser={this.props.authUser}
      />
    );
  }
}

export default withRouter(Project);
