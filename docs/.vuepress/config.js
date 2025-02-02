import { viteBundler } from "@vuepress/bundler-vite";
import { defaultTheme } from "@vuepress/theme-default";
import { defineUserConfig } from "vuepress";
import { registerComponentsPlugin } from "@vuepress/plugin-register-components";
import { path } from "vuepress/utils";
import { shikiPlugin } from "@vuepress/plugin-shiki";

export default defineUserConfig({
  bundler: viteBundler(),
  theme: defaultTheme({
    logo: "https://avatars.githubusercontent.com/u/9082051?v=4",
    sidebar: "heading",
    // navbar: [{ text: "Blog", link: "/blog/" }],
  }),
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
    [
      shikiPlugin({
        langs: ["c", "python", "bash", "java"],
        notationFocus: true,
        notationHighlight: true,
        notationWordHighlight: true,
        collapsedLines: true
      }),
    ],
  ],
});
