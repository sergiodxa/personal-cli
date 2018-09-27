function template(url) {
  return `import Slide from "components/slide";

export default () => (
  <Slide
    title=""
    basePath="/slides/${url}"
    next={null}
    prev={null}
    center
    dark
  >
  </Slide>
);
`;
}

module.exports = template;
