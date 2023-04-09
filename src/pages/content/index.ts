/**
 * @description
 * Chrome extensions don't support modules in content scripts.
 */
import("./Settings");

try {
  addScript("src/pages/extension/index.js");
} catch (e) {
  console.error(e);
}

// Placeholder for message handling
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.color === "green") {
    document.body.style.backgroundColor = "green";
    sendResponse({ status: "done" });
  }
});

function addScript(src: string) {
  const script = document.createElement("script");
  script.type = "module";
  script.src = chrome.runtime.getURL(src);
  (document.body || document.head || document.documentElement).appendChild(
    script
  );
}
