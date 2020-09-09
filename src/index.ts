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
        core.info(`Cirrus CLI binary found in cache ${cliPath}`);
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

        await startHTTPCachingServer();
        // use Docker bridge
        let localhostIP = process.platform === 'linux' ? '172.17.0.1' : 'localhost'
        let runArguments = ["run", "--environment", `CIRRUS_HTTP_CACHE_HOST=${localhostIP}:12321`];
        if (taskName != "") {
            runArguments.push(taskName);
        }
        await exec(`"${cliBinaryPath}"`, runArguments);
    } catch (error) {
        core.setFailed(error.message);
    }
}

async function startHTTPCachingServer() {
    let runArguments = [
        "run", "-d", "-p", `12321:12321`,
        "--name", "cache_proxy",
        "--env", "ACTIONS_CACHE_URL",
        "--env", "ACTIONS_RUNTIME_URL",
        "--env", "ACTIONS_RUNTIME_TOKEN",
        "ghcr.io/cirruslabs/actions-http-cache-proxy:latest"
    ];

    try {
        await exec(`"docker"`, runArguments);
    } catch (e) {
        core.error(e)
    }
}

run();