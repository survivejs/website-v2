import * as twindColors from "https://cdn.skypack.dev/twind@0.16.16/colors?min";
import twindTypography from "https://cdn.skypack.dev/@twind/typography@0.0.2?min";

export default {
  theme: {
    extend: {
      colors: {
        ...twindColors,
        primary: "#09b5c4",
        primarymuted: "#0ab5c340",
        secondary: "#d3fffb",
      },
    },
  },
  plugins: {
    ...twindTypography(),
    // TODO: not-prose hasn't been implemented yet
    "btn-group": "not-prose flex flex-row gap-4",
    btn: "py-2 px-4 rounded-full border-2 border-primary bg-primarymuted",
  },
};
