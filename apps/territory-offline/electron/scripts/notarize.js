require("dotenv").config();
var { notarize } = require("@electron/notarize");

exports.default = async function notarizing(context) {
  const { electronPlatformName, appOutDir } = context;
  if (electronPlatformName !== "darwin") {
    return;
  }

  const appName = context.packager.appInfo.productFilename;
  const appPath = `${appOutDir}/${appName}.app`;
  console.log("\n\n\t Notarizing " + appName + "! Please wait...");
  console.log("apple id -> " + process.env.APPLEID);
  console.log("app path -> " + appPath);

  return await notarize({
    tool: "notarytool",
    appPath,
    appleId: process.env.APPLEID,
    appleIdPassword: process.env.APPLEIDPASS,
    teamId: process.env.APPLE_TEAM_ID,
  }).catch((error) => {
    console.error("\n\n\n\n");
    console.error("FEHLER: Notarization failed!");
    console.error("####################################");
    console.error(error);
    console.error("####################################");
    console.error("\n\n\n\n");

    throw new Error(error);
  });
};
