"use client";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { createCompletion } from "@utils/openAi";

import { useEffect, useState } from "react";
import ModelParams from "../components/ModelParams/ModelParams";
import SetApiKey from "../components/SetApiKey/SetApiKey";
import Delete from "../components/icons/Delete";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

export default function App() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [error, setError] = useState("");
  const [licenseKey, setLicenseKey] = useState("");
  const [isLicenseValid, setIsLicenseValid] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [ref] = useAutoAnimate<HTMLDivElement>();

  useEffect(() => {
    window.addEventListener("message", onMessage);
    return () => {
      window.removeEventListener("message", onMessage);
    };
  }, []);

  useEffect(() => {
    const checkIfLicenseIsValid = async () => {
      const isLicenseValid = await chrome.storage.sync.get("isLicenseValid");
      if (isLicenseValid) setIsLicenseValid(isLicenseValid.isLicenseValid);
    };
    checkIfLicenseIsValid();
  }, []);

  useEffect(() => {
    const checkIfLicenseKeySaved = async () => {
      const licenseKey = await chrome.storage.sync.get("licenseKey");
      if (licenseKey) setLicenseKey(licenseKey.licenseKey);
    };
    checkIfLicenseKeySaved();
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

      const response = await createCompletion({
        apiKey: apiKey.apiKey,
        userPrompt,
      });

      sendMessageToInjectedScript({
        type: "setMonaco",
        payload: response.data,
      });
      sendMessageToInjectedScript({
        type: "addControlButtons",
      });
    } else {
      //API keys not exist, open window
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
    await chrome.storage.sync.set({ [key]: payload });
    const data = await chrome.storage.sync.get(key);
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

  async function checkLicenseKey(licenseKey) {
    setError("");
    let url = "https://api.gumroad.com/v2/licenses/verify";

    let options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: `{"product_id":"J2fktl8gFc_3NjRqPXPRqA==","license_key":"${licenseKey}"}`,
    };
    try {
      const response = await fetch(url, options);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setIsLicenseValid(true);
          updateStorage({ key: "isLicenseValid", payload: true });
        } else {
          setError("License key is not valid");
          setIsLicenseValid(false);
          updateStorage({ key: "isLicenseValid", payload: false });
        }
      } else {
        setError(
          response.status === 404
            ? "License key is not valid"
            : "There has been an issue verifying your license key please try again later"
        );
        setError("License key is not valid");
        setIsLicenseValid(false);
        updateStorage({ key: "isLicenseValid", payload: false });
      }
    } catch (error) {
      console.log(error);
      setError("There has been a problem with the connection");
    }
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
                sendMessageToInjectedScript({
                  type: "turnOffAirtableKeyFeautres",
                });
              }}
            >
              Edit settings
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Settings</DialogTitle>
            </DialogHeader>
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">
              Enter License Key
            </h3>
            <div className="text-sm dark:text-slate-400">
              Airtable Hint GPT - requires a paid Gumroad license key. If you do
              not have one.{" "}
              <a
                href="https://businessautomated.gumroad.com/l/airtable-hint"
                rel="noopener noreferrer"
                target="_blank"
                className="underline"
              >
                You can get it here.
              </a>
            </div>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-5 items-center gap-4 sm:grid-cols-8">
                <Label htmlFor="license" className="sm:col-span-2">
                  License Key
                </Label>
                <Input
                  id="license"
                  placeholder="Your License Key"
                  value={licenseKey}
                  className="col-span-3 sm:col-span-5"
                  type={"password"}
                  onChange={(e) => {
                    updateStorage({
                      key: "licenseKey",
                      payload: e.target.value,
                    });
                    setLicenseKey(e.target.value);
                  }}
                />
                <Button
                  className="w-11 py-2 hover:bg-red-600"
                  onClick={() => {
                    setLicenseKey("");
                    updateStorage({ key: "licenseKey", payload: "" });
                    setIsLicenseValid(false);
                    updateStorage({ key: "isLicenseValid", payload: false });
                    setApiKey("");
                    updateStorage({ key: "apiKey", payload: "" });
                  }}
                >
                  <Delete />
                </Button>
              </div>
            </div>
            {isLicenseValid && (
              <SetApiKey {...{ apiKey, setApiKey, updateStorage }} />
            )}
            <div ref={ref}> {apiKey && <ModelParams />}</div>
            {!!error && (
              <div className="text-center text-base font-bold text-red-600 dark:text-red-400">
                {error}
              </div>
            )}
            <DialogFooter>
              {!isLicenseValid ? (
                <Button
                  type="submit"
                  onClick={async () => checkLicenseKey(licenseKey)}
                >
                  Next
                </Button>
              ) : (
                <Button type="submit" onClick={() => setDialogOpen(false)}>
                  Done
                </Button>
              )}
            </DialogFooter>{" "}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
