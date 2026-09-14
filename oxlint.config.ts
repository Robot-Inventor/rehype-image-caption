import { defineConfig } from "oxlint";
import { oxlintConfig } from "@robot-inventor/oxlint-config";

export default defineConfig({
    ...oxlintConfig,
    ignorePatterns: ["**/*.test.ts"],
    rules: {
        "jsdoc-js/no-multi-asterisks": "off",
        "sort-keys": "off"
    }
});
