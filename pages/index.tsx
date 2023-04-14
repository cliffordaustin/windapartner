import { dehydrate, QueryClient, useQuery } from "react-query";
import { getHighlightedStays } from "./api/stays";
import { getUser } from "./api/user";
import { GetServerSideProps } from "next";
import { Stay, UserTypes } from "@/utils/types";
import Head from "next/head";
import Navbar from "@/components/Homepage/Navbar";
import Image from "next/image";
import Button from "@/components/ui/Button";
import { Link as ScrollLink } from "react-scroll";
import { Source_Sans_Pro } from "next/font/google";
import Main from "@/components/Homepage/Main";
import getToken from "@/utils/getToken";
import Cookies from "js-cookie";
import { AxiosError } from "axios";

const sans = Source_Sans_Pro({
  weight: ["900"],
  subsets: ["latin"],
});

export default function Home() {
  const token = Cookies.get("token");

  const { data: stays } = useQuery<Stay[]>(
    "highlightedStays",
    getHighlightedStays
  );

  const { data: user } = useQuery<UserTypes | null>("user", () =>
    getUser(token)
  );

  return (
    <div className="">
      <Head>
        <title>
          Winda.guide | High quality and affordable lodges in Africa
        </title>
        <meta
          name="description"
          content="Search, discover, and book your travel needs in Kenya, all in one place. Try it now."
        ></meta>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <Navbar showBookNowBtn={true} user={user}></Navbar>

      <div className="select-none relative">
        <div className="w-full text-red-600 flex flex-col items-center h-[500px] md:h-[600px] relative before:absolute before:h-full before:w-full before:bg-black before:z-20 before:opacity-40">
          <video
            autoPlay
            muted
            playsInline
            loop
            className="w-full h-full absolute inset-0 object-cover object-center"
            id="video"
          >
            <source
              src="https://winda-guide.s3.eu-west-2.amazonaws.com/video/winda-homevid.webm"
              type="video/webm"
            ></source>
            <source
              src="https://winda-guide.s3.eu-west-2.amazonaws.com/video/winda-homevid.mp4"
              type="video/mp4"
            ></source>

            <Image
              className={"w-full object-cover object-bottom "}
              fill
              src="/images/image-header.jpg"
              unoptimized={true}
              sizes="380"
              alt="Image of samburu man looking at a vast landscape"
              priority
            />
          </video>

          <div className="flex flex-col items-center justify-center absolute w-[90%] text-center top-[30%] md:top-[30%] z-20 px-6 md:px-0">
            <div className="flex flex-col items-center">
              <h1
                className={
                  "font-black mb-2 text-3xl sm:text-3xl md:text-6xl xl:text-7xl text-white text-center " +
                  sans.className
                }
              >
                Quality, Tasteful and Affordable Lodges Across Africa
              </h1>
              <h3
                className={
                  "font-bold mb-8 mt-3 text-base sm:text-2xl italic text-white text-center "
                }
              >
                You deserve memorable travel experiences without breaking the
                bank.
              </h3>
            </div>

            <ScrollLink
              to="stays"
              spy={true}
              smooth={true}
              offset={-50}
              duration={500}
            >
              <Button className="flex w-[150px] h-[40px] items-center justify-center gap-0.5 px-2 ml-4 lg:px-4 py-2 cursor-pointer gradient-red rounded-3xl">
                <span className="text-white text-base uppercase font-bold">
                  Book now
                </span>
              </Button>
            </ScrollLink>
          </div>
        </div>
      </div>

      <div className="bg-white md:pb-14">
        <div className="2xl:w-4/6 2xl:mx-auto">
          <Main stays={stays}></Main>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const queryClient = new QueryClient();

  const token = getToken(context);

  try {
    await queryClient.fetchQuery<Stay[]>(
      "highlightedStays",
      getHighlightedStays
    );

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
