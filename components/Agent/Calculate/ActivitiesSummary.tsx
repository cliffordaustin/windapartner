import { ActivityFee } from "@/context/CalculatePage";
import { Text } from "@mantine/core";
import pricing from "@/utils/calculation";

type FeesSummaryProps = {
  activity: ActivityFee;
  numberOfGuests: number;
  nights: number;
  summarizedCalculation?: boolean;
};

export default function ActivitiesSummary({
  activity,
  numberOfGuests,
  nights,
  summarizedCalculation,
}: FeesSummaryProps) {
  const activityArr = [activity];

  const price = pricing.calculateActivityFees(
    activityArr,
    numberOfGuests,
    nights
  );

  return (
    <div>
      <div className="flex flex-col gap-1 ml-1">
        <div className="flex items-center justify-between">
          <Text size="sm" className="text-gray-600" weight={500}>
            {activity.name}
          </Text>
          {!summarizedCalculation && (
            <Text size="sm" className="text-gray-600" weight={500}>
              ${price.toLocaleString()}
            </Text>
          )}
        </div>
      </div>
    </div>
  );
}
