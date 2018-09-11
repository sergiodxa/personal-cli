function addProtocol(url) {
  if (url.startsWith("https://")) return url;
  if (url.startsWith("http://")) return url;
  return `https://${url}`;
}

module.exports = addProtocol;
