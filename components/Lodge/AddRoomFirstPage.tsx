import { Context, Guest } from "@/context/LodgeDetailPage";
import {
  Anchor,
  Container,
  Divider,
  Flex,
  NumberInput,
  Select,
  Text,
  TextInput,
} from "@mantine/core";
import { IconX } from "@tabler/icons-react";
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
      packages: updatedPackages,
    }));
  };

  const clearGuestsForZeroIndex = (index: number) => {
    const newGuests = [...state.guests];
    newGuests[index].guestType = "";
    newGuests[index].description = "";

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

    setState((prev) => ({ ...prev, packages: newPackages, guests: newGuests }));
  };

  const removeGuest = (index: number) => {
    const newGuests = state.guests.filter((_, i) => i !== index);

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

    setState((prev) => ({ ...prev, packages: newPackages, guests: newGuests }));
  };
  return (
    <Flex w={900} gap={35} mt={12} mx="auto">
      <Container className="w-[40%]">
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
            {state.packages.map((packageItem, index) => (
              <Flex align="center" gap={2} key={index}>
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
                    { value: "BED AND BREAKFAST", label: "Bed and Breakfast" },
                  ]}
                  radius="sm"
                />

                <IconX
                  size={20}
                  color="red"
                  className="cursor-pointer"
                  onClick={() => {
                    if (index === 0) {
                      // clear the name of the first package
                      const newPackages = [...state.packages];
                      newPackages[index].name = "";
                      setState((prev) => ({ ...prev, packages: newPackages }));
                    } else {
                      const newPackages = [...state.packages];
                      newPackages.splice(index, 1);
                      setState((prev) => ({ ...prev, packages: newPackages }));
                    }
                  }}
                />
              </Flex>
            ))}
            <Anchor
              size="sm"
              type="button"
              color="blue"
              onClick={() =>
                setState((prev) => ({
                  ...prev,
                  packages: [
                    ...prev.packages,
                    {
                      name: "",
                      seasons: [
                        {
                          date: [null, null],
                          name: "High Season",
                          guests: [
                            {
                              guestType: "",
                              description: "",
                              residentPrice: "",
                              nonResidentPrice: "",
                            },
                          ],
                        },

                        {
                          date: [null, null],
                          name: "Low Season",
                          guests: [
                            {
                              guestType: "",
                              description: "",
                              residentPrice: "",
                              nonResidentPrice: "",
                            },
                          ],
                        },
                      ],
                    },
                  ],
                }))
              }
            >
              Add another package
            </Anchor>
          </Flex>
        </Flex>
      </Container>

      <Divider orientation="vertical" />

      <Container className="w-[60%]">
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

              <IconX
                size={20}
                color="red"
                className="cursor-pointer mt-6"
                onClick={() => {
                  if (index === 0) {
                    clearGuestsForZeroIndex(index);
                  } else {
                    removeGuest(index);
                  }
                }}
              />
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
    </Flex>
  );
}

export default AddRoomFirstPage;
