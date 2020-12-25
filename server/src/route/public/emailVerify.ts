import { convertFromURL } from "../../helpers/cryptoSetup";
import { auth, db } from "../../helpers/firebaseSetup";

export const execute = async (req, res) => {
  let encryptedUID: string = req.url.replace("/verify/", "");
  let uid: string;
  try {
    uid = convertFromURL(encryptedUID);
  } catch (e) {
    res.status(400).send("invalid-ID");
    return;
  }

  auth
    .updateUser(uid, { emailVerified: true })
    .then(async (userRecord) => {
      await db.ref(`userInformation/${userRecord.uid}/emailVerified`).set(true);
      res.status(200).send("Verified!");
    })
    .catch((error) => {
      res.status(400).send("There is no such user");
      return;
    });
};
