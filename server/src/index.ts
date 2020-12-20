/*
 * Welcome to the OPAL Backend:
 *  ___________    _________    __________    __
 * | _________ |  |    __   \  /   _____  \  |  |
 * | |       | |  |   |__|  |  |  |_____| |  |  |
 * | |       | |  |   _____/   |   ____   |  |  |
 * | |       | |  |  |         |  |    |  |  |  |
 * | |_______| |  |  |         |  |    |  |  |  |_______
 * |___________|  |__|         |__|    |__|  |__________|
 *
 * OPAL, or the Online Problem Archival Location is a convenient way to store
 * problems for a mathematics contest. The OPAL software allows problem
 * proposers to sign up, where they have a multitude of options, including, but
 * not limited to:
 *     - Proposing problems: With the simple LaTeX as you go syntax, it is
 *         simpler than ever to propose a problem. In addition, the simple UI
 *         interface provides all the necessary information.
 *     - Adding tags: Tags are necessary for almost anything, in order to make
 *         sure there is organization. OPAL has an in-built tagging mechanism,
 *         which allows any user to see problems satisfying the given
 *         constraints.
 *     - Difficulty ratings. Proposers and testsolvers can give difficulty
 *         ratings, which are then averaged to calculate the overall rating of
 *         the problem. Problems can be queried by average difficulty,
 *         difficulty according to a certain person, and the number of people
 *         who have rated it.
 *     - In-built search function. This search function not only allows you to
 *         easily access problems by searching the content, but allows
 *         additional filters, such as the problem proposer, difficulty ratings,
 *         tags, and number of solutions. This helps make it easy and efficient
 *         to sort out well-recieved problems from hard problems.
 *
 * OPAL aims to satisfy your needs for a problem management system. Here's a
 * general process of how a problem can be submitted (note that this is not
 * a strict guideline on how to use the system):
 *     1. The administrator (User 0) controls the three tags `Accepted`,
 *         `Shortlist`, and `Longlist`.
 *     2. User 1 proposes a problem to OPAL. He adds the fully LaTeXed problem,
 *          his difficulty ratings, appropriate tags, and his solution, which he
 *          elects to hide temporarily (this is to encourage solving the problem
 *          rather than looking at the official solution).
 *     3. Users 2 through 4 attempt to solve the problem. User 2 has a solution
 *          that is very similar to User 1, and his solution is recorded and he
 *          obtains access to all solutions to that problem (note that the
 *          feature is not intended to be abused - you shouldn't type in `Hi` as
 *          your solution, and then look at the official solution). This
 *          solution is documented the same, and while existing in the database,
 *          will not appear on the UI.
 *     4. User 3 has a different solution, and that gets documented as well. As
 *          his solution is different, it is going to be displayed in the UI.
 *     5. User 4 is unable to solve it, so then User 0 allows User 4t o view the
 *          available solutions (note solutions marked `duplicate` will not be
 *          displayed).
 *     6. The problem selection commitee (PSC) votes on the problem, and they
 *          give their votes to User 0. User 0 then will mark the problems
 *          accordingly, and can create additional tags to make it easy to see
 *          which problems are ranked at which difficulty. Note that these tags
 *          can be created so that only User 0 can change them, or the PSC as
 *          well.
 *
 * EXTRA FEATURES: WE WILL TRY TO ADD THEM
 * In addition, OPAL features one collaborative, real-time, LaTeX editor. This
 * LaTeX editor serves the purpose of being able to allow your problem proposers
 * to see what the test and shortlist will look like ahead of time, to catch any
 * clerical errors.
 *
 * OPAL is created by the following people:
 * @author Amol Rama
 * @author Anthony Wang
 * @author Arnav Adhikhari
 * @author Arul Kolla
 *
 * If you have any design ideas for OPAL, email us at
 *  ___________________________________________________________________________
 * |                                                                           |
 * |                  onlineproblemarchivallocation@gmail.com                  |
 * |___________________________________________________________________________|
 *
 * All code here is copyrighted by our team.
 */

/*
 * @name index
 *
 * This is the main file that runs the backend. The main backend is controlled
 * by an express web server, which takes requests, feeds them into the database,
 * and passes them back.
 */

/*
 * Critical requires that enable express. The bodyParser allows us to see the
 * contents of the request, while the port is where our server runs. Lastly, the
 * CORS is required to access the server in development.
 */

import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
const port = 2718;
const jsonEncoded = bodyParser.json();

app.use(cors());

const routes = fs
  .readdirSync(path.resolve(__dirname, "./route"))
  .filter((file) => file.endsWith(".js"));

routes.forEach((route) => {
  const file: {
    execute: (req: any, res: any) => void;
  } = require(`./route/${route}`);

  app.all(`/${route.substring(0, route.length - 3)}`, jsonEncoded, (req, res) =>
    file.execute(req, res)
  );
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
