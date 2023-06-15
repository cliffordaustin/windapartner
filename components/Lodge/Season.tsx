import { Context } from "@/context/LodgeDetailPage";
import { Season } from "@/context/LodgeDetailPage";
import { Accordion, Flex, NumberInput, Text, TextInput } from "@mantine/core";
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
                  const newPackages = [...state.packages];
                  newPackages[active].seasons[index].name =
                    e.currentTarget.value;
                  setState((prev) => ({ ...prev, packages: newPackages }));
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
              const newPackages = [...state.packages];
              newPackages[active].seasons.splice(index, 1);
              setState((prev) => ({ ...prev, packages: newPackages }));
            }}
          />
        )}
      </Flex>

      <Accordion.Panel>
        <DatePickerInput
          type="range"
          value={season.date}
          onChange={(date) => {
            const newPackages = [...state.packages];
            newPackages[active].seasons[index].date = date;
            setState((prev) => ({ ...prev, packages: newPackages }));
          }}
          color="red"
          label="Pick date range"
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
