import {
  Context,
  NonResidentGuests,
  OtherFees,
  ParkFee,
  ResidentGuests,
  Room as StateRoomType,
  StateType,
} from "@/context/CalculatePage";
import { ParkFee as ParkFeeType } from "@/pages/api/stays";
import { getParkFees, getRoomTypes } from "@/pages/api/stays";
import pricing from "@/utils/calculation";
import {
  OtherFeesNonResident,
  OtherFeesResident,
  RoomType,
  AgentStay,
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
import { parse, format, add } from "date-fns";
import { Mixpanel } from "@/utils/mixpanelconfig";

type RoomProps = {
  room: StateRoomType;
  stay: AgentStay;
  index: number;
};

const guestClassName =
  "h-[35px] hover:bg-red-500 cursor-pointer hover:border-red-500 hover:text-white transition-all duration-300 flex text-gray-600 items-center justify-center w-[35px] border border-solid border-gray-400 ";

export default function Room({ room, stay, index }: RoomProps) {
  type SelectedPackagesType = {
    name: string;
    description: string | null;
  };
  const [selectedPackages, setSelectedPackages] = useState<
    SelectedPackagesType[]
  >([]);

  const { state, setState } = useContext(Context);

  type UniqueRoomsType = {
    name?: string;
    packages: string[];
    adult_capacity: number;
    child_capacity: number;
    infant_capacity: number;
  };

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

  const handleOtherFees = (
    e: React.ChangeEvent<HTMLInputElement>,
    fee: ParkFeeType
  ) => {
    if (e.target.checked) {
      const otherFee: OtherFees = {
        id: fee.id,
        name: fee.name || "",
        residentAdultPrice: Number(fee.resident_adult_price),
        residentChildPrice: Number(fee.resident_child_price),
        residentTeenPrice: Number(fee.resident_teen_price),
        nonResidentAdultPrice: Number(fee.non_resident_adult_price),
        nonResidentChildPrice: Number(fee.non_resident_child_price),
        nonResidentTeenPrice: Number(fee.non_resident_teen_price),
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
                    otherFees: [...item.otherFees, otherFee],
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
                    otherFees: item.otherFees.filter(
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

  const numberOfSelectedFees = room.otherFees.length;

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

  // console.log(roomTypes);
  // console.log(new Date());
  // console.log(currentState?.date[0]);
  // console.log(currentState?.date[1]);

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
        accumulator.push({
          name: current.name,
          adult_capacity: current.capacity,
          child_capacity: current.child_capacity,
          infant_capacity: current.infant_capacity,
          packages: [current.package],
        });
      }
      return accumulator;
    }, []) || [];

  function getPackagesForSelectedRoom(room: string): SelectedPackagesType[] {
    const roomName = room.toLowerCase()?.trim();
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
      if (guest.resident) {
        numGuests += guest.numberOfGuests;
      }
    }

    for (const guest of room.nonResidentGuests) {
      if (guest.nonResident) {
        numGuests += guest.numberOfGuests;
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
                      numberOfGuests: 1,
                      description: "",
                    },
                  ],
                  nonResidentGuests: [
                    {
                      id: uuidv4(),
                      nonResident: "",
                      numberOfGuests: 1,
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

  const clickSelectPackage = (selectPackage: string, description: string) => {
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
                  package_description: description,
                  residentGuests: [
                    {
                      id: uuidv4(),
                      resident: "",
                      numberOfGuests: 1,
                      guestType: "",
                      description: "",
                    },
                  ],
                  nonResidentGuests: [
                    {
                      id: uuidv4(),
                      nonResident: "",
                      numberOfGuests: 1,
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
                      numberOfGuests: 1,
                      guestType: "",
                      description: "",
                    },
                  ],
                  nonResidentGuests: [
                    {
                      id: uuidv4(),
                      nonResident: "",
                      numberOfGuests: 1,
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

  const addNumberOfNonResidentGuest = (guest: NonResidentGuests) => {
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
                        numberOfGuests: item.numberOfGuests + 1,
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

  const subtractNumberOfNonResidentGuest = (guest: NonResidentGuests) => {
    if (guest.numberOfGuests === 0) {
      return;
    }
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
                        numberOfGuests: item.numberOfGuests - 1,
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

  const addNumberOfResidentGuest = (guest: ResidentGuests) => {
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
                        numberOfGuests: item.numberOfGuests + 1,
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

  const subtractNumberOfResidentGuest = (guest: ResidentGuests) => {
    if (guest.numberOfGuests === 0) {
      return;
    }
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
                        numberOfGuests: item.numberOfGuests - 1,
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

  const { data: otherFees, isLoading: otherFeesLoading } = useQuery(
    `park-fees-${stay?.slug}`,
    () => getParkFees(stay)
  );

  const [isRoomOpen, setIsRoomOpen] = useState(false);
  const [isPackageOpen, setIsPackageOpen] = useState(false);

  return (
    <div className="flex gap-0.5 items-center">
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
              className="px-2 py-1 cursor-pointer rounded-l-md border border-solid w-[220px] border-gray-300"
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
              <div key={index}>
                {selectRoom.adult_capacity ||
                selectRoom.child_capacity ||
                selectRoom.infant_capacity ? (
                  <Tooltip.Floating
                    multiline
                    width={220}
                    color="white"
                    position="bottom"
                    className="text-gray-800 font-semibold border-gray-200 border border-solid"
                    label={
                      <div className="flex flex-col gap-2">
                        {selectRoom.adult_capacity && (
                          <Text size="sm" weight={600}>
                            Adult Capacity: {selectRoom.adult_capacity}
                          </Text>
                        )}
                        {selectRoom.child_capacity && (
                          <Text size="sm" weight={600}>
                            Child Capacity: {selectRoom.child_capacity}
                          </Text>
                        )}
                        {selectRoom.infant_capacity && (
                          <Text size="sm" weight={600}>
                            Infant Capacity: {selectRoom.infant_capacity}
                          </Text>
                        )}
                      </div>
                    }
                  >
                    <Flex
                      justify={"space-between"}
                      align={"center"}
                      onClick={() => {
                        if (selectRoom.name === room.name) {
                          deselectRoom();
                        } else {
                          clickSelectRoom(selectRoom);
                          Mixpanel.track("User selected a room", {
                            property: stay.property_name,
                            room: selectRoom.name,
                          });
                        }
                      }}
                      // onMouseUp={() => {
                      //   setIsRoomOpen(false);
                      // }}
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
                  </Tooltip.Floating>
                ) : (
                  <Flex
                    justify={"space-between"}
                    align={"center"}
                    onClick={() => {
                      if (selectRoom.name === room.name) {
                        deselectRoom();
                      } else {
                        clickSelectRoom(selectRoom);
                        Mixpanel.track("User selected a room", {
                          property: stay.property_name,
                          room: selectRoom.name,
                        });
                      }
                    }}
                    // onMouseUp={() => {
                    //   setIsRoomOpen(false);
                    // }}
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
                )}
              </div>
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
              className="px-2 py-1 cursor-pointer border-l-transparent border border-solid w-[220px] border-gray-300"
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
                  if (roomPackage.name === room.package) {
                    deselectPackage();
                  } else {
                    clickSelectPackage(
                      roomPackage.name,
                      roomPackage.description || ""
                    );

                    Mixpanel.track("User selected a package", {
                      property: stay.property_name,
                      room_package: roomPackage.name,
                    });
                  }
                }}
                // onMouseUp={() => {
                //   setIsPackageOpen(false);
                // }}
                className={
                  "rounded-md mt-1 cursor-pointer " +
                  (room.package === roomPackage.name
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

        <Popover
          width={470}
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
                                  Mixpanel.track("User selected a guest", {
                                    property: stay.property_name,
                                    guest: guestType,
                                  });
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
                        <Tooltip.Floating
                          multiline
                          width={220}
                          color="white"
                          position="bottom"
                          className="text-gray-800 font-semibold border-gray-200 border border-solid"
                          label={
                            guest.guestType
                              ? guest.guestType
                              : "Select a guest type"
                          }
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
                        </Tooltip.Floating>

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
                                    Mixpanel.track(
                                      "User selected a guest type",
                                      {
                                        property: stay.property_name,
                                        guest_type: guestType?.name,
                                      }
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

                      <Flex
                        h={50}
                        className="border rounded-md border-solid border-gray-300"
                        align="center"
                        justify="center"
                        gap={5}
                      >
                        <Container
                          w={15}
                          h={48}
                          className="flex hover:bg-gray-100 cursor-pointer rounded-l-md items-center justify-center"
                          onClick={() =>
                            subtractNumberOfNonResidentGuest(guest)
                          }
                        >
                          <Text className="text-2xl mb-1"> - </Text>
                        </Container>
                        <Text>{guest.numberOfGuests}</Text>
                        <Container
                          w={15}
                          h={48}
                          className="flex hover:bg-gray-100 cursor-pointer rounded-r-md items-center justify-center"
                          onClick={() => addNumberOfNonResidentGuest(guest)}
                        >
                          <Text className="text-2xl"> + </Text>
                        </Container>
                      </Flex>

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
                                          numberOfGuests: 1,
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
                                          numberOfGuests: 1,
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

                      <Flex
                        h={50}
                        className="border rounded-md border-solid border-gray-300"
                        align="center"
                        justify="center"
                        gap={5}
                      >
                        <Container
                          w={15}
                          h={48}
                          className="flex hover:bg-gray-100 cursor-pointer rounded-l-md items-center justify-center"
                          onClick={() => subtractNumberOfResidentGuest(guest)}
                        >
                          <Text className="text-2xl mb-1"> - </Text>
                        </Container>
                        <Text>{guest.numberOfGuests}</Text>
                        <Container
                          w={15}
                          h={48}
                          className="flex hover:bg-gray-100 cursor-pointer rounded-r-md items-center justify-center"
                          onClick={() => addNumberOfResidentGuest(guest)}
                        >
                          <Text className="text-2xl"> + </Text>
                        </Container>
                      </Flex>

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
                                          numberOfGuests: 1,
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
                                          numberOfGuests: 1,
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
              className="px-2 py-1 cursor-pointer rounded-r-md border-l border-l-transparent border border-solid w-[180px] border-gray-300"
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
                Park/conservancy fees
              </Text>

              {otherFees?.map((fee, index) => (
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
                      !!room.otherFees.find((item) => item.id === fee.id)
                    }
                    onClick={() => {
                      Mixpanel.track("User selected a fee", {
                        property: stay.property_name,
                        fee: fee.name,
                      });
                    }}
                    onChange={(event) => {
                      handleOtherFees(event, fee);
                    }}
                  ></Checkbox>
                </Flex>
              ))}

              {/* {stay.other_fees_non_resident.map(
                (fee, index) =>
                  !!(fee.adult_price || fee.child_price || fee.teen_price) && (
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
                    </Flex>
                  )
              )}

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
              ))} */}
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
