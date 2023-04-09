import App from "@src/pages/content/Settings/app";
import { cssom, observe, twind } from "@twind/core";
import "construct-style-sheets-polyfill";
import { createRoot } from "react-dom/client";
import refreshOnUpdate from "virtual:reload-on-update-in-view";
import config from "../../../../twind.config";

refreshOnUpdate("pages/content/Settings");

// Create separate CSSStyleSheet
const sheet = cssom(new CSSStyleSheet());

// Use sheet and config to create an twind instance. `tw` will
// append the right CSS to our custom stylesheet.
const tw = twind(config, sheet);

const root = document.createElement("div");
root.id = "airtable-hint-root";
const shadowRoot = root.attachShadow({ mode: "open" });

document.body.append(root);

// get hold of the shadow dom root
const shadowRootElement = document.querySelector(
  "#airtable-hint-root"
).shadowRoot;

// link sheet target to shadow dom root
shadowRootElement.adoptedStyleSheets = [sheet.target];

// finally, observe using tw function
observe(tw, shadowRootElement);

createRoot(shadowRoot).render(<App />);
