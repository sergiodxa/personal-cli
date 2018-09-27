const fs = require("fs");
const childProcess = require("child_process");
const mkdirp = require("mkdirp");
const { promisify } = require("util");
const { resolve, join } = require("path");

const log = require("../lib/log")("slide");

const template = {
  about: require("../template/slide-about"),
  empty: require("../template/slide-empty"),
  initial: require("../template/slide-initial"),
  questions: require("../template/slide-questions")
};

const writeFile = promisify(fs.writeFile);
const createDir = promisify(mkdirp);
const exec = promisify(childProcess.exec);

async function main(url, title) {
  if (!url) {
    log.error("Missing <url> argument");
    return process.exit(1);
  }

  if (title && title.length > 140) {
    log.error(
      `The title is too long (${
        title.length
      }), try to keep it under 140 characters`
    );
    return process.exit(1);
  }

  const path = resolve("pages/slides", url);

  log(`Creating new slidedeck "${title || url}"`);

  log("Generating templates");
  const about = template.about(url);
  const initial = title ? template.initial(url, title) : template.empty(url);
  const questions = template.questions(url);

  log("Creating directory");
  await createDir(path);

  log("Writing file to disk");
  await writeFile(`${join(path, "./index.js")}`, initial, "utf8");
  await writeFile(`${join(path, "./about.js")}`, about, "utf8");
  await writeFile(`${join(path, "./questions.js")}`, questions, "utf8");

  log(`Slidedeck generated!`);

  log("Opening slidedeck on VSCode");
  exec("code .");
}

module.exports = main;
