import { getRoomTypes } from "@/pages/api/stays";
import pricing from "@/utils/calculation";
import { RoomType, Stay } from "@/utils/types";
import {
  Button,
  Container,
  Divider,
  Flex,
  Grid,
  Modal,
  Popover,
  ScrollArea,
  Switch,
  Text,
  Tooltip,
} from "@mantine/core";
import { IconSelector } from "@tabler/icons-react";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import NonResidentPriceEdit from "./NonResidentPriceEdit";
import { useDisclosure } from "@mantine/hooks";
import NonResidentBulkEdit from "./NonResidentBulkEdit";
import ResidentPriceEdit from "./ResidentPriceEdit";
import ResidentBulkEdit from "./ResidentBulkEdit";

type PriceEditProps = {
  date: [Date | null, Date | null];
  stay: Stay | undefined;
};

type UniqueRoomsType = {
  name?: string;
  packages: string[];
};

type SelectedPackagesType = {
  name: string;
  description: string | null;
};

type SelectedGuestType = {
  name?: string;
  description?: string;
};

function PriceEdit({ date, stay }: PriceEditProps) {
  const queryStr = stay ? "room-type-" + stay.slug : "room-type";
  const { data: roomTypes, isLoading: roomTypesLoading } = useQuery(
    queryStr,
    () =>
      getRoomTypes(
        stay,
        format(date[0] || new Date(), "yyyy-MM-dd"),
        format(date[1] || new Date(), "yyyy-MM-dd")
      ),
    { enabled: date[0] && date[1] ? true : false }
  );

  const uniqueRooms: UniqueRoomsType[] =
    roomTypes?.reduce((accumulator: UniqueRoomsType[], current: RoomType) => {
      const roomName = current.name?.toLowerCase();
      const index = accumulator.findIndex(
        (room) => room.name?.toLowerCase().trim() === roomName?.trim()
      );
      if (index >= 0) {
        // If roomName already exists, add package to the existing room object
        accumulator[index].packages.push(current.package);
      } else {
        // If roomName doesn't exist, create a new room object with the roomName and package
        accumulator.push({ name: current.name, packages: [current.package] });
      }
      return accumulator;
    }, []) || [];

  const [selectedPackages, setSelectedPackages] = useState<
    SelectedPackagesType[]
  >([]);

  const [isRoomOpen, setIsRoomOpen] = useState(false);
  const [isPackageOpen, setIsPackageOpen] = useState(false);

  const [selectedRoom, setSelectedRoom] = useState<string | undefined>("");
  const [selectedPackage, setSelectedPackage] = useState<string | undefined>(
    ""
  );

  const deselectRoom = () => {
    setSelectedRoom("");
  };

  const clickSelectRoom = (room: string | undefined) => {
    setSelectedRoom(room);
    setIsRoomOpen(false);
    setSelectedPackage("");
    setSelectedNonResidentGuestType(undefined);
    setSelectedResidentGuestType(undefined);
  };

  useEffect(() => {
    const packages = getPackagesForSelectedRoom(selectedRoom);
    setSelectedPackages(packages);
  }, [selectedRoom]);

  const deselectPackage = () => {
    setSelectedPackage("");
    setIsPackageOpen(false);
    setSelectedNonResidentGuestType(undefined);
    setSelectedResidentGuestType(undefined);
  };

  const clickSelectPackage = (pkg: string | undefined) => {
    setSelectedPackage(pkg);
    setSelectedNonResidentGuestType(undefined);
    setSelectedResidentGuestType(undefined);
    setIsPackageOpen(false);
  };

  const [selectedNonResidentGuestType, setSelectedNonResidentGuestType] =
    useState<SelectedGuestType>();
  const [selectedResidentGuestType, setSelectedResidentGuestType] =
    useState<SelectedGuestType>();

  function getPackagesForSelectedRoom(
    room: string | undefined
  ): SelectedPackagesType[] {
    const roomName = room?.toLowerCase()?.trim();
    const packages: SelectedPackagesType[] = [];

    for (const room of roomTypes || []) {
      if (room.name?.toLowerCase() === roomName) {
        packages.push({
          name: room.package,
          description: room.package_description,
        });
      }
    }
    return packages;
  }

  const commonRoomResidentNamesWithDescription =
    pricing.findCommonRoomResidentNamesWithDescription(
      selectedRoom,
      selectedPackage,
      roomTypes,
      true
    );

  const commonRoomNonResidentNamesWithDescription =
    pricing.findCommonRoomNonResidentNamesWithDescription(
      selectedRoom,
      selectedPackage,
      roomTypes,
      true
    );

  const selectedRoomType = roomTypes?.find(
    (room) =>
      room.name?.toLowerCase() === selectedRoom?.toLowerCase() &&
      room.package === selectedPackage
  );

  const [opened, { open, close }] = useDisclosure(false);

  const [isNonResident, setIsNonResident] = React.useState(true);

  const [isResidentDropdownOpen, setIsResidentDropdownOpen] =
    React.useState(false);
  const [isNonResidentDropdownOpen, setIsNonResidentDropdownOpen] =
    React.useState(false);

  return (
    <div className="border relative border-solid w-full border-gray-200 rounded-xl p-5">
      <Text className="font-semibold" size="lg">
        Prices
      </Text>
      {date[0] && date[1] && (
        <Text className="text-gray-600" size="sm">
          Data being shown is from {format(date[0] as Date, "dd MMM yyyy")} to{" "}
          {format(new Date(date[1]) as Date, "dd MMM yyyy")}
        </Text>
      )}

      {!date[0] ||
        (!date[1] && (
          <Text className="text-gray-600" size="sm">
            Please select a date range to view the rooms and packages
          </Text>
        ))}

      <Switch
        label="Non-resident prices"
        color="red"
        className="absolute top-4 right-4"
        checked={isNonResident}
        onChange={(event) => setIsNonResident(event.currentTarget.checked)}
      />

      <Divider my={12} />

      <Flex className="w-full" mt={18}>
        <Popover
          width={350}
          position="bottom-start"
          arrowOffset={60}
          withArrow
          shadow="md"
          opened={isRoomOpen}
          onChange={setIsRoomOpen}
        >
          <Popover.Target>
            <Flex
              justify={"space-between"}
              align={"center"}
              onClick={() => setIsRoomOpen((prev) => !prev)}
              className="px-2 py-1 cursor-pointer rounded-l-md border border-solid w-[180px] border-gray-300"
            >
              <Flex direction="column" gap={4}>
                <Text size="xs" weight={600} className="text-gray-500">
                  Rooms
                </Text>
                <div className="w-[140px] overflow-hidden">
                  <Text truncate size="sm" weight={600}>
                    {selectedRoom ? `${selectedRoom}` : "Select the room"}
                  </Text>
                </div>
              </Flex>

              <IconSelector className="text-gray-500"></IconSelector>
            </Flex>
          </Popover.Target>

          <Popover.Dropdown className="px-3">
            {uniqueRooms.map((selectRoom, index) => (
              <Flex
                key={index}
                justify={"space-between"}
                align={"center"}
                onClick={() => {
                  if (selectRoom.name === selectedRoom) {
                    deselectRoom();
                  } else {
                    clickSelectRoom(selectRoom.name);
                  }
                }}
                // onMouseDown={() => {
                //   setIsRoomOpen(false);
                // }}
                className={
                  "py-2 px-2 rounded-md mt-1 cursor-pointer " +
                  (selectRoom.name === selectedRoom
                    ? "bg-[#FA5252] text-white"
                    : "hover:bg-gray-100")
                }
              >
                <Text size="sm" weight={600}>
                  {selectRoom.name}
                </Text>
              </Flex>
            ))}
          </Popover.Dropdown>
        </Popover>

        <Popover
          width={350}
          position="bottom-start"
          arrowOffset={60}
          withArrow
          shadow="md"
          opened={isPackageOpen}
          onChange={setIsPackageOpen}
        >
          <Popover.Target>
            <Flex
              justify={"space-between"}
              align={"center"}
              onClick={() => setIsPackageOpen((prev) => !prev)}
              className="px-2 py-1 cursor-pointer border-l-transparent border border-solid w-[200px] border-gray-300"
            >
              <Flex direction="column" gap={4}>
                <Text size="xs" weight={600} className="text-gray-500">
                  Package
                </Text>
                <div className="w-[140px] overflow-hidden">
                  <Text truncate size="sm" weight={600}>
                    {selectedPackage
                      ? selectedPackage.charAt(0).toUpperCase() +
                        selectedPackage.slice(1).toLowerCase()
                      : "Select the package"}
                  </Text>
                </div>
              </Flex>

              <IconSelector className="text-gray-500"></IconSelector>
            </Flex>
          </Popover.Target>

          <Popover.Dropdown className="px-3">
            {selectedPackages.map((roomPackage, index) => (
              <Flex
                key={index}
                justify={"space-between"}
                align={"center"}
                onClick={() => {
                  if (roomPackage.name === selectedPackage) {
                    deselectPackage();
                  } else {
                    clickSelectPackage(roomPackage.name);
                  }
                }}
                // onMouseDown={() => {
                //   setIsPackageOpen(false);
                // }}
                className={
                  "rounded-md mt-1 cursor-pointer " +
                  (selectedPackage === roomPackage.name
                    ? "bg-[#FA5252] text-white"
                    : "hover:bg-gray-100")
                }
              >
                {roomPackage.description ? (
                  <Tooltip.Floating
                    multiline
                    width={300}
                    color="white"
                    position="bottom"
                    className="text-gray-800 font-semibold border-gray-200 border border-solid"
                    label={roomPackage.description}
                  >
                    <Text
                      w="100%"
                      className="py-2 px-2 "
                      size="sm"
                      weight={600}
                    >
                      {roomPackage.name.charAt(0).toUpperCase() +
                        roomPackage.name.slice(1).toLowerCase()}
                    </Text>
                  </Tooltip.Floating>
                ) : (
                  <Text className="py-2 px-2 " size="sm" weight={600}>
                    {roomPackage.name.charAt(0).toUpperCase() +
                      roomPackage.name.slice(1).toLowerCase()}
                  </Text>
                )}
              </Flex>
            ))}
          </Popover.Dropdown>
        </Popover>

        {isNonResident && (
          <Popover
            width={300}
            position="bottom-start"
            arrowOffset={60}
            withArrow
            shadow="md"
            opened={isNonResidentDropdownOpen}
            onChange={setIsNonResidentDropdownOpen}
          >
            <Popover.Target>
              <Flex
                justify={"space-between"}
                align={"center"}
                onClick={() => setIsNonResidentDropdownOpen((prev) => !prev)}
                className="px-2 py-1 cursor-pointer rounded-r-md border-l-transparent border border-solid w-[200px] border-gray-300"
              >
                <Flex direction="column" gap={4}>
                  <Text size="xs" weight={600} className="text-gray-500">
                    Non-resident guest types
                  </Text>
                  <div className="w-[140px] overflow-hidden">
                    <Text
                      transform="capitalize"
                      size="sm"
                      truncate
                      weight={600}
                    >
                      {selectedNonResidentGuestType
                        ? selectedNonResidentGuestType.name
                        : "Select guest type"}
                    </Text>
                  </div>
                </Flex>

                <IconSelector className="text-gray-500"></IconSelector>
              </Flex>
            </Popover.Target>

            <Popover.Dropdown className="px-0 py-2">
              <ScrollArea.Autosize
                type="auto"
                mah={300}
                offsetScrollbars={true}
                className="w-full px-2"
              >
                {commonRoomNonResidentNamesWithDescription.map(
                  (guestType, index) => (
                    <Flex
                      w="100%"
                      onClick={() => {
                        setSelectedNonResidentGuestType(guestType);
                        setIsNonResidentDropdownOpen(false);
                      }}
                      key={index}
                    >
                      {guestType?.description ? (
                        <Tooltip.Floating
                          multiline
                          width={220}
                          color="white"
                          position="bottom"
                          className="text-gray-800 font-semibold border-gray-200 border border-solid"
                          label={guestType.description}
                        >
                          <Text
                            w="100%"
                            className={
                              "py-2 px-2 rounded-md mt-1 cursor-pointer " +
                              (selectedNonResidentGuestType?.name ===
                              guestType?.name
                                ? "bg-[#FA5252] text-white"
                                : "hover:bg-gray-100")
                            }
                            size="sm"
                            weight={600}
                            transform="capitalize"
                          >
                            {guestType?.name}
                          </Text>
                        </Tooltip.Floating>
                      ) : (
                        <Text
                          w="100%"
                          className={
                            "py-2 px-2 rounded-md mt-1 cursor-pointer " +
                            (selectedNonResidentGuestType?.name ===
                            guestType?.name
                              ? "bg-[#FA5252] text-white"
                              : "hover:bg-gray-100")
                          }
                          size="sm"
                          weight={600}
                          transform="capitalize"
                        >
                          {guestType?.name}
                        </Text>
                      )}
                    </Flex>
                  )
                )}
              </ScrollArea.Autosize>
            </Popover.Dropdown>
          </Popover>
        )}

        {!isNonResident && (
          <Popover
            width={300}
            position="bottom-start"
            arrowOffset={60}
            withArrow
            shadow="md"
            opened={isResidentDropdownOpen}
            onChange={setIsResidentDropdownOpen}
          >
            <Popover.Target>
              <Flex
                justify={"space-between"}
                align={"center"}
                onClick={() => setIsResidentDropdownOpen((prev) => !prev)}
                className="px-2 py-1 cursor-pointer rounded-r-md border-l-transparent border border-solid w-[200px] border-gray-300"
              >
                <Flex direction="column" gap={4}>
                  <Text size="xs" weight={600} className="text-gray-500">
                    Resident guest types
                  </Text>
                  <div className="w-[140px] overflow-hidden">
                    <Text
                      transform="capitalize"
                      size="sm"
                      truncate
                      weight={600}
                    >
                      {selectedResidentGuestType
                        ? selectedResidentGuestType.name
                        : "Select guest type"}
                    </Text>
                  </div>
                </Flex>

                <IconSelector className="text-gray-500"></IconSelector>
              </Flex>
            </Popover.Target>

            <Popover.Dropdown className="px-0 py-2">
              <ScrollArea.Autosize
                type="auto"
                mah={300}
                offsetScrollbars={true}
                className="w-full px-2"
              >
                {commonRoomResidentNamesWithDescription.map(
                  (guestType, index) => (
                    <Flex
                      w="100%"
                      onClick={() => {
                        setSelectedResidentGuestType(guestType);
                        setIsResidentDropdownOpen(false);
                      }}
                      key={index}
                    >
                      {guestType?.description ? (
                        <Tooltip.Floating
                          multiline
                          width={220}
                          color="white"
                          position="bottom"
                          className="text-gray-800 font-semibold border-gray-200 border border-solid"
                          label={guestType.description}
                        >
                          <Text
                            w="100%"
                            className={
                              "py-2 px-2 rounded-md mt-1 cursor-pointer " +
                              (selectedResidentGuestType?.name ===
                              guestType?.name
                                ? "bg-[#FA5252] text-white"
                                : "hover:bg-gray-100")
                            }
                            size="sm"
                            weight={600}
                            transform="capitalize"
                          >
                            {guestType?.name}
                          </Text>
                        </Tooltip.Floating>
                      ) : (
                        <Text
                          w="100%"
                          className={
                            "py-2 px-2 rounded-md mt-1 cursor-pointer " +
                            (selectedResidentGuestType?.name === guestType?.name
                              ? "bg-[#FA5252] text-white"
                              : "hover:bg-gray-100")
                          }
                          size="sm"
                          weight={600}
                          transform="capitalize"
                        >
                          {guestType?.name}
                        </Text>
                      )}
                    </Flex>
                  )
                )}
              </ScrollArea.Autosize>
            </Popover.Dropdown>
          </Popover>
        )}
      </Flex>

      {selectedRoom &&
        selectedPackage &&
        selectedNonResidentGuestType?.name &&
        isNonResident && (
          <Container className="mt-10">
            <Grid className="border-t border-b-0 border-r-0 border-l border-solid border-gray-300">
              {selectedRoomType?.room_non_resident_availabilities.map(
                (guest, index) => (
                  <NonResidentPriceEdit
                    key={guest.id}
                    date={format(new Date(guest.date), "dd MMM yyyy")}
                    guestType={selectedNonResidentGuestType?.name || ""}
                    nonResidentGuests={
                      guest.room_non_resident_guest_availabilities
                    }
                    stay={stay}
                  />
                )
              )}
            </Grid>
          </Container>
        )}

      {selectedRoom &&
        selectedPackage &&
        selectedResidentGuestType?.name &&
        !isNonResident && (
          <Container className="mt-10">
            <Grid className="border-t border-b-0 border-r-0 border-l border-solid border-gray-300">
              {selectedRoomType?.room_resident_availabilities.map(
                (guest, index) => (
                  <ResidentPriceEdit
                    key={guest.id}
                    date={format(new Date(guest.date), "dd MMM yyyy")}
                    guestType={selectedResidentGuestType?.name || ""}
                    residentGuests={guest.room_resident_guest_availabilities}
                    stay={stay}
                  />
                )
              )}
            </Grid>
          </Container>
        )}

      <Modal
        classNames={{
          title: "text-lg font-bold",
          close: "text-black hover:text-gray-700 hover:bg-gray-200",
          header: "bg-gray-100",
        }}
        opened={opened}
        size="lg"
        onClose={close}
        title="Bulk update"
      >
        {isNonResident && (
          <NonResidentBulkEdit
            guestType={selectedNonResidentGuestType?.name || ""}
            description={selectedNonResidentGuestType?.description || ""}
            date={date}
            roomName={selectedRoomType?.name || ""}
            packageName={selectedPackage || ""}
            selectedRoomType={selectedRoomType}
            stay={stay}
            setSelectedNonResidentGuestType={setSelectedNonResidentGuestType}
            closeModal={close}
          ></NonResidentBulkEdit>
        )}

        {!isNonResident && (
          <ResidentBulkEdit
            guestType={selectedResidentGuestType?.name || ""}
            description={selectedResidentGuestType?.description || ""}
            date={date}
            roomName={selectedRoomType?.name || ""}
            packageName={selectedPackage || ""}
            selectedRoomType={selectedRoomType}
            stay={stay}
            setSelectedResidentGuestType={setSelectedResidentGuestType}
            closeModal={close}
          ></ResidentBulkEdit>
        )}
      </Modal>

      {selectedRoom &&
        selectedPackage &&
        selectedNonResidentGuestType?.name &&
        isNonResident && (
          <div className="flex mt-8 justify-between">
            <div></div>
            <Button onClick={open} color="red" radius="md" size="sm">
              Bulk update
            </Button>
          </div>
        )}

      {selectedRoom &&
        selectedPackage &&
        selectedResidentGuestType?.name &&
        !isNonResident && (
          <div className="flex mt-8 justify-between">
            <div></div>
            <Button onClick={open} color="red" radius="md" size="sm">
              Bulk update
            </Button>
          </div>
        )}
    </div>
  );
}

export default PriceEdit;
