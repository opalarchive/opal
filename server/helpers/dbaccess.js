const { db } = require('./firebaseSetup');

const dbaccess = async (uuid, authuid) => {
  const projectPublic = await db.ref(`projectPublic/${uuid}`).once('value').then(snapshot => snapshot.val());

  if (!projectPublic) {
    // it doesn't exist
    return [404, 'does-not-exist'];
  }

  if (!projectPublic.editors[authuid]) {
    // you can't access it
    return [403, 'forbidden'];
  }

  if (projectPublic.trashed) {
    // trashed
    return [403, 'trashed'];
  }

  return [200, 'permitted'];
}

module.exports = dbaccess;