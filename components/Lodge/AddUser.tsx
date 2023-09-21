import { LodgeStay, UserTypes } from "@/utils/types";
import {
  ActionIcon,
  Avatar,
  Button,
  Flex,
  Group,
  Modal,
  ScrollArea,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus, IconSend, IconShare2 } from "@tabler/icons-react";
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
import { Auth } from "aws-amplify";
import { Icon } from "@iconify/react";
import { notifications } from "@mantine/notifications";

type AddUserPropTypes = {
  stay: LodgeStay | undefined;
};

function AddUser({ stay }: AddUserPropTypes) {
  const queryClient = useQueryClient();
  const [opened, { open, close }] = useDisclosure(false);

  const { data: propertAccess, isLoading: propertAccessLoading } = useQuery<
    UserAgentStayType[]
  >("user-agents-email", () => getStayPropertyAccess(stay));

  const { data: propertAccessNotUser, isLoading: propertAccessNotUserLoading } =
    useQuery<NotUserAgentStayType[]>("not-user-agents-email", () =>
      getStayPropertyAccessNotUser(stay)
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
      const currentSession = await Auth.currentSession();
      const accessToken = currentSession.getAccessToken();
      const token = accessToken.getJwtToken();
      await axios.post(
        `${process.env.NEXT_PUBLIC_baseURL}/stays/${stay.slug}/update-property-access/`,
        {
          email,
          encoded_email: Buffer.from(email).toString("base64"),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
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
    const currentSession = await Auth.currentSession();
    const accessToken = currentSession.getAccessToken();
    const token = accessToken.getJwtToken();
    await axios.delete(
      `${process.env.NEXT_PUBLIC_baseURL}/property-access/${id}/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
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

  const [
    openedPropertyAccess,
    { open: openPropertyAccess, close: closePropertyAccess },
  ] = useDisclosure(false);

  const resendInvitation = async (id: number, email: string) => {
    const currentSession = await Auth.currentSession();
    const accessToken = currentSession.getAccessToken();
    const token = accessToken.getJwtToken();
    await axios.post(
      `${process.env.NEXT_PUBLIC_baseURL}/resend-property-email/`,
      {
        property_access_id: id,
        encoded_email: Buffer.from(email).toString("base64"),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    notifications.show({
      title: "Success",
      message: "Invitation sent successfully.",
    });
  };

  return (
    <ScrollArea className="w-full h-[85vh] px-5 pt-5">
      <div className="">
        <div className="flex gap-10 items-center justify-between">
          <Flex gap={3} direction="column">
            <Text size="sm" className="font-bold" color="gray">
              Users added will be able to manage this property and its prices.
            </Text>
            <Text className="font-semibold" size="lg">
              Add Team Members
            </Text>
          </Flex>

          {/* <Button
            color="red"
            size="sm"
            leftIcon={<IconShare2></IconShare2>}
            onClick={open}
          >
            Share
          </Button> */}

          <div className="flex items-center gap-3">
            <Button
              color="red"
              size="sm"
              leftIcon={<IconPlus></IconPlus>}
              onClick={openPropertyAccess}
              className="rounded-full"
            >
              Add Team Member
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

        <Modal
          opened={openedPropertyAccess}
          onClose={closePropertyAccess}
          size="lg"
          classNames={{
            title: "text-lg font-bold",
            close:
              "text-black hover:text-gray-700 w-[40px] h-[30px] hover:bg-gray-100",
            body: "max-h-[500px] overflow-y-scroll px-10 pb-8 w-full",
            content: "rounded-2xl",
          }}
          centered
        >
          <div className="">
            <Text className="font-bold text-xl">Add Team Members</Text>

            <form
              onSubmit={form.onSubmit((values) => {
                form.setFieldValue("email", "");
              })}
              className="flex w-full items-center mt-2 mb-2 gap-2"
            >
              <div className="flex gap-4 w-full items-center">
                <TextInput
                  placeholder="Add user's email"
                  type="email"
                  w="100%"
                  size="md"
                  value={form.values.email}
                  onChange={(event) =>
                    form.setFieldValue("email", event.currentTarget.value)
                  }
                />
              </div>
            </form>

            <Text size="sm" color="gray">
              *If user is already registered with us, they will automatically be
              granted access to this property prices without requiring an email
              to be sent to them.
            </Text>
          </div>

          <div className="flex justify-between mt-[22px] items-center">
            <Button
              onClick={() => {
                closePropertyAccess();
              }}
              variant="light"
              color="gray"
              size="sm"
            >
              Close
            </Button>

            <Button
              onClick={() => {
                grantAccessMutation(form.values.email);
                closePropertyAccess();
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

        {/* <form
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
        </form> */}

        {totalAgents > 0 && (
          <div className="mt-4 flex flex-col gap-3">
            {/* <div className="flex flex-col gap-1">
              {propertAccessNotUser && propertAccessNotUser?.length > 0 && (
                <Text className="font-semibold" size="md">
                  Invitation pending
                </Text>
              )}

              <Flex gap={5} direction="column">
                {propertAccessNotUser?.map((property) => (
                  <Flex
                    justify="space-between"
                    key={property.id}
                    align="center"
                  >
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
            </div> */}

            <div className="flex flex-col">
              {/* {propertAccess && propertAccess?.length > 0 && (
                <Text className="font-semibold" size="md">
                  Approved users
                </Text>
              )} */}

              <Flex
                className="border-b border-solid border-gray-200 border-x-0 border-t-0"
                gap={5}
                direction="column"
              >
                {propertAccess?.map((property) => {
                  const fullName =
                    (property.user?.first_name || "") +
                    " " +
                    (property.user?.last_name || "");
                  return (
                    <Flex
                      justify="space-between"
                      className="py-2 border-t border-b-0 border-x-0 border-solid border-gray-200"
                      key={property.id}
                      align="center"
                    >
                      <Group key={property.id} noWrap>
                        {property.user && property.user.profile_pic && (
                          <div className="relative w-9 h-9 rounded-full">
                            <Avatar
                              radius="md"
                              src={property.user?.profile_pic}
                              alt="profile image of a agent.user"
                            />
                          </div>
                        )}

                        {property.user && !property.user.profile_pic && (
                          <Avatar color="red" radius="md">
                            {fullName
                              .split(" ")
                              .map((name) => name[0])
                              .join("")
                              .toUpperCase()}
                          </Avatar>
                        )}

                        {property.user &&
                          !property.user.profile_pic &&
                          !fullName && <Avatar radius="md"></Avatar>}

                        <div className="flex items-center gap-2">
                          <Text>
                            {(property.user.first_name || "") +
                              " " +
                              (property.user.last_name || "")}
                          </Text>
                          <Text size="sm" color="dimmed">
                            {property.user.primary_email}
                          </Text>
                        </div>
                      </Group>

                      <Tooltip
                        label="Remove account"
                        withArrow
                        position="bottom"
                      >
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPropertyAccessUserId(property.id);
                            removePropertyAccessMutation(property.id);
                          }}
                          className="w-10 hover:bg-red-50 transition-all duration-300 h-10 rounded-lg flex items-center justify-center"
                        >
                          <Icon
                            color="red"
                            className="w-6 h-6 cursor-pointer"
                            icon="la:user-minus"
                          ></Icon>
                        </div>
                      </Tooltip>

                      {/* <Button
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
                      </Button> */}
                    </Flex>
                  );
                })}
              </Flex>

              <Flex gap={5} direction="column">
                {propertAccessNotUser?.map((property) => (
                  <Flex
                    justify="space-between"
                    className="py-2 border-b border-t-0 border-x-0 border-solid border-gray-200"
                    key={property.id}
                    align="center"
                  >
                    <Group key={property.id} noWrap>
                      <Avatar radius="md"></Avatar>
                      <div>
                        <Text size="sm" color="dimmed">
                          {property.email}
                        </Text>
                      </div>
                    </Group>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Text className="text-sm">Invitation pending</Text>
                        <Tooltip
                          label="Resend invitation"
                          withArrow
                          position="bottom"
                        >
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              resendInvitation(property.id, property.email);
                            }}
                            className="w-7 bg-blue-50 cursor-pointer hover:bg-blue-100 transition-all duration-300 h-7 rounded-lg flex items-center justify-center"
                          >
                            <IconSend color="blue" size={17}></IconSend>
                          </div>
                        </Tooltip>
                      </div>
                      <Tooltip
                        label="Cancel invite"
                        withArrow
                        position="bottom"
                      >
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPropertyAccessUserId(property.id);
                            removePropertyAccessNotUserMutation(property.id);
                          }}
                          className="w-10 hover:bg-red-50 transition-all duration-300 h-10 rounded-lg flex items-center justify-center"
                        >
                          <Icon
                            color="red"
                            className="w-6 h-6 cursor-pointer"
                            icon="la:user-minus"
                          ></Icon>
                        </div>
                      </Tooltip>
                    </div>

                    {/* <Button
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
                    </Button> */}
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
    </ScrollArea>
  );
}

export default AddUser;
