function template(url, title) {
  return `import Slide from "components/slide";
import { H1 } from "components/title";

export default () => (
  <Slide
    title="${title}"
    basePath="/slides/${url}"
    next="about"
    prev={null}
    center
    dark
  >
    <H1>${title}</H1>
  </Slide>
);
`;
}

module.exports = template;
