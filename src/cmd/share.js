const meta = require("metascraper");
const fetch = require("node-fetch");
const log = require("../lib/log")("share");
const addProtocol = require("../lib//add-protocol");
const gh = require("../lib/gh");

const scrapper = meta([require("metascraper-title")()]);

async function getTitle(url) {
  log("Scrapping page title");
  const html = await fetch(url).then(res => res.text());
  try {
    return await scrapper({ html, url });
  } finally {
    log("Title scrapped");
  }
}

async function retrieve() {
  log("Retrieving list of currently shared links");
  const response = await gh(
    "/repos/sergiodxa/personal-site/contents/data/links.json",
    {
      method: "GET"
    }
  );
  const { content, sha } = await response.json();
  const rawContent = Buffer.from(content, "base64").toString();
  try {
    return { content: JSON.parse(rawContent), sha };
  } finally {
    log("List of shared links retrieved");
  }
}

async function upload(data, url, sha) {
  log("Uploading new list of shared links");
  try {
    return await gh("/repos/sergiodxa/personal-site/contents/data/links.json", {
      method: "PUT",
      body: JSON.stringify({
        message: `Add shared link for ${url}`,
        committer: {
          name: "Sergio Xalambrí",
          email: "hello@sergiodxa.com"
        },
        sha,
        content: data.toString("base64")
      })
    });
  } finally {
    log("Updated list of shared links successfully uploaded");
  }
}

async function main(url, comment) {
  if (!url) {
    log.error("Missing <url> argument");
    return process.exit(1);
  }

  if (!comment) {
    log.error("Missing <comment> argument");
    return process.exit(1);
  }

  if (comment.length > 200) {
    log.error(
      `The comment is too long (${
        comment.length
      }), try to keep it under 200 characters`
    );
    return process.exit(1);
  }

  log(`Sharing link ${url}`);
  const date = new Date().toJSON();
  const { title } = await getTitle(addProtocol(url));
  const { content, sha } = await retrieve();

  let newContent = content.reverse();
  newContent.push({
    url: addProtocol(url),
    title,
    comment,
    date
  });
  newContent = newContent.reverse();

  const buffer = Buffer.from(
    `${JSON.stringify(newContent, null, 2)}\n`,
    "utf8"
  );

  await upload(buffer, addProtocol(url), sha);

  log(`Link shared on https://sdx.im/link/${addProtocol(url)}!`);
}

module.exports = main;
