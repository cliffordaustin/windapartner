import { useState, useEffect } from "react";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Open_Sans } from "next/font/google";
import { QueryClient, QueryClientProvider, Hydrate } from "react-query";
import { MantineProvider } from "@mantine/core";
import { NavigationProgress, nprogress } from "@mantine/nprogress";
import { useRouter } from "next/router";
import { ContextProvider as AgentContextProvider } from "@/context/AgentPage";
import { ContextProvider as CalculateContextProvider } from "@/context/CalculatePage";
import { Notifications } from "@mantine/notifications";
import ReactGA from "react-ga4";

const open_sans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "700", "800", "500", "600"],
});

if (
  process.env.NODE_ENV === "production" &&
  process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID
) {
  console.log("init");
  ReactGA.initialize(process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID);
  if (process.browser) {
    ReactGA.send({
      hitType: "pageview",
      page: window.location.pathname,
    });
  }
}

export default function App({ Component, pageProps }: AppProps) {
  // This ensures that data is not shared
  // between different users and requests
  const [queryClient] = useState(() => new QueryClient());

  const router = useRouter();

  useEffect(() => {
    const handleStart = (url: string) =>
      url !== router.asPath && nprogress.start();
    const handleComplete = () => nprogress.complete();

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router.asPath]);

  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        fontFamily: open_sans.style.fontFamily,
      }}
    >
      <NavigationProgress color="red" />
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
  );
}
