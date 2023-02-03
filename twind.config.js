import { defineConfig } from "@twind/core";
import presetAutoprefix from "@twind/preset-autoprefix";
import presetTailwind from "@twind/preset-tailwind";

// use px instead of rem (Tailwind's default unit) so that the size of shadow dom elements is not affected by html base font size https://github.com/tw-in-js/twind/issues/437#issue-1532077112
const presetRemToPx = ({ baseValue = 16 } = {}) => {
  return {
    finalize(rule) {
      return {
        ...rule,
        // d: the CSS declaration body
        // Based on https://github.com/TheDutchCoder/postcss-rem-to-px/blob/main/index.js
        d: rule.d?.replace(
          /"[^"]+"|'[^']+'|url\([^)]+\)|(-?\d*\.?\d+)rem/g,
          (match, p1) => {
            if (p1 === undefined) return match;
            return `${p1 * baseValue}${p1 == 0 ? "" : "px"}`;
          }
        ),
      };
    },
  };
};

export default defineConfig({
  presets: [presetAutoprefix(), presetTailwind(/* options */), presetRemToPx()],
  /* config */
});
