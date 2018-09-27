function template(url) {
  return `import AboutSlide from "components/slides/about";

export default () => (
  <AboutSlide basePath="/slides/${url}" next={null} />
);
`;
}

module.exports = template;
