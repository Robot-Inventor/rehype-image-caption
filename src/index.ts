// eslint-disable-next-line import-x/no-unassigned-import
import "mdast-util-mdx-jsx";
import type { ElementContent, Root } from "hast";
import type { Plugin, Transformer } from "unified";
import { isElement } from "hast-util-is-element";
import { visit } from "unist-util-visit";

interface Options {
    /**
     * Wrap images without captions in a `<figure>` tag.
     * If set to `false`, images without captions will not be wrapped in a `<figure>` tag.
     * @default `true`
     */
    wrapImagesWithoutCaptions?: boolean;
}

/**
 * Check if a node is an image.
 * @param node Node to check
 * @returns `true` if the node is an image, `false` otherwise
 */
const isImage = (node: ElementContent): boolean => {
    try {
        if (node.type === "mdxJsxFlowElement" && ["astro-image", "img"].includes(node.name ?? "")) {
            return true;
        }
        return isElement(node, "img");
    } catch {
        return false;
    }
};

/**
 * `rehype` plugin to set captions for images in addition to alt text.
 * @param options Options
 * @returns Transformer
 * @example
 *
 * Input:
 *
 * ```markdown
 * ![alt text](image.jpg)
 *
 * ![alt text](image.jpg)*caption text*
 *
 * ![alt text](image.jpg)
 * *caption text*
 * ```
 *
 * Output:
 *
 * ```html
 * <figure>
 *     <img src="image.jpg" alt="alt text">
 * </figure>
 * <figure>
 *     <img src="image.jpg" alt="alt text">
 *     <figcaption>caption text</figcaption>
 * </figure>
 * <figure>
 *     <img src="image.jpg" alt="alt text">
 *     <figcaption>caption text</figcaption>
 * </figure>
 * ```
 */
// eslint-disable-next-line max-lines-per-function
const rehypeImageCaption: Plugin<[Options?], Root> = (options: Options = { wrapImagesWithoutCaptions: true }) => {
    /**
     * Transformer
     * @param tree Root node
     */
    // eslint-disable-next-line max-lines-per-function
    const transformer: Transformer<Root> = (tree) => {
        // eslint-disable-next-line max-lines-per-function, max-statements
        visit(tree, "element", (node) => {
            const [firstChild] = node.children;
            if (!firstChild) return;

            if (!(node.tagName === "p" && isImage(firstChild))) return;

            // eslint-disable-next-line no-magic-numbers
            if (node.children.length === 1 && options.wrapImagesWithoutCaptions) {
                // Image without caption
                node.tagName = "figure";
                node.children = [firstChild];
                // eslint-disable-next-line no-magic-numbers
            } else if (node.children.length === 2 && isElement(node.children[1], "em")) {
                // Image with caption without line break
                node.tagName = "figure";
                node.children = [
                    firstChild,
                    {
                        type: "element",
                        tagName: "figcaption",
                        properties: {},
                        children: node.children[1].children
                    }
                ];
            } else if (
                // eslint-disable-next-line no-magic-numbers
                node.children.length === 3 &&
                node.children[1] &&
                node.children[1].type === "text" &&
                node.children[1].value.trim() === "" &&
                isElement(node.children[2], "em")
            ) {
                // Image with caption with line break
                node.tagName = "figure";
                node.children = [
                    firstChild,
                    {
                        type: "element",
                        tagName: "figcaption",
                        properties: {},
                        children: node.children[2].children
                    }
                ];
            } else if (
                // eslint-disable-next-line no-magic-numbers
                node.children.length === 4 &&
                isElement(node.children[1], "br") &&
                node.children[2] &&
                node.children[2].type === "text" &&
                node.children[2].value.trim() === "" &&
                isElement(node.children[3], "em")
            ) {
                // Image with caption with line break (with remark-breaks plugin)
                node.tagName = "figure";
                node.children = [
                    firstChild,
                    {
                        type: "element",
                        tagName: "figcaption",
                        properties: {},
                        children: node.children[3].children
                    }
                ];
            }
        });
    };

    return transformer;
};

export default rehypeImageCaption;
