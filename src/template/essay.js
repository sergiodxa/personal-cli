function template(slug, title, layout = "essay", depth = 0) {
  const importPath = depth === 0 ? "../../" : "../".repeat(depth) + "../../";
  return `import withLayout from "${importPath}lib/with-layout.js";

export const meta = {
  title: "${title}",
  slug: "${slug}",
  date: "${new Date().toJSON()}",
  description: "",
  lang: "es",
  tags: []
}

export default withLayout("${layout}")(meta)`;
}

module.exports = template;
