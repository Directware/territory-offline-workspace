const pjson = require('./../../package.json');
const fs = require('fs');
const baseDir = `${__dirname}/../release/`;
const azure = require('azure-storage');
const cliProgress = require('cli-progress');

/* Some important initialisations */
const releaseNameForMac = `territory-offline.dmg`;
const releaseNameForWin = `territory-offline.exe`;
const releaseNameForLinux = `territory-offline.AppImage`;
const currentReleaseConfigName = "current-release.json";
const BLOB_CONTAINER = "to-installations";
const filesToBeDeployed = [releaseNameForMac, releaseNameForWin, releaseNameForLinux, currentReleaseConfigName];
const startTime = new Date();
const blobService = azure.createBlobService();
const bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

createReleaseJsonFile();

filesToBeDeployed.forEach(fName =>
{
  if (!fs.existsSync(baseDir + fName))
  {
    console.log("Can not find file: " + fName);
    process.exit();
  }
});

uploadFilesToAzureBlob();

function createReleaseJsonFile()
{
  fs.writeFile(`${baseDir + currentReleaseConfigName}`, JSON.stringify({
    version: pjson.version,
    winFileName: releaseNameForWin,
    macFileName: releaseNameForMac,
    linuxFileName: releaseNameForLinux,
    creation: new Date()
  }), 'utf8', () =>
  {
  });
}

function uploadFilesToAzureBlob()
{
  if (filesToBeDeployed.length === 0)
  {
    console.log("");
    console.log(`#### Release successfully completed in ${timeDiference()}! ####`);
    return;
  }

  const a = BLOB_CONTAINER;
  const fileName = filesToBeDeployed[0];
  const c = `${baseDir}${fileName}`;
  console.log("Start upload: " + fileName);

  const d = {
    blockSize: 1024 * 1024
  };
  const speedSummary = blobService.createBlockBlobFromLocalFile(a, fileName, c, d, function (error, result, response)
  {
    if (error)
    {
      console.error(error);
    }
  });

  speedSummary.on('progress', function() {
    const percentComplete = speedSummary.getCompletePercent(2);

    bar1.start(100, percentComplete);

    if (percentComplete >= 100)
    {
      bar1.stop();
      filesToBeDeployed.shift();
      uploadFilesToAzureBlob();
    }
  });
}

function timeDiference()
{
  const timeDiff = new Date() - startTime;
  const minutes = Math.floor(timeDiff / 1000 / 60) + "";
  const sec = timeDiff - (minutes * 60 * 1000) + "";

  const formattedMins = minutes.padStart(2, "0");
  const formattedSec = sec.padStart(2, "0").slice(0, 2);
  return `${formattedMins}min ${formattedSec}sec`;
}
