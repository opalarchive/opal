import { clientdb } from "../../helpers/clientdb";
import * as firebase from "firebase-admin";
import {
  Problem,
  ProjectSettings,
  ProblemTemplate,
} from "../../../../.shared/src/types";
import {
  problemTextMaxLength,
  problemTitleMaxLength,
} from "../../../../.shared/src/constants";
import { Result } from "../../helpers/types";

const tryAction = async (
  cdb: firebase.database.Database,
  problemTemplate: ProblemTemplate,
  authuid: string
): Promise<Result<string>> => {
  let problems: Omit<Problem, "ind">[] | undefined = await cdb
    .ref(`problems`)
    .once("value")
    .then((snapshot) => snapshot.val());

  const problem: Omit<Problem, "ind"> = {
    ...problemTemplate,
    replies: [],
    tags: [],
    votes: {},
  };

  problems = problems || [];
  problems.push(problem);

  await cdb.ref(`problems`).set(problems);

  return { status: 200, value: "success" };
};

export const execute = async (req, res) => {
  const uuid: string = req.body.uuid;
  const problem: Omit<Problem, "ind" | "replies" | "tags" | "votes"> =
    req.body.problem;
  const authuid: string = req.body.authuid;

  if (!problem) {
    res.status(404).send("invalid-problem");
    return;
  }

  const trydb = await clientdb(uuid, authuid);

  if (trydb.status !== 200 || typeof trydb.value === "string") {
    res.status(trydb.status).send(trydb.value);
    return;
  }

  const projectSettings: ProjectSettings = await trydb.value
    .ref(`settings`)
    .once("value")
    .then((snapshot) => snapshot.val());

  if (
    !problem.category ||
    !Object.keys(projectSettings.categoryColors).includes(problem.category) ||
    typeof problem.difficulty !== "number" ||
    problem.difficulty < projectSettings.difficultyRange.start ||
    problem.difficulty > projectSettings.difficultyRange.end ||
    typeof problem.text !== "string" ||
    problem.text.length > problemTextMaxLength ||
    typeof problem.title !== "string" ||
    problem.title.length > problemTitleMaxLength
  ) {
    res.status(trydb.status).send(trydb.value);
    return;
  }

  const result = await tryAction(trydb.value, problem, authuid);
  res.status(result.status).send(result.value);
};
