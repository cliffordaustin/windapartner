import { useState, useEffect } from "react";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Open_Sans } from "next/font/google";
import { QueryClient, QueryClientProvider, Hydrate } from "react-query";
import { MantineProvider } from "@mantine/core";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useRouter } from "next/router";
import { ContextProvider as AgentContextProvider } from "@/context/AgentPage";
import { ContextProvider as CalculateContextProvider } from "@/context/CalculatePage";
import { Notifications } from "@mantine/notifications";
import Router from "next/router";
import ReactGA from "react-ga4";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import Head from "next/head";

import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { Amplify, Auth } from "aws-amplify";

import awsExports from "../src/aws-exports";
Amplify.configure({ ...awsExports, ssr: true });

const open_sans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "700", "800", "500", "600"],
});

if (
  process.env.NODE_ENV === "production" &&
  process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID
) {
  ReactGA.initialize(process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID);
  if (process.browser) {
    ReactGA.send({
      hitType: "pageview",
      page: window.location.pathname,
    });
  }
}

NProgress.configure({
  minimum: 0.3,
  easing: "ease",
  speed: 800,
  showSpinner: false,
});

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <GoogleOAuthProvider
      clientId={process.env.NEXT_PUBLIC_GOOGLE_SOCAIL_AUTH_CLIENT_ID || ""}
    >
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          fontFamily: open_sans.style.fontFamily,
        }}
      >
        <Notifications />
        <QueryClientProvider client={queryClient}>
          <Hydrate state={pageProps.dehydratedState}>
            <AgentContextProvider>
              <CalculateContextProvider>
                <main className={open_sans.className}>
                  <Component {...pageProps} />
                </main>
              </CalculateContextProvider>
            </AgentContextProvider>
          </Hydrate>
        </QueryClientProvider>
      </MantineProvider>
    </GoogleOAuthProvider>
  );
}
