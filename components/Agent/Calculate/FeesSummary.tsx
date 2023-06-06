import { RoomType } from "@/utils/types";
import { Room } from "@/context/CalculatePage";
import { Text } from "@mantine/core";
import pricing from "@/utils/calculation";

type FeesSummaryProps = {
  rooms: Room[];
  nights: number;
};

export default function FeesSummary({ rooms, nights }: FeesSummaryProps) {
  const totalGuests = pricing.getTotalGuestsByCategory(rooms);

  const findUniqueFees = pricing.findUniqueFees(rooms);

  return (
    <div>
      <div className="flex flex-col gap-1 ml-1">
        {findUniqueFees.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <Text size="sm" className="text-gray-600" weight={500}>
              {item.name}
            </Text>
            <Text size="sm" className="text-gray-600" weight={500}>
              KES
              {(
                pricing.getResidentTotalPriceOtherFee(rooms, item) * nights
              ).toLocaleString()}
            </Text>
          </div>
        ))}
      </div>
    </div>
  );
}
