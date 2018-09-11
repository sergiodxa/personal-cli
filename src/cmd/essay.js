const fs = require("fs");
const childProcess = require("child_process");
const mkdirp = require("mkdirp");
const { promisify } = require("util");
const { resolve } = require("path");
const log = require("../lib/log")("essay");
const template = require("../template/essay.js");

const writeFile = promisify(fs.writeFile);
const createDir = promisify(mkdirp);
const exec = promisify(childProcess.exec);

async function main(path, title, { layout } = {}) {
  if (!path) {
    log.error("Missing <path> argument");
    return process.exit(1);
  }

  if (!title) {
    log.error("Missing <title> argument");
    return process.exit(1);
  }

  if (title.length > 100) {
    log.error(
      `The title is too long (${
        title.length
      }), try to keep it under 100 characters`
    );
    return process.exit(1);
  }

  if (!layout) {
    log.error("Missing <layout> argument");
    return process.exit(1);
  }

  log(`Creating new essay ${title}`);
  const slug = path.split("/").reverse()[0];

  log("Generating template");
  const content = template(
    slug,
    title,
    layout,
    path.split("/").filter(section => {
      if (section === "pages") return false;
      if (section === "essays") return false;
      return true;
    }).length - 1
  );

  log("Creating directory");
  await createDir(
    resolve(
      path
        .split("/")
        .reverse()
        .slice(1)
        .reverse()
        .join("/")
    )
  );

  log("Writing file to disk");
  await writeFile(`${resolve(path)}.mdx`, content, "utf8");

  log(
    `New essay file ${path} generated for the essay ${title}, time to write!`
  );

  log("Opening new file on local IDE");
  exec(`code ${resolve(path)}.mdx`);
}

module.exports = main;
