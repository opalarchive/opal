/*
 * @name envSetup
 *
 * This helper sets up the environment file, by taking the environment file and
 * making it a JSON object, which can be used. Instead of process.env.ENV_VAR,
 * you would call [importName].ENV_VAR, essentially getting rid of process.
 *
 * @author Amol Rama, Anthony Wang
 * @since October 20, 2020
 */

import dotenv from "dotenv";
import { ENVTemplate } from "./types";

dotenv.config();

// get ts to shut up
const env = (process.env as unknown) as ENVTemplate;

export default env;
