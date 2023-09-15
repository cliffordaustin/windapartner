import {
  RoomAvailabilityNonResident,
  RoomAvailabilityResident,
  RoomType,
} from "@/utils/types";
import React, { useMemo } from "react";
import SelectedRoomTable from "./SelectedRoomTable";
import { AgentDiscountRateType } from "@/pages/api/stays";
import SelectedRoomTableResident from "./SelectedRoomTableResident";

type RoomTableType = {
  roomTypes: RoomType[] | undefined;
  isNonResident: boolean;
  guestType: string;
  agentRates: AgentDiscountRateType[] | undefined;
  displayRackRates: boolean;
};
type PackagesType = {
  name: string;
  room_resident_availabilities: RoomAvailabilityResident[];
  room_non_resident_availabilities: RoomAvailabilityNonResident[];
};

type UniqueRoomsType = {
  name?: string;
  packages: PackagesType[];
  adult_capacity: number;
  child_capacity: number;
  infant_capacity: number;
};

export default function RoomTable({
  roomTypes,
  isNonResident,
  guestType,
  agentRates,
  displayRackRates,
}: RoomTableType) {
  const uniqueRooms: UniqueRoomsType[] = useMemo(
    () =>
      roomTypes?.reduce((accumulator: UniqueRoomsType[], current: RoomType) => {
        const roomName = current.name?.toLowerCase();
        const index = accumulator.findIndex(
          (room) => room.name?.toLowerCase().trim() === roomName?.trim()
        );
        if (index >= 0) {
          accumulator[index].packages.push({
            name: current.package,
            room_resident_availabilities: current.room_resident_availabilities,
            room_non_resident_availabilities:
              current.room_non_resident_availabilities,
          });
        } else {
          accumulator.push({
            name: current.name,
            adult_capacity: current.capacity,
            child_capacity: current.child_capacity,
            infant_capacity: current.infant_capacity,
            packages: [
              {
                name: current.package,
                room_resident_availabilities:
                  current.room_resident_availabilities,
                room_non_resident_availabilities:
                  current.room_non_resident_availabilities,
              },
            ],
          });
        }
        return accumulator;
      }, []) || [],
    [roomTypes]
  );

  return (
    <div className="flex flex-col gap-3">
      {isNonResident &&
        uniqueRooms.map((room, index) => (
          <SelectedRoomTable
            agentRates={agentRates}
            key={index}
            room={room}
            guestType={guestType}
            displayRackRates={displayRackRates}
          />
        ))}

      {!isNonResident &&
        uniqueRooms.map((room, index) => (
          <SelectedRoomTableResident
            agentRates={agentRates}
            key={index}
            room={room}
            guestType={guestType}
            displayRackRates={displayRackRates}
          />
        ))}
    </div>
  );
}
