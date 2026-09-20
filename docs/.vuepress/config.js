import { viteBundler } from "@vuepress/bundler-vite";
import { defineUserConfig } from "vuepress";
import theme from "./theme.js";

export default defineUserConfig({
  bundler: viteBundler(),
  theme,
  description: "Notes on Linux, systems, debugging, and the engineering work behind them.",
  head:[
    ['meta', {name: 'google-site-verification', 'content': 'fiql57E-4MbcN3dvCE3NYp2e5vRu03Pg2bDERier0gc'}],
    ['meta', {name: 'google-adsense-account', 'content': 'ca-pub-8634712203742253'}],
    ['script', {src: "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8634712203742253", crossorigin: "anonymous", async: true, defer: true}]
  ],
  lang: "en-US",
  title: "Yogaraj.S",
});
