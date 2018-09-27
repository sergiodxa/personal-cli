# personal-cli

A CLI tool with commands for personal usage.

## Usage

Install it from npm

```bash
yarn global add @sergiodxa/cli
```

Add the followings environment keys to your machine.

- `GITHUB_TOKEN`

Use it!

## Commands

### `cli essay <path> '<title>'`

Create a new essay entry on the specified `path` with the given `title`.

Optionally is possible to customize the layout to use with `--layout <name>` which by default is `essay`.

### `cli init <name> [type]`

Initialize a new project with the given name. This will:

- Create a directory with the given name inside `~/Project`
- Initialize Git inside that directory
- Initialize Yarn with default inside it
- Add `start`, `build` and `dev` scripts to package.json based on the type of project
- If type is defined create now.json and Dockerfile
- Lastly open VSCode inside the new project

The argument `type` is optional and defaults to none. Possible values are:

- `none`
- `next`
- `micro`
- `next-static`

### `cli short <url> <path>`

Add a new short URL to [sergiodxa/personal-shortening](https://github.com/sergiodxa/personal-shortening).

**Example**:
```bash
cli short https://sergiodxa.com /home
```

> **Note**: The `/` at the beginning of the path is optional.

> **Note**: The protocol is optional and will default to `https://`.

### `cli share <url> <comment>`

Share a new interesting link on sergiodxa.com/links.

**Example**:
```bash
cli share https://sergiodxa.com 'This a super interesting link!'
```

> **Note**: The protocol is optional and will default to `https://`.

### `cli slide <url> [title]

Initialize a new slidedeck with the defined URL and title.

***Example***:
```bash
cli slide micro-frontends 'Micro Frontend con React & Next.js'
```

> **Note**: In the case the title is provided the first slide (index.js) will also be generated using an H1 with the title.

> **Note**: All slides automatically have a generic _about_ slide.
