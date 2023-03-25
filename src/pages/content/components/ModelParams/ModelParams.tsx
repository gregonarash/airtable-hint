import Info from "@/components/icons/Info";
import { listModels } from "@utils/openAi";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { DialogDescription } from "../ui/dialog";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Slider } from "../ui/slider";
import { Switch } from "../ui/switch";
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

const ModelParams = () => {
  const [temp, setTemp] = useState<number>(0.2);
  const [chatMode, setChatMode] = useState<boolean>(true);
  const [chatModel, setChatModel] = useState<string>("gpt-3.5-turbo");
  const [GPT4available, setGPT4available] = useState<boolean>(false);

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

  useEffect(() => {
    const getChatModel = async () => {
      const chatModel = await chrome.storage.sync.get("chatModel");
      if (chatModel && chatModel.chatModel !== undefined) {
        setChatModel(chatModel.chatModel);
      }
    };
    getChatModel();
  }, []);

  useEffect(() => {
    const checkGPT4availability = async () => {
      const modelList = await listModels();
      if (modelList.data.includes("gpt-4")) {
        setGPT4available(true);
      }
    };
    checkGPT4availability();
  }, []);

  return (
    <div>
      <h3 className="text-center text-base font-semibold text-slate-900 dark:text-slate-50 sm:text-left">
        Model Parameters
      </h3>
      <DialogDescription className="text-center sm:text-left">
        Adjust settings for the model to modify responses
      </DialogDescription>
      <div className="grid grid-cols-5 items-center gap-4 py-4 pl-1 sm:grid-cols-8">
        <Label htmlFor="name" className="break-words text-right sm:col-span-2">
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex flex-wrap items-center justify-start ">
                  Temp
                  <Info className="w-6 pl-1 pr-2" />
                  {temp}{" "}
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs justify-start text-start text-sm">
                <span className="font-semibold">Default: 0.2 </span>
                <span className="font-normal">
                  Setting temperature to 0 will make the answers mostly
                  deterministic, while a higher number will create more
                  randomness/variety in the responses.
                </span>
                <TooltipArrow />
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
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
        ></Slider>

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

      <div className="flex items-center space-x-2 pb-4 pl-1">
        <Label htmlFor="chat-completion-mode">
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex flex-wrap items-center justify-end ">
                  {chatMode
                    ? "ChatGPT Completion Mode"
                    : "Regular GPT Prompt Mode"}
                  <Info className="w-6 pl-1 pr-2" />
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs justify-start text-start text-sm">
                <span className="font-semibold">
                  Default: ChatGPT Completion Mode{" "}
                </span>
                <span className="font-normal">
                  We recommend using ChatGPT completions (based on the
                  "gpt-3.5-turbo" model). Regular GPT completions are based on
                  "text-davinci-003" model. While both types yield similar
                  results in most cases, the ChatGPT model is significantly
                  cheaper to use.
                </span>
                <TooltipArrow />
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Label>
        <Switch
          checked={chatMode}
          onCheckedChange={async (e) => {
            setChatMode(e);
            await chrome.storage.sync.set({ chatCompletions: e });
          }}
          id="chat-completion-mode"
        />
      </div>
      <div className="flex items-center space-x-2 pb-4 pl-1">
        <Label htmlFor="ai-model">Model:</Label>
        {chatMode ? (
          <Select
            onValueChange={async (e) => {
              setChatModel(e);
              await chrome.storage.sync.set({ chatModel: e });
            }}
            value={chatModel}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gpt-3.5-turbo">GPT 3.5 Turbo</SelectItem>
              {GPT4available && <SelectItem value="gpt-4">GPT 4</SelectItem>}
            </SelectContent>
          </Select>
        ) : (
          <span className="text-center text-sm text-slate-500 dark:text-slate-400 sm:text-left">
            Text Davinci 003
          </span>
        )}
      </div>
    </div>
  );
};

export default ModelParams;
