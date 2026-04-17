import { fileURLToPath, URL } from "node:url";
import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  async viteFinal(config) {
    config.resolve ??= {};
    const alias = Array.isArray(config.resolve.alias)
      ? config.resolve.alias
      : [];

    config.resolve.alias = [
      ...alias,
      {
        find: "fundbrdet-ui/styles.css",
        replacement: fileURLToPath(
          new URL("../src/ui-library/styles.css", import.meta.url),
        ),
      },
      {
        find: "fundbrdet-ui",
        replacement: fileURLToPath(
          new URL("../src/ui-library/index.ts", import.meta.url),
        ),
      },
    ];

    return config;
  },
};

export default config;
