import jQuery from "jquery";

// actual extension-code
// listen to messages from the script
window.addEventListener("message", onMessage);

//prevent airtable defaults on hint GPT element
document.addEventListener(
  "mousedown",
  (e) => {
    if (e.target === document.querySelector("#airtable-hint-root")) {
      e.stopImmediatePropagation();
    }
  },
  true
);

const $ = jQuery;
let history = [];

const hintGPTOnClick = () => {
  $("#hintGPT")
    .html(
      '<svg width="10.8" height="10.8" viewBox="0 0 54 54" class="animate-spin-scale animate-infinite " data-testid="loading-spinner" style="shape-rendering: geometricprecision;"><g><path d="M10.9,48.6c-1.6-1.3-2-3.6-0.7-5.3c1.3-1.6,3.6-2.1,5.3-0.8c0.8,0.5,1.5,1.1,2.4,1.5c7.5,4.1,16.8,2.7,22.8-3.4c1.5-1.5,3.8-1.5,5.3,0c1.4,1.5,1.4,3.9,0,5.3c-8.4,8.5-21.4,10.6-31.8,4.8C13,50.1,11.9,49.3,10.9,48.6z" fill="currentColor" fill-opacity="1"></path><path d="M53.6,31.4c-0.3,2.1-2.3,3.5-4.4,3.2c-2.1-0.3-3.4-2.3-3.1-4.4c0.2-1.1,0.2-2.2,0.2-3.3c0-8.7-5.7-16.2-13.7-18.5c-2-0.5-3.2-2.7-2.6-4.7s2.6-3.2,4.7-2.6C46,4.4,53.9,14.9,53.9,27C53.9,28.5,53.8,30,53.6,31.4z" fill="currentColor" fill-opacity="1"></path><path d="M16.7,1.9c1.9-0.8,4.1,0.2,4.8,2.2s-0.2,4.2-2.1,5c-7.2,2.9-12,10-12,18.1c0,1.6,0.2,3.2,0.6,4.7c0.5,2-0.7,4.1-2.7,4.6c-2,0.5-4-0.7-4.5-2.8C0.3,31.5,0,29.3,0,27.1C0,15.8,6.7,5.9,16.7,1.9z" fill="currentColor" fill-opacity="1"></path></g></svg>'
    )
    .off("click");
  const extensionRoot = document.createElement("div");
  extensionRoot.id = "extension";
  document.body.appendChild(extensionRoot);

  //@ts-ignore
  const prompt = monaco.editor.getModels()[0].getValue();

  sendMessage({
    type: "processPrompt",
    payload: prompt,
  });
};

async function sendMessage(message) {
  window.postMessage({
    ...message,
    from: "AIRTABLE_HINT",
    to: "CONTENT_SCRIPT",
  });
}

function onMessage(event) {
  if (
    event.source !== window ||
    event.origin !== "https://airtable.com" ||
    event.data.from !== "AIRTABLE_HINT" ||
    event.data.to !== "INJECTED_SCRIPT"
  ) {
    return;
  }
  switch (event.data.type) {
    case "turnOffAirtableKeyFeautres":
      turnOffAirtableKeyFeautres();
      break;
    case "setMonaco":
      setMonaco(event.data.payload);
      history.push(event.data.payload);
      waiting = false;
      break;
    case "setGPTButtonDefault":
      setGPTButtonDefault();
      break;
    case "addControlButtons":
      addControlButtons();
      break;
    case "waitingAnimation":
      waitingAnimation();
      break;
    case "addPromptToHistory":
      history[0] = event.data.payload;
      break;
    case "error":
      console.log("error", event.data.payload);
      break;
  }
}

function turnOffAirtableKeyFeautres() {
  // turning off Airtable jQuery keydown event, that prevents backspace on modal.
  // Majority of browsers do not trigger back navigation on backspace, so this should not be needed.
  // @ts-ignore
  window.jQuery(document).off("keydown");
}

function setMonaco(text) {
  //@ts-ignore
  monaco.editor.getModels()[0].setValue(text);
}

function goBackInHistory() {
  //discard currently displayed text
  history.pop();
  const previousText = history.slice(-1)[0];
  setMonaco(previousText);
  if (history.length < 2) {
    setGPTButtonDefault();
    history.pop();
  }
}

function repeatGPT() {
  if (history.length < 1) setGPTButtonDefault();
  const originalPrompt = history[0];
  setGPTButtonDefault();
  $("#hintGPT")
    .html(
      '<svg width="10.8" height="10.8" viewBox="0 0 54 54" class="animate-spin-scale animate-infinite " data-testid="loading-spinner" style="shape-rendering: geometricprecision;"><g><path d="M10.9,48.6c-1.6-1.3-2-3.6-0.7-5.3c1.3-1.6,3.6-2.1,5.3-0.8c0.8,0.5,1.5,1.1,2.4,1.5c7.5,4.1,16.8,2.7,22.8-3.4c1.5-1.5,3.8-1.5,5.3,0c1.4,1.5,1.4,3.9,0,5.3c-8.4,8.5-21.4,10.6-31.8,4.8C13,50.1,11.9,49.3,10.9,48.6z" fill="currentColor" fill-opacity="1"></path><path d="M53.6,31.4c-0.3,2.1-2.3,3.5-4.4,3.2c-2.1-0.3-3.4-2.3-3.1-4.4c0.2-1.1,0.2-2.2,0.2-3.3c0-8.7-5.7-16.2-13.7-18.5c-2-0.5-3.2-2.7-2.6-4.7s2.6-3.2,4.7-2.6C46,4.4,53.9,14.9,53.9,27C53.9,28.5,53.8,30,53.6,31.4z" fill="currentColor" fill-opacity="1"></path><path d="M16.7,1.9c1.9-0.8,4.1,0.2,4.8,2.2s-0.2,4.2-2.1,5c-7.2,2.9-12,10-12,18.1c0,1.6,0.2,3.2,0.6,4.7c0.5,2-0.7,4.1-2.7,4.6c-2,0.5-4-0.7-4.5-2.8C0.3,31.5,0,29.3,0,27.1C0,15.8,6.7,5.9,16.7,1.9z" fill="currentColor" fill-opacity="1"></path></g></svg>'
    )
    .off("click");
  sendMessage({
    type: "processPrompt",
    payload: originalPrompt,
  });
  waitingAnimation();
}

function setGPTButtonDefault() {
  $("#hintGPT").replaceWith(
    '<div tabindex="0" aria-label="Hint GPT" id="hintGPT" class="text-white mr2 flex-none flex-inline items-center justify-center rounded green greenDark1-hover greenDark1-focus strong pointer focus-visible" role="button" style="width: 80px; height: 26px;">Hint GPT</div>'
  );
  $("#hintGPT").on("click", hintGPTOnClick);

  if (document.activeElement instanceof HTMLElement)
    document.activeElement.blur();
}

// Waiting animation
let waiting = false;
const waitingAnimation = () => {
  waiting = true;
  const mouseTop = " .b--.     \n";
  const mouseBottom = [];
  mouseBottom[0] = "`,-,-'~~-  ";
  mouseBottom[1] = "`,-,-'~-~  ";
  mouseBottom[2] = "`,-,-'-~~  ";
  mouseBottom[3] = "`,-,-'~~~   ";
  const infoText = "(Looking for your answer in AI maze...)";

  // @ts-ignore
  const initialInput = monaco.editor.getModels()[0].getValue();
  let distance = 30;
  const interval = setInterval(() => {
    if (waiting) {
      const animation =
        initialInput +
        "\n" +
        infoText +
        "\n" +
        " ".repeat(distance) +
        mouseTop +
        " ".repeat(distance) +
        mouseBottom[distance % 4];
      distance--;
      // @ts-ignore
      monaco.editor.getModels()[0].setValue(animation);
      if (distance === 0) distance = 30;
    } else clearInterval(interval);
  }, 500);
};

function addHintGPTButton() {
  if ($("#hintGPT").length) return;
  $("#hyperbaseContainer > [role='presentation']")
    .find(
      ".flex.items-baseline.justify-end div:first-child,.flex.items-baseline.justify-end button:first-child"
    )
    .after(
      '<div tabindex="0" aria-label="Hint GPT" id="hintGPT" class="text-white mr2 flex-none flex-inline items-center justify-center rounded green greenDark1-hover greenDark1-focus strong pointer focus-visible" role="button" style="width: 80px; height: 26px;">Hint GPT</div>'
    );
  $("#hintGPT").on("click", hintGPTOnClick);
  sendMessage({
    type: "setShowSettings",
    payload: true,
  });
  history = [];
}

function addControlButtons() {
  if (!$("#hintGPT").length) return;
  $("#hintGPT").replaceWith(
    '<div tabindex="0" aria-label="Hint GPT" id="hintGPT" class="text-white mr2 flex-none flex-inline items-center justify-center" role="button" style="width: 100px;height: 26px;"><div id="hintGPTBack" aria-label="Hint GPT Back" class="flex-none flex-inline items-center justify-center green greenDark1-hover greenDark1-focus strong pointer focus-visible" style="height: 26px; width: 50px; border-radius: 3px 0 0 3px;">Back</div><div id="hintGPTRetry" aria-label="Hint GPT Retry" class="flex-none flex-inline items-center justify-center green greenDark1-hover greenDark1-focus strong pointer focus-visible" style="height: 26px;width: 50px;border-radius: 0 3px 3px 0;border-left: solid;">Retry</div></div>'
  );
  $("#hintGPTBack").on("click", goBackInHistory);
  $("#hintGPTRetry").on("click", repeatGPT);
}

// observer for formula field
const observerForMonacoField = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    if (mutation.addedNodes.length) {
      const newNodes = mutation.addedNodes;
      for (let node of newNodes) {
        if (
          node.nodeType === Node.ELEMENT_NODE &&
          (node as Element).tagName === "DIV" &&
          (node as Element).classList.contains("monaco-editor") &&
          (node as Element).classList.contains("no-user-select")
        ) {
          addHintGPTButton();
          //monacoFocusHandler();
        }
      }
    }
    if (mutation.removedNodes.length) {
      const removedNodes = mutation.removedNodes;
      for (let node of removedNodes) {
        if (
          node.nodeType === Node.ELEMENT_NODE &&
          (node as Element).tagName === "DIV" &&
          (node as Element).classList.contains("monaco-editor") &&
          (node as Element).classList.contains("no-user-select")
        ) {
          $("#hintGPT").remove();
        }
      }
    }
  });
});

//top level observer for the column presentation panel
const observerForPresentationPanel = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    if (mutation.addedNodes.length) {
      const newNodes = mutation.addedNodes;
      for (let node of newNodes) {
        if (
          node.nodeType === Node.ELEMENT_NODE &&
          (node as Element).role === "presentation"
        ) {
          observerForMonacoField.observe(
            document.querySelector("[role='presentation']"),
            {
              childList: true,
              subtree: true,
            }
          );
          //in case observer is too late and the monaco field is already there
          if (
            document
              .querySelector("[role='presentation']")
              .querySelector(".monaco-editor")
          ) {
            addHintGPTButton();
            //monacoFocusHandler();
          }
        }
      }
    }
    if (mutation.removedNodes.length) {
      const removedNodes = mutation.removedNodes;
      for (let node of removedNodes) {
        if (
          node.nodeType === Node.ELEMENT_NODE &&
          (node as Element).role === "presentation"
        ) {
          const settingsButton = document
            .querySelector("#airtable-hint-root")
            .shadowRoot.querySelector("#airtable-hint-dialog >  button");

          if (settingsButton) {
            observerForMonacoField?.disconnect();
            sendMessage({
              type: "setShowSettings",
              payload: false,
            });
          }
        }
      }
    }
  });
});

//observer for the monaco field focus
//TODO
function monacoFocusHandler() {
  const observerForMonacoFieldFocus = new MutationObserver(function (
    mutations
  ) {
    mutations.forEach(function (mutation) {
      console.log("mutation", mutation);
    });
  });

  observerForMonacoFieldFocus.observe(
    document
      .querySelector("[role='presentation']")
      .querySelector(".monaco-editor"),
    {
      childList: true,
      subtree: true,
    }
  );
}
observerForPresentationPanel.observe(
  document.querySelector("#hyperbaseContainer"),
  {
    childList: true,
    subtree: false,
  }
);
