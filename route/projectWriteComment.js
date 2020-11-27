const clientdb = require('../helpers/clientdb');

module.exports = {
  path: '/project-write-comment',
  execute: async (req, res) => {
    const uuid = req.query.uuid;
    const problemId = req.query.problemId;
    const authuid = req.query.authuid;
    const text = req.query.text;
    
    const trydb = await clientdb(uuid, authuid);

    if (trydb[0] !== 200 || trydb[1] === 'unconfigured') {
      res.status(trydb[0]).send(trydb[1]);
      return;
    }

    const problem = await trydb[1].ref(`problems/${problemId}`).once('value').then(snapshot => snapshot.val());
    
    if (!problem) {
      res.status(404).send('problem-not-found');
      return;
    }

    let index = 0;
    if (!!problem.replies) {
      index = problem.replies.length;
    }

    const now = new Date();
    await trydb[1].ref(`problems/${problemId}/replies/${index}`).set({
      author: authuid,
      text,
      time: now.getTime(),
      type: 'comment'
    });

    res.status(201).send('success');
  }
}
