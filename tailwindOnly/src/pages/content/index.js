console.log("content loaded Tailwind extension");
try {
  addScript("src/pages/extension/index.js");
} catch (e) {
  console.error(e);
}
function addScript(src) {
  const script = document.createElement("script");
  script.type = "module";
  script.src = chrome.runtime.getURL(src);
  console.log("adding script", script);
  (document.body || document.head || document.documentElement).appendChild(
    script
  );
}
