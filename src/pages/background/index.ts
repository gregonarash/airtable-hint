import reloadOnUpdate from "virtual:reload-on-update-in-background-script";

reloadOnUpdate("pages/background");

console.log("background loaded");

//Placeholder
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log("content script received message", request);
  if (request.color === "green") {
    document.body.style.backgroundColor = "green";
    sendResponse({ status: "done" });
  }
});
