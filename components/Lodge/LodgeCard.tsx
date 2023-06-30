import { ContextProvider } from "@/context/LodgeDetailPage";
import { Stay } from "@/utils/types";
import { Carousel } from "@mantine/carousel";
import {
  Button,
  Center,
  Container,
  FileInput,
  Flex,
  Group,
  Image,
  Loader,
  Modal,
  Text,
  TextInput,
  createStyles,
  FileInputProps,
  rem,
  Box,
  ActionIcon,
  Popover,
  Menu,
  NumberInput,
  Select,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconChevronLeft,
  IconChevronRight,
  IconDots,
  IconPencil,
  IconPhoto,
  IconPlus,
  IconTrash,
  IconUpload,
} from "@tabler/icons-react";
import { useMutation, useQueryClient } from "react-query";
import Link from "next/link";
import React from "react";
import { EmblaCarouselType } from "embla-carousel-react";
import AddRoomFirstPage from "./AddRoomFirstPage";
import AddRoomSecondPage from "./AddRoomSecondPage";
import { deleteStayEmail } from "@/pages/api/stays";
import Cookies from "js-cookie";
import { useForm } from "@mantine/form";
import axios from "axios";
import { useRouter } from "next/router";
import StayImages from "./StayImages";

type LodgeProps = {
  stay: Stay;
  setStayIds: React.Dispatch<React.SetStateAction<number[]>>;
  stayIds: number[];
};

const useStyles = createStyles(() => ({
  control: {
    "&[data-inactive]": {
      opacity: 0,
      cursor: "default",
    },
  },
}));

function LodgeCard({ stay, stayIds, setStayIds }: LodgeProps) {
  const { classes } = useStyles();

  const images = stay.stay_images.sort(
    (x, y) => Number(y.main) - Number(x.main)
  );

  const arrImages = images.map((image) => {
    return image.image;
  });

  const router = useRouter();

  const isAdded = stayIds.includes(stay.id);

  function handleRemoveItemClick(id: number) {
    setStayIds((prev) => prev.filter((stayId) => stayId !== id));
    const storedItemIds = localStorage.getItem("lodge-stay-ids");
    localStorage.setItem(
      "lodge-stay-ids",
      JSON.stringify(
        JSON.parse(storedItemIds || "[]").filter(
          (stayId: number) => stayId !== id
        )
      )
    );
  }

  function addListingToCalculate(id: number) {
    setStayIds((prev) => [...prev, id]);
    const storedItemIds = localStorage.getItem("lodge-stay-ids");
    localStorage.setItem(
      "lodge-stay-ids",
      JSON.stringify([...JSON.parse(storedItemIds || "[]"), id])
    );
  }

  const queryClient = useQueryClient();

  const token = Cookies.get("token");
  const [opened, { open, close }] = useDisclosure(false);

  const [embla, setEmbla] = React.useState<EmblaCarouselType | null>(null);

  const [currentSlideIndex, setCurrentSlideIndex] = React.useState(0);

  // const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [deleteModal, { open: openDeleteModal, close: closeDelteModal }] =
    useDisclosure(false);

  const [editModal, { open: openEditModal, close: closeEditModal }] =
    useDisclosure(false);

  const { mutateAsync: deleteProperty, isLoading: deleteLoading } = useMutation(
    deleteStayEmail,
    {
      onSuccess: () => {
        // refetch stays
        queryClient.invalidateQueries("all-stay-email");
        closeDelteModal();
      },
    }
  );

  type FormValues = {
    property_name: string | undefined;
    location: string | undefined;
  };

  const form = useForm<FormValues>({
    initialValues: {
      property_name: stay.property_name,
      location: stay.location,
    },
  });

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

  type ParkFeesValues = {
    name: string | "";
    adultPrice: number | "";
    childPrice: number | "";
    teenPrice: number | "";
    nonResidentAdultPrice: number | "";
    nonResidentChildPrice: number | "";
    nonResidentTeenPrice: number | "";
  };

  const parkFeesForm = useForm<ParkFeesValues>({
    initialValues: {
      name: "",
      adultPrice: "",
      childPrice: "",
      teenPrice: "",
      nonResidentAdultPrice: "",
      nonResidentChildPrice: "",
      nonResidentTeenPrice: "",
    },
  });

  type ActivityValues = {
    name: string | "";
    description: string | "";
    residentPrice: number | "";
    nonResidentPrice: number | "";
  };

  const activityForm = useForm<ActivityValues>({
    initialValues: {
      name: "",
      description: "",
      residentPrice: "",
      nonResidentPrice: "",
    },
  });

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

  const [files, setFiles] = React.useState<File[]>([]);

  const [noFiles, setNoFiles] = React.useState(false);

  const editProperty = async (values: FormValues) => {
    await axios.patch(
      `${process.env.NEXT_PUBLIC_baseURL}/user-stays-email/${stay.slug}/`,
      {
        property_name: values.property_name,
        name: values.property_name,
        location: values.location,
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
        `${process.env.NEXT_PUBLIC_baseURL}/stays/${stay.slug}/create-image/`,
        formData,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
    }
  };

  const { mutateAsync: edit, isLoading: editLoading } = useMutation(
    editProperty,
    {
      onSuccess: () => {
        // refetch stays
        queryClient.invalidateQueries("all-stay-email");
        router.reload();
      },
    }
  );

  const [openParkFeesModal, { open: openParkFees, close: closeParkFees }] =
    useDisclosure(false);

  const [parkFeeLoading, setParkFeeLoading] = React.useState(false);
  const addParkFees = async (values: ParkFeesValues) => {
    setParkFeeLoading(true);
    await axios.post(
      `${process.env.NEXT_PUBLIC_baseURL}/partner-stays/${stay.slug}/park-fees/`,
      {
        name: values.name,
        resident_adult_price: Number(values.adultPrice),
        resident_child_price: Number(values.childPrice),
        resident_teen_price: Number(values.teenPrice),
        non_resident_adult_price: Number(values.nonResidentAdultPrice),
        non_resident_child_price: Number(values.nonResidentChildPrice),
        non_resident_teen_price: Number(values.nonResidentTeenPrice),
      },
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    );

    router.reload();
  };

  const [openActivityModal, { open: openActivity, close: closeActivity }] =
    useDisclosure(false);

  const [activityOption, setActivityOption] = React.useState<string | null>(
    "PER PERSON"
  );

  const [activityLoading, setActivityLoading] = React.useState(false);

  const addActivity = async (values: ActivityValues) => {
    setActivityLoading(true);
    await axios.post(
      `${process.env.NEXT_PUBLIC_baseURL}/partner-stays/${stay.slug}/activities/`,
      {
        name: values.name,
        description: values.description,
        resident_price: Number(values.residentPrice),
        price: Number(values.nonResidentPrice),
        price_type: activityOption,
      },
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    );

    router.reload();
  };

  const [
    openAddContractRateModal,
    { open: openAddContractRate, close: closeAddContractRate },
  ] = useDisclosure(false);

  const [contractRateFile, setContractRateFile] = React.useState<File | null>(
    null
  );

  const [contractRateLoading, setContractRateLoading] = React.useState(false);

  const [noContractRateFile, setNoContractRateFile] = React.useState(false);

  const addContractRate = async () => {
    if (!contractRateFile) {
      setNoContractRateFile(true);
      return;
    } else {
      setNoContractRateFile(false);
      setContractRateLoading(true);
      const formData = new FormData();
      formData.append("lodge_price_data_pdf", contractRateFile);

      await axios.patch(
        `${process.env.NEXT_PUBLIC_baseURL}/user-stays-email/${stay.slug}/`,
        formData,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      router.reload();
    }
  };

  return (
    <div className="w-full rounded-md relative shadow border">
      <Carousel
        classNames={classes}
        className="rounded-md"
        w={"100%"}
        color="red"
      >
        {arrImages.map((image, index) => (
          <Carousel.Slide className="rounded-md" w={"100%"} key={index}>
            <Image
              w={"100%"}
              fit="cover"
              height={120}
              className="overflow-hidden rounded-t-lg"
              src={image}
              alt={"Images of " + (stay.property_name || stay.name)}
            />
          </Carousel.Slide>
        ))}
      </Carousel>

      <div className="absolute flex items-center top-2 left-2 rounded-full bg-white">
        <div
          onClick={openDeleteModal}
          className="p-1 flex cursor-pointer items-center justify-center rounded-full hover:bg-gray-100"
        >
          <IconTrash size={22} color="red"></IconTrash>
        </div>
        <div
          onClick={openEditModal}
          className="p-1 flex cursor-pointer items-center justify-center rounded-full hover:bg-gray-100"
        >
          <IconPencil size={22} color="blue"></IconPencil>
        </div>
      </div>

      <div className="p-2">
        <Text truncate weight={600} size="md">
          {stay.property_name}
        </Text>

        <Text truncate size="sm" className="text-gray-600">
          {stay.location}
        </Text>

        <Box sx={{ display: "flex", gap: 6, alignItems: "center" }}>
          <Button
            size="xs"
            color="red"
            variant="light"
            className="w-full mt-1 !py-2"
            onClick={open}
          >
            Add rates
          </Button>

          <Menu
            trigger="hover"
            openDelay={100}
            closeDelay={400}
            shadow="md"
            width={250}
          >
            <Menu.Target>
              <ActionIcon size="md" className="bg-gray-200 hover:bg-gray-300">
                <IconDots size="1rem" />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Label>Fees</Menu.Label>
              <Menu.Item onClick={openParkFees}>
                Add Park/Conservancy fee
              </Menu.Item>
              <Menu.Item onClick={openActivity}>Add Activities</Menu.Item>

              <Menu.Divider />

              <Menu.Label>Rates</Menu.Label>
              <Menu.Item onClick={openAddContractRate}>
                Add contact rates
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Box>
      </div>

      <Modal
        opened={openParkFeesModal}
        onClose={closeParkFees}
        title={"Park/Conservancy fees"}
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
          onSubmit={parkFeesForm.onSubmit((values) => addParkFees(values))}
        >
          <TextInput
            label="Fee name"
            placeholder="Enter fee name"
            value={parkFeesForm.values.name}
            onChange={(event) =>
              parkFeesForm.setFieldValue("name", event.currentTarget.value)
            }
            required
          />

          <NumberInput
            label="Resident adult fee"
            placeholder="Enter resident adult fee"
            value={parkFeesForm.values.adultPrice}
            onChange={(value) =>
              parkFeesForm.setFieldValue("adultPrice", value)
            }
          />

          <NumberInput
            label="Resident teen fee"
            placeholder="Enter resident teen fee"
            value={parkFeesForm.values.teenPrice}
            onChange={(value) => parkFeesForm.setFieldValue("teenPrice", value)}
          />

          <NumberInput
            label="Resident child fee"
            placeholder="Enter resident child fee"
            value={parkFeesForm.values.childPrice}
            onChange={(value) =>
              parkFeesForm.setFieldValue("childPrice", value)
            }
          />

          <NumberInput
            label="Non-resident adult fee"
            placeholder="Enter non-resident adult fee"
            value={parkFeesForm.values.nonResidentAdultPrice}
            onChange={(value) =>
              parkFeesForm.setFieldValue("nonResidentAdultPrice", value)
            }
          />

          <NumberInput
            label="Non-resident teen fee"
            placeholder="Enter non-resident teen fee"
            value={parkFeesForm.values.nonResidentTeenPrice}
            onChange={(value) =>
              parkFeesForm.setFieldValue("nonResidentTeenPrice", value)
            }
          />

          <NumberInput
            label="Non-resident child fee"
            placeholder="Enter non-resident child fee"
            value={parkFeesForm.values.nonResidentChildPrice}
            onChange={(value) =>
              parkFeesForm.setFieldValue("nonResidentChildPrice", value)
            }
          />

          <Flex gap={8} justify="right" mt={6}>
            <Button onClick={closeParkFees} variant="default">
              Close
            </Button>
            <Button disabled={parkFeeLoading} type="submit">
              Submit{" "}
              {parkFeeLoading && (
                <Loader size="xs" color="gray" ml={5}></Loader>
              )}
            </Button>
          </Flex>
        </form>
      </Modal>

      <Modal
        opened={openAddContractRateModal}
        onClose={closeAddContractRate}
        title={"Add Contract Rates"}
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
        <FileInput
          label="Upload contract rates"
          placeholder="Accepted file types: PDF"
          accept="application/pdf"
          icon={<IconUpload size={rem(14)} />}
          error={noContractRateFile ? "Please select at least one file" : ""}
          onChange={(payload: File) => {
            setNoContractRateFile(false);
            setContractRateFile(payload);
          }}
        />

        <Flex gap={8} justify="right" mt={6}>
          <Button onClick={closeAddContractRate} variant="default">
            Close
          </Button>
          <Button
            disabled={contractRateLoading}
            onClick={() => {
              addContractRate();
            }}
          >
            Submit{" "}
            {contractRateLoading && (
              <Loader size="xs" color="gray" ml={5}></Loader>
            )}
          </Button>
        </Flex>
      </Modal>

      <Modal
        opened={openActivityModal}
        onClose={closeActivity}
        title={"Activities"}
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
          onSubmit={activityForm.onSubmit((values) => addActivity(values))}
        >
          <TextInput
            label="Activity name"
            placeholder="Enter activity name"
            value={activityForm.values.name}
            onChange={(event) =>
              activityForm.setFieldValue("name", event.currentTarget.value)
            }
            required
          />

          <TextInput
            label="Activity description"
            placeholder="Enter activity description"
            value={activityForm.values.description}
            onChange={(event) =>
              activityForm.setFieldValue(
                "description",
                event.currentTarget.value
              )
            }
          />

          <Select
            label="Select the pricing type"
            placeholder="Select the pricing type"
            value={activityOption}
            onChange={(value) => setActivityOption(value)}
            data={[
              { label: "Per Person", value: "PER PERSON" },
              { label: "Per Person Per Night", value: "PER PERSON PER NIGHT" },
              { label: "Whole Group", value: "WHOLE GROUP" },
            ]}
            required
          />

          <NumberInput
            label="Resident Activity Price"
            placeholder="Enter resident activity price"
            value={activityForm.values.residentPrice}
            onChange={(value) =>
              activityForm.setFieldValue("residentPrice", value)
            }
          />

          <NumberInput
            label="Non-resident Activity Price"
            placeholder="Enter non-resident activity price"
            value={activityForm.values.nonResidentPrice}
            onChange={(value) =>
              activityForm.setFieldValue("nonResidentPrice", value)
            }
          />

          <Flex gap={8} justify="right" mt={6}>
            <Button onClick={closeActivity} variant="default">
              Close
            </Button>
            <Button disabled={activityLoading} type="submit">
              Submit{" "}
              {activityLoading && (
                <Loader size="xs" color="gray" ml={5}></Loader>
              )}
            </Button>
          </Flex>
        </form>
      </Modal>

      <Modal
        opened={editModal}
        onClose={closeEditModal}
        title={"Edit your property"}
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
          onSubmit={form.onSubmit((values) => edit(values))}
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

          <Flex direction="column" mt={8} gap={3}>
            {stay.stay_images.map((image, index) => (
              <StayImages stay={stay} image={image} key={index}></StayImages>
            ))}
          </Flex>

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
          />

          <Flex gap={8} justify="right" mt={6}>
            <Button onClick={closeEditModal} variant="default">
              Close
            </Button>
            <Button disabled={editLoading} type="submit">
              Submit{" "}
              {editLoading && <Loader size="xs" color="gray" ml={5}></Loader>}
            </Button>
          </Flex>
        </form>
      </Modal>

      <Modal
        opened={deleteModal}
        onClose={closeDelteModal}
        title={"Delete property"}
        classNames={{
          title: "text-xl font-bold",
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
        <p>
          Are you sure you want to delete this property? All rates associated to
          this property will also be deleted. This action cannot be undone.
        </p>
        <Flex justify="flex-end" mt={12} gap={6} align="center">
          <Button onClick={closeDelteModal} variant="default">
            Close
          </Button>

          <Button
            onClick={() =>
              deleteProperty({
                slug: stay.slug,
                token: token,
              })
            }
            className="flex items-center"
            disabled={deleteLoading}
            color="red"
          >
            Proceed
            {deleteLoading && <Loader size="xs" color="gray" ml={5}></Loader>}
          </Button>
        </Flex>
      </Modal>

      <ContextProvider>
        <Modal
          opened={opened}
          onClose={close}
          title={"Add rates"}
          classNames={{
            title: "text-xl font-bold",
            close: "text-black hover:text-gray-700 hover:bg-gray-200",
            header: "bg-gray-100",
          }}
          fullScreen
          transitionProps={{ transition: "fade", duration: 200 }}
          closeButtonProps={{
            style: {
              width: 30,
              height: 30,
            },
            iconSize: 20,
          }}
        >
          <Carousel
            getEmblaApi={(embla) => {
              setEmbla(embla);
            }}
            withControls={false}
            onSlideChange={(index) => {
              setCurrentSlideIndex(index);
            }}
            speed={14}
            mx="auto"
            mb={30}
            withKeyboardEvents={false}
          >
            <Carousel.Slide>
              <AddRoomFirstPage></AddRoomFirstPage>
            </Carousel.Slide>
            <Carousel.Slide>
              <AddRoomSecondPage staySlug={stay.slug}></AddRoomSecondPage>
            </Carousel.Slide>
          </Carousel>

          <Container
            pos="fixed"
            bottom={0}
            right={0}
            w="100%"
            className="w-[600px] bg-gray-100 flex justify-between items-center text-right px-10"
          >
            {currentSlideIndex === 0 && <div></div>}
            {currentSlideIndex === 1 && (
              <Flex
                onClick={() => {
                  embla?.scrollPrev();
                }}
                className="cursor-pointer"
                gap={4}
                align="center"
              >
                <IconChevronLeft className="w-5 h-5" />
                <p>Previous</p>
              </Flex>
            )}
            {currentSlideIndex === 0 && (
              <Flex
                onClick={() => {
                  embla?.scrollNext();
                }}
                className="cursor-pointer"
                gap={4}
                align="center"
              >
                <p>Next</p>
                <IconChevronRight className="w-5 h-5" />
              </Flex>
            )}
          </Container>
        </Modal>
      </ContextProvider>

      {isAdded ? (
        <Button
          onClick={() => handleRemoveItemClick(stay.id)}
          className="w-[30px] p-0 bg-black hover:bg-black absolute left-1 bottom-[100px] h-[30px] flex items-center justify-center rounded-full"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6 text-white"
          >
            <path
              fillRule="evenodd"
              d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </Button>
      ) : (
        <Button
          color="red"
          onClick={() => addListingToCalculate(stay.id)}
          className="w-[30px] p-0 absolute left-1 bottom-[100px] h-[30px] flex items-center justify-center rounded-full"
        >
          <IconPlus size="1.4rem" className="text-white" />
        </Button>
      )}
    </div>
  );
}

export default LodgeCard;
