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