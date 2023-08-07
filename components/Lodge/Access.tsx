import {
  AgentStayType,
  AgentType,
  getAllAgents,
  getStayAgents,
  getStayAgentsNotVerified,
} from "@/pages/api/stays";
import { LodgeStay } from "@/utils/types";
import {
  Avatar,
  Button,
  Flex,
  Group,
  Loader,
  MultiSelect,
  Text,
} from "@mantine/core";
import axios from "axios";
import Cookies from "js-cookie";
import React, { forwardRef } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";

type AccessPropTypes = {
  stay: LodgeStay | undefined;
};

function Access({ stay }: AccessPropTypes) {
  const token = Cookies.get("token");

  const { data: agentVerified, isLoading: isAgentVerifiedLoading } = useQuery<
    AgentStayType[]
  >("all-agents-verified", () => getStayAgents(token, stay));

  const { data: agentNotVerified, isLoading: isAgentNotVerifiedLoading } =
    useQuery<AgentStayType[]>("all-agents-not-verified", () =>
      getStayAgentsNotVerified(token, stay)
    );

  const { data: agents, isLoading: isAgentLoading } = useQuery<AgentType[]>(
    "all-agents",
    () => getAllAgents(token)
  );

  const queryClient = useQueryClient();

  const [agentIds, setAgentIds] = React.useState<number[]>([]);

  const agentsData = agents
    ? [
        ...agents.map((agent) => {
          return {
            image: agent.profile_pic,
            label: `${agent.first_name || ""} ${agent.last_name || ""}`,
            value: `${agent.id}`,
            description: agent.email,
          };
        }),
      ]
    : [];

  interface ItemProps extends React.ComponentPropsWithoutRef<"div"> {
    image: string;
    label: string;
    description: string;
  }

  const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
    ({ image, label, description, ...others }: ItemProps, ref) => (
      <div ref={ref} {...others}>
        <Group noWrap>
          <Avatar radius="xl" src={image} />

          <div>
            <Text>{label}</Text>
            <Text size="xs" color="dimmed">
              {description}
            </Text>
          </div>
        </Group>
      </div>
    )
  );

  SelectItem.displayName = "SelectItem";

  const grantAccess = async () => {
    for (const agentId of agentIds) {
      if (stay) {
        await axios.patch(
          `${process.env.NEXT_PUBLIC_baseURL}/stays/${stay.slug}/update-agents/`,
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
    }
  };

  const { mutateAsync: grantAccessMutation, isLoading: grantAccessLoading } =
    useMutation(grantAccess, {
      onSuccess: () => {
        queryClient.invalidateQueries(`all-agents-verified`);
        setAgentIds([]);
      },
    });

  const [selectedRemoveAgentId, setSelectedRemoveAgentId] = React.useState<
    number | null
  >(null);

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

  const grantAccessFromRequest = async (id: number) => {
    if (stay) {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_baseURL}/agent-access/${id}/`,
        {
          approved: true,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
    }
  };

  const removeAccessFromRequest = async (id: number) => {
    if (stay) {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_baseURL}/agent-access/${id}/`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
    }
  };

  const {
    mutateAsync: grantAccessFromRequestMutation,
    isLoading: grantAccessFromRequestLoading,
  } = useMutation(grantAccessFromRequest, {
    onSuccess: () => {
      queryClient.invalidateQueries(`all-agents-verified`);
      queryClient.invalidateQueries(`all-agents-not-verified`);
    },
  });

  const {
    mutateAsync: removeAccessFromRequestMutation,
    isLoading: removeAccessFromRequestLoading,
  } = useMutation(removeAccessFromRequest, {
    onSuccess: () => {
      queryClient.invalidateQueries(`all-agents-verified`);
      queryClient.invalidateQueries(`all-agents-not-verified`);
    },
  });

  const [selectedAgentId, setSelectedAgentId] = React.useState<number | null>();

  return (
    <div className="border border-solid w-full border-gray-200 rounded-xl p-5">
      <Text className="font-semibold" size="lg">
        Agent Access
      </Text>

      <Flex gap={5} align="flex-end" className="mt-2">
        <MultiSelect
          label="Add agents"
          placeholder="Select one or more agents"
          itemComponent={SelectItem}
          data={agentsData}
          mt={6}
          searchable
          nothingFound="No agents found"
          maxDropdownHeight={400}
          w={300}
          value={agentIds.map((agentId) => String(agentId))}
          filter={(value, selected, item) =>
            !selected &&
            (item.label?.toLowerCase().includes(value.toLowerCase().trim()) ||
              item.description
                .toLowerCase()
                .includes(value.toLowerCase().trim()))
          }
          onChange={(values) => {
            setAgentIds(values.map((value) => Number(value)));
          }}
        />

        <Button
          color="red"
          className="mb-0.5"
          onClick={() => grantAccessMutation()}
          loading={grantAccessLoading}
        >
          Grant Access
        </Button>
      </Flex>

      <Flex gap={5} direction="column" className="mt-5">
        {agentNotVerified && agentNotVerified.length > 0 && (
          <Text weight={600}>Requests</Text>
        )}

        {agentNotVerified?.map((agent) => (
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

            <Flex gap={3} align="center">
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedAgentId(agent.id);
                  grantAccessFromRequestMutation(agent.id);
                }}
                color="blue"
                variant="subtle"
                className="px-1"
                size="xs"
                loading={
                  grantAccessFromRequestLoading && selectedAgentId === agent.id
                }
              >
                Grant Access
              </Button>

              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedAgentId(agent.id);
                  removeAccessFromRequestMutation(agent.id);
                }}
                color="red"
                variant="subtle"
                className="px-1"
                size="xs"
                loading={
                  removeAccessFromRequestLoading && selectedAgentId === agent.id
                }
              >
                Ignore
              </Button>
            </Flex>
          </Flex>
        ))}

        {agentVerified && agentVerified.length > 0 && (
          <Text weight={600}>Verified Agents</Text>
        )}
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

        {isAgentVerifiedLoading ||
          (isAgentNotVerifiedLoading && (
            <div className="flex items-center mt-5 justify-center">
              <Loader color="red" />
            </div>
          ))}
      </Flex>
    </div>
  );
}

export default Access;
