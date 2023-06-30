import { Context, Guest, Package, Season } from "@/context/LodgeDetailPage";
import {
  Accordion,
  AccordionControlProps,
  ActionIcon,
  Anchor,
  Box,
  Container,
  Divider,
  Flex,
  NumberInput,
  ScrollArea,
  Select,
  Text,
  TextInput,
  Textarea,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { IconCalendar, IconSelector, IconX } from "@tabler/icons-react";
import React, { useContext } from "react";

function AddRoomFirstPage() {
  const { state, setState } = useContext(Context);

  const updateGuestType = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const updatedGuests = [...state.guests];
    updatedGuests[index] = {
      ...updatedGuests[index],
      guestType: event.target.value,
    };

    const updateSeasons = state.seasons.map((season) => {
      const updatedGuests = season.guests.map((g, i) => {
        if (i === index) {
          return {
            ...g,
            guestType: event.target.value,
          };
        }
        return g;
      });

      return {
        ...season,
        guests: updatedGuests,
      };
    });

    const updatedPackages = state.packages.map((pkg) => {
      const updatedSeasons = pkg.seasons.map((season) => {
        const updatedGuests = season.guests.map((g, i) => {
          if (i === index) {
            return {
              ...g,
              guestType: event.target.value,
            };
          }
          return g;
        });

        return {
          ...season,
          guests: updatedGuests,
        };
      });

      return {
        ...pkg,
        seasons: updatedSeasons,
      };
    });

    setState((prevState) => ({
      ...prevState,
      guests: updatedGuests,
      seasons: updateSeasons,
      packages: updatedPackages,
    }));
  };

  const updateGuestDescription = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const updatedGuests = [...state.guests];
    updatedGuests[index] = {
      ...updatedGuests[index],
      description: event.target.value,
    };

    const updateSeasons = state.seasons.map((season) => {
      const updatedGuests = season.guests.map((g, i) => {
        if (i === index) {
          return {
            ...g,
            description: event.target.value,
          };
        }
        return g;
      });

      return {
        ...season,
        guests: updatedGuests,
      };
    });

    const updatedPackages = state.packages.map((pkg) => {
      const updatedSeasons = pkg.seasons.map((season) => {
        const updatedGuests = season.guests.map((g, i) => {
          if (i === index) {
            return {
              ...g,
              description: event.target.value,
            };
          }
          return g;
        });

        return {
          ...season,
          guests: updatedGuests,
        };
      });

      return {
        ...pkg,
        seasons: updatedSeasons,
      };
    });

    setState((prevState) => ({
      ...prevState,
      guests: updatedGuests,
      seasons: updateSeasons,
      packages: updatedPackages,
    }));
  };

  const addGuest = () => {
    const newGuest: Guest = {
      guestType: "",
      description: "",
      residentPrice: "",
      nonResidentPrice: "",
    };

    const updatedGuests = [...state.guests, newGuest];

    const updatedSeasons = state.seasons.map((season) => {
      return {
        ...season,
        guests: [...season.guests, newGuest],
      };
    });

    const updatedPackages = state.packages.map((pkg) => {
      const updatedSeasons = pkg.seasons.map((season) => {
        return {
          ...season,
          guests: [...season.guests, newGuest],
        };
      });

      return {
        ...pkg,
        seasons: updatedSeasons,
      };
    });

    setState((prevState) => ({
      ...prevState,
      guests: updatedGuests,
      seasons: updatedSeasons,
      packages: updatedPackages,
    }));
  };

  const clearGuestsForZeroIndex = (index: number) => {
    const newGuests = [...state.guests];
    newGuests[index].guestType = "";
    newGuests[index].description = "";

    const updateSeason = state.seasons.map((season) => {
      const updatedGuests = season.guests.map((g, i) => {
        if (i === index) {
          return {
            ...g,
            guestType: "",
            description: "",
          };
        }
        return g;
      });

      return {
        ...season,
        guests: updatedGuests,
      };
    });

    const newPackages = state.packages.map((pkg) => {
      const newSeasons = pkg.seasons.map((season) => {
        const newGuests = season.guests.map((g, i) => {
          if (i === index) {
            return {
              ...g,
              guestType: "",
              description: "",
            };
          }
          return g;
        });

        return {
          ...season,
          guests: newGuests,
        };
      });

      return {
        ...pkg,
        seasons: newSeasons,
      };
    });

    setState((prev) => ({
      ...prev,
      packages: newPackages,
      seasons: updateSeason,
      guests: newGuests,
    }));
  };

  const removeGuest = (index: number) => {
    const newGuests = state.guests.filter((_, i) => i !== index);

    const updateSeason = state.seasons.map((season) => {
      const updatedGuests = season.guests.filter((_, i) => i !== index);

      return {
        ...season,
        guests: updatedGuests,
      };
    });

    const newPackages = state.packages.map((pkg) => {
      const newSeasons = pkg.seasons.map((season) => {
        const newGuests = season.guests.filter((_, i) => i !== index);

        return {
          ...season,
          guests: newGuests,
        };
      });

      return {
        ...pkg,
        seasons: newSeasons,
      };
    });

    setState((prev) => ({
      ...prev,
      packages: newPackages,
      seasons: updateSeason,
      guests: newGuests,
    }));
  };

  const addPackage = () => {
    const newPackage: Package = {
      name: "",
      description: "",
      seasons: state.seasons.map((season) => ({
        ...season,
      })),
    };

    setState((prev) => ({
      ...prev,
      packages: [...prev.packages, newPackage],
    }));
  };

  const updateSeasonName = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const updatedSeasons = [...state.seasons];
    updatedSeasons[index] = {
      ...updatedSeasons[index],
      name: event.target.value,
    };
    const updatedPackages = state.packages.map((pkg) => {
      const updatedSeasons = pkg.seasons.map((season, i) => {
        if (index === i) {
          return {
            ...season,
            name: event.target.value,
          };
        }
        return season;
      });

      return {
        ...pkg,
        seasons: updatedSeasons,
      };
    });

    setState((prev) => ({
      ...prev,
      seasons: updatedSeasons,
      packages: updatedPackages,
    }));
  };

  const updateSeasonDate = (
    date: [Date | null, Date | null],
    index: number,
    dateIndex: number
  ) => {
    const updatedSeasons = [...state.seasons];
    updatedSeasons[index] = {
      ...updatedSeasons[index],
      date: updatedSeasons[index].date.map((d, i) => {
        if (i === dateIndex) {
          return date;
        }
        return d;
      }),
    };

    const updatedPackages = state.packages.map((pkg) => {
      const updatedSeasons = pkg.seasons.map((season, i) => {
        if (index === i) {
          return {
            ...season,
            date: season.date.map((d, i) => {
              if (i === dateIndex) {
                return date;
              }
              return d;
            }),
          };
        }
        return season;
      });

      return {
        ...pkg,
        seasons: updatedSeasons,
      };
    });

    setState((prev) => ({
      ...prev,
      seasons: updatedSeasons,
      packages: updatedPackages,
    }));
  };

  const clearSeasonDate = (index: number, dateIndex: number) => {
    // if dateIndex is 0, set the date to [null, null], else remove the date
    const seletedSeason = state.seasons[index];
    if (seletedSeason.date.length === 1) {
      const updatedSeasons = [...state.seasons];
      updatedSeasons[index] = {
        ...updatedSeasons[index],
        date: [[null, null]],
      };

      const updatedPackages = state.packages.map((pkg) => {
        const updatedSeasons: Season[] = pkg.seasons.map((season, i) => {
          if (index === i) {
            return {
              ...season,
              date: [[null, null]],
            };
          }
          return season;
        });

        return {
          ...pkg,
          seasons: updatedSeasons,
        };
      });

      setState((prev) => ({
        ...prev,
        seasons: updatedSeasons,
        packages: updatedPackages,
      }));
    } else {
      const updatedSeasons = [...state.seasons];
      updatedSeasons[index] = {
        ...updatedSeasons[index],
        date: updatedSeasons[index].date.filter((_, i) => i !== dateIndex),
      };

      const updatedPackages = state.packages.map((pkg) => {
        const updatedSeasons: Season[] = pkg.seasons.map((season, i) => {
          if (index === i) {
            return {
              ...season,
              date: season.date.filter((_, i) => i !== dateIndex),
            };
          }
          return season;
        });

        return {
          ...pkg,
          seasons: updatedSeasons,
        };
      });

      setState((prev) => ({
        ...prev,
        seasons: updatedSeasons,
        packages: updatedPackages,
      }));
    }
  };

  const addSeasonDate = (index: number) => {
    const updatedSeasons = [...state.seasons];
    updatedSeasons[index] = {
      ...updatedSeasons[index],
      date: [...updatedSeasons[index].date, [null, null]],
    };

    const updatedPackages = state.packages.map((pkg) => {
      const updatedSeasons: Season[] = pkg.seasons.map((season, i) => {
        if (index === i) {
          return {
            ...season,
            date: [...season.date, [null, null]],
          };
        }
        return season;
      });

      return {
        ...pkg,
        seasons: updatedSeasons,
      };
    });

    setState((prev) => ({
      ...prev,
      seasons: updatedSeasons,
      packages: updatedPackages,
    }));
  };

  const addSeason = () => {
    const newSeason: Season = {
      name: "",
      date: [[null, null]],
      guests: state.guests.map((guest) => ({ ...guest })),
    };

    const updatedPackages = state.packages.map((pkg) => {
      return {
        ...pkg,
        seasons: [...pkg.seasons, newSeason],
      };
    });

    setState((prev) => ({
      ...prev,
      seasons: [...prev.seasons, newSeason],
      packages: updatedPackages,
    }));
  };

  const removeSeason = (index: number) => {
    const updatedSeasons = state.seasons.filter((_, i) => i !== index);
    const updatedPackages = state.packages.map((pkg) => {
      return {
        ...pkg,
        seasons: pkg.seasons.filter((_, i) => i !== index),
      };
    });

    setState((prev) => ({
      ...prev,
      seasons: updatedSeasons,
      packages: updatedPackages,
    }));
  };

  const clearSeasonsForZeroIndex = (index: number) => {
    const updatedSeasons = [...state.seasons];
    updatedSeasons[index] = {
      ...updatedSeasons[index],
      name: "",
      date: [[null, null]],
    };

    const updatedPackages = state.packages.map((pkg) => {
      const updatedSeasons: Season[] = pkg.seasons.map((season, i) => {
        if (index === i) {
          return {
            ...season,
            name: "",
            date: [[null, null]],
          };
        }
        return season;
      });

      return {
        ...pkg,
        seasons: updatedSeasons,
      };
    });

    setState((prev) => ({
      ...prev,
      seasons: updatedSeasons,
      packages: updatedPackages,
    }));
  };
  return (
    <Flex w={900} gap={35} mt={12} mx="auto">
      <ScrollArea className="w-[40%] h-[80vh]" type="never">
        <Container>
          <Text weight={700} size="md">
            Room
          </Text>

          <Flex direction="column" mt={10} gap={4}>
            <TextInput
              label="Room name"
              placeholder="eg. Standard Room"
              value={state.name}
              onChange={(event) => {
                const name = event.currentTarget.value;
                setState((prev) => ({
                  ...prev,
                  name: name,
                }));
              }}
              radius="sm"
            />

            <NumberInput
              label="Adult capacity"
              placeholder="eg. 2"
              value={state.adult_capacity}
              onChange={(value) =>
                setState((prev) => ({ ...prev, adult_capacity: value }))
              }
              radius="sm"
            />

            <NumberInput
              label="Child capacity"
              placeholder="eg. 1"
              value={state.child_capacity}
              onChange={(value) =>
                setState((prev) => ({ ...prev, child_capacity: value }))
              }
              radius="sm"
            />

            <NumberInput
              label="Infant capacity"
              placeholder="eg. 1"
              value={state.infant_capacity}
              onChange={(value) =>
                setState((prev) => ({ ...prev, infant_capacity: value }))
              }
              radius="sm"
            />

            <Flex direction="column" gap={6}>
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
                defaultValue="0"
                variant="contained"
              >
                {state.packages.map((packageItem, index) => (
                  <Accordion.Item value={index.toString()} key={index}>
                    <Flex align="center" gap={5}>
                      <Accordion.Control>
                        <Select
                          value={packageItem.name}
                          onChange={(value) => {
                            const newPackages = [...state.packages];
                            newPackages[index].name = value;
                            setState((prev) => ({
                              ...prev,
                              packages: newPackages,
                            }));
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          placeholder="Select one"
                          className="w-full"
                          data={[
                            { value: "ALL INCLUSIVE", label: "All Inclusive" },
                            { value: "FULL BOARD", label: "Full Board" },
                            { value: "GAME PACKAGE", label: "Game Package" },
                            { value: "HALF BOARD", label: "Half Board" },
                            {
                              value: "BED AND BREAKFAST",
                              label: "Bed and Breakfast",
                            },
                          ]}
                          radius="sm"
                        />
                      </Accordion.Control>
                      <div
                        onClick={() => {
                          if (state.packages.length === 1) {
                            // clear the name of the first package
                            const newPackages = [...state.packages];
                            newPackages[index].name = "";
                            newPackages[index].description = "";
                            setState((prev) => ({
                              ...prev,
                              packages: newPackages,
                            }));
                          } else {
                            const newPackages = [...state.packages];
                            newPackages.splice(index, 1);
                            setState((prev) => ({
                              ...prev,
                              packages: newPackages,
                            }));
                          }
                        }}
                        className="w-7 h-7 flex mr-2 items-center hover:bg-gray-200 cursor-pointer justify-center bg-gray-100 rounded-md"
                      >
                        <IconX
                          size={20}
                          color="gray"
                          className="cursor-pointer"
                        />
                      </div>
                    </Flex>
                    <Accordion.Panel>
                      <Textarea
                        placeholder="Describe the package"
                        label="Description"
                        value={packageItem.description}
                        onChange={(event) => {
                          const newPackages = [...state.packages];
                          newPackages[index].description =
                            event.currentTarget.value;
                          setState((prev) => ({
                            ...prev,
                            packages: newPackages,
                          }));
                        }}
                      />
                    </Accordion.Panel>
                    {/* <Flex align="center" gap={5} key={index}>
                  <Select
                    value={packageItem.name}
                    onChange={(value) => {
                      const newPackages = [...state.packages];
                      newPackages[index].name = value;
                      setState((prev) => ({ ...prev, packages: newPackages }));
                    }}
                    placeholder="Select one"
                    className="w-full"
                    data={[
                      { value: "ALL INCLUSIVE", label: "All Inclusive" },
                      { value: "FULL BOARD", label: "Full Board" },
                      { value: "GAME PACKAGE", label: "Game Package" },
                      { value: "HALF BOARD", label: "Half Board" },
                      {
                        value: "BED AND BREAKFAST",
                        label: "Bed and Breakfast",
                      },
                    ]}
                    radius="sm"
                  />
                  <div
                    onClick={() => {
                      if (state.packages.length === 1) {
                        // clear the name of the first package
                        const newPackages = [...state.packages];
                        newPackages[index].name = "";
                        setState((prev) => ({
                          ...prev,
                          packages: newPackages,
                        }));
                      } else {
                        const newPackages = [...state.packages];
                        newPackages.splice(index, 1);
                        setState((prev) => ({
                          ...prev,
                          packages: newPackages,
                        }));
                      }
                    }}
                    className="w-7 h-7 flex items-center hover:bg-gray-200 cursor-pointer justify-center bg-gray-100 rounded-md"
                  >
                    <IconX size={20} color="gray" className="cursor-pointer" />
                  </div>
                </Flex> */}
                  </Accordion.Item>
                ))}
              </Accordion>
              <Anchor
                size="sm"
                type="button"
                color="blue"
                onClick={() => {
                  addPackage();
                }}
              >
                Add another package
              </Anchor>
            </Flex>
          </Flex>
        </Container>
      </ScrollArea>

      <Divider orientation="vertical" />
      <ScrollArea className="w-[60%] h-[80vh]" type="never">
        <Container>
          <Text weight={700} size="md">
            Guest Types
          </Text>

          <Flex className="w-full" direction="column" mt={10} gap={4}>
            {state.guests.map((guest, index) => (
              <Flex align="center" className="w-full" key={index} gap={8}>
                <TextInput
                  label="Guest Type"
                  placeholder="eg. Per Person Sharing"
                  className="w-[50%]"
                  value={guest.guestType}
                  onChange={(event) => {
                    updateGuestType(event, index);
                  }}
                  radius="sm"
                />

                <TextInput
                  label="Description"
                  placeholder="Describe the guest type"
                  className="w-[50%]"
                  value={guest.description}
                  onChange={(event) => {
                    updateGuestDescription(event, index);
                  }}
                  radius="sm"
                />
                <div
                  onClick={() => {
                    if (state.guests.length === 1) {
                      clearGuestsForZeroIndex(index);
                    } else {
                      removeGuest(index);
                    }
                  }}
                  className="w-7 h-7 flex mt-[22px] items-center hover:bg-gray-200 cursor-pointer justify-center bg-gray-100 rounded-md"
                >
                  <IconX size={20} color="gray" className="cursor-pointer" />
                </div>
              </Flex>
            ))}

            <Anchor
              size="sm"
              type="button"
              color="blue"
              onClick={() => {
                addGuest();
              }}
            >
              Add another guest type
            </Anchor>
          </Flex>
        </Container>

        <Divider my={18} />

        <Container>
          <Text weight={700} size="md">
            Seasons
          </Text>

          <Flex direction="column" mt={10} gap={4}>
            <Accordion
              onKeyUpCapture={(e) => {
                e.preventDefault();
              }}
              classNames={{
                control: "hover:bg-gray-50 h-[55px]",
              }}
              chevronPosition="left"
              mb={10}
              defaultValue="0"
              variant="contained"
            >
              {state.seasons.map((season, index) => (
                <Accordion.Item value={index.toString()} key={index}>
                  <Flex direction="column" className="w-full" gap={8}>
                    <Flex align="center">
                      <Accordion.Control>
                        <TextInput
                          value={season.name}
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          onChange={(event) => {
                            updateSeasonName(event, index);
                          }}
                          className="w-full"
                          placeholder="eg. High Season"
                        />
                      </Accordion.Control>
                      <Box
                        mr={3}
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        <ActionIcon
                          onClick={() => {
                            if (state.seasons.length === 1) {
                              clearSeasonsForZeroIndex(index);
                            } else {
                              removeSeason(index);
                            }
                          }}
                          size="lg"
                          className="hover:bg-gray-100"
                        >
                          <IconX
                            size={20}
                            color="gray"
                            className="cursor-pointer"
                          />
                        </ActionIcon>
                      </Box>
                    </Flex>

                    <Accordion.Panel>
                      <Flex direction="column" gap={6}>
                        {season.date.map((date, dateIndex) => (
                          <Flex align="center" gap={5} key={dateIndex}>
                            <DatePickerInput
                              type="range"
                              value={date}
                              onChange={(date) => {
                                updateSeasonDate(date, index, dateIndex);
                              }}
                              color="red"
                              placeholder="Select dates"
                              styles={{
                                input: { paddingTop: 13, paddingBottom: 13 },
                              }}
                              labelProps={{ className: "font-semibold mb-1" }}
                              rightSection={
                                <IconSelector className="text-gray-500" />
                              }
                              className="max-w-fit min-w-[250px]"
                              minDate={new Date()}
                              icon={<IconCalendar className="text-gray-500" />}
                              numberOfColumns={2}
                              autoSave="true"
                              dropdownType="modal"
                              modalProps={{
                                closeOnClickOutside: true,
                                overlayProps: {
                                  color: "#333",
                                  opacity: 0.4,
                                  zIndex: 201,
                                },
                              }}
                            />

                            <div
                              onClick={() => {
                                clearSeasonDate(index, dateIndex);
                              }}
                              className="w-7 h-7 flex items-center hover:bg-gray-200 cursor-pointer justify-center bg-gray-100 rounded-md"
                            >
                              <IconX
                                size={20}
                                color="gray"
                                className="cursor-pointer"
                              />
                            </div>
                          </Flex>
                        ))}
                      </Flex>

                      <Anchor
                        size="sm"
                        type="button"
                        color="blue"
                        onClick={() => {
                          addSeasonDate(index);
                        }}
                      >
                        Add another date
                      </Anchor>
                    </Accordion.Panel>
                  </Flex>
                </Accordion.Item>
              ))}
            </Accordion>

            <Flex justify="space-between" mb={4}>
              <div></div>
              <Anchor
                size="sm"
                type="button"
                color="blue"
                onClick={() => {
                  addSeason();
                }}
              >
                Add another season
              </Anchor>
            </Flex>
          </Flex>
        </Container>
      </ScrollArea>
    </Flex>
  );
}

export default AddRoomFirstPage;
