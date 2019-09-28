require("dotenv").config();
export default {
  env: {
    nodeEnv: process.env.NODE_ENV || "development",
    redirectURI: process.env.REDIRECT_URI || "http://localhost:3000/profile"
  },
  mode: "universal",
  /*
   ** Headers of the page
   */
  head: {
    title: "Apollify",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: process.env.npm_package_description || ""
      },
      {
        hid: "keywords",
        name: "keywords",
        content: "spotify, artists, playlist, apollify"
      },
      {
        hid: "og:url",
        property: "og:url",
        content: "https://www.apollify.com/"
      },
      {
        hid: "og:image",
        property: "og:image",
        content: "https://www.apollify.com/image.svg"
      },
      {
        hid: "og:image:alt",
        property: "og:image:alt",
        content: "Apollify"
      },
      {
        hid: "twitter:card",
        name: "twitter:card",
        content: "summary_large_image"
      },
      {
        hid: "twitter:url",
        name: "twitter:url",
        content: "https://www.apollify.com"
      },
      {
        hid: "twitter:title",
        name: "twitter:title",
        content: "Apollify"
      },
      {
        hid: "twitter:description",
        name: "twitter:description",
        content: process.env.npm_package_description || ""
      },
      {
        hid: "twitter:image",
        name: "twitter:image",
        content: "https://www.apollify.com/image.svg"
      },
      {
        hid: "twitter:image:alt",
        name: "twitter:image:alt",
        content: "Apollify"
      }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: "#1db954", throttle: 0, height: "4px" },
  manifest: {
    name: "Apollify",
    short_name: "Apollify",
    description: process.env.npm_package_description || "",
    theme_color: "#4a148c",
    lang: "en"
  },
  /*
   ** Global CSS
   */
  css: [],
  serverMiddleware: ["redirect-ssl", "~/api/redirect-heroku"],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [],
  /*
   ** Nuxt.js modules
   */
  modules: [
    "@nuxtjs/pwa",
    [
      "nuxt-fontawesome",
      {
        imports: [
          {
            set: "@fortawesome/free-solid-svg-icons",
            icons: ["fas"]
          }
        ]
      }
    ],
    [
      "@nuxtjs/google-analytics",
      {
        id: process.env.ANALYTICS_ID
      }
    ]
  ],
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      config.node = {
        fs: "empty"
      };
    }
  }
};
