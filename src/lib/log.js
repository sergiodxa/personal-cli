const chalk = require("chalk");

const log = command => {
  const logger = (...args) => {
    console.log(chalk.cyan(`[${command}]`), ...args);
  };
  logger.error = (...args) => {
    console.error(chalk.red("[err]"), ...args);
  };
  return logger;
};

module.exports = log;
