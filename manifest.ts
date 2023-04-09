import packageJson from "./package.json";

/**
 * After changing, please reload the extension at `chrome://extensions`
 */
const manifest: chrome.runtime.ManifestV3 = {
  manifest_version: 3,
  name: "Airtable Hint GPT",
  version: packageJson.version,
  description: packageJson.description,
  // options_page: "src/pages/options/index.html",
  // background: { service_worker: "src/pages/background/index.js" },
  // action: {
  //   default_popup: "src/pages/popup/index.html",
  //   default_icon: "icon-34.png",
  // },
  // chrome_url_overrides: {
  //   newtab: "src/pages/newtab/index.html",
  // },
  icons: {
    "128": "icon-128.png",
  },
  content_scripts: [
    {
      matches: ["https://airtable.com/*"],
      js: ["src/pages/content/index.js"],
      css: ["assets/css/contentStyle.chunk.css"],
    },
  ],
  devtools_page: "src/pages/devtools/index.html",
  web_accessible_resources: [
    {
      resources: [
        "assets/js/*.js",
        "assets/css/*.css",
        "src/pages/extension/index.js",
        "icon-128.png",
        "icon-34.png",
      ],
      matches: ["*://*/*"],
    },
  ],
  permissions: ["activeTab", "tabs", "storage"],
};

export default manifest;
