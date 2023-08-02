import {
  Button,
  Flex,
  Grid,
  List,
  Modal,
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
import { useDisclosure } from "@mantine/hooks";
import AgentSignin from "./AgentSignin";

type MainProps = {
  targetRef: React.MutableRefObject<HTMLDivElement | null>;
};

function AgentMain({ targetRef }: MainProps) {
  const form = useForm({
    initialValues: {
      email: "",
      name: "",
    },
  });

  const [opened, { open, close }] = useDisclosure(false);
  return (
    <div ref={targetRef} className="py-4">
      <div className="px-24 flex items-center gap-10">
        <div className="flex flex-col gap-6">
          <Text
            className={
              "font-black mb-2 uppercase text-2xl self-baseline sm:text-3xl md:text-5xl xl:text-5xl text-black "
            }
          >
            Title Here
          </Text>
          <Text
            className={
              "mb-2 text-xl pr-12 sm:text-xl md:text-2xl xl:text-2xl text-black "
            }
          >
            No more manually referencing contract rates. Automatically pull
            rates directly from properties and calculate trip costs across
            different locations in minutes.
          </Text>
        </div>

        <div className="h-[290px] w-[1760px] relative bg-white">
          <video
            muted
            controls
            // width="320"
            // height="240"
            className="w-full h-full absolute inset-0"
            id="video"
          >
            <source
              src="https://winda-guide.s3.eu-west-2.amazonaws.com/video/Travel+Agent+Screen+recording+2023-08-01+5.04.48+PM.webm"
              type="video/webm"
              width={700}
            ></source>
          </video>
        </div>
      </div>

      <div className="px-24 flex flex-col justify-center items-center gap-5 mt-10">
        <Text
          className={
            "text-xl pr-12 sm:text-xl md:text-2xl xl:text-2xl text-black "
          }
          weight={700}
        >
          Signup to get free access to the preview release
        </Text>

        <div className="w-full justify-center flex gap-4">
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
          <AgentSignin
            name={form.values.name}
            email={form.values.email}
          ></AgentSignin>
        </div>
      </Modal>
    </div>
  );
}

export default AgentMain;
