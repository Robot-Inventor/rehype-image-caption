import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkBreaks from "remark-breaks";
import remarkRehype from "remark-rehype";
import rehypeImageCaption from "./index.js";
import rehypeStringify from "rehype-stringify";
import { expect, it } from "vitest";

const processor = unified().use(remarkParse).use(remarkRehype).use(rehypeImageCaption).use(rehypeStringify);

const processorWithoutWrapping = unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeImageCaption, { wrapImagesWithoutCaptions: false })
    .use(rehypeStringify);

const processorWithBreaks = unified()
    .use(remarkParse)
    .use(remarkBreaks)
    .use(remarkRehype)
    .use(rehypeImageCaption)
    .use(rehypeStringify);

const markdown = `
![alt text](image.jpg)

![alt text](image.jpg)*caption text*

![alt text](image.jpg)
*caption text*
`.trim();

const expectedWithoutWrapping = `
<p><img src="image.jpg" alt="alt text"></p>
<figure><img src="image.jpg" alt="alt text"><figcaption>caption text</figcaption></figure>
<figure><img src="image.jpg" alt="alt text"><figcaption>caption text</figcaption></figure>
`.trim();

const expected = `
<figure><img src="image.jpg" alt="alt text"></figure>
<figure><img src="image.jpg" alt="alt text"><figcaption>caption text</figcaption></figure>
<figure><img src="image.jpg" alt="alt text"><figcaption>caption text</figcaption></figure>
`.trim();

it("transforms image with caption to figure element", async () => {
    const result = await processor.process(markdown);
    expect(result.toString().trim()).toBe(expected);
});

it("does not wrap images without captions in figure when option is disabled", async () => {
    const result = await processorWithoutWrapping.process(markdown);
    expect(result.toString().trim()).toBe(expectedWithoutWrapping);
});

it("transforms image with caption to figure element with remark-breaks plugin", async () => {
    const result = await processorWithBreaks.process(markdown);
    expect(result.toString().trim()).toBe(expected);
});
