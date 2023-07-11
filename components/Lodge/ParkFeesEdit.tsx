import { getParkFees } from "@/pages/api/stays";
import { Stay } from "@/utils/types";
import { Container, Text } from "@mantine/core";
import React from "react";
import { useQuery } from "react-query";
import ParkFee from "./ParkFee";

type ParkFeesEditProps = {
  stay: Stay | undefined;
};

function ParkFeesEdit({ stay }: ParkFeesEditProps) {
  const { data: parkFees, isLoading } = useQuery(
    `park-fees-${stay?.slug}`,
    () => getParkFees(stay)
  );
  return (
    <div className="border border-solid w-full border-gray-200 rounded-xl p-5">
      <Text className="font-semibold" size="lg">
        Park Fees
      </Text>

      <Container className="mt-5 p-0 w-full">
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
      </Container>
    </div>
  );
}

export default ParkFeesEdit;
