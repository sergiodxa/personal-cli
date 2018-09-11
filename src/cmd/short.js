const log = require("../lib/log")("short");
const gh = require("../lib/gh");
const addProtocol = require("../lib/add-protocol");
const addSlash = require("../lib/add-slash");

async function retrieve() {
  log("Retrieving list of current short URLs");
  const response = await gh(
    "/repos/sergiodxa/personal-shortening/contents/data/urls.json",
    {
      method: "GET"
    }
  );
  const { content, sha } = await response.json();
  const rawContent = Buffer.from(content, "base64").toString();
  return { content: JSON.parse(rawContent), sha };
}

async function add({ long, short }) {
  const { content, sha } = await retrieve();

  const newContent = Object.assign({}, content, {
    [short]: long
  });

  const buffer = Buffer.from(
    `${JSON.stringify(newContent, null, 2)}\n`,
    "utf8"
  );

  try {
    log("Uploading new short URLs map");
    await gh("/repos/sergiodxa/personal-shortening/contents/data/urls.json", {
      method: "PUT",
      body: JSON.stringify({
        message: `Add short URL from ${short} to ${long}`,
        committer: {
          name: "Sergio Xalambrí",
          email: "hello@sergiodxa.com"
        },
        sha,
        content: buffer.toString("base64")
      })
    });
  } catch (error) {
    throw error;
  }

  return newContent;
}

async function main(url, path) {
  if (!url) {
    log.error("Missing <url> argument");
    return;
  }

  if (!path) {
    log.error("Missing <path> argument");
    return;
  }

  const long = addProtocol(url);
  const short = addSlash(path);

  log(`Adding short URL from ${short} to ${long}`);

  await add({
    long,
    short
  });

  log(`URL added on https://sdx.im${short}`);
}

module.exports = main;
