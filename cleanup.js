const fs = require("fs");
const glob = require("glob");
const rimraf = require("rimraf");

const extensions = ["*.js", "*.d.ts", "tsconfig.tsbuildinfo"];
const approved = ["cleanup.js", "client/config-overrides.js"];

glob.glob(
  `**/+(${extensions.join("|")})`,
  { ignore: [`**/node_modules/**/+(${extensions.join("|")})`] },
  (err, files) => {
    if (err) {
      console.log("\x1b[31m%s\x1b[0m", err);
      return;
    }

    files.forEach((file) => {
      if (!approved.includes(file)) {
        fs.unlink(file, (err) => {
          if (err) {
            console.log("\x1b[31m%s\x1b[0m", err);
            return;
          }
          console.log("\x1b[32m%s\x1b[0m", `${file} has been removed.`);
        });
      }
    });
  }
);

rimraf("server/built-src", (err) => {
  if (err) {
    console.log("\x1b[31m%s\x1b[0m", err);
    return;
  }
  console.log("\x1b[32m%s\x1b[0m", `server/built-src has been removed.`);
});
