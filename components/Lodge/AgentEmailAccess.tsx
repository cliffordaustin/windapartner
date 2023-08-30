import {
  Avatar,
  Button,
  Flex,
  Group,
  Modal,
  Text,
  TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconShare2, IconX } from "@tabler/icons-react";
import React from "react";
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

type AgentEmailAccessPropTypes = {
  stay: LodgeStay | undefined;
};

function AgentEmailAccess({ stay }: AgentEmailAccessPropTypes) {
  const token = Cookies.get("token");
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

  const form = useForm({
    initialValues: {
      email: "",
    },
  });

  const [emails, setEmails] = React.useState<string[]>([]);

  const grantAccess = async () => {
    for (const email of emails) {
      if (stay) {
        await axios.patch(
          `${process.env.NEXT_PUBLIC_baseURL}/stays/${stay.slug}/update-agents-email/`,
          {
            email,
            encoded_email: Buffer.from(email).toString("base64"),
          },
          {
            headers: {
              Authorization: `Token ${token}`,
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
      await axios.patch(
        `${process.env.NEXT_PUBLIC_baseURL}/stays/${stay.slug}/remove-agent/`,
        {
          agent_id: agentId,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
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
          Authorization: `Token ${token}`,
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

  const totalAgents = (notUserAgentsByEmail?.length || 0) + lenApprovedAgents;
  return (
    <div className="border border-solid w-full border-gray-200 rounded-xl px-5 py-3">
      <div className="flex items-center gap-10 justify-between">
        <Flex gap={3} direction="column">
          <Text className="font-semibold" size="lg">
            Agent Access
          </Text>
          <Text size="sm" color="gray">
            Grant access to your contracted agents to view property prices.
          </Text>
        </Flex>

        <div className="flex items-center gap-2">
          {totalAgents > 0 && (
            <Button color="red" size="sm" onClick={openEmailAccess}>
              Grant access
            </Button>
          )}
          <Button
            color="red"
            size="sm"
            leftIcon={<IconShare2></IconShare2>}
            onClick={open}
          >
            Share
          </Button>
        </div>
      </div>

      {totalAgents === 0 && (
        <div className="flex mt-2 flex-col gap-4 items-center">
          <Text className="font-semibold" size="md">
            No agents have access to this property.
          </Text>
          <Button color="red" size="sm" onClick={openEmailAccess}>
            Grant access
          </Button>
        </div>
      )}

      {totalAgents > 0 && (
        <div className="mt-4 flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            {notUserAgentsByEmail && notUserAgentsByEmail?.length > 0 && (
              <Text className="font-semibold" size="md">
                Invitation pending
              </Text>
            )}

            <Flex gap={5} direction="column">
              {notUserAgentsByEmail?.map((agent) => (
                <Flex justify="space-between" key={agent.id} align="center">
                  <Group key={agent.id} noWrap>
                    <div>
                      <Text size="sm" color="dimmed">
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
            {lenApprovedAgents > 0 && (
              <Text className="font-semibold" size="md">
                Approved agents
              </Text>
            )}

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
                      removeAccessLoading && selectedRemoveAgentId === agent.id
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
        title="Grant Agent Access"
        // overlayProps={{
        //   opacity: 0.55,
        //   blur: 3,
        // }}
        classNames={{
          title: "text-lg font-bold",
          close: "text-black hover:text-gray-700 hover:bg-gray-200",
          body: "max-h-[500px] overflow-y-scroll",
        }}
        // withinPortal={false}
      >
        <div className="mt-2">
          <div className="flex gap-2 flex-wrap items-center">
            {emails.map((email, index) => (
              <div
                key={index}
                className="flex items-center gap-1 bg-gray-100 rounded-full py-1 px-2"
              >
                <Text size="sm">{email}</Text>

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
              setEmails([...emails, form.values.email]);
              form.setFieldValue("email", "");
            })}
            className="flex items-center mt-2 mb-2 gap-2"
          >
            <TextInput
              placeholder="Email address"
              type="email"
              w="100%"
              required
              value={form.values.email}
              label="Agent's email"
              onChange={(event) =>
                form.setFieldValue("email", event.currentTarget.value)
              }
            />

            <Button
              className="mt-[22px] w-[130px]"
              color="red"
              type="submit"
              size="sm"
            >
              Add email
            </Button>
          </form>

          <Text size="sm" color="gray">
            *If an agent is already registered with us, they will automatically
            be granted access to this property prices without requiring an email
            to be sent to them.
          </Text>
        </div>

        <div className="flex justify-between items-center">
          <div></div>

          {emails.length > 0 && (
            <Button
              onClick={() => {
                grantAccessMutation();
              }}
              loading={grantAccessLoading}
              className="mt-[22px]"
              color="red"
              type="submit"
              size="sm"
            >
              Grant access to {emails.length} agents
            </Button>
          )}
        </div>
      </Modal>

      <Modal opened={opened} onClose={close} centered>
        <Share property={stay?.property_name || ""}></Share>
      </Modal>
    </div>
  );
}

export default AgentEmailAccess;
