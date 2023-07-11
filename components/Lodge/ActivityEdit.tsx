import { getStayActivities } from "@/pages/api/stays";
import { Stay } from "@/utils/types";
import { Container, Text } from "@mantine/core";
import React from "react";
import { useQuery } from "react-query";
import Activity from "./Activity";

type ActivityEditProps = {
  stay: Stay | undefined;
};

function ActivityEdit({ stay }: ActivityEditProps) {
  const { data: activities, isLoading } = useQuery(
    `activities-${stay?.slug}`,
    () => getStayActivities(stay)
  );
  return (
    <div className="border border-solid w-full border-gray-200 rounded-xl p-5">
      <Text className="font-semibold" size="lg">
        Activities
      </Text>

      <Container className="mt-5 p-0 w-full">
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
      </Container>
    </div>
  );
}

export default ActivityEdit;
