function addSlash(path) {
  if (path.startsWith("/")) return path;
  return `/${path}`;
}

module.exports = addSlash;
