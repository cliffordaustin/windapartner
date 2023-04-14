import { ExtraFee } from "@/context/CalculatePage";
import pricing from "@/utils/calculation";
import { Flex, Text } from "@mantine/core";

type ExtraFeesSummaryProps = {
  index: number;
  fee: ExtraFee;
  numberOfGuests: number;
  nights: number;
};

export default function ExtraFeesSummary({
  index,
  fee,
  numberOfGuests,
  nights,
}: ExtraFeesSummaryProps) {
  const feeArr = [fee];

  const price = pricing.calculateExtraFees(feeArr, numberOfGuests, nights);
  return (
    <div>
      {/* <Text size="sm" weight={600}>
        {index + 1}. {fee.name} -{" "}
      </Text> */}

      <div>
        <Flex align="center" justify="space-between">
          <Text className="text-gray-600" size="sm">
            {" "}
            {fee.name}{" "}
            {fee.pricingType
              ? `(${
                  fee.pricingType.charAt(0).toUpperCase() +
                  fee.pricingType.slice(1).toLowerCase()
                })`
              : ""}
          </Text>

          {!!price && (
            <Text className="text-gray-600" size="sm">
              {" "}
              {fee.guestType === "Resident"
                ? "KES"
                : fee.guestType === "Non-resident"
                ? "$"
                : ""}
              {price.toLocaleString()}
            </Text>
          )}
        </Flex>
      </div>
    </div>
  );
}
