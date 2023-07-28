import React, { forwardRef, useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import { LodgeStay, UserTypes } from "@/utils/types";
import axios, { AxiosError } from "axios";
import getToken from "@/utils/getToken";
import { dehydrate, QueryClient, useMutation, useQuery } from "react-query";
import { AgentType, getAllAgents, getAllStaysEmail } from "@/pages/api/stays";
import { getUser } from "@/pages/api/user";
import Cookies from "js-cookie";
import LodgeCard from "@/components/Lodge/LodgeCard";
import { useRouter } from "next/router";
import {
  Accordion,
  Avatar,
  Box,
  Button,
  Checkbox,
  Flex,
  Grid,
  Loader,
  Modal,
  MultiSelect,
  Switch,
  Text,
  TextInput,
} from "@mantine/core";
import { useDisclosure, useListState } from "@mantine/hooks";
import AddRoomFirstPage from "@/components/Lodge/AddRoomFirstPage";
import { ContextProvider } from "@/context/LodgeDetailPage";
import {
  IconCalendar,
  IconChevronLeft,
  IconChevronRight,
  IconSelector,
  IconUpload,
} from "@tabler/icons-react";
import { Carousel } from "@mantine/carousel";
import AddRoomSecondPage from "@/components/Lodge/AddRoomSecondPage";
import { EmblaCarouselType } from "embla-carousel-react";
import Navbar from "@/components/Agent/Navbar";
import { DatePickerInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { FileInput, FileInputProps, Group, Center, rem } from "@mantine/core";
import { IconPhoto } from "@tabler/icons-react";

function Lodge({}) {
  const token = Cookies.get("token");
  const router = useRouter();
  const { data: user } = useQuery<UserTypes | null>("user", () =>
    getUser(token)
  );
  const { data: stays, isLoading: isStayLoading } = useQuery<LodgeStay[]>(
    "all-stay-email",
    () => getAllStaysEmail(token)
  );

  const { data: agents, isLoading: isAgentLoading } = useQuery<AgentType[]>(
    "all-agents",
    () => getAllAgents(token)
  );

  const [stayIds, setStayIds] = React.useState<number[]>([]);

  const [opened, { open, close }] = useDisclosure(false);
  const [
    grantAccessModal,
    { open: openGrantAccessModal, close: closeGrantAccessModal },
  ] = useDisclosure(false);

  function Value({ file }: { file: File | null }) {
    return (
      <Center
        inline
        sx={(theme) => ({
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[7]
              : theme.colors.gray[1],
          fontSize: theme.fontSizes.xs,
          padding: `${rem(3)} ${rem(7)}`,
          borderRadius: theme.radius.sm,
        })}
      >
        <IconPhoto size={rem(14)} style={{ marginRight: rem(5) }} />
        <span
          style={{
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            overflow: "hidden",
            maxWidth: rem(200),
            display: "inline-block",
          }}
        >
          {file?.name}
        </span>
      </Center>
    );
  }

  const ValueComponent: FileInputProps["valueComponent"] = ({ value }) => {
    if (Array.isArray(value)) {
      return (
        <Group spacing="sm" py="xs">
          {value.map((file, index) => (
            <Value file={file} key={index} />
          ))}
        </Group>
      );
    }

    return <Value file={value} />;
  };

  const form = useForm({
    initialValues: {
      property_name: "",
      location: "",
    },
  });

  type FormValues = {
    property_name: string;
    location: string;
  };

  const [files, setFiles] = React.useState<File[]>([]);

  const [noFiles, setNoFiles] = React.useState(false);

  const [loading, setLoading] = React.useState(false);

  const [agentIds, setAgentIds] = React.useState<number[]>([]);

  const submit = async (values: FormValues) => {
    if (files.length === 0) {
      setNoFiles(true);
    } else {
      setNoFiles(false);
      setLoading(true);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_baseURL}/create-stay/`,
        {
          property_name: values.property_name,
          name: values.property_name,
          location: values.location,
          is_partner_property: true,
          contact_email: user?.email,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      for (const file of files) {
        const formData = new FormData();
        formData.append("image", file);
        await axios.post(
          `${process.env.NEXT_PUBLIC_baseURL}/stays/${res.data?.slug}/create-image/`,
          formData,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
      }

      router.reload();
    }
  };

  const initialValues = stays
    ? [
        ...stays.map((stay) => {
          return {
            key: stay.id,
            label: stay.property_name,
            slug: stay.slug,
            checked: false,
          };
        }),
      ]
    : [];

  const [values, handlers] = useListState(initialValues);

  const allChecked = values.every((value) => value.checked);
  const indeterminate = values.some((value) => value.checked) && !allChecked;

  const items = values.map((value, index) => (
    <Checkbox
      mt="xs"
      ml={33}
      label={value.label}
      key={value.key}
      checked={value.checked}
      onChange={(event) =>
        handlers.setItemProp(index, "checked", event.currentTarget.checked)
      }
    />
  ));

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
      const selected = values.filter((value) => value.checked);
      for (const stay of selected) {
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
        closeGrantAccessModal();
      },
    });

  return (
    <div className="overflow-x-hidden">
      <div className="border-b border-x-0 border-t-0 border-solid border-b-gray-200">
        <Navbar
          openModal={() => {
            open();
          }}
          grantAccessModal={() => {
            openGrantAccessModal();
          }}
          includeSearch={false}
          user={user}
          showAddProperty={true}
          showGrantAccess={true}
          navBarLogoLink="/partner/lodge"
        ></Navbar>
      </div>

      <div className="max-w-[1500px] mx-auto">
        <Grid px={32} py={10} mt={8} gutter={"sm"} className="w-full">
          {stays?.map((stay, index) => (
            <Grid.Col xl={2} lg={2} md={4} sm={6} xs={6} key={index}>
              <LodgeCard
                stayIds={stayIds}
                setStayIds={setStayIds}
                stay={stay}
              />
            </Grid.Col>
          ))}
        </Grid>
      </div>

      <Modal
        opened={grantAccessModal}
        onClose={closeGrantAccessModal}
        title={"Grant agent access to your properties"}
        classNames={{
          title: "text-lg font-bold",
          close: "text-black hover:text-gray-700 hover:bg-gray-200",
          header: "bg-gray-100",
        }}
        transitionProps={{ transition: "fade", duration: 200 }}
        size="lg"
        closeButtonProps={{
          style: {
            width: 30,
            height: 30,
          },
          iconSize: 20,
        }}
      >
        <MultiSelect
          label="Select agents"
          placeholder="Select one or more agents"
          itemComponent={SelectItem}
          data={agentsData}
          mt={6}
          searchable
          nothingFound="No agents found"
          maxDropdownHeight={400}
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

        <div className="mt-4">
          <Checkbox
            checked={allChecked}
            indeterminate={indeterminate}
            label="Select all"
            transitionDuration={0}
            onChange={() =>
              handlers.setState((current) =>
                current.map((value) => ({ ...value, checked: !allChecked }))
              )
            }
          />
          {items}
        </div>

        <Flex gap={8} justify="right" mt={10}>
          <Button
            onClick={() => {
              grantAccessMutation();
            }}
            loading={grantAccessLoading}
            color="red"
          >
            Grant access
          </Button>
        </Flex>
      </Modal>

      <Modal
        opened={opened}
        onClose={close}
        title={"Add your property"}
        classNames={{
          title: "text-lg font-bold",
          close: "text-black hover:text-gray-700 hover:bg-gray-200",
          header: "bg-gray-100",
        }}
        transitionProps={{ transition: "fade", duration: 200 }}
        closeButtonProps={{
          style: {
            width: 30,
            height: 30,
          },
          iconSize: 20,
        }}
      >
        <form
          className="flex flex-col gap-1"
          onSubmit={form.onSubmit((values) => submit(values))}
        >
          <TextInput
            label="Property name"
            placeholder="Enter property name"
            value={form.values.property_name}
            onChange={(event) =>
              form.setFieldValue("property_name", event.currentTarget.value)
            }
            required
          />

          <TextInput
            label="Location"
            placeholder="Enter location"
            value={form.values.location}
            onChange={(event) =>
              form.setFieldValue("location", event.currentTarget.value)
            }
            required
          />

          <FileInput
            label="Images"
            placeholder="Select one or more images"
            multiple
            valueComponent={ValueComponent}
            accept="image/png, image/jpeg, image/jpg"
            icon={<IconUpload size={rem(14)} />}
            error={noFiles ? "Please select at least one file" : ""}
            onChange={(payload: File[]) => {
              setNoFiles(false);
              setFiles(payload);
            }}
            required
          />

          <Flex gap={8} justify="right" mt={6}>
            <Button onClick={close} variant="default">
              Close
            </Button>
            <Button color="red" disabled={loading} type="submit">
              Submit{" "}
              {loading && <Loader size="xs" color="gray" ml={5}></Loader>}
            </Button>
          </Flex>
        </form>
      </Modal>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const queryClient = new QueryClient();

  const token = getToken(context);

  try {
    const user = await queryClient.fetchQuery<UserTypes | null>("user", () =>
      getUser(token)
    );

    if (user?.is_partner) {
      await queryClient.fetchQuery<LodgeStay[] | null>("all-stay-email", () =>
        getAllStaysEmail(token)
      );

      return {
        props: {
          dehydratedState: dehydrate(queryClient),
        },
      };
    } else {
      return {
        redirect: {
          destination: `/partner/signin?redirect=/partner/lodge/`,
          permanent: false,
        },
      };
    }
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 401) {
      return {
        redirect: {
          destination: `/partner/signin?redirect=/partner/lodge/`,
          permanent: false,
        },
      };
    }
    return {
      props: {},
    };
  }
};

export default Lodge;
