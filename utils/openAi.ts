export async function createCompletion({ apiKey, userPrompt }) {
  const chatKeyInStorage = await chrome.storage.sync.get("chatCompletions");
  //defaults to true if chatCompletions is not set
  const chatCompletion =
    chatKeyInStorage.chatCompletions == null ||
    chatKeyInStorage.chatCompletions;

  if (chatCompletion) return await createChatCompletion({ apiKey, userPrompt });
  else return await createRegularCompletion({ apiKey, userPrompt });
}

export async function createRegularCompletion({
  apiKey,
  userPrompt,
}: {
  apiKey: string;
  userPrompt: string;
}) {
  const temperature =
    (await chrome.storage.sync.get("temperature"))?.temperature || 0.2;

  const prompt = `
    I want to generate Airtable formula that will do following:
    ${userPrompt}

    Make sure the response is a valid Airtable formula.`;

  const body = {
    model: "text-davinci-003",
    prompt: prompt,
    max_tokens: 3500,
    temperature: temperature, //range 0-2 according to docs but PlayGround uses 0-1
  };

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  };

  try {
    console.log("prompt sent to openai", prompt);
    const response = await fetch(
      "https://api.openai.com/v1/completions",
      options
    );

    const json = await response.json();
    if (response.status !== 200) {
      throw json || "Error connecting to OpenAI";
    }
    const formattedResponse = json.choices[0].text.replace(/^\n+/, "");
    return { success: true, data: formattedResponse };
  } catch (err) {
    console.log("error in request", err);
    return {
      success: false,
      data:
        err?.error?.message?.replace(/^\n+/, "") ||
        "Error connecting to OpenAI",
    };
  }
}

export async function createChatCompletion({
  apiKey,
  userPrompt,
}: {
  apiKey: string;
  userPrompt: string;
}) {
  const temperature =
    (await chrome.storage.sync.get("temperature"))?.temperature || 0.2;

  const messages = [
    {
      role: "system",
      content:
        "You are a bot providing Airtable formulas. Respond with a formulas only and nothing else. No additional explanation is needed, only a valid Airtable formula without quotation marks.",
    },
    // { role: "user", content: "Extract the first name from the Project lead field" },
    // {
    //   role: "assistant",
    //   content: 'LEFT({Project lead}, FIND(" ", {Project lead}))',
    // },
    { role: "user", content: userPrompt },
  ];

  const body = {
    model: "gpt-3.5-turbo",
    messages: messages,
    max_tokens: 3500,
    temperature: temperature, //range 0-2 according to docs but PlayGround uses 0-1
  };

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  };

  try {
    console.log("prompt sent to openai", messages);
    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      options
    );

    const json = await response.json();
    if (response.status !== 200) {
      throw json || "Error connecting to OpenAI";
    }
    const formattedResponse = json.choices[0].message.content.replace(
      /^\n+/,
      ""
    );
    return { success: true, data: formattedResponse };
  } catch (err) {
    console.log("error in request", err);
    return {
      success: false,
      data:
        err?.error?.message?.replace(/^\n+/, "") ||
        "Error connecting to OpenAI",
    };
  }
}
