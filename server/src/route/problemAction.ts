import { clientdb } from "../helpers/clientdb";

const parseData = (data, type) => {
  switch (type) {
    case "vote":
      if (data === "-1") return -1;
      return 1;
    case "comment":
      return data;
    default:
      return null;
  }
};

const tryAction = async (cdb, problem, problemId, data, type, authuid) => {
  switch (type) {
    case "vote":
      const newVote =
        !!problem.votes && problem.votes[authuid] === data ? 0 : data;
      await cdb.ref(`problems/${problemId}/votes/${authuid}`).set(newVote);

      return;
    case "comment":
      let index = 0;
      if (!!problem.replies) {
        index = problem.replies.length;
      }

      const now = new Date();
      await cdb.ref(`problems/${problemId}/replies/${index}`).set({
        author: authuid,
        text: data,
        time: now.getTime(),
        type: "comment",
      });

      return;
  }
};

export const execute = async (req, res) => {
  const uuid = req.query.uuid;
  const problemId = req.query.problemId;
  let data = req.query.data;
  const type = req.query.type;
  const authuid = req.query.authuid;

  data = parseData(data, type);

  if (data === null) {
    res.status(404).send("action-not-found");
    return;
  }

  const trydb = await clientdb(uuid, authuid);

  if (trydb[0] !== 200 || trydb[1] === "unconfigured") {
    res.status(trydb[0]).send(trydb[1]);
    return;
  }

  const problem = await trydb[1]
    .ref(`problems/${problemId}`)
    .once("value")
    .then((snapshot) => snapshot.val());

  if (!problem) {
    res.status(404).send("problem-not-found");
    return;
  }

  await tryAction(trydb[1], problem, problemId, data, type, authuid);

  res.status(201).send("success");
};
