import { Stay } from "@/utils/types";
import { format } from "date-fns";
import React from "react";
import SelectedRoom from "./SelectedRoom";
import { useQuery } from "react-query";
import { getRoomTypes } from "@/pages/api/stays";

type SelectedStaysProps = {
  stay: Stay | undefined;
  date: [Date | null, Date | null];
};

type PackageResidentAvailabilityTypes = {
  date: string;
  name: string;
  residentPrice: number;
};

function SelectedStays({ stay, date }: SelectedStaysProps) {
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
      {roomTypes?.map((roomType, index) => (
        <SelectedRoom key={index} roomType={roomType} />
      ))}
    </div>
  );
}

export default SelectedStays;
