import {
  Button,
  Divider,
  Flex,
  Grid,
  List,
  Menu,
  Modal,
  NavLink,
  Tabs,
  Text,
  TextInput,
  Textarea,
  ThemeIcon,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconCalculator,
  IconCircleCheck,
  IconCircleDashed,
  IconCircleX,
  IconHome,
  IconLockAccess,
  IconNote,
  IconNotes,
  IconUser,
} from "@tabler/icons-react";
import axios from "axios";
import Image from "next/image";
import React from "react";
import { notifications } from "@mantine/notifications";
import { useDisclosure } from "@mantine/hooks";
import PropertySignin from "./PropertySignin";

type MainProps = {
  targetRef: React.MutableRefObject<HTMLDivElement | null>;
};

function Main({ targetRef }: MainProps) {
  const form = useForm({
    initialValues: {
      email: "",
      name: "",
    },
  });

  const [opened, { open, close }] = useDisclosure(false);

  type FormValues = {
    firstName: string;
    lastName: string;
    email: string;
    message: string;
  };
  const demo = useForm<FormValues>({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      message: "",
    },
  });

  const [loading, setLoading] = React.useState(false);

  const sumbit = (values: FormValues) => {
    setLoading(true);
    axios
      .post(`${process.env.NEXT_PUBLIC_baseURL}/schedule-demo/`, {
        first_name: values.firstName,
        last_name: values.lastName,
        email: values.email,
        message: values.message,
      })
      .then((res) => {
        setLoading(false);
        notifications.show({
          title: "Demo scheduled!",
          message: "We will get back to you shortly.",
        });
        form.reset();
      });
  };
  return (
    <div className="">
      <div
        ref={targetRef}
        className="relative hidden md:flex black-gradient rounded-xl h-[280px] md:h-[500px] mx-auto w-[90%] items-center justify-center"
      >
        <video
          className="rounded-xl w-[80%] h-[200px] md:w-[800px] md:h-[425px] absolute bottom-[7%] z-20"
          muted
          id="video"
          // controls
          autoPlay
          loop
        >
          <source
            src="https://winda-guide.s3.eu-west-2.amazonaws.com/video/Travel-Agent-Screen-recording-2023-08-01-5.04.48-PM-_online-video-cutter.com_.webm"
            type="video/webm"
            width={700}
          ></source>
          <source
            src="https://winda-guide.s3.eu-west-2.amazonaws.com/video/Travel+Agent+Screen+recording+2023-08-01+5.04.48+PM+(online-video-cutter.com).mp4"
            type="video/mp4"
            width={700}
          ></source>
        </video>
      </div>

      <div ref={targetRef} className="relative md:hidden mt-10">
        <video
          className="rounded-t-xl w-full h-[240px] md:w-[800px] md:h-[425px] bottom-0 z-20"
          muted
          id="video"
          autoPlay
          loop
        >
          <source
            src="https://winda-guide.s3.eu-west-2.amazonaws.com/video/Travel-Agent-Screen-recording-2023-08-01-5.04.48-PM-_online-video-cutter.com_.webm"
            type="video/webm"
            width={700}
          ></source>
          <source
            src="https://winda-guide.s3.eu-west-2.amazonaws.com/video/Travel+Agent+Screen+recording+2023-08-01+5.04.48+PM+(online-video-cutter.com).mp4"
            type="video/mp4"
            width={700}
          ></source>
        </video>
      </div>
      <div className="w-full mx-auto mt-10">
        <Text className="font-semibold text-center text-2xl md:text-3xl px-4">
          See how teams use Safari Pricer
        </Text>

        <Tabs
          color="dark"
          className="w-full md:w-[90%] mx-auto"
          defaultValue="consultants"
        >
          <Tabs.List className="mt-4 w-fit mx-auto">
            <Tabs.Tab value="consultants" className="px-2 md:px-4 md:text-lg">
              Tour Consultants
            </Tabs.Tab>
            <Tabs.Tab value="private" className="px-2 md:px-4 md:text-lg">
              Private Guides
            </Tabs.Tab>
            <Tabs.Tab value="properties" className="px-2 md:px-4 md:text-lg">
              Properties
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="consultants">
            <div className="mt-8 w-[90%] md:w-full mx-auto bg-[#f5f3f4] flex gap-6 h-[400px] rounded-xl">
              <div className="flex flex-col gap-6 w-full md:w-[50%] py-5 px-6 md:px-12">
                <div className="">
                  <Text className="text-xl md:text-2xl py-5">
                    Deliver a wide variety of itineraries to your clients in
                    minutes.
                  </Text>

                  <div className="bg-gray-300 h-[1px] w-[50%]"></div>
                </div>

                <List
                  spacing="xs"
                  size="sm"
                  center
                  icon={
                    <ThemeIcon color="dark" size={24} radius="xl">
                      <IconCircleCheck size="1rem" />
                    </ThemeIcon>
                  }
                >
                  <List.Item>
                    Calculate the trip’s cost across multiple locations.
                  </List.Item>
                  <List.Item>
                    Create quotes and send to your clients in minutes.
                  </List.Item>
                  <List.Item>
                    Direct access to most properties in East Africa.
                  </List.Item>
                </List>

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
              </div>
              <div className="hidden md:block md:w-[60%] relative">
                <Image
                  src="/images/home/tour-consultants.png"
                  className={"object-cover object-top"}
                  alt={"Images of Tour Consultants"}
                  sizes="100%"
                  priority
                  fill
                />

                {/* <div className="absolute bg-black w-full h-full inset-0 bg-opacity-5"></div> */}
              </div>
            </div>
          </Tabs.Panel>

          <Tabs.Panel value="private">
            <div className="mt-8 w-[90%] md:w-full mx-auto bg-[#f5f3f4] flex gap-6 h-[400px] rounded-xl">
              <div className="flex flex-col gap-6 w-full md:w-[50%] py-5 px-6 md:px-12">
                <div className="">
                  <Text className="text-xl md:text-2xl py-5">
                    Create your own quotes across multiple locations quickly and
                    accurately.
                  </Text>

                  <div className="bg-gray-300 h-[1px] w-[50%]"></div>
                </div>

                <List
                  spacing="xs"
                  size="sm"
                  center
                  icon={
                    <ThemeIcon color="dark" size={24} radius="xl">
                      <IconCircleCheck size="1rem" />
                    </ThemeIcon>
                  }
                >
                  <List.Item>Create quotes on mobile.</List.Item>
                  <List.Item>Available while offline on safari.</List.Item>
                  <List.Item>Integrates with your itinerary builder.</List.Item>
                </List>

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
              </div>
              <div className="hidden md:block md:w-[60%] relative">
                <Image
                  src="/images/home/private-guides.png"
                  className={"object-cover object-top"}
                  alt={"Images of Private Guides"}
                  sizes="100%"
                  priority
                  fill
                />
              </div>
            </div>
          </Tabs.Panel>

          <Tabs.Panel value="properties">
            <div className="mt-8 w-[90%] md:w-full mx-auto bg-[#f5f3f4] flex gap-6 h-[400px] rounded-xl">
              <div className="flex flex-col gap-6 w-full md:w-[50%] py-5 px-6 md:px-12">
                <div className="">
                  <Text className="text-xl md:text-2xl py-5">
                    Increase your property’s visibility to a larger audience of
                    travel agents and tour operators.
                  </Text>

                  <div className="bg-gray-300 h-[1px] w-[50%]"></div>
                </div>

                <List
                  spacing="xs"
                  size="sm"
                  center
                  icon={
                    <ThemeIcon color="dark" size={24} radius="xl">
                      <IconCircleCheck size="1rem" />
                    </ThemeIcon>
                  }
                >
                  <List.Item>
                    Promote your offers to all agents on Safari Pricer.
                  </List.Item>
                  <List.Item>
                    Centrally manage all agent contracts in one place.
                  </List.Item>
                  <List.Item>
                    Automate access to your rates by agents.
                  </List.Item>
                </List>

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
              </div>
              <div className="hidden md:block md:w-[60%] relative">
                <Image
                  src="/images/home/properties.png"
                  className={"object-cover object-top"}
                  alt={"Images of Properties"}
                  sizes="100%"
                  priority
                  fill
                />
              </div>
            </div>
          </Tabs.Panel>
        </Tabs>

        {/* <div className="py-8 max-w-[1300px] mx-auto">
          <div className="px-6 md:px-12 lg:px-24 flex-col md:flex-row flex items-center gap-4 md:gap-10">
            <div className="flex gap-3 flex-col">
              <Text
                className={
                  "md:mb-2 text-xl self-baseline sm:text-xl md:text-2xl font-normal "
                }
              >
                Safari pricer helps you churn a travel quote in{" "}
                <span className="font-bold">minutes.</span>
              </Text>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-[30px] h-[30px] bg-red-600 rounded-full flex items-center justify-center">
                    <IconLockAccess
                      color="white"
                      className=""
                      size={20}
                    ></IconLockAccess>
                  </div>
                  <Text className={"text-sm md:text-lg text-black "}>
                    Access all your suppliers in one place.
                  </Text>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-[30px] h-[30px] bg-red-600 rounded-full flex items-center justify-center">
                    <IconCalculator color="white" size={20}></IconCalculator>
                  </div>
                  <Text className={"text-sm md:text-lg text-black "}>
                    Calculate rack and nett rates automatically.
                  </Text>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-[30px] h-[30px] bg-red-600 rounded-full flex items-center justify-center">
                    <IconNotes color="white" size={20}></IconNotes>
                  </div>
                  <Text className={"text-sm md:text-lg text-black "}>
                    Creat quote and invoice to send to your customers.
                  </Text>
                </div>
              </div>
            </div>

            <div className="h-[220px] md:h-[250px] lg:h-[280px] w-[420px] md:w-[760px] relative">
              <video
                muted
                controls
                width="320"
                height="240"
                className="w-full h-full absolute inset-0"
                id="video"
                // autoPlay
              >
                <source
                  src="https://winda-guide.s3.eu-west-2.amazonaws.com/video/Travel+Agent+Screen+recording+2023-08-01+5.04.48+PM.webm"
                  type="video/webm"
                  width={700}
                ></source>
                <source
                  src="https://winda-guide.s3.eu-west-2.amazonaws.com/video/Travel+Agent+Screen+recording+2023-08-01+5.04.48+PM.mp4"
                  type="video/mp4"
                  width={700}
                ></source>
              </video>
            </div>
          </div>
          <div className="px-6 md:px-24 flex flex-col justify-center items-center gap-5 mt-14">
            <Text
              className={
                "text-xl pr-12 sm:text-xl md:text-2xl xl:text-2xl text-black "
              }
              weight={700}
            >
              Signup to get free access to the preview release
            </Text>

            <div className="w-full justify-center flex flex-col md:flex-row gap-2 md:gap-4">
              <TextInput
                required
                placeholder="Your Email Address"
                value={form.values.email}
                onChange={(event) =>
                  form.setFieldValue("email", event.currentTarget.value)
                }
                error={form.errors.email}
                radius="md"
                size="lg"
              />
              <TextInput
                placeholder="Your Company's Name"
                value={form.values.name}
                onChange={(event) =>
                  form.setFieldValue("name", event.currentTarget.value)
                }
                radius="md"
                size="lg"
              />

              <Button onClick={open} radius="md" size="lg" color="red">
                Join now
              </Button>
            </div>
          </div>
          <Modal
            opened={opened}
            onClose={close}
            overlayProps={{
              opacity: 0.55,
              blur: 3,
            }}
            className="!w-[500px]"
          >
            <div className="flex flex-col justify-center gap-4">
              <PropertySignin
                name={form.values.name}
                email={form.values.email}
              ></PropertySignin>
            </div>
          </Modal>   
        </div> */}
      </div>

      {/* <div className="max-w-[1100px] mx-auto mt-12 md:mt-24 px-6 md:px-12">
        <Text
          className="font-bold mt-1 text-center mb-2 text-2xl self-baseline sm:text-2xl md:text-4xl xl:text-4xl text-black"
          color="black"
        >
          Why SafariPricer is different.
        </Text>

        <Text className="text-center text-xl mt-4 md:mt-6">
          We&apos;re reshaping how lodges and travel agents collaborate, making
          bookings effortless.
        </Text>

        <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-center mt-10">
          <div className="relative w-full md:w-[45%] h-[330px]">
            <Image
              src="/images/property.jpg"
              className="w-full h-full object-cover"
              alt={"Images of property"}
              priority
              fill
            />
          </div>

          <div className="flex flex-col w-full md:w-[55%] gap-2">
            <Text className="font-bold mt-1 mb-2 text-xl self-baseline sm:text-2xl md:text-2xl xl:text-3xl text-black">
              An experience so seamless, agents will thank you with delight!
            </Text>

            <Text
              className={
                "text-base md:pr-12 sm:text-base md:text-base xl:text-lg text-black "
              }
            >
              Properties can efficiently manage agent contracts on one platform,
              update pricing in real-time, maintain effective agent
              relationships, and track performance automatically throughout the
              year.
            </Text>

            <Button
              onClick={open}
              color="red"
              className="w-fit"
              radius="md"
              size="lg"
            >
              Try for free
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-center mt-10">
          <div className="flex order-2 md:order-1 flex-col w-full md:w-[50%] gap-2">
            <Text className="font-bold mt-1 mb-2 text-xl self-baseline sm:text-2xl md:text-2xl xl:text-3xl text-black">
              Trip calculations, a breeze, no stress, just ease!
            </Text>

            <Text
              className={
                "text-base md:pr-12 sm:text-base md:text-base xl:text-lg text-black "
              }
            >
              Travel agents eliminate the need for hundreds of pricing contracts
              and gain instant access to all contract rates. They calculate trip
              costs instantly and generate client quotes and invoices within
              minutes.
            </Text>

            <Button
              onClick={open}
              color="red"
              className="w-fit"
              radius="md"
              size="lg"
            >
              Try for free
            </Button>
          </div>
          <div className="relative order-1 md:order-2 w-full md:w-[50%] h-[330px]">
            <Image
              src="/images/agent.png"
              className="w-full h-full object-cover"
              alt={"Images of property"}
              priority
              fill
            />
          </div>
        </div>
      </div>

      <div className="mt-4 px-6 md:px-12">
        <Flex
          mx="auto"
          className="justify-center mt-12 md:mt-24"
          maw={1200}
          direction="column"
        >
          <Text className="font-bold mt-1 text-center mb-2 text-xl self-baseline sm:text-2xl md:text-4xl xl:text-4xl text-black">
            Key features
          </Text>
          <Flex
            align="center"
            className="md:flex-row flex-col"
            gap={30}
            w="100%"
          >
            <div className="md:w-[35%] w-full">
              <Text weight={600} mt={20}>
                Seamless Integration:
              </Text>
              <List
                spacing="lg"
                size="sm"
                mt={8}
                withPadding
                center
                icon={
                  <ThemeIcon color="teal" size={24} radius="xl">
                    <IconCircleCheck size="1rem" />
                  </ThemeIcon>
                }
              >
                <List.Item className="leading-5">
                  Our pricing engine integrates with existing travel software
                  and tools.
                </List.Item>
              </List>

              <Text weight={600} className="mt-4 md:mt-12">
                Customizable sections:
              </Text>
              <List
                spacing="lg"
                size="sm"
                mt={8}
                withPadding
                center
                icon={
                  <ThemeIcon color="teal" size={24} radius="xl">
                    <IconCircleCheck size="1rem" />
                  </ThemeIcon>
                }
              >
                <List.Item className="leading-5">
                  To include different pricing options, such as add-ons or
                  discounts, based on your preferences.
                </List.Item>
              </List>

              <Text weight={600} className="mt-4 md:mt-12">
                Accurate Pricing Control:
              </Text>
              <List
                spacing="lg"
                size="sm"
                mt={8}
                withPadding
                center
                icon={
                  <ThemeIcon color="teal" size={24} radius="xl">
                    <IconCircleCheck size="1rem" />
                  </ThemeIcon>
                }
              >
                <List.Item className="leading-5">
                  Properties set and adjust prices centrally, ensuring
                  consistent and accurate pricing across all channels.
                </List.Item>
              </List>
            </div>

            <div className="relative md:block hidden w-[280px] h-[500px]">
              <Image
                className={"w-full "}
                fill
                src="/images/home/pitchimg2.png"
                alt=""
                priority
              />
            </div>

            <div className="md:w-[35%] w-full">
              <Text weight={600} mt={20}>
                Advanced Trip Configuration:
              </Text>
              <List
                spacing="lg"
                size="sm"
                mt={8}
                withPadding
                center
                icon={
                  <ThemeIcon color="teal" size={24} radius="xl">
                    <IconCircleCheck size="1rem" />
                  </ThemeIcon>
                }
              >
                <List.Item className="leading-5">
                  Agents can customize and configure every aspect of the trip.
                </List.Item>
              </List>

              <Text weight={600} className="mt-4 md:mt-12">
                Automation and Reporting:
              </Text>
              <List
                spacing="lg"
                size="sm"
                mt={8}
                withPadding
                center
                icon={
                  <ThemeIcon color="teal" size={24} radius="xl">
                    <IconCircleCheck size="1rem" />
                  </ThemeIcon>
                }
              >
                <List.Item className="leading-5">
                  Users can generate insightful reports and business
                  intelligence to help in making data-driven decisions.
                </List.Item>
              </List>

              <Text weight={600} className="mt-4 md:mt-12">
                A seamless and easy UX:
              </Text>
              <List
                spacing="lg"
                size="sm"
                mt={8}
                withPadding
                center
                icon={
                  <ThemeIcon color="teal" size={24} radius="xl">
                    <IconCircleCheck size="1rem" />
                  </ThemeIcon>
                }
              >
                <List.Item className="leading-5">
                  Automated rate upload and calculation across properties in the
                  same or different locations.
                </List.Item>
              </List>
            </div>
          </Flex>
        </Flex>
      </div>

      <div className="mt-16 px-5">
        <Text weight={800} className="text-2xl md:text-4xl px-0 md:px-28">
          Schedule Demo
        </Text>

        <Flex maw={900} mt={25} mx="auto" direction="column" gap={12}>
          <form onSubmit={demo.onSubmit((values) => sumbit(values))}>
            <Flex gap={12}>
              <TextInput
                placeholder="First Name"
                required
                value={demo.values.firstName}
                w="50%"
                label="First Name"
                onChange={(event) =>
                  demo.setFieldValue("firstName", event.currentTarget.value)
                }
              />

              <TextInput
                placeholder="Last Name"
                required
                w="50%"
                value={demo.values.lastName}
                label="Last Name"
                onChange={(event) =>
                  demo.setFieldValue("lastName", event.currentTarget.value)
                }
              />
            </Flex>
            <TextInput
              mt={12}
              placeholder="Email"
              required
              value={demo.values.email}
              label="Email"
              onChange={(event) =>
                demo.setFieldValue("email", event.currentTarget.value)
              }
            />

            <Textarea
              mt={12}
              placeholder="Message"
              value={demo.values.message}
              minRows={5}
              label="Message (optional)"
              onChange={(event) =>
                demo.setFieldValue("message", event.currentTarget.value)
              }
            />

            <Button loading={loading} type="submit" mt={8} color="red">
              <Text weight={600}>Submit</Text>
            </Button>
          </form>
        </Flex>
      </div> */}
    </div>
  );
}

export default Main;
