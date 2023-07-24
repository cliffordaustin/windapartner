import { Context, ContextProvider, StateType } from "@/context/LodgeDetailPage";
import { RoomType, LodgeStay } from "@/utils/types";
import { Carousel } from "@mantine/carousel";
import {
  Accordion,
  Button,
  Container,
  Flex,
  Modal,
  NumberInput,
  Text,
  TextInput,
  Textarea,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import axios from "axios";
import { EmblaCarouselType } from "embla-carousel-react";
import Cookies from "js-cookie";
import React, { useContext, useEffect } from "react";
import { useMutation, useQueryClient } from "react-query";
import AddRoomFirstPage from "./AddRoomFirstPage";
import AddRoomSecondPage from "./AddRoomSecondPage";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

type PackageType = {
  id: number;
  name: string;
  description: string | null;
};

type GuestType = { name: string; description?: string };

type UniqueRoomsType = {
  name?: string;
  packages: PackageType[];
  guestTypes: GuestType[];
  adult_capacity: number;
  child_capacity: number;
  infant_capacity: number;
};

type RoomPackageEditProps = {
  index: number;
  room: UniqueRoomsType;
  stay: LodgeStay | undefined;
};

function RoomPackageEdit({ index, room, stay }: RoomPackageEditProps) {
  const { state, setState } = useContext(Context);

  const [editModal, { open: openEditModal, close: closeEditModal }] =
    useDisclosure(false);

  const [
    addPackageModal,
    { open: openAddPackageModal, close: closeAddPackageModal },
  ] = useDisclosure(false);

  const [roomName, setRoomName] = React.useState<string | undefined>(room.name);
  const [packages, setPackages] = React.useState<PackageType[] | undefined>(
    room.packages
  );

  useEffect(() => {
    setPackages(room.packages);
  }, [room]);

  const [adultCapacity, setAdultCapacity] = React.useState<
    number | undefined | ""
  >(room.adult_capacity);
  const [childCapacity, setChildCapacity] = React.useState<
    number | undefined | ""
  >(room.child_capacity);
  const [infantCapacity, setInfantCapacity] = React.useState<
    number | undefined | ""
  >(room.infant_capacity);

  const token = Cookies.get("token");
  const queryClient = useQueryClient();

  const submit = async () => {
    if (stay) {
      for (const packageItem of packages || []) {
        await axios.patch(
          `${process.env.NEXT_PUBLIC_baseURL}/stays/${stay.slug}/room-detail-types/${packageItem.id}/`,
          {
            name: roomName,
            capacity: adultCapacity,
            child_capacity: childCapacity,
            infant_capacity: infantCapacity,
            package: packageItem.name,
            package_description: packageItem.description,
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

  const deleteRoom = async () => {
    if (stay) {
      for (const packageItem of packages || []) {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_baseURL}/stays/${stay.slug}/room-detail-types/${packageItem.id}/`,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
      }
    }
  };

  const deletePackage = async (id: number) => {
    if (stay) {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_baseURL}/stays/${stay.slug}/room-detail-types/${id}/`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
    }
  };

  const [deletePackageId, setDeletePackageId] = React.useState<number | null>();

  const queryStr = stay ? stay.slug : "room-type";

  const { mutateAsync: submitMutation, isLoading: submitLoading } = useMutation(
    submit,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(queryStr);
        closeEditModal();
      },
    }
  );

  const { mutateAsync: deleteMutation, isLoading: deleteLoading } = useMutation(
    deleteRoom,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(queryStr);
      },
    }
  );

  const {
    mutateAsync: deletePackageMutation,
    isLoading: deletePackageLoading,
  } = useMutation(deletePackage, {
    onSuccess: () => {
      queryClient.invalidateQueries(queryStr);
    },
  });

  const [embla, setEmbla] = React.useState<EmblaCarouselType | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = React.useState(0);

  const addPackage = () => {
    const updateFirstRoom = state.rooms[0];
    updateFirstRoom.name = room.name || "";
    updateFirstRoom.adult_capacity = room.adult_capacity || 0;
    updateFirstRoom.child_capacity = room.child_capacity || 0;
    updateFirstRoom.infant_capacity = room.infant_capacity || 0;

    const updatePackage = updateFirstRoom.packages[0];

    // update the guests for each seasons

    updatePackage.seasons.forEach((season) => {
      season.guests = room.guestTypes.map((guest) => ({
        guestType: guest.name,
        description: guest.description || "",
        residentPrice: "",
        nonResidentPrice: "",
      }));
    });

    state.seasons.forEach((season) => {
      season.guests = room.guestTypes.map((guest) => ({
        guestType: guest.name,
        description: guest.description || "",
        residentPrice: "",
        nonResidentPrice: "",
      }));
    });

    state.guests = room.guestTypes.map((guest) => ({
      guestType: guest.name,
      description: guest.description || "",
      residentPrice: "",
      nonResidentPrice: "",
    }));

    setState(
      (prevState): StateType => ({
        ...prevState,

        rooms: [updateFirstRoom],
      })
    );
  };
  return (
    <>
      <Modal
        opened={editModal}
        onClose={closeEditModal}
        title={"Edit room and package"}
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
        size="lg"
      >
        <Flex direction="column" mt={10} gap={4}>
          <TextInput
            label="Room name"
            placeholder="eg. Standard Room"
            value={roomName}
            onChange={(event) => {
              const name = event.currentTarget.value;
              setRoomName(name);
            }}
            radius="sm"
          />

          <NumberInput
            label="Adult capacity"
            placeholder="eg. 2"
            value={adultCapacity}
            onChange={(value) => setAdultCapacity(value)}
            radius="sm"
          />

          <NumberInput
            label="Child capacity"
            placeholder="eg. 1"
            value={childCapacity}
            onChange={(value) => setChildCapacity(value)}
            radius="sm"
          />

          <NumberInput
            label="Infant capacity"
            placeholder="eg. 1"
            value={infantCapacity}
            onChange={(value) => setInfantCapacity(value)}
            radius="sm"
          />

          <Text weight={500} size="sm">
            Packages
          </Text>
          <Accordion
            onKeyUpCapture={(e) => {
              e.preventDefault();
            }}
            classNames={{
              control: "hover:bg-gray-50 h-[55px]",
            }}
            chevronPosition="left"
            mb={10}
            variant="contained"
          >
            {packages?.map((packageItem, index) => (
              <Accordion.Item value={index.toString()} key={index}>
                <Flex align="center" gap={5}>
                  <Accordion.Control>
                    <TextInput
                      value={packageItem.name || ""}
                      onChange={(event) => {
                        const newPackages = [...packages];
                        newPackages[index].name = event.currentTarget.value;
                        setPackages(newPackages);
                      }}
                      placeholder="eg. All Inclusive"
                      radius="sm"
                    />
                  </Accordion.Control>
                </Flex>
                <Accordion.Panel>
                  <Textarea
                    placeholder="Describe the package"
                    label="Description"
                    value={packageItem.description || ""}
                    onChange={(event) => {
                      const newPackages = [...packages];
                      newPackages[index].description =
                        event.currentTarget.value;
                      setPackages(newPackages);
                    }}
                  />
                </Accordion.Panel>
              </Accordion.Item>
            ))}

            <div className="mt-4 flex justify-between items-center">
              <div></div>
              <Button
                loading={submitLoading}
                onClick={() => {
                  submitMutation();
                }}
                color="red"
              >
                Submit
              </Button>
            </div>
          </Accordion>
        </Flex>
      </Modal>

      <Modal
        opened={addPackageModal}
        onClose={closeAddPackageModal}
        title={"Add package"}
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
            <AddRoomFirstPage showRoomsOptions={false}></AddRoomFirstPage>
          </Carousel.Slide>
          <Carousel.Slide>
            <AddRoomSecondPage staySlug={stay?.slug || ""}></AddRoomSecondPage>
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

      <Accordion.Item value={index.toString()}>
        <Accordion.Control>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Text>
                <span className="font-semibold">{room.name} - </span>
                <span className="text-sm text-gray-600">
                  {room.adult_capacity} Adult, {room.child_capacity} Child,{" "}
                  {room.infant_capacity} Infant
                </span>
              </Text>
            </div>
            <div className="flex items-center gap-1.5">
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  openEditModal();
                }}
                // color="red"
                variant="subtle"
                className="px-1"
                size="xs"
              >
                Edit
              </Button>

              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  openAddPackageModal();

                  addPackage();
                }}
                // color="red"
                variant="subtle"
                className="px-1"
                size="xs"
              >
                Add Package
              </Button>

              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteMutation();
                }}
                color="red"
                variant="subtle"
                className="px-1"
                size="xs"
                loading={deleteLoading}
              >
                Delete
              </Button>
            </div>
          </div>
        </Accordion.Control>
        <Accordion.Panel>
          <div className="flex">
            <Text w={150} className="text-gray-600" size="sm">
              Packages
            </Text>
            <Flex gap={8} className="w-full" direction="column">
              {room.packages.map((packageItem, index) => (
                <Flex
                  className="w-[90%]"
                  align="center"
                  justify="space-between"
                  key={index}
                >
                  <Text transform="capitalize" size="md">
                    <span className="font-medium">
                      {packageItem.name.charAt(0).toUpperCase() +
                        packageItem.name.slice(1).toLowerCase()}{" "}
                    </span>
                    {packageItem.description && (
                      <span className="text-sm text-gray-600">
                        - {packageItem.description}
                      </span>
                    )}
                  </Text>

                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      deletePackageMutation(packageItem.id);
                      setDeletePackageId(packageItem.id);
                    }}
                    color="red"
                    variant="subtle"
                    className="px-1"
                    size="xs"
                    loading={
                      deletePackageLoading && deletePackageId === packageItem.id
                    }
                  >
                    Delete
                  </Button>
                </Flex>
              ))}
            </Flex>
          </div>
        </Accordion.Panel>
      </Accordion.Item>
    </>
  );
}

export default RoomPackageEdit;
