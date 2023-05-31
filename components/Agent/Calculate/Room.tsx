import {
  Context,
  NonResidentGuests,
  ParkFee,
  ResidentGuests,
  Room as StateRoomType,
  StateType,
} from "@/context/CalculatePage";
import { getRoomTypes } from "@/pages/api/stays";
import pricing from "@/utils/calculation";
import {
  OtherFeesNonResident,
  OtherFeesResident,
  RoomType,
  Stay,
} from "@/utils/types";
import {
  Flex,
  Popover,
  Text,
  Divider,
  Checkbox,
  Tooltip,
  ScrollArea,
  Container,
} from "@mantine/core";
import { IconMinus, IconPlus, IconSelector, IconX } from "@tabler/icons-react";
import { useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { v4 as uuidv4 } from "uuid";
import { parse, format } from "date-fns";

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

  const currentState = state.find((item) => item.id === stay.id);

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

  type GuestTypes = "Adult" | "Child" | "Infant" | "Teen" | "";

  const guestTypes: GuestTypes[] = ["Adult", "Child", "Teen", "Infant"];

  const queryStr = stay ? stay.slug : "room-type";

  const { data: roomTypes, isLoading: roomTypesLoading } = useQuery(
    queryStr,
    () =>
      getRoomTypes(
        stay,
        format(currentState?.date[0] || new Date(), "yyyy-MM-dd"),
        format(currentState?.date[1] || new Date(), "yyyy-MM-dd")
      ),
    { enabled: currentState?.date[0] && currentState.date[1] ? true : false }
  );

  console.log(roomTypes);
  console.log(new Date());
  console.log(currentState?.date[0]);
  console.log(currentState?.date[1]);

  const commonRoomResidentNamesWithDescription =
    pricing.findCommonRoomResidentNamesWithDescription(
      room.name,
      room.package,
      roomTypes
    );

  const commonRoomNonResidentNamesWithDescription =
    pricing.findCommonRoomNonResidentNamesWithDescription(
      room.name,
      room.package,
      roomTypes
    );

  const removeResidentGuest = (guest: ResidentGuests) => {
    setState(
      state.map((item) => {
        if (item.id === stay.id) {
          return {
            ...item,
            rooms: item.rooms.map((item) => {
              if (item.id === room.id) {
                return {
                  ...item,
                  residentGuests: item.residentGuests.filter(
                    (item) => item.id !== guest.id
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
  };

  const removeNonResidentGuest = (guest: NonResidentGuests) => {
    setState(
      state.map((item) => {
        if (item.id === stay.id) {
          return {
            ...item,
            rooms: item.rooms.map((item) => {
              if (item.id === room.id) {
                return {
                  ...item,
                  nonResidentGuests: item.nonResidentGuests.filter(
                    (item) => item.id !== guest.id
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
  };

  const getNumGuests = (room: StateRoomType): number => {
    let numGuests = 0;

    for (const guest of room.residentGuests) {
      if (guest.resident && guest.guestType) {
        numGuests++;
      }
    }

    for (const guest of room.nonResidentGuests) {
      if (guest.nonResident && guest.guestType) {
        numGuests++;
      }
    }

    return numGuests;
  };

  const totalNumberOfGuests = getNumGuests(room);

  const hasContentInFirstFee = state.find((item) => {
    if (item.id === stay.id) {
      if (item.rooms[0].name || item.rooms[0].package) {
        return true;
      } else {
        return false;
      }
    }
    return false;
  });

  const clearFee = () => {
    // clear all fields in first fee state
    const updatedItems: StateType[] = state.map((item) => {
      if (item.id === stay.id) {
        return {
          ...item,
          rooms: item.rooms.map((item) => {
            if (item.id === room.id) {
              return {
                ...item,
                residentParkFee: [],
                nonResidentParkFee: [],
                package: "",
                name: "",
                residentGuests: [],
                nonResidentGuests: [],
              };
            }
            return item;
          }),
        };
      }
      return item;
    });

    setState(updatedItems);
  };

  const clickSelectRoom = (selectRoom: UniqueRoomsType) => {
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
                  residentGuests: [
                    {
                      id: uuidv4(),
                      resident: "",
                      guestType: "",
                      description: "",
                    },
                  ],
                  nonResidentGuests: [
                    {
                      id: uuidv4(),
                      nonResident: "",
                      guestType: "",
                      description: "",
                    },
                  ],
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

  const deselectRoom = () => {
    setState(
      state.map((item) => {
        if (item.id === stay.id) {
          return {
            ...item,
            rooms: item.rooms.map((item) => {
              if (item.id === room.id) {
                return {
                  ...item,
                  name: "",
                  package: "",
                  residentGuests: [],
                  nonResidentGuests: [],
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

  const clickSelectPackage = (selectPackage: string) => {
    setState(
      state.map((item) => {
        if (item.id === stay.id) {
          return {
            ...item,
            rooms: item.rooms.map((item) => {
              if (item.id === room.id) {
                return {
                  ...item,
                  package: selectPackage,
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

  const deselectPackage = () => {
    setState(
      state.map((item) => {
        if (item.id === stay.id) {
          return {
            ...item,
            rooms: item.rooms.map((item) => {
              if (item.id === room.id) {
                return {
                  ...item,
                  package: "",
                  residentGuests: [
                    {
                      id: uuidv4(),
                      resident: "",
                      guestType: "",
                      description: "",
                    },
                  ],
                  nonResidentGuests: [
                    {
                      id: uuidv4(),
                      nonResident: "",
                      guestType: "",
                      description: "",
                    },
                  ],
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

  const clickSelectNonResidentGuest = (
    guest: NonResidentGuests,
    guestType: GuestTypes
  ) => {
    setState(
      state.map((item) => {
        if (item.id === stay.id) {
          return {
            ...item,
            rooms: item.rooms.map((item) => {
              if (item.id === room.id) {
                return {
                  ...item,
                  nonResidentGuests: item.nonResidentGuests.map((item) => {
                    if (item.id === guest.id) {
                      return {
                        ...item,
                        nonResident: guestType,
                      };
                    }
                    return item;
                  }),
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

  const deselectNonResidentGuest = (guest: NonResidentGuests) => {
    setState(
      state.map((item) => {
        if (item.id === stay.id) {
          return {
            ...item,
            rooms: item.rooms.map((item) => {
              if (item.id === room.id) {
                return {
                  ...item,
                  nonResidentGuests: item.nonResidentGuests.map((item) => {
                    if (item.id === guest.id) {
                      return {
                        ...item,
                        nonResident: "",
                        guestType: "",
                      };
                    }
                    return item;
                  }),
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

  const clickSelectResidentGuest = (
    guest: ResidentGuests,
    guestType: GuestTypes
  ) => {
    setState(
      state.map((item) => {
        if (item.id === stay.id) {
          return {
            ...item,
            rooms: item.rooms.map((item) => {
              if (item.id === room.id) {
                return {
                  ...item,
                  residentGuests: item.residentGuests.map((item) => {
                    if (item.id === guest.id) {
                      return {
                        ...item,
                        resident: guestType,
                      };
                    }
                    return item;
                  }),
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

  const deselectResidentGuest = (guest: ResidentGuests) => {
    setState(
      state.map((item) => {
        if (item.id === stay.id) {
          return {
            ...item,
            rooms: item.rooms.map((item) => {
              if (item.id === room.id) {
                return {
                  ...item,
                  residentGuests: item.residentGuests.map((item) => {
                    if (item.id === guest.id) {
                      return {
                        ...item,
                        resident: "",
                        guestType: "",
                      };
                    }
                    return item;
                  }),
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

  return (
    <div className="flex justify-between items-center">
      <Flex className="w-full" mt={18}>
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
              className="px-2 py-1 cursor-pointer rounded-l-md border border-solid w-[180px] border-gray-300"
            >
              <Flex direction="column" gap={4}>
                <Text size="xs" weight={600} className="text-gray-500">
                  Rooms
                </Text>
                <div className="w-[140px] overflow-hidden">
                  <Text truncate size="sm" weight={600}>
                    {room.name ? `${room.name}` : "Select the room"}
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
                  if (selectRoom.name === room.name) {
                    deselectRoom();
                  } else {
                    clickSelectRoom(selectRoom);
                  }
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
              className="px-2 py-1 cursor-pointer border-l-transparent border border-solid w-[180px] border-gray-300"
            >
              <Flex direction="column" gap={4}>
                <Text size="xs" weight={600} className="text-gray-500">
                  Package
                </Text>
                <div className="w-[140px] overflow-hidden">
                  <Text truncate size="sm" weight={600}>
                    {room.package
                      ? room.package.charAt(0).toUpperCase() +
                        room.package.slice(1).toLowerCase()
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
                  if (roomPackage === room.package) {
                    deselectPackage();
                  } else {
                    clickSelectPackage(roomPackage);
                  }
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
          width={400}
          position="bottom-start"
          arrowOffset={60}
          withArrow
          shadow="md"
        >
          <Popover.Target>
            <Flex
              justify={"space-between"}
              align={"center"}
              className="px-2 py-1 cursor-pointer border border-l-transparent border-solid w-[180px] border-gray-300"
            >
              <Flex direction="column" gap={4}>
                <Text size="xs" weight={600} className="text-gray-500">
                  Guests
                </Text>
                <div className="w-[140px] overflow-hidden">
                  <Text truncate size="sm" weight={600}>
                    {totalNumberOfGuests > 0
                      ? `${totalNumberOfGuests} ${
                          totalNumberOfGuests === 1 ? "Guest" : "Guests"
                        }`
                      : "Add guests"}
                  </Text>
                </div>
              </Flex>

              <IconSelector className="text-gray-500"></IconSelector>
            </Flex>
          </Popover.Target>

          <Popover.Dropdown className="px-3">
            {commonRoomNonResidentNamesWithDescription.length > 0 && (
              <>
                <Flex direction="column" gap={5}>
                  <Text size="sm" mb={2} weight={600}>
                    Non-Resident guests
                  </Text>
                  {room.nonResidentGuests.map((guest, index) => (
                    <Flex gap={7} key={index} align={"center"}>
                      <Popover
                        width={150}
                        position="bottom-start"
                        arrowOffset={60}
                        withArrow
                        shadow="md"
                      >
                        <Popover.Target>
                          <Flex
                            justify={"space-between"}
                            align={"center"}
                            className="px-2 py-1 cursor-pointer border rounded-md border-solid w-[48%] border-gray-300"
                          >
                            <Flex direction="column" gap={4}>
                              <Text
                                size="xs"
                                weight={600}
                                className="text-gray-500"
                              >
                                Guest
                              </Text>
                              <Text
                                transform="capitalize"
                                size="sm"
                                weight={600}
                              >
                                {guest.nonResident
                                  ? guest.nonResident
                                  : "Select guest"}
                              </Text>
                            </Flex>

                            <IconSelector className="text-gray-500"></IconSelector>
                          </Flex>
                        </Popover.Target>

                        <Popover.Dropdown className="px-2 py-2">
                          {guestTypes.map((guestType, index) => (
                            <Flex
                              w="100%"
                              onClick={() => {
                                if (guest.nonResident === guestType) {
                                  deselectNonResidentGuest(guest);
                                } else {
                                  clickSelectNonResidentGuest(guest, guestType);
                                }
                              }}
                              key={index}
                            >
                              <Text
                                w="100%"
                                className={
                                  "py-2 px-2 rounded-md mt-1 cursor-pointer " +
                                  (guest.nonResident === guestType
                                    ? "bg-[#FA5252] text-white"
                                    : "hover:bg-gray-100")
                                }
                                size="sm"
                                weight={600}
                              >
                                {guestType}
                              </Text>
                            </Flex>
                          ))}
                        </Popover.Dropdown>
                      </Popover>

                      <Popover
                        width={300}
                        position="bottom-start"
                        arrowOffset={60}
                        withArrow
                        shadow="md"
                      >
                        <Popover.Target>
                          <Flex
                            justify={"space-between"}
                            align={"center"}
                            className="px-2 py-1 cursor-pointer border rounded-md border-solid w-[48%] border-gray-300"
                          >
                            <Flex direction="column" gap={4}>
                              <Text
                                size="xs"
                                weight={600}
                                className="text-gray-500"
                              >
                                Guest type
                              </Text>
                              <div className="w-[140px] overflow-hidden">
                                <Text
                                  transform="capitalize"
                                  size="sm"
                                  truncate
                                  weight={600}
                                >
                                  {guest.guestType
                                    ? guest.guestType
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
                                    setState(
                                      state.map((item) => {
                                        if (item.id === stay.id) {
                                          return {
                                            ...item,
                                            rooms: item.rooms.map((item) => {
                                              if (item.id === room.id) {
                                                return {
                                                  ...item,
                                                  nonResidentGuests:
                                                    item.nonResidentGuests.map(
                                                      (item) => {
                                                        if (
                                                          item.id === guest.id
                                                        ) {
                                                          return {
                                                            ...item,
                                                            guestType:
                                                              guestType?.name,
                                                          };
                                                        }
                                                        return item;
                                                      }
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
                                          (guest.guestType === guestType?.name
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
                                        (guest.guestType === guestType?.name
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

                      {/* <Flex
                        h={50}
                        className="border rounded-md border-solid border-gray-300"
                        align="center"
                        justify="center"
                        gap={5}
                      >
                        <Container
                          w={15}
                          h={48}
                          className="flex hover:bg-gray-100 cursor-pointer rounded-l-
                          md items-center justify-center"
                        >
                          <Text className="text-2xl mb-1"> - </Text>
                        </Container>
                        <Text>1</Text>
                        <Container
                          w={15}
                          h={48}
                          className="flex hover:bg-gray-100 cursor-pointer rounded-r-md items-center justify-center"
                        >
                          <Text className="text-2xl"> + </Text>
                        </Container>
                      </Flex> */}

                      <div
                        onClick={() => {
                          removeNonResidentGuest(guest);
                        }}
                        className="mt-2 cursor-pointer"
                      >
                        {index > 0 && (
                          <IconX className="text-gray-600 w-5 h-5"></IconX>
                        )}
                      </div>
                    </Flex>
                  ))}
                  <Flex mt={5} pr={5} align="center" justify="space-between">
                    <Flex
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
                                      nonResidentGuests: [
                                        ...item.nonResidentGuests,
                                        {
                                          id: uuidv4(),
                                          nonResident: "",
                                          guestType: "",
                                          description: "",
                                        },
                                      ],
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
                      className="cursor-pointer w-fit"
                      align="center"
                      gap={4}
                    >
                      <Text
                        className="text-blue-500"
                        size="sm"
                        weight={600}
                        color="blue"
                      >
                        Add Non-Resident Guest
                      </Text>

                      <IconPlus className="w-5 h-5 text-blue-500"></IconPlus>
                    </Flex>

                    <Text
                      underline
                      className="cursor-pointer"
                      color="red"
                      size="sm"
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
                                      nonResidentGuests: [
                                        {
                                          id: uuidv4(),
                                          nonResident: "",
                                          guestType: "",
                                          description: "",
                                        },
                                      ],
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
                    >
                      Clear all
                    </Text>
                  </Flex>
                </Flex>
              </>
            )}
            {commonRoomResidentNamesWithDescription.length > 0 && (
              <>
                <Divider className="my-2"></Divider>

                <Flex direction="column" gap={5}>
                  <Text size="sm" mb={2} weight={600}>
                    Resident guests
                  </Text>
                  {room.residentGuests.map((guest, index) => (
                    <Flex key={index} gap={7} align={"center"}>
                      <Popover
                        width={150}
                        position="bottom-start"
                        arrowOffset={60}
                        withArrow
                        shadow="md"
                      >
                        <Popover.Target>
                          <Flex
                            justify={"space-between"}
                            align={"center"}
                            className="px-2 py-1 cursor-pointer border rounded-md border-solid w-[48%] border-gray-300"
                          >
                            <Flex direction="column" gap={4}>
                              <Text
                                size="xs"
                                weight={600}
                                className="text-gray-500"
                              >
                                Guest
                              </Text>
                              <Text
                                transform="capitalize"
                                size="sm"
                                weight={600}
                              >
                                {guest.resident
                                  ? guest.resident
                                  : "Select guest"}
                              </Text>
                            </Flex>

                            <IconSelector className="text-gray-500"></IconSelector>
                          </Flex>
                        </Popover.Target>

                        <Popover.Dropdown className="px-2 py-2">
                          {guestTypes.map((guestType, index) => (
                            <Flex
                              w="100%"
                              onClick={() => {
                                if (guest.resident === guestType) {
                                  deselectResidentGuest(guest);
                                } else {
                                  clickSelectResidentGuest(guest, guestType);
                                }
                              }}
                              key={index}
                            >
                              <Text
                                w="100%"
                                className={
                                  "py-2 px-2 rounded-md mt-1 cursor-pointer " +
                                  (guest.resident === guestType
                                    ? "bg-[#FA5252] text-white"
                                    : "hover:bg-gray-100")
                                }
                                size="sm"
                                weight={600}
                              >
                                {guestType}
                              </Text>
                            </Flex>
                          ))}
                        </Popover.Dropdown>
                      </Popover>

                      <Popover
                        width={300}
                        position="bottom-start"
                        arrowOffset={60}
                        withArrow
                        shadow="md"
                      >
                        <Popover.Target>
                          <Flex
                            justify={"space-between"}
                            align={"center"}
                            className="px-2 py-1 cursor-pointer border rounded-md border-solid w-[48%] border-gray-300"
                          >
                            <Flex direction="column" gap={4}>
                              <Text
                                size="xs"
                                weight={600}
                                className="text-gray-500"
                              >
                                Guest type
                              </Text>
                              <div className="w-[140px] overflow-hidden">
                                <Text
                                  transform="capitalize"
                                  size="sm"
                                  truncate
                                  weight={600}
                                >
                                  {guest.guestType
                                    ? guest.guestType
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
                                    setState(
                                      state.map((item) => {
                                        if (item.id === stay.id) {
                                          return {
                                            ...item,
                                            rooms: item.rooms.map((item) => {
                                              if (item.id === room.id) {
                                                return {
                                                  ...item,
                                                  residentGuests:
                                                    item.residentGuests.map(
                                                      (item) => {
                                                        if (
                                                          item.id === guest.id
                                                        ) {
                                                          return {
                                                            ...item,
                                                            guestType:
                                                              guestType?.name,
                                                          };
                                                        }
                                                        return item;
                                                      }
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
                                          (guest.guestType === guestType?.name
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
                                        (guest.guestType === guestType?.name
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

                      <div
                        onClick={() => {
                          removeResidentGuest(guest);
                        }}
                        className="mt-2 cursor-pointer"
                      >
                        {index > 0 && (
                          <IconX className="text-gray-600 w-5 h-5"></IconX>
                        )}
                      </div>
                    </Flex>
                  ))}
                  <Flex mt={5} pr={5} align="center" justify="space-between">
                    <Flex
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
                                      residentGuests: [
                                        ...item.residentGuests,
                                        {
                                          id: uuidv4(),
                                          resident: "",
                                          guestType: "",
                                          description: "",
                                        },
                                      ],
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
                      className="cursor-pointer w-fit"
                      align="center"
                      mt={5}
                      gap={4}
                    >
                      <Text
                        className="text-blue-500"
                        size="sm"
                        weight={600}
                        color="blue"
                      >
                        Add Resident Guest
                      </Text>

                      <IconPlus className="w-5 h-5 text-blue-500"></IconPlus>
                    </Flex>

                    <Text
                      underline
                      className="cursor-pointer"
                      color="red"
                      size="sm"
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
                                      residentGuests: [
                                        {
                                          id: uuidv4(),
                                          resident: "",
                                          guestType: "",
                                          description: "",
                                        },
                                      ],
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
                    >
                      Clear all
                    </Text>
                  </Flex>
                </Flex>
              </>
            )}
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
                <div className="w-[160px] overflow-hidden">
                  <Text truncate size="sm" weight={600}>
                    {numberOfSelectedFees > 0
                      ? `${numberOfSelectedFees} ${
                          numberOfSelectedFees === 1 ? "Selected" : "Selected"
                        }`
                      : "Add fees"}
                  </Text>
                </div>
              </Flex>

              <IconSelector className="text-gray-500"></IconSelector>
            </Flex>
          </Popover.Target>

          <Popover.Dropdown className="px-3">
            <Flex direction="column" gap={5}>
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

              <Divider mt={6} size="xs" />

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

      <div
        onClick={() => {
          clearFee();
        }}
        className="mt-5 cursor-pointer"
      >
        {index === 0 && hasContentInFirstFee && (
          <IconX className="text-gray-600"></IconX>
        )}
      </div>
    </div>
  );
}
