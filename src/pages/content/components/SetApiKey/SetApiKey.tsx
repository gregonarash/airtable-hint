import { useEffect } from "react";
import Delete from "../icons/Delete";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const SetApiKey = ({ apiKey, setApiKey, updateStorage }) => {
  useEffect(() => {
    const checkIfApiKeySaved = async () => {
      const apiKey = await chrome.storage.sync.get("apiKey");
      if (apiKey) setApiKey(apiKey.apiKey);
    };
    checkIfApiKeySaved();
  }, []);

  return (
    <>
      <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">
        OpenAI connection
      </h3>
      <div className="text-sm dark:text-slate-400">
        Connect to your OpenAI account. You can create your API key{" "}
        <a
          href="https://platform.openai.com/account/api-keys"
          rel="noopener noreferrer"
          target="_blank"
          className="underline"
        >
          here.
        </a>
      </div>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-5 items-center gap-4 sm:grid-cols-8">
          <Label htmlFor="name" className="sm:col-span-2">
            OpenAI API key
          </Label>
          <Input
            id="name"
            placeholder="Your OpenAI API Key"
            value={apiKey}
            className="col-span-3 sm:col-span-5"
            type={"password"}
            onChange={(e) => {
              updateStorage({
                key: "apiKey",
                payload: e.target.value,
              });
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
            <Delete />
          </Button>
        </div>
      </div>
    </>
  );
};

export default SetApiKey;
