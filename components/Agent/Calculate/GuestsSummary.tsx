import { Context, GuestTotal, Room } from "@/context/CalculatePage";
import { AgentDiscountRateType } from "@/pages/api/stays";
import pricing from "@/utils/calculation";
import { RoomType } from "@/utils/types";
import { Divider, Flex, Text } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import { useContext, useEffect } from "react";

type GuestsSummaryProps = {
  room: Room;
  roomTypes: RoomType[] | undefined;
  index: number;
  includeClientInCalculation?: boolean;
  commission?: number;
  summarizedCalculation?: boolean;
  agentRates: AgentDiscountRateType[] | undefined;
};

export default function GuestsSummary({
  room,
  roomTypes,
  index,
  includeClientInCalculation,
  commission,
  summarizedCalculation,
  agentRates,
}: GuestsSummaryProps) {
  const countResidentGuestTypes = pricing.countResidentGuestTypesWithPrice(
    room.residentGuests,
    room,
    roomTypes,
    agentRates
  );

  return (
    <div className="mt-3">
      <Text size="sm" weight={600}>
        {index + 1}. {room.name} -{" "}
        {room.package.charAt(0).toUpperCase() +
          room.package.slice(1).toLowerCase()}
      </Text>

      {room.package_description &&
        countResidentGuestTypes.length > 0 &&
        (summarizedCalculation || includeClientInCalculation) && (
          <Flex my={6} align="center" gap={5}>
            <Text size="sm" className="text-gray-600 whitespace-pre-wrap">
              {room.package_description}
            </Text>
          </Flex>
        )}

      <Divider className="my-4" />

      <div className="ml-1 mt-3 flex flex-col gap-1">
        {countResidentGuestTypes.map((guestType, index) => (
          <Flex key={index} align="center" justify="space-between">
            <Text className="text-gray-600" size="sm">
              {guestType.name}
            </Text>
            {!summarizedCalculation && (
              <Text className="text-gray-600" size="sm">
                KES
                {guestType.price &&
                  pricing
                    .clientIncludedInPrice(
                      guestType.price,
                      !!includeClientInCalculation,
                      commission || 0
                    )
                    .toLocaleString()}
              </Text>
            )}
          </Flex>
        ))}
        {countResidentGuestTypes.length === 0 && (
          <Text className="text-gray-600" size="sm">
            No resident guests
          </Text>
        )}
      </div>
    </div>
  );
}
