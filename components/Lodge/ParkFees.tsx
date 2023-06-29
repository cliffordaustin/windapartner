import { getParkFees } from "@/pages/api/stays";
import { Stay } from "@/utils/types";
import React from "react";
import { useQuery } from "react-query";
import ParkFee from "./ParkFee";
import { Divider, Text } from "@mantine/core";

type ParkFeesProps = {
  stay: Stay | undefined;
};

function ParkFees({ stay }: ParkFeesProps) {
  const { data: parkFees, isLoading } = useQuery(
    `park-fees-${stay?.slug}`,
    () => getParkFees(stay)
  );

  return (
    <div>
      {parkFees && parkFees.length > 0 && (
        <div className="flex flex-col gap-3">
          {parkFees.map((fee, index) => (
            <ParkFee stay={stay} fee={fee} key={index} />
          ))}
        </div>
      )}

      {parkFees && parkFees.length === 0 && (
        <Text className="text-center font-semibold" size="sm">
          No park fees available
        </Text>
      )}
    </div>
  );
}

export default ParkFees;
