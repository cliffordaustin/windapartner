import React, { useEffect } from "react";
import { GetServerSideProps } from "next";
import { Stay, UserTypes } from "@/utils/types";
import axios, { AxiosError } from "axios";
import getToken from "@/utils/getToken";
import { dehydrate, QueryClient, useQuery } from "react-query";
import { getAllStaysEmail } from "@/pages/api/stays";
import { getUser } from "@/pages/api/user";
import Cookies from "js-cookie";
import LodgeCard from "@/components/Lodge/LodgeCard";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Grid,
  Loader,
  Modal,
  Switch,
  Text,
  TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
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
import SelectedStays from "@/components/Lodge/SelectedStays";
import { useForm } from "@mantine/form";
import { FileInput, FileInputProps, Group, Center, rem } from "@mantine/core";
import { IconPhoto } from "@tabler/icons-react";

function Lodge({}) {
  const token = Cookies.get("token");
  const router = useRouter();
  const { data: user } = useQuery<UserTypes | null>("user", () =>
    getUser(token)
  );
  const { data: stays, isLoading: isStayLoading } = useQuery<Stay[]>(
    "all-stay-email",
    () => getAllStaysEmail(token)
  );

  const [stayIds, setStayIds] = React.useState<number[]>([]);

  const [selectedStays, setSelectedStays] = React.useState<
    (Stay | undefined)[] | undefined
  >([]);

  useEffect(() => {
    const selected = stays?.map((stay) => {
      if (stayIds.includes(stay.id)) {
        return stay;
      } else {
        return;
      }
    });
    setSelectedStays(selected);
  }, [stayIds, stays]);

  useEffect(() => {
    const storedItemIds = localStorage.getItem("lodge-stay-ids");
    if (storedItemIds) {
      setStayIds(JSON.parse(storedItemIds));
    }
  }, []);

  const [date, setDate] = React.useState<[Date | null, Date | null]>([
    null,
    null,
  ]);

  const [isNonResident, setIsNonResident] = React.useState(true);

  const [opened, { open, close }] = useDisclosure(false);

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
  return (
    <div className="overflow-x-hidden">
      <div className="border-b border-x-0 border-t-0 border-solid border-b-gray-200">
        <Navbar
          openModal={() => {
            open();
          }}
          includeSearch={false}
          user={user}
          showAddProperty={true}
        ></Navbar>
      </div>
      <Grid className="" gutter="xl">
        <Grid.Col xl={6} lg={6} md={6}>
          <Grid px={18} py={10} mt={8} gutter={"sm"} className="">
            {stays?.map((stay, index) => (
              <Grid.Col xl={3} lg={4} md={6} sm={6} xs={6} key={index}>
                <LodgeCard
                  stayIds={stayIds}
                  setStayIds={setStayIds}
                  stay={stay}
                />
              </Grid.Col>
            ))}
          </Grid>
        </Grid.Col>

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

        <Grid.Col
          xl={"auto"}
          className="relative h-[calc(100vh-60px)]"
          lg={"auto"}
          md={"auto"}
        >
          <Container className="border-l border-l-gray-300 border-solid border-y-0 border-r-0 sticky h-[calc(100vh-70px)] overflow-auto">
            <div className="py-4 items-center gap-4 flex justify-between border-solid border-x-0 border-t-0 border-b border-b-gray-300">
              <div></div>
              <DatePickerInput
                type="range"
                value={date}
                onChange={(date) => {
                  setDate(date);
                }}
                color="red"
                label="Select date range"
                placeholder="Select dates"
                styles={{ input: { paddingTop: 13, paddingBottom: 13 } }}
                labelProps={{ className: "font-semibold mb-1" }}
                rightSection={<IconSelector className="text-gray-500" />}
                className="max-w-fit min-w-[300px]"
                minDate={new Date()}
                icon={<IconCalendar className="text-gray-500" />}
                numberOfColumns={2}
                autoSave="true"
              />

              <Switch
                label="Non-resident prices"
                color="red"
                mt={25}
                checked={isNonResident}
                onChange={(event) =>
                  setIsNonResident(event.currentTarget.checked)
                }
              />
            </div>

            <Container className="mt-4">
              {selectedStays?.map((stay, index) => (
                <SelectedStays
                  isNonResident={isNonResident}
                  key={index}
                  stay={stay}
                  date={date}
                />
              ))}
            </Container>
          </Container>
          {/* <div className="absolute h-[25px] w-[25px] rounded-full z-10 top-[50%] left-[1px]">
            <div className="h-[25px] cursor-pointer w-[25px] fixed bg-black rounded-full z-10 flex items-center justify-center">
              <IconChevronLeft size={20} className="mr-[2px]" color="white" />
            </div>
          </div> */}
        </Grid.Col>
      </Grid>
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
      await queryClient.fetchQuery<Stay[] | null>("all-stay-email", () =>
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
