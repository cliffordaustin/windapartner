import {
  AgentDiscountRateType,
  getRoomTypes,
  getRoomTypesWithStaySlug,
} from "@/pages/api/stays";
import { AgentStay, RoomType } from "@/utils/types";
import { format } from "date-fns";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import RoomTable from "./RoomTable";
import { DatePickerInput } from "@mantine/dates";
import { IconCalendar, IconSelector } from "@tabler/icons-react";
import {
  Flex,
  Popover,
  ScrollArea,
  Switch,
  Text,
  Tooltip,
} from "@mantine/core";

type AgentPriceTableType = {
  staySlug: string | null;
  agentRates: AgentDiscountRateType[] | undefined;
  displayRackRates: boolean;
  isNonResident: boolean;
  setIsNonResident: (isNonResident: boolean) => void;
};

export default function AgentPriceTable({
  staySlug,
  agentRates,
  displayRackRates,
  isNonResident,
  setIsNonResident,
}: AgentPriceTableType) {
  const [date, setDate] = useState<[Date | null, Date | null]>([
    new Date(),
    new Date(new Date().setDate(new Date().getDate() + 20)),
  ]);
  const queryStr = staySlug
    ? `${staySlug}-agent-price-table`
    : "room-type-agent-price-table";
  const {
    data: roomTypes,
    isLoading: roomTypesLoading,
    refetch,
  } = useQuery(
    queryStr,
    () =>
      getRoomTypesWithStaySlug(
        staySlug,
        format(date[0] || new Date(), "yyyy-MM-dd"),
        format(date[1] || new Date(), "yyyy-MM-dd")
      ),
    { enabled: false }
  );

  useEffect(() => {
    if (date[0] && date[1]) {
      refetch();
    }
  }, [staySlug, date]);

  const getAllGuestTypes = useCallback(
    (roomTypes: RoomType[]) => {
      const guestTypes: string[] = [];
      roomTypes.forEach((roomType) => {
        roomType.room_non_resident_availabilities.forEach((item) => {
          item.room_non_resident_guest_availabilities.map((item) => {
            if (item.name && !guestTypes.includes(item.name?.toLowerCase())) {
              guestTypes.push(item.name?.toLowerCase().trim());
            }
          });
        });
      });
      return guestTypes;
    },
    [roomTypes]
  );
  const allGuestTypes = getAllGuestTypes(roomTypes || []);

  const [guestType, setGuestType] = useState<string>(allGuestTypes[0]);

  useEffect(() => {
    const allGuestTypes = getAllGuestTypes(roomTypes || []);

    if (allGuestTypes.length > 0) {
      setGuestType(allGuestTypes[0]);
    }
  }, [roomTypes]);

  return (
    <div className="relative">
      <div className="flex items-center gap-4 justify-center mb-5">
        <DatePickerInput
          type="range"
          value={date}
          onChange={(date) => {
            setDate(date);
          }}
          color="red"
          label="Select date range"
          placeholder="Select dates"
          styles={{ input: { paddingTop: 13, paddingBottom: 13 } }}
          labelProps={{ className: "font-semibold mb-1" }}
          rightSection={<IconSelector className="text-gray-500" />}
          className="max-w-fit min-w-[250px] font-semibold"
          minDate={new Date()}
          icon={<IconCalendar className="text-gray-500" />}
          numberOfColumns={2}
          autoSave="true"
        />
        <Popover
          width={300}
          position="bottom-start"
          arrowOffset={60}
          withArrow
          shadow="md"
        >
          <Popover.Target>
            <div>
              <Text size="sm" className="mb-1" weight={600}>
                Guest type
              </Text>
              <Flex
                justify={"space-between"}
                align={"center"}
                className="px-2 py-[11px] cursor-pointer border rounded-sm border-solid w-[220px] border-gray-300"
              >
                <Flex direction="column" gap={4}>
                  <div className="w-[140px] overflow-hidden">
                    <Text
                      transform="capitalize"
                      size="sm"
                      truncate
                      weight={600}
                    >
                      {guestType ? guestType : "Select guest type"}
                    </Text>
                  </div>
                </Flex>

                <IconSelector className="text-gray-500"></IconSelector>
              </Flex>
            </div>
          </Popover.Target>

          <Popover.Dropdown className="px-0 py-2">
            <ScrollArea.Autosize
              type="auto"
              mah={300}
              offsetScrollbars={true}
              className="w-full pl-3"
            >
              {allGuestTypes.map((guest, index) => (
                <Flex
                  w="100%"
                  onClick={() => {
                    setGuestType(guest);
                  }}
                  key={index}
                >
                  <Text
                    w="100%"
                    className={
                      "py-2 px-2 rounded-md mt-1 cursor-pointer " +
                      (guestType === guest
                        ? "bg-[#FA5252] text-white"
                        : "hover:bg-gray-100")
                    }
                    size="sm"
                    weight={600}
                    transform="capitalize"
                  >
                    {guest}
                  </Text>
                </Flex>
              ))}
            </ScrollArea.Autosize>
          </Popover.Dropdown>
        </Popover>

        <Switch
          className="mt-[22px]"
          label="Non-resident"
          color="red"
          checked={isNonResident}
          onChange={(event) => setIsNonResident(event.currentTarget.checked)}
        />
      </div>
      {!roomTypesLoading && date[0] && date[1] && (
        <RoomTable
          roomTypes={roomTypes}
          isNonResident={isNonResident}
          guestType={guestType}
          agentRates={agentRates}
          displayRackRates={displayRackRates}
        />
      )}
    </div>
  );
}
