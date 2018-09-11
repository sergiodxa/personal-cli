const meow = require("meow");
const chalk = require("chalk");

const log = require("./lib/log")("cli");
const pkg = require("../package.json");

const cli = meow(
  `
  ${chalk.white("Usage")}
    $ ${chalk.cyan("essay <path> '<title>'")}
    $ ${chalk.cyan("init <name> [type]")}
    $ ${chalk.cyan("share <url> '<comment>'")}
    $ ${chalk.cyan("short <url> <path>")}

  ${chalk.white("Aliases")}
    $ ${chalk.cyan("blog <path> '<title>'")}
      Is alias of ${chalk.cyan("essay")}
  
  ${chalk.white("Init Types")}
    • ${chalk.cyan("none")} (default)
    • ${chalk.cyan("next")}
    • ${chalk.cyan("micro")}
    • ${chalk.cyan("next-static")}
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
  case "init":
    return require("./cmd/init.js")(...options);
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
