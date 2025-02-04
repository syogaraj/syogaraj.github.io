import { viteBundler } from "@vuepress/bundler-vite";
import { defaultTheme } from "@vuepress/theme-default";
import { defineUserConfig } from "vuepress";
import { registerComponentsPlugin } from "@vuepress/plugin-register-components";
import { path } from "vuepress/utils";
import theme from "./theme.js";
import { googleAnalyticsPlugin } from "@vuepress/plugin-google-analytics";

export default defineUserConfig({
  bundler: viteBundler(),
  theme,
  head:[
    ['meta', {name: 'google-site-verification', 'content': 'fiql57E-4MbcN3dvCE3NYp2e5vRu03Pg2bDERier0gc'}]
  ],
  lang: "en-US",
  title: "Yogaraj.S",
  plugins: [
    [
      registerComponentsPlugin({
        componentsDir: path.resolve(__dirname, "./components"),
      }),
    ],
    googleAnalyticsPlugin({
      id: "G-H8EJQ97RLW",
    }),
  ],
});
