# rehype-image-caption

rehype plugin to set captions for images in addition to alt text.

## Installation

```sh
npm install rehype-image-caption
```

## Example

```javascript
import remarkParse from "remark-parse";
import rehypeStringify from "rehype-stringify";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import rehypeImageCaption from "rehype-image-caption";

const processor = unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeImageCaption)
    .use(rehypeStringify);

const markdown = `
![alt text](image.jpg)

![alt text](image.jpg)*caption text*

![alt text](image.jpg)
*caption text*
`;

processor.process(markdown).then((result) => {
    console.log(result.toString());
});
```

The above code will output the following:

```html
<figure>
    <img src="image.jpg" alt="alt text">
</figure>
<figure>
    <img src="image.jpg" alt="alt text">
    <figcaption>caption text</figcaption>
</figure>
<figure>
    <img src="image.jpg" alt="alt text">
    <figcaption>caption text</figcaption>
</figure>
```

## Options

### `wrapImagesWithoutCaptions`

- Type: `boolean`
- Default: `true`

Wrap images without captions in a `<figure>` tag. If set to `false`, images without captions will not be wrapped in a `<figure>` tag.

## Development

### Build

```sh
npm run build
```

### Format

```sh
npm run format
```

or

```sh
npm run format:check
```

### Lint

```sh
npm run lint
```

### Test

```sh
npm run test
```

### Pull Requests

This repository uses [Changesets](https://github.com/changesets/changesets) to manage versioning and releases. When creating a pull request, please run the Changesets CLI and commit the changeset file.

```bash
npx changeset
```
