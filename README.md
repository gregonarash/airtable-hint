<div align="center">
<img src="public/icon-128.png" alt="logo"/>
<h1> Airtable Hint GPT Chrome extension</h1>

![](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)
![](https://img.shields.io/badge/Typescript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![](https://badges.aleen42.com/src/vitejs.svg)

![GitHub action badge](https://github.com/gregonarash/airtable-hint/actions/workflows/build.yml/badge.svg)

> Chrome extension for Airtable adding OpenAI GPT based code hints to Airtable formula field

</div>

## Table of Contents

- [Intro](#intro)
- [Installation](#installation)
  - [Download pre-built extension](#download)
  - [Install code and build locally](#local_installation)
- [Screenshots](#screenshots)
  - [NewTab](#newtab)
  - [Popup](#popup)
- [Extension Stack](#extension_stack)

## Intro <a name="intro"></a>

Chrome extension for Airtable adding OpenAI GPT based code hints to Airtable formula field.

This extension utilizes OpenAI GPT-3 (model "text-davinci-003") to provide code hints for Airtable formula fields. It plugs into the Airtable formula editor (based on Monaco editor) and provides code hint based on the prompt provided by the user inside the field.

The prompt is wrapped in an extra set of instructions before being sent to OpenAI GPT-3. The intention is to simplify the prompt and make sure the OpenAI response is provided in format of Airtable formula. The prompt is wrapped in the following format:

Regular Completions Mode

```
I want to generate Airtable formula that will do following:
${userPrompt}

Make sure the response is a valid Airtable formula.
```

ChatGPT Completions Mode

```
    {
      role: "system",
      content:
        "You are a bot providing Airtable formulas. Respond with a formulas only and nothing else. No additional explanation is needed, only a valid Airtable formula without quotation marks.",
    },
    { role: "user", content: userPrompt },
```

The prompt is sent to OpenAI with following parameters:

- "max_tokens" set to 3500 to provide sufficient room for longer prompts
- "temperature" as adjusted by user in the extension settings, defaults to 0.2
- "model"
  - Regular Completions Mode "text-davinci-003". Based on tests the "codex" models were performing worse than "davinci" model.
  - ChatGPT Completions Mode "gpt-3.5-turbo" which should point to the latest updated version of chat model.

## Installation <a name="installation"></a>

Extension requires OpenAI account and API key. The API key can be obtained from [OpenAI dashboard](https://platform.openai.com/account/api-keys).

### Download pre-built extension <a name="download"></a>

1. Download the latest version from: TBC

### Install code and build locally <a name="local_installation"></a>

1. Clone this repository.
2. Change `name` and `description` in package.json => **Auto synchronize with manifest**
3. Run `yarn install` or `npm i` (check your node version >= 16.6, recommended >= 18)
4. Run `yarn dev` or `npm run dev`
5. Load Extension on Chrome
   1. Open - Chrome browser
   2. Access - chrome://extensions
   3. Check - Developer mode
   4. Find - Load unpacked extension
   5. Select - `dist` folder in this project (after dev or build)
6. If you want to build in production, Just run `yarn build` or `npm run build`.

## Extension Stack <a name="extension_stack"></a>

The base for this extension was forked from [Jonghakseo/chrome-extension-boilerplate-react-vite](https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite#intro) and modified to fit the needs of this extension.

The core difference was adding Tailwind CSS. To avoid clashes with Airtable CSS, the extension is using shadow DOM to encapsulate the extension UI. To enable Tailwind inside of shadow DOM I am using Twind,
which converts Tailwind into classes at runtime.

The Hint GPT button is inserted into the Airtable UI, using some ugly JQuery.

- [React 18](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/) - for styling
- [Twind](https://twind.style/) - for runtime Tailwind CSS classes
- [shadcn/ui](https://ui.shadcn.com/) - for UI components on the settings page
- [AutoAnimate](https://auto-animate.formkit.com/) - adding a simple animation
- [SASS](https://sass-lang.com/) - still there but not utilized
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)
- [Chrome Extension Manifest Version 3](https://developer.chrome.com/docs/extensions/mv3/intro/)
- [Jest](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- HMR [incomplete](https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite/pull/25)

---

_Business Automated!_ is an independent automation consultancy. If you would like to request a custom automation or product for your business, visit us at [Business-Automated.com](https://business-automated.com/)

Follow us on Twitter🐦: https://twitter.com/BAutomated
Watch more on Youtube ️📺: https://www.youtube.com/c/BusinessAutomatedTutorials
If you like our tutorials — buy us a coffee☕: https://www.buymeacoffee.com/business
