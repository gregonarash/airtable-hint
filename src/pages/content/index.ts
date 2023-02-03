console.log("content loaded content/index.ts");

/**
 * @description
 * Chrome extensions don't support modules in content scripts.
 */
import("./components/Demo");

try {
  addScript("src/pages/extension/index.js");
} catch (e) {
  console.error(e);
}

function addScript(src: string) {
  const script = document.createElement("script");
  script.type = "module";
  script.src = chrome.runtime.getURL(src);
  console.log("adding script", script);
  (document.body || document.head || document.documentElement).appendChild(
    script
  );
}
