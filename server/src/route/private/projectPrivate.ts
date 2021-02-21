import {
  List,
  Problem,
  ProjectPrivate,
  reply,
  Votes,
} from "../../../../.shared/src/types";
import { clientdb } from "../../helpers/clientdb";
import { getIdToUsername } from "../../helpers/idToUsername";

export const execute = async (req, res) => {
  const uuid: string = req.body.uuid;
  const authuid: string = req.body.authuid;

  const trydb = await clientdb(uuid, authuid);

  if (trydb.status !== 200 || typeof trydb.value === "string") {
    res.status(trydb.status).send(trydb.value);
    return;
  }

  interface PseudoProjectPrivate
    extends Omit<ProjectPrivate, "lists" | "problems"> {
    // these can possibly be undefined because of how firebase stores empty arrays/objects
    lists?: (Omit<List, "problems"> & {
      problems?: number[];
    })[];
    problems?: (Omit<Problem, "ind" | "replies" | "tags" | "votes"> & {
      replies?: reply[];
      tags?: string[];
      votes?: Votes;
    })[];
  }

  const pseudoProjectPrivate: PseudoProjectPrivate = await trydb.value
    .ref("/")
    .once("value")
    .then((snapshot) => snapshot.val());
  const { problems, ...rest } = pseudoProjectPrivate;

  let projectPrivate: ProjectPrivate = { ...rest, lists: [], problems: [] };

  const idToUsername = await getIdToUsername();

  pseudoProjectPrivate.lists = pseudoProjectPrivate.lists || [];
  pseudoProjectPrivate.lists.forEach(({ problems, ...rest }, ind) => {
    projectPrivate.lists[ind] = {
      problems: problems || [],
      ...rest,
    };
  });

  pseudoProjectPrivate.problems = pseudoProjectPrivate.problems || [];
  pseudoProjectPrivate.problems.forEach(
    ({ replies, tags, votes, ...rest }, ind) => {
      projectPrivate.problems[ind] = {
        ind,
        replies: replies || [],
        tags: tags || [],
        votes: votes || {},
        ...rest,
      };
    }
  );

  // change private uids to usernames
  projectPrivate.problems.forEach((prob) => {
    prob.author = idToUsername(prob.author);
    // the uid is a key, so we have to turn the object into an array and back
    if (!!prob.votes) {
      prob.votes = Object.fromEntries(
        Object.entries(prob.votes).map(([uid, vote]) => [
          idToUsername(uid),
          vote,
        ])
      );
    }
    // uid is a value, so it can do directly changed
    if (!!prob.replies) {
      prob.replies.forEach((reply) => {
        reply.author = idToUsername(reply.author);
      });
    }
  });
  res.status(200).send(projectPrivate);
};
