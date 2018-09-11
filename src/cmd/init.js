const fs = require("fs");
const childProcess = require("child_process");
const mkdirp = require("mkdirp");
const { promisify } = require("util");
const { resolve } = require("path");
const homeDir = require("os-homedir");
const latestVersion = require("latest-version");
const log = require("../lib/log")("init");
const gitIgnore = require("../template/gitIgnore");

const writeFile = promisify(fs.writeFile);
const createDir = promisify(mkdirp);
const exec = promisify(childProcess.exec);

const dockerFile = {
  next: `FROM mhart/alpine-node:10 as base
WORKDIR /usr/src
COPY package.json yarn.lock /usr/src/
RUN yarn install
COPY . .
RUN yarn build && yarn --production

FROM mhart/alpine-node:base-10
WORKDIR /usr/src
ENV NODE_ENV="production"
COPY --from=base /usr/src .
EXPOSE 3000
CMD ["node", "./node_modules/.bin/next", "start"]`,
  micro: `FROM mhart/alpine-node:10 as base
WORKDIR /usr/src
COPY package.json yarn.lock /usr/src/
RUN yarn --production
COPY . .

FROM mhart/alpine-node:base-10
WORKDIR /usr/src
ENV NODE_ENV="production"
COPY --from=base /usr/src .
CMD ["node", "./node_modules/.bin/micro"]`,
  "next-static": `FROM mhart/alpine-node:10
WORKDIR /usr/src
COPY package.json yarn.lock /usr/src/
RUN yarn install
COPY . .
RUN yarn build
RUN yarn export -o /public`
};

const nowConfig = name => ({
  next: JSON.stringify(
    {
      name,
      type: "docker",
      features: {
        cloud: "v2"
      }
    },
    null,
    2
  ),
  micro: nowConfig.next,
  "next-static": JSON.stringify(
    {
      name,
      type: "static"
    },
    null,
    2
  )
});

async function main(name, type) {
  if (!name) {
    log.error("Missing <name> argument");
    return process.exit(1);
  }

  log(`Initializing project ${name}${type ? ` of type ${type}` : ""}`);

  const fullPath = resolve(homeDir(), 'Projects', name);

  log(`Creating directory ${fullPath}`);
  await createDir(fullPath);

  log("Initializing Git");
  await exec(`git init ${fullPath}`);
  await writeFile(resolve(fullPath, '.gitignore'), gitIgnore(), 'utf8');

  log("Creating package.json");
  const pkg = {
    name,
    description: "",
    version: "0.0.0",
    main: "src/index.js",
    author:
      "Sergio Daniel Xalambrí <hello@sergiodxa.com> (https://sergiodxa.com/)",
    license: "MIT",
    scripts: {},
    dependencies: {},
    devDependencies: {}
  };

  switch (type) {
    case "next": {
      log("Customizing package.json for Next.js");
      pkg.scripts.dev = "next";
      pkg.scripts.build = "next build";
      pkg.scripts.start = "next start";
      delete pkg.main
      pkg.dependencies.next = await latestVersion("next");
      pkg.dependencies.react = await latestVersion("react");
      pkg.dependencies['react-dom'] = await latestVersion("react-dom");
      break;
    }
    case "micro": {
      log("Customizing package.json for micro");
      pkg.scripts.dev = "micro-dev";
      pkg.scripts.start = "micro";
      pkg.dependencies.micro = await latestVersion("micro");
      pkg.dependencies['now-env'] = await latestVersion("now-env");
      pkg.devDependencies['micro-dev'] = await latestVersion("micro-dev");
      break;
    }
    case "next-static": {
      log("Customizing package.json for Next.js static");
      pkg.scripts.dev = "next";
      pkg.scripts.build = "next build";
      pkg.scripts.export = "next export";
      delete pkg.main
      pkg.dependencies.next = await latestVersion("next");
      pkg.dependencies.react = await latestVersion("react");
      pkg.dependencies['react-dom'] = await latestVersion("react-dom");
      break;
    }
  }

  log("Adding package.json");
  await writeFile(
    resolve(fullPath, "package.json"),
    JSON.stringify(pkg, null, 2),
    "utf8"
  );

  if (type && dockerFile[type]) {
    log(`Creating Dockerfile for ${type}`);
    await writeFile(resolve(fullPath, "Dockerfile"), dockerFile[type], "utf8");
  }

  if (type && nowConfig(name)[type]) {
    log(`Creating now.json for ${type}`);
    await writeFile(
      resolve(fullPath, "now.json"),
      nowConfig(name)[type],
      "utf8"
    );
  }

  log("Opening new project VSCode");
  await exec(`code ${fullPath}`);
}

module.exports = main;
