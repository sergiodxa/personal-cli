const meow = require("meow");
const chalk = require("chalk");

const log = require("./lib/log")("cli");
const pkg = require("../package.json");

const cli = meow(
  `
  ${chalk.white("Usage")}
    $ ${chalk.cyan("essay <path> '<title>'")}
    $ ${chalk.cyan("share <url> '<comment>'")}
    $ ${chalk.cyan("short <url> <path>")}

  ${chalk.white("Aliases")}
    ${chalk.cyan("blog")} is alias of ${chalk.cyan("essay")}
`,
  {
    description: chalk.cyan("[cli] ") + chalk.white(pkg.description),
    flags: {
      layout: {
        type: "string",
        default: "essay"
      }
    }
  }
);

const [command, ...options] = cli.input;

switch (command) {
  case "essay":
  case "blog":
    return require("./cmd/essay.js")(...options, cli.flags);
  case "short":
    return require("./cmd/short.js")(...options);
  case "share":
    return require("./cmd/share.js")(...options);
  default: {
    if (command) {
      log(`The command ${command} is invalid`);
    }
    log("To see the available commands run `cli --help`");
  }
}
