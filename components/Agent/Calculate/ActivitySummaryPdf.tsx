import { ActivityFee } from "@/context/CalculatePage";
import pricing from "@/utils/calculation";
import { Text, View } from "@react-pdf/renderer";

type FeesSummaryProps = {
  activity: ActivityFee;
  numberOfGuests: number;
  nights: number;
};

export default function ActivitiesSummaryPdf({
  activity,
  numberOfGuests,
  nights,
}: FeesSummaryProps) {
  const activityArr = [activity];

  const price = pricing.calculateActivityFees(
    activityArr,
    numberOfGuests,
    nights
  );

  return (
    <View style={{ flexDirection: "column", marginBottom: 6, marginLeft: 4 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={{ fontSize: 12, fontWeight: 500, color: "gray" }}>
          {activity.name}
        </Text>
        <Text style={{ fontSize: 12, fontWeight: 500, color: "gray" }}>
          ${price.toLocaleString()}
        </Text>
      </View>
    </View>
  );
}
