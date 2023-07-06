import { dehydrate, QueryClient, useQuery } from "react-query";
import { getUser } from "./api/user";
import { GetServerSideProps } from "next";
import { UserTypes } from "@/utils/types";
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
  const token = Cookies.get("token");

  const { data: user } = useQuery<UserTypes | null>("user", () =>
    getUser(token)
  );

  const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>({
    offset: 60,
  });

  return (
    <div className="overflow-x-hidden">
      <Head>
        <title>Winda | Safari Pricer</title>
        <meta
          name="description"
          content="Search, discover, and book your travel needs in Kenya, all in one place. Try it now."
        ></meta>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <div className="w-full flex flex-col items-center home-gradient h-[300px] md:h-[350px] lg:h-[500px] !relative">
        <div className="absolute top-10 left-6">
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
        </div>

        <Flex
          h="100%"
          w="90%"
          px={25}
          gap={24}
          align="center"
          justify="space-center"
        >
          <div className="absolute lg:static bottom-12 flex w-full lg:w-[50%] flex-col">
            <Text
              className={
                "font-black mb-2 uppercase text-4xl self-baseline sm:text-3xl md:text-7xl xl:text-7xl text-white "
              }
            >
              Safari Pricer
            </Text>

            <Button
              className="!rounded-full mt-4 self-baseline"
              w={150}
              color="red"
              onClick={() =>
                scrollIntoView({
                  alignment: "center",
                })
              }
            >
              Schedule Demo
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

      <div>
        <Main targetRef={targetRef}></Main>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const queryClient = new QueryClient();

  const token = getToken(context);

  try {
    await queryClient.fetchQuery<UserTypes | null>("user", () =>
      getUser(token)
    );

    return {
      props: {
        dehydratedState: dehydrate(queryClient),
      },
    };
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 401) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }
    return {
      props: {},
    };
  }
};
