/*
 * Code by @DakotaLarson on Github.
 * See https://github.com/facebook/create-react-app/issues/6799#issuecomment-570081122
 */

const {
  override,
  removeModuleScopePlugin,
  getBabelLoader,
} = require("customize-cra");
const path = require("path");

console.log("f");

const addShared = (config) => {
  console.log(config);
  const loader = getBabelLoader(config, false);
  const sharedPath = path
    .normalize(path.join(process.cwd(), "../.shared/src/types"))
    .replace(/\\/g, "\\");

  loader.include = [loader.include, sharedPath];
  return config;
};

module.exports = override(addShared, removeModuleScopePlugin());
