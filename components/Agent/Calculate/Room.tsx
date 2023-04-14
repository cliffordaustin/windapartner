import {
  Context,
  ParkFee,
  Room as StateRoomType,
} from "@/context/CalculatePage";
import {
  OtherFeesNonResident,
  OtherFeesResident,
  RoomType,
  Stay,
} from "@/utils/types";
import { Flex, Popover, Text, Divider, Checkbox } from "@mantine/core";
import { IconMinus, IconPlus, IconSelector, IconX } from "@tabler/icons-react";
import { useContext, useEffect, useState } from "react";

type RoomProps = {
  room: StateRoomType;
  stay: Stay;
  index: number;
};

const guestClassName =
  "h-[35px] hover:bg-red-500 cursor-pointer hover:border-red-500 hover:text-white transition-all duration-300 flex text-gray-600 items-center justify-center w-[35px] border border-solid border-gray-400 ";

export default function Room({ room, stay, index }: RoomProps) {
  const [selectedPackages, setSelectedPackages] = useState<string[]>([]);

  const { state, setState } = useContext(Context);

  type UniqueRoomsType = {
    name?: string;
    packages: string[];
  };

  const uniqueRooms: UniqueRoomsType[] = stay.room_types.reduce(
    (accumulator: UniqueRoomsType[], current: RoomType) => {
      const roomName = current.name?.toLowerCase();
      const index = accumulator.findIndex(
        (room) => room.name?.toLowerCase() === roomName
      );
      if (index >= 0) {
        // If roomName already exists, add package to the existing room object
        accumulator[index].packages.push(current.package);
      } else {
        // If roomName doesn't exist, create a new room object with the roomName and package
        accumulator.push({ name: current.name, packages: [current.package] });
      }
      return accumulator;
    },
    []
  );

  function getPackagesForSelectedRoom(room: string): string[] {
    const roomName = room.toLowerCase();
    const packages: string[] = [];

    for (const room of stay.room_types) {
      if (room.name?.toLowerCase() === roomName) {
        packages.push(room.package);
      }
    }
    return packages;
  }

  useEffect(() => {
    const packages = getPackagesForSelectedRoom(room.name);
    setSelectedPackages(packages);
  }, [room.name]);

  const currentStay = state.find((item) => item.id === stay.id);

  type GuestType =
    | "residentAdult"
    | "residentChild"
    | "residentInfant"
    | "nonResidentAdult"
    | "nonResidentChild"
    | "nonResidentInfant";

  const addGuest = (type: GuestType) => {
    setState(
      state.map((item) => {
        if (item.id === stay.id) {
          return {
            ...item,
            rooms: item.rooms.map((item) => {
              if (room.id === item.id) {
                return {
                  ...item,
                  residentAdult:
                    type === "residentAdult"
                      ? room.residentAdult + 1
                      : room.residentAdult,
                  residentChild:
                    type === "residentChild"
                      ? room.residentChild + 1
                      : room.residentChild,
                  residentInfant:
                    type === "residentInfant"
                      ? room.residentInfant + 1
                      : room.residentInfant,
                  nonResidentAdult:
                    type === "nonResidentAdult"
                      ? room.nonResidentAdult + 1
                      : room.nonResidentAdult,
                  nonResidentChild:
                    type === "nonResidentChild"
                      ? room.nonResidentChild + 1
                      : room.nonResidentChild,
                  nonResidentInfant:
                    type === "nonResidentInfant"
                      ? room.nonResidentInfant + 1
                      : room.nonResidentInfant,
                };
              }
              return item;
            }),
          };
        }
        return item;
      })
    );
  };

  const removeGuest = (type: GuestType) => {
    setState(
      state.map((item) => {
        if (item.id === stay.id) {
          return {
            ...item,
            rooms: item.rooms.map((item) => {
              if (room.id === item.id) {
                return {
                  ...item,
                  residentAdult:
                    type === "residentAdult"
                      ? room.residentAdult > 0
                        ? room.residentAdult - 1
                        : 0
                      : room.residentAdult,
                  residentChild:
                    type === "residentChild"
                      ? room.residentChild > 0
                        ? room.residentChild - 1
                        : 0
                      : room.residentChild,
                  residentInfant:
                    type === "residentInfant"
                      ? room.residentInfant > 0
                        ? room.residentInfant - 1
                        : 0
                      : room.residentInfant,
                  nonResidentAdult:
                    type === "nonResidentAdult"
                      ? room.nonResidentAdult > 0
                        ? room.nonResidentAdult - 1
                        : 0
                      : room.nonResidentAdult,
                  nonResidentChild:
                    type === "nonResidentChild"
                      ? room.nonResidentChild > 0
                        ? room.nonResidentChild - 1
                        : 0
                      : room.nonResidentChild,
                  nonResidentInfant:
                    type === "nonResidentInfant"
                      ? room.nonResidentInfant > 0
                        ? room.nonResidentInfant - 1
                        : 0
                      : room.nonResidentInfant,
                };
              }
              return item;
            }),
          };
        }
        return item;
      })
    );
  };

  const handleResidentFees = (
    e: React.ChangeEvent<HTMLInputElement>,
    fee: OtherFeesResident
  ) => {
    if (e.target.checked) {
      const otherFee: ParkFee = {
        id: fee.id,
        name: fee.name,
        price: fee.price,
        feeType: fee.resident_fee_type,
        guestType: fee.guest_type,
      };
      setState(
        state.map((item) => {
          if (item.id === stay.id) {
            return {
              ...item,
              rooms: item.rooms.map((item) => {
                if (item.id === room.id) {
                  return {
                    ...item,
                    residentParkFee: [...item.residentParkFee, otherFee],
                  };
                }
                return item;
              }),
            };
          }
          return item;
        })
      );
    } else {
      setState(
        state.map((item) => {
          if (item.id === stay.id) {
            return {
              ...item,
              rooms: item.rooms.map((item) => {
                if (item.id === room.id) {
                  return {
                    ...item,
                    residentParkFee: item.residentParkFee.filter(
                      (item) => item.id !== fee.id
                    ),
                  };
                }
                return item;
              }),
            };
          }
          return item;
        })
      );
    }
  };

  const handleNonResidentFees = (
    e: React.ChangeEvent<HTMLInputElement>,
    fee: OtherFeesNonResident
  ) => {
    if (e.target.checked) {
      const otherFee: ParkFee = {
        id: fee.id,
        name: fee.name,
        price: fee.price,
        feeType: fee.nonresident_fee_type,
        guestType: fee.guest_type,
      };
      setState(
        state.map((item) => {
          if (item.id === stay.id) {
            return {
              ...item,
              rooms: item.rooms.map((item) => {
                if (item.id === room.id) {
                  return {
                    ...item,
                    nonResidentParkFee: [...item.nonResidentParkFee, otherFee],
                  };
                }
                return item;
              }),
            };
          }
          return item;
        })
      );
    } else {
      setState(
        state.map((item) => {
          if (item.id === stay.id) {
            return {
              ...item,
              rooms: item.rooms.map((item) => {
                if (item.id === room.id) {
                  return {
                    ...item,
                    nonResidentParkFee: item.nonResidentParkFee.filter(
                      (item) => item.id !== fee.id
                    ),
                  };
                }
                return item;
              }),
            };
          }
          return item;
        })
      );
    }
  };

  const totalGuests =
    room.residentAdult +
    room.residentChild +
    room.residentInfant +
    room.nonResidentAdult +
    room.nonResidentChild +
    room.nonResidentInfant;

  const numberOfSelectedFees =
    room.residentParkFee.length + room.nonResidentParkFee.length;

  const removeRoom = () => {
    setState(
      state.map((item) => {
        if (item.id === stay.id) {
          return {
            ...item,
            rooms: item.rooms.filter((item) => item.id !== room.id),
          };
        }
        return item;
      })
    );
  };

  return (
    <div className="flex items-center">
      <Flex w="100%" mt={18}>
        <Popover
          width={350}
          position="bottom-start"
          arrowOffset={60}
          withArrow
          shadow="md"
          styles={{}}
        >
          <Popover.Target>
            <Flex
              justify={"space-between"}
              align={"center"}
              className="px-2 py-1 cursor-pointer rounded-l-md border border-solid w-[220px] border-gray-300"
            >
              <Flex direction="column" gap={4}>
                <Text size="xs" weight={600} className="text-gray-500">
                  Rooms
                </Text>
                <Text size="sm" weight={600}>
                  {room.name ? room.name : "Select the room"}
                </Text>
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
                  setState(
                    state.map((item) => {
                      if (item.id === stay.id) {
                        return {
                          ...item,
                          rooms: item.rooms.map((item) => {
                            if (item.id === room.id) {
                              return {
                                ...item,
                                name: selectRoom.name || "",
                                package: "",
                              };
                            }
                            return item;
                          }),
                        };
                      }
                      return item;
                    })
                  );
                }}
                className={
                  "py-2 px-2 rounded-md mt-1 cursor-pointer " +
                  (selectRoom.name === room.name
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
        >
          <Popover.Target>
            <Flex
              justify={"space-between"}
              align={"center"}
              className="px-2 py-1 cursor-pointer border-l-transparent border border-solid w-[220px] border-gray-300"
            >
              <Flex direction="column" gap={4}>
                <Text size="xs" weight={600} className="text-gray-500">
                  Package
                </Text>
                <Text size="sm" weight={600}>
                  {room.package
                    ? room.package.charAt(0).toUpperCase() +
                      room.package.slice(1).toLowerCase()
                    : "Select the package"}
                </Text>
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
                  setState(
                    state.map((item) => {
                      if (item.id === stay.id) {
                        return {
                          ...item,
                          rooms: item.rooms.map((item) => {
                            if (item.id === room.id) {
                              return {
                                ...item,
                                package: roomPackage,
                              };
                            }
                            return item;
                          }),
                        };
                      }
                      return item;
                    })
                  );
                }}
                className={
                  "py-2 px-2 rounded-md mt-1 cursor-pointer " +
                  (room.package === roomPackage
                    ? "bg-[#FA5252] text-white"
                    : "hover:bg-gray-100")
                }
              >
                <Text size="sm" weight={600}>
                  {roomPackage.charAt(0).toUpperCase() +
                    roomPackage.slice(1).toLowerCase()}
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
        >
          <Popover.Target>
            <Flex
              justify={"space-between"}
              align={"center"}
              className="px-2 py-1 cursor-pointer border border-l-transparent border-solid w-[220px] border-gray-300"
            >
              <Flex direction="column" gap={4}>
                <Text size="xs" weight={600} className="text-gray-500">
                  Guests
                </Text>
                <Text size="sm" weight={600}>
                  {totalGuests > 0
                    ? `${totalGuests} ${totalGuests === 1 ? "Guest" : "Guests"}`
                    : "Add guests"}
                </Text>
              </Flex>

              <IconSelector className="text-gray-500"></IconSelector>
            </Flex>
          </Popover.Target>

          <Popover.Dropdown className="px-3">
            <Flex direction="column" gap={5}>
              <Text size="sm" weight={600}>
                Resident guests
              </Text>

              <Flex justify={"space-between"} mt={6} align={"center"}>
                <Text size="sm">Adult (18+ years)</Text>

                <Flex>
                  <div
                    onClick={() => {
                      removeGuest("residentAdult");
                    }}
                    className={guestClassName}
                  >
                    <IconMinus className="w-5 h-5"></IconMinus>
                  </div>
                  <div className="h-[35px] flex text-gray-600 items-center justify-center w-[35px] border-x-transparent border border-solid border-gray-400">
                    {room.residentAdult}
                  </div>
                  <div
                    onClick={() => {
                      addGuest("residentAdult");
                    }}
                    className={guestClassName}
                  >
                    <IconPlus className="w-5 h-5"></IconPlus>
                  </div>
                </Flex>
              </Flex>

              <Flex justify={"space-between"} mt={6} align={"center"}>
                <Text size="sm">Child (2-12 years)</Text>

                <Flex>
                  <div
                    onClick={() => {
                      removeGuest("residentChild");
                    }}
                    className={guestClassName}
                  >
                    <IconMinus className="w-5 h-5"></IconMinus>
                  </div>
                  <div className="h-[35px] flex text-gray-600 items-center justify-center w-[35px] border-x-transparent border border-solid border-gray-400">
                    {room.residentChild}
                  </div>
                  <div
                    onClick={() => {
                      addGuest("residentChild");
                    }}
                    className={guestClassName}
                  >
                    <IconPlus className="w-5 h-5"></IconPlus>
                  </div>
                </Flex>
              </Flex>

              <Flex justify={"space-between"} mt={6} align={"center"}>
                <Text size="sm">Infant (Under 2 years)</Text>

                <Flex>
                  <div
                    onClick={() => {
                      removeGuest("residentInfant");
                    }}
                    className={guestClassName}
                  >
                    <IconMinus className="w-5 h-5"></IconMinus>
                  </div>
                  <div className="h-[35px] flex text-gray-600 items-center justify-center w-[35px] border-x-transparent border border-solid border-gray-400">
                    {room.residentInfant}
                  </div>
                  <div
                    onClick={() => {
                      addGuest("residentInfant");
                    }}
                    className={guestClassName}
                  >
                    <IconPlus className="w-5 h-5"></IconPlus>
                  </div>
                </Flex>
              </Flex>

              <Divider mt={6} size="xs" />

              <Text size="sm" weight={600}>
                Non-resident guests
              </Text>

              <Flex justify={"space-between"} mt={6} align={"center"}>
                <Text size="sm">Adult (18+ years)</Text>

                <Flex>
                  <div
                    onClick={() => {
                      removeGuest("nonResidentAdult");
                    }}
                    className={guestClassName}
                  >
                    <IconMinus className="w-5 h-5"></IconMinus>
                  </div>
                  <div className="h-[35px] flex text-gray-600 items-center justify-center w-[35px] border-x-transparent border border-solid border-gray-400">
                    {room.nonResidentAdult}
                  </div>
                  <div
                    onClick={() => {
                      addGuest("nonResidentAdult");
                    }}
                    className={guestClassName}
                  >
                    <IconPlus className="w-5 h-5"></IconPlus>
                  </div>
                </Flex>
              </Flex>

              <Flex justify={"space-between"} mt={6} align={"center"}>
                <Text size="sm">Child (2-12 years)</Text>

                <Flex>
                  <div
                    onClick={() => {
                      removeGuest("nonResidentChild");
                    }}
                    className={guestClassName}
                  >
                    <IconMinus className="w-5 h-5"></IconMinus>
                  </div>
                  <div className="h-[35px] flex text-gray-600 items-center justify-center w-[35px] border-x-transparent border border-solid border-gray-400">
                    {room.nonResidentChild}
                  </div>
                  <div
                    onClick={() => {
                      addGuest("nonResidentChild");
                    }}
                    className={guestClassName}
                  >
                    <IconPlus className="w-5 h-5"></IconPlus>
                  </div>
                </Flex>
              </Flex>

              <Flex justify={"space-between"} mt={6} align={"center"}>
                <Text size="sm">Infant (Under 2 years)</Text>

                <Flex>
                  <div
                    onClick={() => {
                      removeGuest("nonResidentInfant");
                    }}
                    className={guestClassName}
                  >
                    <IconMinus className="w-5 h-5"></IconMinus>
                  </div>
                  <div className="h-[35px] flex text-gray-600 items-center justify-center w-[35px] border-x-transparent border border-solid border-gray-400">
                    {room.nonResidentInfant}
                  </div>
                  <div
                    onClick={() => {
                      addGuest("nonResidentInfant");
                    }}
                    className={guestClassName}
                  >
                    <IconPlus className="w-5 h-5"></IconPlus>
                  </div>
                </Flex>
              </Flex>
            </Flex>
          </Popover.Dropdown>
        </Popover>

        <Popover
          width={450}
          position="bottom-end"
          arrowOffset={60}
          withArrow
          shadow="md"
        >
          <Popover.Target>
            <Flex
              justify={"space-between"}
              align={"center"}
              className="px-2 py-1 cursor-pointer rounded-r-md border-l border-l-transparent border border-solid w-[220px] border-gray-300"
            >
              <Flex direction="column" gap={4}>
                <Text size="xs" weight={600} className="text-gray-500">
                  Park/Conservancy fees
                </Text>
                <Text size="sm" w={"60%"} truncate weight={600}>
                  {numberOfSelectedFees > 0
                    ? `${numberOfSelectedFees} ${
                        numberOfSelectedFees === 1 ? "Selected" : "Selected"
                      }`
                    : "Add fees"}
                </Text>
              </Flex>

              <IconSelector className="text-gray-500"></IconSelector>
            </Flex>
          </Popover.Target>

          <Popover.Dropdown className="px-3">
            <Flex direction="column" gap={5}>
              {stay.other_fees_resident.length > 0 && (
                <Text size="sm" weight={600}>
                  Resident guests
                </Text>
              )}

              {stay.other_fees_resident.map((fee, index) => (
                <Flex
                  mt={6}
                  key={index}
                  justify={"space-between"}
                  align={"center"}
                >
                  <Checkbox
                    color="red"
                    label={`${fee.name}`}
                    checked={
                      !!room.residentParkFee.find((item) => item.id === fee.id)
                    }
                    onChange={(event) => {
                      handleResidentFees(event, fee);
                    }}
                  ></Checkbox>
                  <Text size="sm" weight={600}>
                    KES{fee.price}
                  </Text>
                </Flex>
              ))}

              <Divider mt={6} size="xs" />

              <Text size="sm" weight={600}>
                Non-resident guests
              </Text>

              {stay.other_fees_non_resident.map((fee, index) => (
                <Flex
                  key={index}
                  justify={"space-between"}
                  mt={6}
                  align={"center"}
                >
                  <Checkbox
                    color="red"
                    label={`${fee.name}`}
                    checked={
                      !!room.nonResidentParkFee.find(
                        (item) => item.id === fee.id
                      )
                    }
                    onChange={(event) => {
                      handleNonResidentFees(event, fee);
                    }}
                  ></Checkbox>

                  <Text size="sm" weight={600}>
                    ${fee.price}
                  </Text>
                </Flex>
              ))}
            </Flex>
          </Popover.Dropdown>
        </Popover>
      </Flex>

      <div
        onClick={() => {
          removeRoom();
        }}
        className="mt-5 cursor-pointer"
      >
        {index > 0 && <IconX className="text-gray-600"></IconX>}
      </div>
    </div>
  );
}
