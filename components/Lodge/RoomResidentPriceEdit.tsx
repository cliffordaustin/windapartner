import { getRoomTypes } from "@/pages/api/stays";
import { RoomType, Stay } from "@/utils/types";
import { Loader, Text } from "@mantine/core";
import { format } from "date-fns";
import React from "react";
import { useQuery } from "react-query";
import SelectedResidentPriceTable from "./SelectedResidentPriceTable";

type RoomResidentPriceEditProps = {
  date: [Date | null, Date | null];
  stay: Stay | undefined;
};

function RoomResidentPriceEdit({ date, stay }: RoomResidentPriceEditProps) {
  const queryStr = stay ? stay.slug : "room-type";
  const { data: roomTypes, isLoading: roomTypesLoading } = useQuery(
    queryStr,
    () =>
      getRoomTypes(
        stay,
        format(date[0] || new Date(), "yyyy-MM-dd"),
        format(date[1] || new Date(), "yyyy-MM-dd")
      ),
    { enabled: date[0] && date[1] ? true : false }
  );
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

      <div className="mt-6">
        {!roomTypesLoading &&
          date[0] &&
          date[1] &&
          roomTypes?.map((roomType, index) => (
            <SelectedResidentPriceTable
              staySlug={stay?.slug}
              key={index}
              roomType={roomType}
            />
          ))}
        {roomTypesLoading && date[0] && date[1] && (
          <div className="absolute top-[50%] left-[50%] -translate-x-2/4">
            <Loader color="red" />
          </div>
        )}
      </div>
    </div>
  );
}

export default RoomResidentPriceEdit;
