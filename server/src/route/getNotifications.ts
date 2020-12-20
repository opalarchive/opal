import { getNotifications } from "../helpers/notification";

export const execute = async (req, res) => {
  const authuid: string = req.query.authuid;

  res.status(201).send(JSON.stringify(await getNotifications(authuid)));
};
