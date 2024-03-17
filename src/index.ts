import type { Plugin, Transformer } from "unified";
import type { Root } from "hast";
import { isElement } from "hast-util-is-element";
import { visit } from "unist-util-visit";

/**
 * `rehype` plugin to set captions for images in addition to alt text.
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
const rehypeImageCaption: Plugin<[], Root> = () => {
    /**
     * Transformer
     * @param tree Root node
     */
    const transformer: Transformer<Root> = (tree) => {
        visit(tree, "element", (node) => {
            if (!(node.tagName === "p" && isElement(node.children[0], "img"))) return;

            // eslint-disable-next-line no-magic-numbers
            if (node.children.length === 1) {
                // Image without caption
                node.tagName = "figure";
                node.children = [node.children[0]];
                // eslint-disable-next-line no-magic-numbers
            } else if (node.children.length === 2 && isElement(node.children[1], "em")) {
                // Image with caption without line break
                node.tagName = "figure";
                node.children = [
                    node.children[0],
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
                node.children[1].type === "text" &&
                node.children[1].value.trim() === "" &&
                isElement(node.children[2], "em")
            ) {
                // Image with caption with line break
                node.tagName = "figure";
                node.children = [
                    node.children[0],
                    {
                        type: "element",
                        tagName: "figcaption",
                        properties: {},
                        children: node.children[2].children
                    }
                ];
            }
        });
    };

    return transformer;
};

export default rehypeImageCaption;
