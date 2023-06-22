import { RoomType } from "@/utils/types";
import React from "react";
import Table from "../ui/Table";
import NonResidentTable from "../ui/NonResidentTable";
import { IconTrash } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "react-query";
import { deleteRoom } from "@/pages/api/lodge";
import { useRouter } from "next/router";

type SelectedRoomProps = {
  roomType: RoomType;
  isNonResident: boolean;
  staySlug: string | undefined;
};

function SelectedRoom({
  roomType,
  isNonResident,
  staySlug,
}: SelectedRoomProps) {
  const residentGuestTypes: (string | undefined)[] = [];
  const nonResidentGuestTypes: (string | undefined)[] = [];

  const router = useRouter();

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

  const { mutateAsync: deleteRoomMutation } = useMutation(deleteRoom, {
    onSuccess: () => {
      router.reload();
    },
  });

  return (
    <div className="relative">
      {roomType.room_resident_availabilities.length > 0 && !isNonResident && (
        <Table
          residentData={roomType.room_resident_availabilities}
          roomTypeName={`${roomType.name} - ${roomType.package.toLowerCase()}`}
          residentGuestTypes={uniqueResidentGuestTypes}
        />
      )}

      {((roomType.room_resident_availabilities.length > 0 && !isNonResident) ||
        (roomType.room_non_resident_availabilities.length > 0 &&
          isNonResident)) && (
        <div
          onClick={() => {
            deleteRoomMutation({
              roomSlug: roomType.slug,
              staySlug: staySlug,
              roomType: roomType,
              isNonResident: isNonResident,
            });
          }}
          className="cursor-pointer"
        >
          <IconTrash
            className="absolute right-2 z-20 top-0.5"
            size="1.3rem"
            color="red"
          ></IconTrash>
        </div>
      )}

      {roomType.room_non_resident_availabilities.length > 0 &&
        isNonResident && (
          <NonResidentTable
            nonResidentData={roomType.room_non_resident_availabilities}
            roomTypeName={`${
              roomType.name
            } - ${roomType.package.toLowerCase()}`}
            nonResidentGuestTypes={uniqueNonResidentGuestTypes}
          />
        )}
    </div>
  );
}

export default SelectedRoom;
