import { eslintConfig } from "@robot-inventor/eslint-config";

export default [
    {
        ignores: [
            "**/*.test.ts"
        ]
    },
    ...eslintConfig,
    {
        rules: {
            "jsdoc/no-multi-asterisks": "off",
            "sort-keys": "off"
        }
    }
];
