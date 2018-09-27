function template(url) {
  return `import QuestionsSlide from "components/slides/questions";

export default () => (
  <QuestionsSlide
    basePath="/slides/${url}"
    prev={null}
    next="/"
  />
);
`;
}

module.exports = template;
