import { defineClientConfig } from "vuepress/client";
import CaptionedImage from "./components/CaptionedImage.vue";
import RecentArticles from "./components/RecentArticles.vue";

export default defineClientConfig({
  enhance({ app }) {
    app.component("CaptionedImage", CaptionedImage);
    app.component("RecentArticles", RecentArticles);
  },
});
