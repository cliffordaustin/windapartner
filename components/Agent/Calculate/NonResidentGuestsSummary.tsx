import { Context, GuestTotal, Room } from "@/context/CalculatePage";
import pricing from "@/utils/calculation";
import { RoomType } from "@/utils/types";
import { Flex, Text } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import { useContext, useEffect } from "react";

type GuestsSummaryProps = {
  room: Room;
  roomTypes: RoomType[] | undefined;
  index: number;
  includeClientInCalculation?: boolean;
  commission?: number;
  summarizedCalculation?: boolean;
};

export default function NonResidentGuestsSummary({
  room,
  roomTypes,
  index,
  includeClientInCalculation,
  commission,
  summarizedCalculation,
}: GuestsSummaryProps) {
  const countNonResidentGuestTypes =
    pricing.countNonResidentGuestTypesWithPrice(
      room.nonResidentGuests,
      room,
      roomTypes
    );

  return (
    <div className="mt-3">
      <Text size="sm" weight={600}>
        {index + 1}. {room.name} -{" "}
        {room.package.charAt(0).toUpperCase() +
          room.package.slice(1).toLowerCase()}
      </Text>
      {room.package_description &&
        countNonResidentGuestTypes.length > 0 &&
        (summarizedCalculation || includeClientInCalculation) && (
          <Flex my={6} align="center" gap={5}>
            <IconInfoCircle size={16} color="gray"></IconInfoCircle>{" "}
            <Text size="sm" className="text-gray-600">
              <span>{room.package_description}</span>
            </Text>
          </Flex>
        )}

      <div className="ml-1 mt-3 flex flex-col gap-1">
        {countNonResidentGuestTypes.map((guestType, index) => (
          <Flex key={index} align="center" justify="space-between">
            <Text className="text-gray-600" size="sm">
              {guestType.name}
            </Text>
            {!summarizedCalculation && (
              <Text className="text-gray-600" size="sm">
                $
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

            {countNonResidentGuestTypes.length === 0 && (
              <Text className="text-gray-600" size="sm">
                No non-resident guests
              </Text>
            )}
          </Flex>
        ))}
      </div>
    </div>
  );
}
