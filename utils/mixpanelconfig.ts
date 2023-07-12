import mixpanel, { Dict } from "mixpanel-browser";

// NB: CHANGE DEBUG TO FALSE IN PRODUCTION
mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN || "", {
  debug: true,
  ignore_dnt: true,
  api_host: "https://api-eu.mixpanel.com",
});

// change to production before deploying
let env_check = process.env.NODE_ENV === "production";

let actions = {
  identify: (id: string) => {
    if (env_check) mixpanel.identify(id);
  },
  alias: (id: string) => {
    if (env_check) mixpanel.alias(id);
  },
  track: (name: string, props?: Dict) => {
    if (env_check) mixpanel.track(name, props);
  },
  people: {
    set: (props: Dict) => {
      if (env_check) mixpanel.people.set(props);
    },
  },
  register_once: (props: Dict) => {
    if (env_check) {
      mixpanel.register_once(props);
    }
  },
};

export let Mixpanel = actions;
