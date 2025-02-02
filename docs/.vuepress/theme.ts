import { hopeTheme } from "vuepress-theme-hope";

export default hopeTheme({
  hostname: "https://syogaraj.github.io",
  author: {
    name: "Yogaraj. S",
    email: "yogarajsivaprakasam@gmail.com",
  },

  // Interface options
  darkmode: "toggle",
  print: false,
  navbar: [
    {
      text: "Articles",
      link: "/article/",
      icon: "material-symbols:book",
    },
  ],
  navbarLayout: {
    start: ["Brand"],
    end: ["Links", "Outlook"]
  },
  logo: "https://avatars.githubusercontent.com/u/9082051?v=4",

  // Markdown options
  markdown: {
    imgLazyload: true,
    imgSize: true,
    tabs: true,
    codeTabs: true,
    align: true,
    highlighter: {
      type: "shiki",
    },
  },

  // Layout options
  headerDepth: 5,

  // Blog options
  blog: {
    intro: "A Tech Geek’s Journey Through Code, Linux, and Complex System",
    medias: {
      GitHub: "https://github.com/syogaraj",
    },
    articlePerPage: 10,
  },

  plugins: {
    blog: {
        excerptLength: 20
    },
    sitemap: true,
  },
});
