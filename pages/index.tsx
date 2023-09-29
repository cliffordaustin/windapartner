import Head from "next/head";
import Image from "next/image";
import { Source_Sans_Pro } from "next/font/google";
import getToken from "@/utils/getToken";
import Cookies from "js-cookie";
import Main from "@/components/Homepage/Main";
import {
  Anchor,
  Button,
  Flex,
  Menu,
  Modal,
  NavLink,
  Popover,
  Text,
} from "@mantine/core";
import Link from "next/link";
import { useDisclosure, useScrollIntoView } from "@mantine/hooks";
import { useEffect } from "react";
import { Auth } from "aws-amplify";
import { IconHome, IconUser } from "@tabler/icons-react";

const sans = Source_Sans_Pro({
  weight: ["900"],
  subsets: ["latin"],
});

export default function Home({ signOut }: { signOut: () => void }) {
  const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>({
    offset: 60,
  });

  const [opened, { open, close }] = useDisclosure(false);

  return (
    <div className="!relative">
      <Head>
        <title>Winda | Safari Pricer For Properties</title>
        <meta
          name="description"
          content="Search, discover, and book your travel needs in Kenya, all in one place. Try it now."
        ></meta>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <div className="sticky bg-[#f5f3f4] w-full flex justify-between top-0 z-40 py-3 left-0 right-0 px-2 md:px-16">
        <Link className="" href="/">
          <div className="relative w-28 h-9 cursor-pointer">
            <Image
              alt="Winda logo"
              src="/images/winda_logo/horizontal-blue-font.png"
              className="w-full h-full"
              sizes="(max-width: 768px) 100vw,
              (max-width: 1200px) 50vw,
              33vw"
              fill
            ></Image>
          </div>
        </Link>

        <div className="flex items-center gap-4"></div>

        <div className="flex items-center gap-3">
          <Menu trigger="hover" width={250} withArrow shadow="md">
            <Menu.Target>
              <Button
                variant="light"
                className="font-semibold bg-white hover:bg-gray-50 text-black"
              >
                Login
              </Button>
            </Menu.Target>
            <Menu.Dropdown className="px-3 py-2">
              <NavLink
                label="Agent"
                component="a"
                href="/signin?next_state=agent"
                icon={<IconUser size="1rem" stroke={1.5} />}
              />
              <NavLink
                label="Property Owner"
                component="a"
                href="/signin?next_state=property"
                icon={<IconHome size="1rem" stroke={1.5} />}
              />
            </Menu.Dropdown>
          </Menu>

          <Menu
            trigger="hover"
            width={250}
            position="bottom-end"
            withArrow
            shadow="md"
          >
            <Menu.Target>
              <Button
                color="dark"
                className="transition-all duration-300 w-fit"
              >
                Get started
              </Button>
            </Menu.Target>
            <Menu.Dropdown className="px-3 py-2">
              <NavLink
                label="Agent"
                component="a"
                href="/signin?next_state=agent&register=1"
                icon={<IconUser size="1rem" stroke={1.5} />}
              />
              <NavLink
                label="Property Owner"
                component="a"
                href="/signin?next_state=property&register=1"
                icon={<IconHome size="1rem" stroke={1.5} />}
              />
            </Menu.Dropdown>
          </Menu>
        </div>
      </div>

      <div className="flex flex-col px-4 md:px-8 items-center mt-6 md:mt-12 w-full gap-4">
        <Text
          className={
            "font-semibold md:mb-2 text-2xl text-center sm:text-2xl md:text-5xl xl:text-5xl text-black "
          }
        >
          The fastest way to calculate your trips.
        </Text>
        <div className="flex flex-col items-center">
          <Text
            className={
              "mb-2 text-sm md:w-[65%] lg:w-[65%] text-center sm:text-base md:text-lg xl:text-lg text-black "
            }
          >
            Tired of wasting time and making errors while calculating your
            client trips? Safaripricer saves you valuable time to focus on
            crafting unforgettable experiences for your customers.
          </Text>

          <div className="flex items-center mt-4 gap-3">
            <Menu
              trigger="hover"
              width={250}
              position="bottom-end"
              withArrow
              shadow="md"
            >
              <Menu.Target>
                <div>
                  <Button
                    size="lg"
                    color="dark"
                    className="transition-all duration-300 w-fit hidden md:block"
                  >
                    Get started
                  </Button>

                  <Button
                    size="md"
                    color="dark"
                    className="transition-all duration-300 w-fit md:hidden"
                  >
                    Get started
                  </Button>
                </div>
              </Menu.Target>
              <Menu.Dropdown className="px-3 py-2">
                <NavLink
                  label="Agent"
                  component="a"
                  href="/signin?next_state=agent&register=1"
                  icon={<IconUser size="1rem" stroke={1.5} />}
                />
                <NavLink
                  label="Property Owner"
                  component="a"
                  href="/signin?next_state=property&register=1"
                  icon={<IconHome size="1rem" stroke={1.5} />}
                />
              </Menu.Dropdown>
            </Menu>

            <Button
              size="lg"
              color="dark"
              variant="outline"
              className="w-fit hidden md:block"
              onClick={() =>
                scrollIntoView({
                  alignment: "center",
                })
              }
            >
              See how it works
            </Button>

            <Button
              size="md"
              color="dark"
              variant="outline"
              className="w-fit md:hidden"
              onClick={() =>
                scrollIntoView({
                  alignment: "center",
                })
              }
            >
              See how it works
            </Button>
          </div>

          {/* <Button
              className="!rounded-full mt-4 self-baseline"
              color="red"
              onClick={() =>
                scrollIntoView({
                  alignment: "center",
                })
              }
            >
              See product demo
            </Button> */}
        </div>
      </div>

      {/* <Flex
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
        </Flex> */}

      {/* <Modal
        opened={opened}
        onClose={close}
        overlayProps={{
          opacity: 0.55,
          blur: 3,
        }}
        className="!w-[500px]"
      >
        <div className="flex flex-col justify-center gap-4">
          <AgentSignin
            name={form.values.name}
            email={form.values.email}
          ></AgentSignin>
        </div>
      </Modal> */}

      <div className="mb-6 mt-6">
        <Main targetRef={targetRef}></Main>
      </div>
    </div>
  );
}
