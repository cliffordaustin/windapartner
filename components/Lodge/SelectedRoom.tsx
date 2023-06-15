import { RoomType } from "@/utils/types";
import React from "react";
import Table from "../ui/Table";

type SelectedRoomProps = {
  roomType: RoomType;
};

function SelectedRoom({ roomType }: SelectedRoomProps) {
  const residentGuestTypes: (string | undefined)[] = [];
  const nonResidentGuestTypes: (string | undefined)[] = [];

  roomType.room_resident_availabilities.forEach((item) => {
    item.room_resident_guest_availabilities.map((item) => {
      if (!residentGuestTypes.includes(item.name?.toLowerCase())) {
        residentGuestTypes.push(item.name?.toLowerCase().trim());
      }
    });
  });

  roomType.room_non_resident_availabilities.forEach((item) => {
    item.room_non_resident_guest_availabilities.map((item) => {
      if (!nonResidentGuestTypes.includes(item.name?.toLowerCase())) {
        nonResidentGuestTypes.push(item.name?.toLowerCase().trim());
      }
    });
  });

  const uniqueResidentGuestTypes = [...new Set(residentGuestTypes)];
  const uniqueNonResidentGuestTypes = [...new Set(nonResidentGuestTypes)];

  console.log(uniqueResidentGuestTypes);

  return (
    <>
      {roomType.room_resident_availabilities.length > 0 && (
        <Table
          data={roomType.room_resident_availabilities}
          roomTypeName={roomType.name}
          residentGuestTypes={uniqueResidentGuestTypes}
          isResident={true}
        />
      )}
    </>
  );
}

export default SelectedRoom;
