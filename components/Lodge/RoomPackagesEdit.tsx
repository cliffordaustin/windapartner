import { RoomType, Stay } from "@/utils/types";
import {
  Accordion,
  Button,
  Container,
  Flex,
  Loader,
  Modal,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { format } from "date-fns";
import React, { use, useCallback } from "react";
import RoomPackageEdit from "./RoomPackageEdit";
import { RoomTypeDetail, getRoomTypes } from "@/pages/api/stays";
import { useQuery } from "react-query";
import { EmblaCarouselType } from "embla-carousel-react";
import { Carousel } from "@mantine/carousel";
import AddRoomFirstPage from "./AddRoomFirstPage";
import AddRoomSecondPage from "./AddRoomSecondPage";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { ContextProvider } from "@/context/LodgeDetailPage";

type RoomPackagesEditProps = {
  date: [Date | null, Date | null];
  stay: Stay | undefined;
};

type GuestType = { name: string; description?: string };

type PackageType = {
  id: number;
  name: string;
  description: string | null;
};

type UniqueRoomsType = {
  id: number;
  name?: string;
  packages: PackageType[];
  guestTypes: GuestType[];
  adult_capacity: number;
  child_capacity: number;
  infant_capacity: number;
};

function RoomPackagesEdit({ date, stay }: RoomPackagesEditProps) {
  const queryStr = stay ? stay.slug : "room-type";

  const { data: roomTypeList, isLoading: roomTypeListLoading } = useQuery(
    queryStr,
    () =>
      getRoomTypes(
        stay,
        format(date[0] || new Date(), "yyyy-MM-dd"),
        format(date[1] || new Date(), "yyyy-MM-dd")
      ),
    { enabled: date[0] && date[1] ? true : false }
  );

  const getGuestTypes = useCallback(
    (room: RoomType | undefined): { name: string; description?: string }[] => {
      const guestTypes: { name: string; description?: string }[] = [];
      if (room) {
        if (room.room_resident_availabilities.length > 0) {
          room.room_resident_availabilities[0].room_resident_guest_availabilities.forEach(
            (resident) => {
              if (resident.name) {
                guestTypes.push({
                  name: resident.name,
                  description: resident.description,
                });
              }
            }
          );
        } else if (room.room_non_resident_availabilities.length > 0) {
          room.room_non_resident_availabilities[0].room_non_resident_guest_availabilities.forEach(
            (nonResident) => {
              if (nonResident.name) {
                guestTypes.push({
                  name: nonResident.name,
                  description: nonResident.description,
                });
              }
            }
          );
        }
      }
      return guestTypes;
    },
    []
  );

  const uniqueRooms: UniqueRoomsType[] = React.useMemo<
    UniqueRoomsType[]
  >(() => {
    let uniqueRooms: UniqueRoomsType[] =
      roomTypeList?.reduce(
        (accumulator: UniqueRoomsType[], current: RoomType) => {
          const roomName = current.name?.toLowerCase();
          const index = accumulator.findIndex(
            (room) => room.name?.toLowerCase().trim() === roomName?.trim()
          );
          if (index >= 0) {
            // If roomName already exists, add package to the existing room object
            accumulator[index].packages.push({
              id: current.id,
              name: current.package,
              description: current.package_description,
            });
          } else {
            // If roomName doesn't exist, create a new room object with the roomName and package
            const guestTypes = getGuestTypes(current);

            accumulator.push({
              id: current.id,
              name: current.name,
              adult_capacity: current.capacity,
              child_capacity: current.child_capacity,
              infant_capacity: current.infant_capacity,
              guestTypes: guestTypes,
              packages: [
                {
                  id: current.id,
                  name: current.package,
                  description: current.package_description,
                },
              ],
            });
          }
          return accumulator;
        },
        []
      ) || [];

    uniqueRooms = uniqueRooms.sort((a, b) => a.id - b.id);

    return uniqueRooms;
  }, [getGuestTypes, roomTypeList]);

  const [addRoomModal, { open: openAddRoomModal, close: closeAddRoomModal }] =
    useDisclosure(false);

  const [embla, setEmbla] = React.useState<EmblaCarouselType | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = React.useState(0);

  return (
    <div className="border border-solid w-full border-gray-200 rounded-xl p-5">
      <Flex justify="space-between" align="center">
        <Text className="font-semibold" size="lg">
          Rooms and Packages
        </Text>

        <Button
          onClick={(e) => {
            e.stopPropagation();
            openAddRoomModal();

            // addPackage();
          }}
          color="red"
          size="xs"
        >
          Add Room
        </Button>
      </Flex>

      {/* {date[0] && date[1] && (
        <Text className="text-gray-600" size="sm">
          Data being shown is based on {format(date[0] as Date, "dd MMM yyyy")}{" "}
          to {format(new Date(date[1]) as Date, "dd MMM yyyy")}
        </Text>
      )} */}

      {!date[0] ||
        (!date[1] && (
          <Text className="text-gray-600" size="sm">
            Please select a date range to view the rooms and packages
          </Text>
        ))}

      <Modal
        opened={addRoomModal}
        onClose={closeAddRoomModal}
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

      <Container className="mt-5 p-0 w-full">
        <Accordion defaultValue="0">
          {uniqueRooms.map((room, index) => (
            <ContextProvider key={room.id}>
              <RoomPackageEdit stay={stay} index={index} room={room} />
            </ContextProvider>
          ))}
        </Accordion>
      </Container>

      {roomTypeListLoading && (
        <div className="flex items-center justify-center">
          <Loader color="red" className="mt-5" />
        </div>
      )}
    </div>
  );
}

export default RoomPackagesEdit;
