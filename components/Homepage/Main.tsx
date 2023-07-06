import {
  Button,
  Flex,
  Grid,
  List,
  Text,
  TextInput,
  Textarea,
  ThemeIcon,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconCircleCheck, IconCircleX } from "@tabler/icons-react";
import axios from "axios";
import Image from "next/image";
import React from "react";
import { notifications } from "@mantine/notifications";

type MainProps = {
  targetRef: React.MutableRefObject<HTMLDivElement | null>;
};

function Main({ targetRef }: MainProps) {
  type FormValues = {
    firstName: string;
    lastName: string;
    email: string;
    message: string;
  };
  const form = useForm<FormValues>({
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
    <div className="py-4">
      <Flex
        mx="auto"
        gap={30}
        mt={30}
        className="justify-center flex-col md:flex-row px-4"
        maw={1000}
        align="center"
      >
        <div className="flex order-2 md:w-[50%] flex-col">
          <Text weight={800} className="text-2xl md:text-4xl text-[#0A1A44]">
            The Problem
          </Text>

          <List
            spacing="lg"
            size="sm"
            mt={20}
            center
            icon={
              <ThemeIcon color="red" size={24} radius="xl">
                <IconCircleX size="1rem" />
              </ThemeIcon>
            }
          >
            <List.Item className="leading-5">
              Travel agents and tour operators spend hours manually pricing
              complex trips.
            </List.Item>
            <List.Item className="leading-5">
              Inaccurate pricing leads to financial losses and customer
              dissatisfaction.
            </List.Item>
            <List.Item className="leading-5">
              Lack of efficient tools and automation to streamline the pricing
              process.
            </List.Item>
          </List>
        </div>
        <div className="relative order-1 w-full sm:w-[400px] h-[320px]">
          <Image
            className={"w-full object-cover md:object-contain"}
            fill
            src="/images/home/pitchimg1.png"
            alt=""
            priority
          />
        </div>
      </Flex>

      <div className="mt-12 md:mt-28">
        <Text
          weight={800}
          className="text-2xl md:text-4xl text-[#0A1A44] px-4 md:px-12"
        >
          Why Safari Pricer?
        </Text>

        <Grid className="mt-6">
          <Grid.Col
            span={12}
            md={4}
            lg={4}
            className="flex flex-col p-8 gap-6 text-white bg-[#0A1A44]"
          >
            <div
              className="
              rounded-full bg-white text-[#0A1A44] font-bold text-xl w-10 h-10 flex items-center justify-center
            "
            >
              01
            </div>
            <Text>
              A seamless and easy UX to calculate rates across properties in the
              same or different locations.
            </Text>
          </Grid.Col>

          <Grid.Col
            span={12}
            md={4}
            lg={4}
            className="flex flex-col p-8 gap-6 text-white bg-[#075E7A]"
          >
            <div
              className="
              rounded-full bg-white text-[#075E7A] font-bold text-xl w-10 h-10 flex items-center justify-center
            "
            >
              02
            </div>
            <Text>
              Customizable to include different pricing options, such as add-ons
              or discounts, based on your preferences.
            </Text>
          </Grid.Col>

          <Grid.Col
            span={12}
            md={4}
            lg={4}
            className="flex flex-col p-8 gap-6 text-white bg-[#0A1A44]"
          >
            <div
              className="
              rounded-full bg-white text-[#0A1A44] font-bold text-xl w-10 h-10 flex items-center justify-center
            "
            >
              03
            </div>
            <Text>
              A dashboard showing valuable analytics such as sales trends, price
              trends and strategies, profitability, forecast future sales etc.
            </Text>
          </Grid.Col>
        </Grid>
      </div>

      <Flex
        mx="auto"
        className="justify-center mt-12 md:mt-24 px-5"
        maw={1000}
        direction="column"
      >
        <Text weight={800} className="text-2xl md:text-4xl text-[#0A1A44]">
          Key features
        </Text>
        <Flex
          align="center"
          className="md:flex-row flex-col mt-2 md:mt-6"
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
                Our pricing engine integrates with existing travel software and
                tools.
              </List.Item>
              <List.Item className="leading-5">
                Agents can access the engine through a user-friendly interface.
              </List.Item>
            </List>

            <Text weight={600} className="mt-8">
              Intuitive Pricing Algorithms:
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
                Complex pricing calculations are simplified and automated.
              </List.Item>
              <List.Item className="leading-5">
                Agents can generate accurate quotes in minutes instead of hours.
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
            <Text weight={600} mt={10}>
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
              <List.Item className="leading-5">
                Accommodation, transportation, activities, and more.
              </List.Item>
            </List>

            <Text weight={600} className="mt-8">
              Real-Time Pricing:
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
                Access up-to-date pricing from multiple suppliers and providers.
              </List.Item>
              <List.Item className="leading-5">
                Ensures accuracy and competitiveness.
              </List.Item>
            </List>
          </div>
        </Flex>
      </Flex>

      <div ref={targetRef} className="mt-16 px-5">
        <Text weight={800} className="text-2xl md:text-4xl px-0 md:px-28">
          Schedule Demo
        </Text>

        <Flex maw={900} mt={25} mx="auto" direction="column" gap={12}>
          <form onSubmit={form.onSubmit((values) => sumbit(values))}>
            <Flex gap={12}>
              <TextInput
                placeholder="First Name"
                required
                value={form.values.firstName}
                w="50%"
                label="First Name"
                onChange={(event) =>
                  form.setFieldValue("firstName", event.currentTarget.value)
                }
              />

              <TextInput
                placeholder="Last Name"
                required
                w="50%"
                value={form.values.lastName}
                label="Last Name"
                onChange={(event) =>
                  form.setFieldValue("lastName", event.currentTarget.value)
                }
              />
            </Flex>
            <TextInput
              mt={12}
              placeholder="Email"
              required
              value={form.values.email}
              label="Email"
              onChange={(event) =>
                form.setFieldValue("email", event.currentTarget.value)
              }
            />

            <Textarea
              mt={12}
              placeholder="Message"
              value={form.values.message}
              minRows={5}
              label="Message (optional)"
              onChange={(event) =>
                form.setFieldValue("message", event.currentTarget.value)
              }
            />

            <Button loading={loading} type="submit" mt={8} color="red">
              <Text weight={600}>Submit</Text>
            </Button>
          </form>
        </Flex>
      </div>
    </div>
  );
}

export default Main;
