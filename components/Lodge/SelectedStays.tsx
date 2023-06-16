import { Stay } from "@/utils/types";
import { format } from "date-fns";
import React from "react";
import SelectedRoom from "./SelectedRoom";
import { useQuery } from "react-query";
import { getRoomTypes } from "@/pages/api/stays";
import { Loader } from "@mantine/core";

type SelectedStaysProps = {
  stay: Stay | undefined;
  date: [Date | null, Date | null];
  isNonResident: boolean;
};
function SelectedStays({ stay, date, isNonResident }: SelectedStaysProps) {
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
    <div className="flex flex-col gap-3">
      {!roomTypesLoading &&
        date[0] &&
        date[1] &&
        roomTypes?.map((roomType, index) => (
          <SelectedRoom
            isNonResident={isNonResident}
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
  );
}

export default SelectedStays;
