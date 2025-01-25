import { viteBundler } from "@vuepress/bundler-vite";
import { defaultTheme } from "@vuepress/theme-default";
import { defineUserConfig } from "vuepress";
import { registerComponentsPlugin } from "@vuepress/plugin-register-components";
import { path } from "vuepress/utils"

export default defineUserConfig({
  bundler: viteBundler(),
  theme: defaultTheme({
    logo: "https://avatars.githubusercontent.com/u/9082051?v=4",
    sidebar: "heading",
    // navbar: [{ text: "Blog", link: "/blog/" }],
  }),

  lang: "en-US",
  title: "Yogaraj.S",
  plugins: [
    [
      registerComponentsPlugin(
      {
        componentsDir: path.resolve(__dirname, "./components"),
      }),
    ]
  ],
});
