const fetch = require("node-fetch");
const log = require("./log")();

const { GH_TOKEN } = process.env;

if (!GH_TOKEN) {
  log.error("The environment variable GH_TOKEN is not defined");
  process.exit(1);
}

function gh(url, options = {}) {
  const ROOT_URL = "https://api.github.com";

  return fetch(`${ROOT_URL}${url}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `token ${GH_TOKEN}`
    }
  });
}

module.exports = gh;
