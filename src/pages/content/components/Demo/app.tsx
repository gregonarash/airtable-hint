"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { createCompletion } from "@utils/openAi";
import { useEffect, useState } from "react";
import ModelParams from "../ModelParams/ModelParams";
import { Button } from "../ui/button";

export default function App() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [ref] = useAutoAnimate<HTMLDivElement>();

  useEffect(() => {
    const checkIfApiKeySaved = async () => {
      const apiKey = await chrome.storage.sync.get("apiKey");
      console.log("checkApiKey", apiKey);
      if (apiKey) setApiKey(apiKey.apiKey);
    };
    checkIfApiKeySaved();
  }, []);

  useEffect(() => {
    window.addEventListener("message", onMessage);
    return () => {
      window.removeEventListener("message", onMessage);
    };
  }, []);

  function onMessage(event) {
    if (
      event.source !== window ||
      event.origin !== "https://airtable.com" ||
      event.data.from !== "AIRTABLE_HINT" ||
      event.data.to !== "CONTENT_SCRIPT"
    ) {
      return;
    }
    console.log("content script received message secure2", event);
    switch (event.data.type) {
      case "processPrompt":
        processPrompt(event.data.payload);
        break;
      case "setShowSettings":
        setShowSettings(event.data.payload);
        break;
    }
  }

  const processPrompt = async (payload) => {
    const apiKey = await chrome.storage.sync.get("apiKey");

    if (apiKey && apiKey.apiKey) {
      //keys exist processing prompt
      sendMessageToInjectedScript({
        type: "waitingAnimation",
      });
      sendMessageToInjectedScript({
        type: "addPromptToHistory",
        payload: payload,
      });

      const baseSchema = getBaseSchema();
      //Base schemea for later
      // My Airtable consists of following fields:
      // ${baseSchema.join(", ")}.

      const userPrompt = payload.match(/\.$/g) ? payload : payload + ".";
      const prompt = `
      I want to generate Airtable formula that will do following:
      ${userPrompt}

      Make sure the response is a valid Airtable formula.`;

      const response = await createCompletion({
        apiKey: apiKey.apiKey,
        prompt,
      });

      sendMessageToInjectedScript({
        type: "setMonaco",
        payload: response.data,
      });
      sendMessageToInjectedScript({
        type: "addControlButtons",
      });
    } else {
      console.log("API keys not exist, open window");
      setDialogOpen(true);
      sendMessageToInjectedScript({
        type: "turnOffAirtableKeyFeautres",
      });
      sendMessageToInjectedScript({
        type: "setGPTButtonDefault",
      });
    }
  };

  async function updateStorage({ key, payload }) {
    console.log("updating storage", payload);
    await chrome.storage.sync.set({ [key]: payload });
    const data = await chrome.storage.sync.get(key);
    console.log("storage updated", data);
  }

  function getBaseSchema() {
    const fields = [];

    document
      .querySelectorAll(
        "[data-columnid]" && '[data-tutorial-selector-id="gridHeaderCell"]'
      )
      .forEach((element) => {
        const match = element
          .querySelector(".contentWrapper > div")
          .getAttribute("aria-label")
          .match(/(.*) column header \(([^()]*)\)$/);
        fields.push(match[1] + " (" + match[2] + " type)");
      });
    return fields;
  }

  function sendMessageToInjectedScript(message) {
    window.postMessage(
      { ...message, from: "AIRTABLE_HINT", to: "INJECTED_SCRIPT" },
      "https://airtable.com"
    );
  }

  return (
    <div
      id="airtable-hint-dialog"
      className="fixed left-5 bottom-20 rounded-md"
    >
      {showSettings && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="green"
              onClick={(e) => {
                console.log("button edit  clicked", e);
                sendMessageToInjectedScript({
                  type: "turnOffAirtableKeyFeautres",
                });
              }}
            >
              Edit Settings
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit settings</DialogTitle>
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">
                OpenAI connection
              </h3>
              <DialogDescription>
                Connect to your OpenAI account. You can create your API key{" "}
                <a
                  href="https://platform.openai.com/account/api-keys"
                  rel="noopener noreferrer"
                  target="_blank"
                  className="underline"
                >
                  here.
                </a>
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-5 items-center gap-4 sm:grid-cols-8">
                <Label htmlFor="name" className="text-right sm:col-span-2">
                  OpenAI API key
                </Label>
                <Input
                  id="name"
                  placeholder="Your OpenAI API Key"
                  value={apiKey}
                  className="col-span-3 sm:col-span-5"
                  type={"password"}
                  onChange={(e) => {
                    updateStorage({ key: "apiKey", payload: e.target.value });
                    setApiKey(e.target.value);
                  }}
                />
                <Button
                  className="w-11 py-2 hover:bg-red-600"
                  onClick={() => {
                    setApiKey("");
                    updateStorage({ key: "apiKey", payload: "" });
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M3 6h18"></path>
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                </Button>
              </div>
            </div>
            <div ref={ref}> {apiKey !== "" && <ModelParams />}</div>

            <DialogFooter>
              <Button type="submit" onClick={() => setDialogOpen(false)}>
                Done
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
