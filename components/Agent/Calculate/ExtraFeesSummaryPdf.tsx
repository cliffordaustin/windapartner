import { ExtraFee } from "@/context/CalculatePage";
import pricing from "@/utils/calculation";
import {
  Document,
  Page,
  Text,
  View,
  Font,
  StyleSheet,
} from "@react-pdf/renderer";

type ExtraFeesSummaryProps = {
  index: number;
  fee: ExtraFee;
  numberOfGuests: number;
  nights: number;
};

export default function ExtraFeesSummaryPdf({
  index,
  fee,
  numberOfGuests,
  nights,
}: ExtraFeesSummaryProps) {
  const feeArr = [fee];

  const price = pricing.calculateExtraFees(feeArr, numberOfGuests, nights);
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <Text style={{ color: "gray", fontSize: 12 }}>
        {" "}
        {fee.name}{" "}
        {fee.pricingType
          ? `(${
              fee.pricingType.charAt(0).toUpperCase() +
              fee.pricingType.slice(1).toLowerCase()
            })`
          : ""}{" "}
      </Text>
      {!!price && (
        <Text style={{ color: "gray", fontSize: 12 }}>
          {" "}
          {fee.guestType === "Resident"
            ? "KES"
            : fee.guestType === "Non-resident"
            ? "$"
            : ""}
          {price.toLocaleString()}{" "}
        </Text>
      )}
    </View>
  );
}
