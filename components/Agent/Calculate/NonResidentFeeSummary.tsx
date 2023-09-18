import { RoomType } from "@/utils/types";
import { Room } from "@/context/CalculatePage";
import { Text } from "@mantine/core";
import pricing from "@/utils/calculation";

type FeesSummaryProps = {
  rooms: Room[];
  nights: number;
  summarizedCalculation?: boolean;
};

export default function NonResidentFeesSummary({
  rooms,
  nights,
  summarizedCalculation,
}: FeesSummaryProps) {
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
            {!summarizedCalculation && (
              <Text size="sm" className="text-gray-600" weight={500}>
                $
                {(
                  pricing.getNonResidentTotalPriceOtherFee(rooms, item) * nights
                ).toLocaleString(undefined, {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                })}
              </Text>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
