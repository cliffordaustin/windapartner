import { RoomType } from "@/utils/types";
import { Text } from "@mantine/core";
import { format } from "date-fns";
import React from "react";

type RoomResidentPriceEditProps = {
  date: [Date | null, Date | null];
  roomTypes: RoomType[] | undefined;
};

function RoomResidentPriceEdit({
  date,
  roomTypes,
}: RoomResidentPriceEditProps) {
  return (
    <div className="border border-solid w-full border-gray-200 rounded-xl p-5">
      <Text className="font-semibold" size="lg">
        Resident Prices
      </Text>
      {date[0] && date[1] && (
        <Text className="text-gray-600" size="sm">
          Data being shown is from {format(date[0] as Date, "dd MMM yyyy")} to{" "}
          {format(date[1] as Date, "dd MMM yyyy")}
        </Text>
      )}

      {!date[0] ||
        (!date[1] && (
          <Text className="text-gray-600" size="sm">
            Please select a date range to view the rooms and packages
          </Text>
        ))}
    </div>
  );
}

export default RoomResidentPriceEdit;
