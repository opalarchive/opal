const { auth, db } = require('../helpers/firebaseSetup');
const { convertFromURL } = require('../helpers/cryptoSetup');

module.exports = {
  path: "/verify/:id",
  execute: async (req, res) => {
    let encryptedUID = req.url.replace('/verify/', '');
    let uid;
    try {
      uid = convertFromURL(encryptedUID);
    }
    catch (e) {
      res.status(400).send("Invalid ID");
      return;
    }
    auth.updateUser(uid, { emailVerified: true }).then(async userRecord => {
      await db.ref(`userInformation/${userRecord.uid}/emailVerified`).set(true);
      res.status(200).send("Verified!");
    }).catch(error => {
      res.status(400).send("There is no such user");
      return;
    });
  }
}
