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
import { format } from "date-fns";
import React, { useContext } from "react";

type SeasonPropTypes = {
  index: number;
  season: Season;
  active: number;
};

function Season({ index, season, active }: SeasonPropTypes) {
  const { state, setState } = useContext(Context);

  const updateResidentPrice = (
    value: number | "",
    guestIndex: number,
    seasonName: string
  ) => {
    const updatedPackages = state.packages.map((pkg) => {
      const updatedSeasons: Season[] = pkg.seasons.map((season) => {
        if (
          season.name === seasonName &&
          state.packages[active].name === pkg.name
        ) {
          const updatedGuests = season.guests.map((guest, index) => {
            if (index === guestIndex) {
              return { ...guest, residentPrice: value };
            }
            return guest;
          });
          return { ...season, guests: updatedGuests };
        }
        return season;
      });
      return { ...pkg, seasons: updatedSeasons };
    });

    setState({ ...state, packages: updatedPackages });
  };

  const updateNonResidentPrice = (
    value: number | "",
    guestIndex: number,
    seasonName: string
  ) => {
    const updatedPackages = state.packages.map((pkg) => {
      const updatedSeasons: Season[] = pkg.seasons.map((season) => {
        if (
          season.name === seasonName &&
          state.packages[active].name === pkg.name
        ) {
          const updatedGuests = season.guests.map((guest, index) => {
            if (index === guestIndex) {
              return { ...guest, nonResidentPrice: value };
            }
            return guest;
          });
          return { ...season, guests: updatedGuests };
        }
        return season;
      });
      return { ...pkg, seasons: updatedSeasons };
    });

    setState({ ...state, packages: updatedPackages });
  };

  return (
    <Accordion.Item value={index.toString()}>
      <Flex align="center">
        <Accordion.Control>
          <Flex gap={4} align="center">
            <span className="font-semibold text-base">{season.name}</span>
          </Flex>
        </Accordion.Control>
      </Flex>

      <Accordion.Panel>
        <Flex direction="column" gap={6}>
          {season.date.length === 1 &&
          (!season.date[0][0] || !season.date[0][1]) ? (
            <Text className="font-semibold text-gray-700" size={"sm"}>
              No dates selected
            </Text>
          ) : (
            season.date.map((date, dateIndex) => (
              <div key={dateIndex}>
                {date[0] && date[1] && (
                  <Text className="font-semibold text-gray-700" size={"sm"}>
                    {format(date[0], "dd MMMM")} -{" "}
                    {format(date[1], "dd MMMM yyyy")}
                  </Text>
                )}
              </div>
            ))
          )}
        </Flex>

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
                    updateResidentPrice(value, guestIndex, season.name);
                  }}
                  radius="sm"
                />

                <NumberInput
                  w="50%"
                  hideControls
                  placeholder="eg. 100"
                  value={guest.nonResidentPrice}
                  onChange={(value) => {
                    updateNonResidentPrice(value, guestIndex, season.name);
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
