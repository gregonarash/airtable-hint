import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { DialogDescription } from "../ui/dialog";
import { Label } from "../ui/label";
import { Slider } from "../ui/slider";
import { Switch } from "../ui/switch";

const ModelParams = () => {
  const [temp, setTemp] = useState<number>(0.2);
  const [chatMode, setChatMode] = useState<boolean>(true);

  useEffect(() => {
    const getTemp = async () => {
      const temp = await chrome.storage.sync.get("temperature");
      if ((temp && temp.temperature) || temp.temperature === 0) {
        setTemp(temp.temperature);
      }
    };
    getTemp();
  }, []);

  useEffect(() => {
    const getCompletionMode = async () => {
      const chatCompletions = await chrome.storage.sync.get("chatCompletions");
      if (chatCompletions && chatCompletions.chatCompletions !== undefined) {
        setChatMode(chatCompletions.chatCompletions);
      }
    };
    getCompletionMode();
  }, []);

  return (
    <div>
      <h3 className="text-center text-base font-semibold text-slate-900 dark:text-slate-50 sm:text-left">
        Model Parameters
      </h3>
      <DialogDescription className="text-center sm:text-left">
        Adjust settings for the model to modify responses
      </DialogDescription>
      <div className="grid grid-cols-5 items-center gap-4 py-4 sm:grid-cols-8">
        <Label htmlFor="name" className="break-words text-right sm:col-span-2">
          Temperature {temp}
        </Label>

        <Slider
          className="col-span-3 sm:col-span-5"
          value={[temp]}
          onValueChange={(value) => setTemp(value[0])}
          onValueCommit={async (value) =>
            await chrome.storage.sync.set({ temperature: value[0] })
          }
          max={1}
          step={0.1}
        />

        <Button
          className="w-11 py-2"
          onClick={async () => {
            setTemp(0.2);
            await chrome.storage.sync.set({ temperature: 0.2 });
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
            <path d="M3 2v6h6"></path>
            <path d="M21 12A9 9 0 0 0 6 5.3L3 8"></path>
            <path d="M21 22v-6h-6"></path>
            <path d="M3 12a9 9 0 0 0 15 6.7l3-2.7"></path>
          </svg>
        </Button>
      </div>
      <div className="pb-4">
        <span className="font-semibold">Default: 0.2</span> Setting temperature
        to 0 will make the answers mostly deterministic, while a higher number
        will create more randomness/variety in the responses.
      </div>
      <div className="flex items-center space-x-2 pb-4">
        <Switch
          checked={chatMode}
          onCheckedChange={async (e) => {
            setChatMode(e);
            await chrome.storage.sync.set({ chatCompletions: e });
          }}
          id="chat-completion-mode"
        />
        <Label htmlFor="airplane-mode">
          {chatMode
            ? "ChatGPT Completion Model"
            : "Regular GPT Completion Model"}
        </Label>
      </div>
      <div className="pb-4">
        <span className="font-semibold">Default: ChatGPT Completion Model</span>{" "}
        We recommend using ChatGPT completions (based on the "gpt-3.5-turbo"
        model). Regular GPT completions are based on "text-davinci-003" model.
        While both types yield similar results in most cases, the ChatGPT model
        is significantly cheaper to use.
      </div>
    </div>
  );
};

export default ModelParams;
