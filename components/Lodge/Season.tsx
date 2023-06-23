import { Context, StateType } from "@/context/LodgeDetailPage";
import { Season } from "@/context/LodgeDetailPage";
import {
  Accordion,
  Anchor,
  Flex,
  NumberInput,
  Text,
  TextInput,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import {
  IconCalendar,
  IconCheck,
  IconPencil,
  IconSelector,
  IconX,
} from "@tabler/icons-react";
import React, { useContext } from "react";

type SeasonPropTypes = {
  index: number;
  season: Season;
  active: number;
};

function Season({ index, season, active }: SeasonPropTypes) {
  const { state, setState } = useContext(Context);
  const [inlineEdit, setInlineEdit] = React.useState(false);
  const [showEdit, setShowEdit] = React.useState(false);

  const updateSeasonDates = (
    date: [Date | null, Date | null],
    seasonName: string,
    newState: StateType,
    dateIndex: number
  ): StateType => {
    const updatedPackages = newState.packages.map((pkg) => {
      const updatedSeasons: Season[] = pkg.seasons.map((season) => {
        if (
          season.name.toLowerCase().trim() === seasonName.toLowerCase().trim()
        ) {
          const updatedDate: [Date | null, Date | null][] = season.date.map(
            (existingDate, index) => {
              if (index === dateIndex) {
                return date;
              }
              return existingDate;
            }
          );
          const newSeason: Season = {
            ...season,
            date: updatedDate,
          };
          return newSeason;
        }
        return season;
      });
      return { ...pkg, seasons: updatedSeasons };
    });

    return { ...newState, packages: updatedPackages };
  };

  const addSeasonDates = (
    newDate: [Date | null, Date | null],
    seasonName: string,
    newState: StateType
  ): StateType => {
    const updatedPackages = newState.packages.map((pkg) => {
      const updatedSeasons: Season[] = pkg.seasons.map((season) => {
        if (season.name === seasonName) {
          const updatedDate = [...season.date, newDate];
          return { ...season, date: updatedDate };
        }
        return season;
      });
      return { ...pkg, seasons: updatedSeasons };
    });

    return { ...newState, packages: updatedPackages };
  };

  const removeSeasonDates = (
    seasonName: string,
    newState: StateType,
    index: number
  ): StateType => {
    const updatedPackages = newState.packages.map((pkg) => {
      const updatedSeasons = pkg.seasons.map((season) => {
        if (season.name === seasonName) {
          const updatedDate = season.date.filter((_, i) => i !== index);
          const clearDate: [Date | null, Date | null][] = [[null, null]];
          return {
            ...season,
            date: updatedDate.length === 0 ? clearDate : updatedDate,
          };
        }
        return season;
      });
      return { ...pkg, seasons: updatedSeasons };
    });

    return { ...newState, packages: updatedPackages };
  };

  const updateSeasonName = (
    oldSeasonName: string,
    newSeasonName: string,
    newState: StateType
  ): StateType => {
    const updatedPackages = newState.packages.map((pkg) => {
      const updatedSeasons: Season[] = pkg.seasons.map((season) => {
        if (
          season.name.toLowerCase().trim() ===
          oldSeasonName.toLowerCase().trim()
        ) {
          const updatedSeason: Season = {
            ...season,
            name: newSeasonName,
          };
          return updatedSeason;
        }
        return season;
      });
      return { ...pkg, seasons: updatedSeasons };
    });

    return { ...newState, packages: updatedPackages };
  };

  const removeSeason = (seasonName: string, newState: StateType): StateType => {
    const updatedPackages = newState.packages.map((pkg) => {
      const updatedSeasons: Season[] = pkg.seasons.filter((season) => {
        return (
          season.name.toLowerCase().trim() !== seasonName.toLowerCase().trim()
        );
      });
      return { ...pkg, seasons: updatedSeasons };
    });

    return { ...newState, packages: updatedPackages };
  };

  return (
    <Accordion.Item
      onMouseEnter={() => {
        setShowEdit(true);
      }}
      onMouseLeave={() => {
        setShowEdit(false);
      }}
      value={index.toString()}
    >
      <Flex align="center">
        <Accordion.Control>
          <Flex gap={4} align="center">
            {!inlineEdit && (
              <span className="font-semibold text-base">{season.name}</span>
            )}
            {inlineEdit && (
              <TextInput
                value={season.name}
                onBlur={() => {
                  setInlineEdit(false);
                }}
                onClick={(e) => {
                  e.stopPropagation();
                }}
                onChange={(e) => {
                  // const newPackages = [...state.packages];
                  // newPackages[active].seasons[index].name =
                  //   e.currentTarget.value;
                  // setState((prev) => ({ ...prev, packages: newPackages }));

                  const newState = updateSeasonName(
                    season.name,
                    e.currentTarget.value,
                    state
                  );
                  setState(newState);
                }}
              />
            )}
            {showEdit && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setInlineEdit(!inlineEdit);
                }}
                className="w-6 h-6 rounded-md bg-red-200 flex items-center justify-center"
              >
                {!inlineEdit && <IconPencil className="w-4 h-4"></IconPencil>}
                {inlineEdit && <IconCheck className="w-4 h-4"></IconCheck>}
              </div>
            )}
          </Flex>
        </Accordion.Control>

        {index > 1 && (
          <IconX
            size={20}
            color="red"
            className="cursor-pointer"
            onClick={() => {
              // const newPackages = [...state.packages];
              // newPackages[active].seasons.splice(index, 1);
              // setState((prev) => ({ ...prev, packages: newPackages }));

              const newState = removeSeason(season.name, state);
              setState(newState);
            }}
          />
        )}
      </Flex>

      <Accordion.Panel>
        <Text className="font-semibold" size={"sm"}>
          Pick date range
        </Text>

        <Flex direction="column" gap={6}>
          {season.date.map((date, dateIndex) => (
            <Flex align="center" gap={2} key={dateIndex}>
              <DatePickerInput
                type="range"
                value={date}
                onChange={(date) => {
                  // const newPackages = [...state.packages];
                  // newPackages[active].seasons[index].date[dateIndex] = date;
                  // setState((prev) => ({ ...prev, packages: newPackages }));

                  const updatedState = updateSeasonDates(
                    date,
                    season.name,
                    state,
                    dateIndex
                  );
                  setState(updatedState);
                }}
                color="red"
                placeholder="Select dates"
                styles={{ input: { paddingTop: 13, paddingBottom: 13 } }}
                labelProps={{ className: "font-semibold mb-1" }}
                rightSection={<IconSelector className="text-gray-500" />}
                className="max-w-fit min-w-[250px]"
                minDate={new Date()}
                icon={<IconCalendar className="text-gray-500" />}
                numberOfColumns={2}
                autoSave="true"
              />

              <IconX
                size={20}
                color="red"
                className="cursor-pointer"
                onClick={() => {
                  // if (dateIndex === 0) {
                  //   const newPackages = [...state.packages];
                  //   newPackages[active].seasons[index].date[dateIndex] = [
                  //     null,
                  //     null,
                  //   ];
                  //   setState((prev) => ({
                  //     ...prev,
                  //     packages: newPackages,
                  //   }));
                  // } else {
                  //   const newPackages = [...state.packages];
                  //   newPackages[active].seasons[index].date.splice(
                  //     dateIndex,
                  //     1
                  //   );
                  //   setState((prev) => ({
                  //     ...prev,
                  //     packages: newPackages,
                  //   }));
                  // }

                  const updatedState = removeSeasonDates(
                    season.name,
                    state,
                    dateIndex
                  );

                  setState(updatedState);
                }}
              />
            </Flex>
          ))}
        </Flex>

        <Anchor
          size="sm"
          type="button"
          color="blue"
          onClick={() => {
            // const newPackages = [...state.packages];
            // newPackages[active].seasons[index].date.push([null, null]);
            // setState((prev) => ({ ...prev, packages: newPackages }));

            const updatedState = addSeasonDates(
              [null, null],
              season.name,
              state
            );
            setState(updatedState);
          }}
        >
          Add another date
        </Anchor>

        <Flex mt={10} direction="column">
          <Flex className="w-full" direction="column" mt={10} gap={8}>
            <Flex className="w-full bg-gray-100 py-2.5 px-2" gap={8}>
              <Text w="50%" className="text-sm font-semibold">
                Guest Type
              </Text>
              <Text w="50%" className="text-sm font-semibold">
                Description
              </Text>
              <Text w="50%" className="text-sm font-semibold">
                Resident price(KES)
              </Text>
              <Text w="50%" className="text-sm font-semibold">
                Non-resident price($)
              </Text>
            </Flex>
            {season.guests.map((guest, guestIndex) => (
              <Flex className="w-full items-center" key={guestIndex} gap={8}>
                <Text className="w-[50%] truncate text-sm" color="dimmed">
                  {guest.guestType}
                </Text>

                <Text className="w-[50%] truncate text-sm" color="dimmed">
                  {guest.description ? guest.description : "---"}
                </Text>

                <NumberInput
                  hideControls
                  w="50%"
                  placeholder="eg. 2000"
                  value={guest.residentPrice}
                  onChange={(value) => {
                    const newPackages = [...state.packages];
                    newPackages[active].seasons[index].guests[
                      guestIndex
                    ].residentPrice = value;
                    setState((prev) => ({
                      ...prev,
                      packages: newPackages,
                    }));
                  }}
                  radius="sm"
                />

                <NumberInput
                  w="50%"
                  hideControls
                  placeholder="eg. 100"
                  value={guest.nonResidentPrice}
                  onChange={(value) => {
                    const newPackages = [...state.packages];
                    newPackages[active].seasons[index].guests[
                      guestIndex
                    ].nonResidentPrice = value;
                    setState((prev) => ({
                      ...prev,
                      packages: newPackages,
                    }));
                  }}
                  radius="sm"
                />
              </Flex>
            ))}
          </Flex>
        </Flex>
      </Accordion.Panel>
    </Accordion.Item>
  );
}

export default Season;
