const { clientdb } = require('../helpers/clientdb');

module.exports = {
  path: '/vote',
  execute: async (req, res) => {
    const uuid = req.query.uuid;
    const problemId = req.query.problemId;
    const authuid = req.query.authuid;
    let direction = req.query.direction;

    if (direction === '-1') direction = -1;
    else direction = 1;
    
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

    const newVote = (problem.votes[authuid] === direction) ? 0 : direction;

    await trydb[1].ref(`problems/${problemId}/votes/${authuid}`).set(newVote);

    res.status(201).send('success');
  }
}
