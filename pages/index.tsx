import Head from "next/head";
import Image from "next/image";
import { Source_Sans_Pro } from "next/font/google";
import getToken from "@/utils/getToken";
import Cookies from "js-cookie";
import { AxiosError } from "axios";
import Main from "@/components/Homepage/Main";
import { Button, Flex, Text } from "@mantine/core";
import Link from "next/link";
import { useScrollIntoView } from "@mantine/hooks";

const sans = Source_Sans_Pro({
  weight: ["900"],
  subsets: ["latin"],
});

export default function Home() {
  const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>({
    offset: 60,
  });

  return (
    <div className="overflow-x-hidden">
      <Head>
        <title>Winda | Safari Pricer For Properties</title>
        <meta
          name="description"
          content="Search, discover, and book your travel needs in Kenya, all in one place. Try it now."
        ></meta>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <div className="w-full flex flex-col items-center home-gradient h-[350px] md:h-[350px] lg:h-[500px] !relative">
        <div className="absolute w-full flex justify-between top-5 md:top-5 left-6">
          <Link href="/">
            <div className="relative w-28 h-9 cursor-pointer">
              <Image
                alt="Winda logo"
                src="/images/winda_logo/horizontal-white-font.png"
                className="w-full h-full"
                sizes="(max-width: 768px) 100vw,
              (max-width: 1200px) 50vw,
              33vw"
                fill
              ></Image>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center gap-1">
              <Link className="text-white font-bold no-underline" href="/">
                For Properties
              </Link>
              <div className="h-[1.5px] w-[16px] bg-white"></div>
            </div>

            <div className="flex flex-col items-center gap-1">
              <Link
                className="text-white font-bold opacity-80 hover:opacity-100 no-underline"
                href="/for-agents"
              >
                For Agents
              </Link>
              <div></div>
            </div>
          </div>

          <div></div>
        </div>

        <Flex
          h="100%"
          w="100%"
          px={25}
          gap={24}
          align="center"
          justify="space-center"
        >
          <div className="absolute lg:static bottom-10 flex w-full lg:w-[50%] flex-col">
            <Text
              className={
                "font-black mb-2 uppercase text-4xl self-baseline sm:text-3xl md:text-7xl xl:text-7xl text-white "
              }
            >
              Safari Pricer
            </Text>
            <Text
              className={
                "mb-2 text-xl pr-12 sm:text-xl md:text-2xl xl:text-2xl text-white "
              }
            >
              An integrated pricing and payment platform for the travel industry
              in Africa.
            </Text>

            <Button
              className="!rounded-full mt-4 self-baseline"
              color="red"
              onClick={() =>
                scrollIntoView({
                  alignment: "center",
                })
              }
            >
              See product demo
            </Button>
          </div>

          <div className="w-full lg:block hidden lg:w-[45%]">
            <div className="relative w-[500px] h-[300px]">
              <Image
                className={"w-full "}
                fill
                src="/images/home/laptop.png"
                alt=""
                priority
              />
            </div>
          </div>
        </Flex>
      </div>

      <div className="mb-6">
        <Main targetRef={targetRef}></Main>
      </div>
    </div>
  );
}
