import { getStayActivities } from "@/pages/api/stays";
import { LodgeStay } from "@/utils/types";
import React from "react";
import { useQuery } from "react-query";
import { Divider, Text } from "@mantine/core";
import Activity from "./Activity";

type ParkFeesProps = {
  stay: LodgeStay | undefined;
};

function Activities({ stay }: ParkFeesProps) {
  const { data: activities, isLoading } = useQuery(
    `activities-${stay?.slug}`,
    () => getStayActivities(stay)
  );

  return (
    <div>
      {activities && activities.length > 0 && (
        <div className="flex flex-col gap-3">
          {activities.map((fee, index) => (
            <Activity stay={stay} fee={fee} key={index} />
          ))}
        </div>
      )}

      {activities && activities.length === 0 && (
        <Text className="text-center font-semibold" size="sm">
          No activities available
        </Text>
      )}
    </div>
  );
}

export default Activities;
