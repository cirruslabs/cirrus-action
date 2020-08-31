import * as core from '@actions/core';
import * as tc from '@actions/tool-cache';
import {exec} from "@actions/exec";
import {chmodSync} from "fs";

async function getCLI(version: string) {
  let path = version !== 'latest' ? await getCachedCLI(version) : await getLatestCLI();
  chmodSync(path, '755');
  return path;
}

async function getCachedCLI(version: string) {
    let cliPath = tc.find("cirrus", version);

    if (cliPath) {
        core.debug(`Tool found in cache ${cliPath}`);
        return cliPath;
    }
    let cliBinaryURL = "https://github.com/cirruslabs/cirrus-cli/releases/" + version + "/download/cirrus-linux-amd64";
    let cliBinaryToolFile = await tc.downloadTool(cliBinaryURL);
    return await tc.cacheFile(cliBinaryToolFile, "cirrus-cli", "cirrus", version);
}

async function getLatestCLI() {
    let cliBinaryURL = "https://github.com/cirruslabs/cirrus-cli/releases/latest/download/cirrus-linux-amd64";
    return await tc.downloadTool(cliBinaryURL);
}

async function run() {
    try {
        const cliVersion = core.getInput('version');
        const taskName = core.getInput('task');

        let cliBinaryPath = await getCLI(cliVersion);
        await exec(cliBinaryPath, ["run", taskName]);
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();