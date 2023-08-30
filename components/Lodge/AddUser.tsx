import { LodgeStay, UserTypes } from "@/utils/types";
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
import { IconShare2 } from "@tabler/icons-react";
import React from "react";
import Share from "../ui/Share";
import { useForm } from "@mantine/form";
import {
  NotUserAgentStayType,
  UserAgentStayType,
  getStayPropertyAccess,
  getStayPropertyAccessNotUser,
} from "@/pages/api/stays";
import Cookies from "js-cookie";
import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "axios";

type AddUserPropTypes = {
  stay: LodgeStay | undefined;
};

function AddUser({ stay }: AddUserPropTypes) {
  const queryClient = useQueryClient();
  const [opened, { open, close }] = useDisclosure(false);
  const token = Cookies.get("token");

  const { data: propertAccess, isLoading: propertAccessLoading } = useQuery<
    UserAgentStayType[]
  >("user-agents-email", () => getStayPropertyAccess(token, stay));

  const { data: propertAccessNotUser, isLoading: propertAccessNotUserLoading } =
    useQuery<NotUserAgentStayType[]>("not-user-agents-email", () =>
      getStayPropertyAccessNotUser(token, stay)
    );

  const form = useForm({
    initialValues: {
      email: "",
    },
  });

  const [emails, setEmails] = React.useState<string[]>([]);

  const [selectedPropertyAccessUserId, setSelectedPropertyAccessUserId] =
    React.useState<number | null>(null);

  const totalAgents =
    (propertAccessNotUser?.length || 0) + (propertAccess?.length || 0);

  const grantAccess = async (email: string) => {
    if (stay) {
      await axios.post(
        `${process.env.NEXT_PUBLIC_baseURL}/stays/${stay.slug}/update-property-access/`,
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
  };

  const { mutateAsync: grantAccessMutation, isLoading: grantAccessLoading } =
    useMutation(grantAccess, {
      onSuccess: () => {
        queryClient.invalidateQueries("user-agents-email");
        queryClient.invalidateQueries("not-user-agents-email");
        form.setFieldValue("email", "");
      },
    });

  const removePropertyAccess = async (id: number) => {
    await axios.delete(
      `${process.env.NEXT_PUBLIC_baseURL}/property-access/${id}/`,
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    );
  };

  const {
    mutateAsync: removePropertyAccessMutation,
    isLoading: removePropertyAccessLoading,
  } = useMutation(removePropertyAccess, {
    onSuccess: () => {
      queryClient.invalidateQueries("user-agents-email");
    },
  });

  const {
    mutateAsync: removePropertyAccessNotUserMutation,
    isLoading: removePropertyAccessNotUserLoading,
  } = useMutation(removePropertyAccess, {
    onSuccess: () => {
      queryClient.invalidateQueries("not-user-agents-email");
    },
  });

  return (
    <div className="border border-solid w-full border-gray-200 rounded-xl p-5">
      <div className="flex gap-10 items-center justify-between">
        <Flex gap={3} direction="column">
          <Text className="font-semibold" size="lg">
            Add Team Members
          </Text>
          <Text size="sm" color="gray">
            {/* *If the user is already registered with us, they will automatically
            be granted access to this property without requiring an email to be
            sent to them. */}
            Users added will be able to manage this property and its prices.
          </Text>
        </Flex>

        <Button
          color="red"
          size="sm"
          leftIcon={<IconShare2></IconShare2>}
          onClick={open}
        >
          Share
        </Button>
      </div>

      <form
        onSubmit={form.onSubmit((values) => {
          grantAccessMutation(values.email);
        })}
        className="flex items-center mt-2 mb-2 gap-2 w-[60%]"
      >
        <TextInput
          placeholder="Email address"
          type="email"
          w="100%"
          required
          value={form.values.email}
          label="User's email"
          onChange={(event) =>
            form.setFieldValue("email", event.currentTarget.value)
          }
        />

        <Button
          loading={grantAccessLoading}
          className="mt-[22px]"
          color="red"
          type="submit"
          size="sm"
        >
          Grant Access
        </Button>
      </form>

      {totalAgents > 0 && (
        <div className="mt-4 flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            {propertAccessNotUser && propertAccessNotUser?.length > 0 && (
              <Text className="font-semibold" size="md">
                Invitation pending
              </Text>
            )}

            <Flex gap={5} direction="column">
              {propertAccessNotUser?.map((property) => (
                <Flex justify="space-between" key={property.id} align="center">
                  <Group key={property.id} noWrap>
                    <div>
                      <Text size="sm" color="dimmed">
                        {property.email}
                      </Text>
                    </div>
                  </Group>

                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPropertyAccessUserId(property.id);
                      removePropertyAccessNotUserMutation(property.id);
                    }}
                    color="red"
                    variant="subtle"
                    className="px-1"
                    size="xs"
                    loading={
                      removePropertyAccessNotUserLoading &&
                      selectedPropertyAccessUserId === property.id
                    }
                  >
                    cancel invite
                  </Button>
                </Flex>
              ))}
            </Flex>
          </div>

          <div className="flex flex-col gap-2">
            {propertAccess && propertAccess?.length > 0 && (
              <Text className="font-semibold" size="md">
                Approved users
              </Text>
            )}

            <Flex gap={5} direction="column">
              {propertAccess?.map((property) => (
                <Flex justify="space-between" key={property.id} align="center">
                  <Group key={property.id} noWrap>
                    <Avatar radius="xl" src={property.user.profile_pic} />

                    <div>
                      <Text>
                        {(property.user.first_name || "") +
                          " " +
                          (property.user.last_name || "")}
                      </Text>
                      <Text size="xs" color="dimmed">
                        {property.user.email}
                      </Text>
                    </div>
                  </Group>

                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPropertyAccessUserId(property.id);
                      removePropertyAccessMutation(property.id);
                    }}
                    color="red"
                    variant="subtle"
                    className="px-1"
                    size="xs"
                    loading={
                      removePropertyAccessLoading &&
                      selectedPropertyAccessUserId === property.id
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

      <Modal opened={opened} onClose={close} centered>
        <Share property={stay?.property_name || ""}></Share>
      </Modal>
    </div>
  );
}

export default AddUser;
