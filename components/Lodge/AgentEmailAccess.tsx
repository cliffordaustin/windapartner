import {
  ActionIcon,
  Avatar,
  Button,
  Flex,
  Group,
  Modal,
  NumberInput,
  ScrollArea,
  Text,
  TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus, IconShare2, IconX } from "@tabler/icons-react";
import React, { use, useEffect, useState } from "react";
import Share from "../ui/Share";
import { LodgeStay } from "@/utils/types";
import { useForm } from "@mantine/form";
import Cookies from "js-cookie";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { notifications } from "@mantine/notifications";
import {
  AgentStayType,
  NotUserAgentStayType,
  UserAgentStayType,
  getStayAgents,
  getStayAgentsByEmailNotUser,
  getStayAgentsByEmailUser,
  getStayAgentsNotVerified,
} from "@/pages/api/stays";
import { WithContext as ReactTags, Tag } from "react-tag-input";
import AWS from "aws-sdk";
import awsmobile from "@/src/aws-exports";
import {
  UserType,
  UsersListType,
} from "aws-sdk/clients/cognitoidentityserviceprovider";
import { API, Auth } from "aws-amplify";

type AgentEmailAccessPropTypes = {
  stay: LodgeStay | undefined;
  token: string;
};

function AgentEmailAccess({ stay, token }: AgentEmailAccessPropTypes) {
  const queryClient = useQueryClient();

  const { data: agentVerified, isLoading: isAgentVerifiedLoading } = useQuery<
    AgentStayType[]
  >("all-agents-verified", () => getStayAgents(token, stay));

  const { data: agentNotVerified, isLoading: isAgentNotVerifiedLoading } =
    useQuery<AgentStayType[]>("all-agents-not-verified", () =>
      getStayAgentsNotVerified(token, stay)
    );

  const { data: userAgentsByEmail, isLoading: userAgentsByEmailLoading } =
    useQuery<UserAgentStayType[]>("user-agents-email", () =>
      getStayAgentsByEmailUser(token, stay)
    );

  const { data: notUserAgentsByEmail, isLoading: notUserAgentsByEmailLoading } =
    useQuery<NotUserAgentStayType[]>("not-user-agents-email", () =>
      getStayAgentsByEmailNotUser(token, stay)
    );

  const [opened, { open, close }] = useDisclosure(false);
  const [
    openedEmailAccess,
    { open: openEmailAccess, close: closeEmailAccess },
  ] = useDisclosure(false);

  type FormValues = {
    email: string;
    contract_rate: number | "";
  };

  const form = useForm<FormValues>({
    initialValues: {
      email: "",
      contract_rate: "",
    },
  });

  const KeyCodes = {
    comma: 188,
    enter: 13,
  };

  const delimiters = [KeyCodes.comma, KeyCodes.enter];

  type EmailType = {
    id: string;
    text: string;
    rate: number | "";
  };

  const [emails, setEmails] = React.useState<EmailType[]>([]);

  const grantAccess = async () => {
    for (const email of emails) {
      if (stay) {
        await axios.patch(
          `${process.env.NEXT_PUBLIC_baseURL}/stays/${stay.slug}/update-agents-email/`,
          {
            email: email.text,
            encoded_email: Buffer.from(email.text).toString("base64"),
            contract_rate: email.rate,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
    }
  };

  const { mutateAsync: grantAccessMutation, isLoading: grantAccessLoading } =
    useMutation(grantAccess, {
      onSuccess: () => {
        queryClient.invalidateQueries(`all-agents-verified`);
        queryClient.invalidateQueries(`user-agents-email`);
        queryClient.invalidateQueries(`not-user-agents-email`);
        setEmails([]);
        closeEmailAccess();

        notifications.show({
          title: "Success",
          message:
            "Access to property prices will be granted immediately upon an agent signing up.",
        });
      },
    });

  const [selectedRemoveAgentId, setSelectedRemoveAgentId] = React.useState<
    number | null
  >(null);

  const [selectedRemoveUserAgentId, setSelectedRemoveUserAgentId] =
    React.useState<number | null>(null);

  const [selectedRemoveNotUserAgentId, setSelectedRemoveNotUserAgentId] =
    React.useState<number | null>(null);

  const removeAccess = async (agentId: number) => {
    if (stay) {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_baseURL}/remove-agent/${agentId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    }
  };

  const { mutateAsync: removeAccessMutation, isLoading: removeAccessLoading } =
    useMutation(removeAccess, {
      onSuccess: () => {
        queryClient.invalidateQueries(`all-agents-verified`);
      },
    });

  const lenApprovedAgents =
    (agentVerified?.length || 0) + (userAgentsByEmail?.length || 0);

  const removeUserAgentAccess = async (id: number) => {
    await axios.delete(
      `${process.env.NEXT_PUBLIC_baseURL}/agent-access-by-email/${id}/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  };

  const {
    mutateAsync: removeUserAgentAccessMutation,
    isLoading: removeUserAgentAccessLoading,
  } = useMutation(removeUserAgentAccess, {
    onSuccess: () => {
      queryClient.invalidateQueries(`user-agents-email`);
    },
  });

  const {
    mutateAsync: removeNotUserAgentAccessMutation,
    isLoading: removeNotUserAgentAccessLoading,
  } = useMutation(removeUserAgentAccess, {
    onSuccess: () => {
      queryClient.invalidateQueries(`not-user-agents-email`);
    },
  });

  type UserType = {};

  const [users, setUsers] = useState<UserType[]>([]);

  let nextToken: string;

  async function listUsers() {
    try {
      let apiName = "AdminQueries";
      let path = "/listUsers";

      let myInit = {
        queryStringParameters: {
          limit: 10,
          nextToken: nextToken,
        },

        headers: {
          "Content-Type": "application/json",
          Authorization: `${(await Auth.currentSession())
            .getAccessToken()
            .getJwtToken()}`,
        },
      };

      const { NextToken, ...rest } = await API.get(apiName, path, myInit);

      nextToken = NextToken;
      setUsers([...users, ...rest.Users]);
    } catch (error: any) {
      console.log(error.response);
    }
  }

  async function getUser() {
    try {
      let apiName = "AdminQueries";
      let path = "/getUser";

      let myInit = {
        queryStringParameters: {
          username: "user1",
        },

        headers: {
          "Content-Type": "application/json",
          Authorization: `${(await Auth.currentSession())
            .getAccessToken()
            .getJwtToken()}`,
        },
      };

      const data = await API.get(apiName, path, myInit);

      console.log(data);
    } catch (error: any) {
      console.log(error.response);
    }
  }

  async function listUsersInGroup() {
    let user = await Auth.currentAuthenticatedUser();
    let userAttributes = await Auth.userAttributes(user);

    console.log(userAttributes);
  }

  // useEffect(() => {
  //   listUsersInGroup();
  // }, []);

  const totalAgents = (notUserAgentsByEmail?.length || 0) + lenApprovedAgents;
  return (
    <ScrollArea className="w-full h-[85vh] rounded-xl px-5 pt-5">
      <div className="">
        <div className="flex items-center gap-10 justify-between">
          <Flex gap={3} direction="column">
            <Text size="sm" className="font-bold" color="gray">
              Manage agents access
            </Text>
            <Text className="font-semibold" size="lg">
              Agent Access
            </Text>
          </Flex>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-3">
              <Button
                color="red"
                size="sm"
                leftIcon={<IconPlus></IconPlus>}
                onClick={openEmailAccess}
                className="rounded-full"
              >
                Add agent
              </Button>

              <ActionIcon
                className="rounded-full hover:bg-gray-100"
                size={35}
                onClick={open}
                color="gray"
              >
                <IconShare2 size={25}></IconShare2>
              </ActionIcon>
            </div>
          </div>
        </div>

        {totalAgents === 0 && (
          <div className="flex mt-6 flex-col gap-4 items-center">
            <Text className="font-semibold" size="md">
              No agents have access to this property.
            </Text>
            {/* <Button color="red" size="sm" onClick={openEmailAccess}>
              Grant access
            </Button> */}
          </div>
        )}

        {totalAgents > 0 && (
          <div className="mt-4 flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              {/* {notUserAgentsByEmail && notUserAgentsByEmail?.length > 0 && (
                <Text className="font-semibold" size="md">
                  Invitation pending
                </Text>
              )} */}

              <Flex gap={5} direction="column">
                {notUserAgentsByEmail?.map((agent) => (
                  <Flex justify="space-between" key={agent.id} align="center">
                    <Group key={agent.id} noWrap>
                      <div>
                        <Text size="sm" className="font-normal text-gray-500">
                          {agent.email}
                        </Text>
                      </div>
                    </Group>

                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedRemoveNotUserAgentId(agent.id);
                        removeNotUserAgentAccessMutation(agent.id);
                      }}
                      color="red"
                      variant="subtle"
                      className="px-1"
                      size="xs"
                      loading={
                        removeNotUserAgentAccessLoading &&
                        selectedRemoveNotUserAgentId === agent.id
                      }
                    >
                      cancel invite
                    </Button>
                  </Flex>
                ))}
              </Flex>
            </div>

            <div className="flex flex-col gap-2">
              {/* {lenApprovedAgents > 0 && (
                <Text className="font-semibold" size="md">
                  Approved agents
                </Text>
              )} */}

              <Flex gap={5} direction="column">
                {agentVerified?.map((agent) => (
                  <Flex justify="space-between" key={agent.id} align="center">
                    <Group key={agent.id} noWrap>
                      <Avatar radius="xl" src={agent.user.profile_pic} />

                      <div>
                        <Text>
                          {(agent.user.first_name || "") +
                            " " +
                            (agent.user.last_name || "")}
                        </Text>
                        <Text size="xs" color="dimmed">
                          {agent.user.email}
                        </Text>
                      </div>
                    </Group>

                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedRemoveAgentId(agent.id);
                        removeAccessMutation(agent.id);
                      }}
                      color="red"
                      variant="subtle"
                      className="px-1"
                      size="xs"
                      loading={
                        removeAccessLoading &&
                        selectedRemoveAgentId === agent.id
                      }
                    >
                      Remove access
                    </Button>
                  </Flex>
                ))}

                {userAgentsByEmail?.map((agent) => (
                  <Flex justify="space-between" key={agent.id} align="center">
                    <Group key={agent.id} noWrap>
                      <Avatar radius="xl" src={agent.user.profile_pic} />

                      <div>
                        <Text>
                          {(agent.user.first_name || "") +
                            " " +
                            (agent.user.last_name || "")}
                        </Text>
                        <Text size="xs" color="dimmed">
                          {agent.user.email}
                        </Text>
                      </div>
                    </Group>

                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedRemoveUserAgentId(agent.id);
                        removeUserAgentAccessMutation(agent.id);
                      }}
                      color="red"
                      variant="subtle"
                      className="px-1"
                      size="xs"
                      loading={
                        removeUserAgentAccessLoading &&
                        selectedRemoveUserAgentId === agent.id
                      }
                    >
                      Remove access
                    </Button>
                  </Flex>
                ))}
              </Flex>
            </div>
          </div>
        )}

        <Modal
          opened={openedEmailAccess}
          onClose={closeEmailAccess}
          size="lg"
          classNames={{
            title: "text-lg font-bold",
            close:
              "text-black hover:text-gray-700 w-[40px] h-[30px] hover:bg-gray-100",
            body: "max-h-[500px] overflow-y-scroll px-10 pb-8 w-full",
            content: "rounded-3xl",
          }}
          centered
        >
          <div className="">
            <Text className="font-bold text-xl">Add agents</Text>
            <div className="flex gap-2 flex-wrap mt-2 items-center">
              {emails.map((email, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1 bg-gray-100 rounded-full py-1 px-2"
                >
                  <Text size="sm">
                    {email.text} - {email.rate}%
                  </Text>

                  <IconX
                    onClick={() => {
                      setEmails(emails.filter((_, i) => i !== index));
                    }}
                    size={15}
                    className="cursor-pointer"
                  ></IconX>
                </div>
              ))}
            </div>
            <form
              onSubmit={form.onSubmit((values) => {
                setEmails([
                  ...emails,
                  {
                    id: values.email,
                    text: values.email,
                    rate: values.contract_rate,
                  },
                ]);
                form.setFieldValue("email", "");
                form.setFieldValue("contract_rate", "");
              })}
              className="flex items-center mt-2 mb-2 gap-2"
            >
              <div className="flex gap-4 items-center">
                <TextInput
                  placeholder="Agent's email"
                  type="email"
                  w="50%"
                  size="md"
                  label="Agent's email"
                  value={form.values.email}
                  onChange={(event) =>
                    form.setFieldValue("email", event.currentTarget.value)
                  }
                />

                <NumberInput
                  placeholder="Agent's contract rate"
                  size="md"
                  w="50%"
                  label="Agent's contract rate"
                  step={0.05}
                  min={0}
                  max={100}
                  precision={2}
                  value={form.values.contract_rate}
                  onChange={(value) =>
                    form.setFieldValue("contract_rate", value)
                  }
                />

                <Button
                  className="mt-[22px] w-[130px]"
                  color="red"
                  type="submit"
                  disabled={
                    form.values.email === "" || form.values.contract_rate === ""
                  }
                  size="md"
                >
                  Add email
                </Button>
              </div>
            </form>

            <Text size="sm" color="gray">
              *If an agent is already registered with us, they will
              automatically be granted access to this property prices without
              requiring an email to be sent to them.
            </Text>
          </div>

          <div className="flex justify-between mt-[22px] items-center">
            <Button
              onClick={() => {
                closeEmailAccess();
              }}
              variant="light"
              color="gray"
              size="sm"
            >
              Close
            </Button>

            <Button
              onClick={() => {
                grantAccessMutation();
              }}
              loading={grantAccessLoading}
              color="red"
              type="submit"
              size="sm"
            >
              Submit
            </Button>
          </div>
        </Modal>

        <Modal opened={opened} onClose={close} centered>
          <Share property={stay?.property_name || ""}></Share>
        </Modal>
      </div>
    </ScrollArea>
  );
}

export default AgentEmailAccess;
