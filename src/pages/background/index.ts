import reloadOnUpdate from "virtual:reload-on-update-in-background-script";

reloadOnUpdate("pages/background");

console.log("background loaded");

console.log("background runtime", chrome.runtime);

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log("content script received message", request);
  if (request.color === "green") {
    document.body.style.backgroundColor = "green";
    sendResponse({ status: "done" });
  }
});
