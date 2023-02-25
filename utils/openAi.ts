export async function createCompletion({
  apiKey,
  prompt,
}: {
  apiKey: string;
  prompt: string;
}) {
  const temperature =
    (await chrome.storage.sync.get("temperature"))?.temperature || 0.2;

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
