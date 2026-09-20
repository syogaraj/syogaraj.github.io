import { hopeTheme } from "vuepress-theme-hope";

export default hopeTheme({
  hostname: "https://syogaraj.github.io",
  favicon: "/images/me.webp",
  author: {
    name: "Yogaraj. S",
    email: "yogarajsivaprakasam@gmail.com",
  },

  logo: "/images/me.webp",
  darkmode: "toggle",
  print: false,
  navbar: [
    {
      text: "Articles",
      link: "/article/",
      icon: "material-symbols:book",
    },
    {
      text: "Topics",
      link: "/category/",
      icon: "material-symbols:category",
    },
    {
      text: "Timeline",
      link: "/timeline/",
      icon: "material-symbols:history",
    },
    {
      text: "GitHub",
      link: "https://github.com/syogaraj",
      icon: "simple-icons:github",
    },
  ],
  navbarLayout: {
    start: ["Brand"],
    end: ["Links", "Outlook"]
  },
  markdown: {
    imgLazyload: true,
    imgSize: true,
    tabs: true,
    codeTabs: true,
    align: true,
    highlighter: {
      type: "shiki",
      notationFocus: true,
      collapsedLines: true,
    },
  },

  pageInfo: ["Author", "Date", "ReadingTime", "Category", "Tag"],
  copyright: "Copyright © 2026 Yogaraj S. All rights reserved.",

  // Blog options
  blog: {
    intro: "Field notes on Linux, systems, debugging, and the technology beneath the surface.",
    medias: {
      GitHub: "https://github.com/syogaraj",
      LinkedIn: "https://www.linkedin.com/in/syogaraj",
    },
    articlePerPage: 10,
  },

  plugins: {
    slimsearch: true,
    copyright: true,
    blog: {
      excerptLength: 40,
    },
    sitemap: true,
  },
});
