import {
  RoomAvailabilityNonResident,
  RoomAvailabilityResident,
  RoomType,
} from "@/utils/types";
import React, { useMemo } from "react";
import SelectedRoomTable from "./SelectedRoomTable";
import { AgentDiscountRateType } from "@/pages/api/stays";
import SelectedRoomTableResident from "./SelectedRoomTableResident";
import DateTable from "./DateTable";
import { Accordion, Divider, ScrollArea } from "@mantine/core";
import { ScrollSync, ScrollSyncPane } from "react-scroll-sync";

type RoomTableType = {
  roomTypes: RoomType[] | undefined;
  isNonResident: boolean;
  guestType: string;
  agentRates: AgentDiscountRateType[] | undefined;
  displayRackRates: boolean;
  date: [Date | null, Date | null];
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
  date,
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
    <>
      <ScrollSync>
        <div>
          <ScrollSyncPane>
            <div style={{ overflow: "auto" }} className="my-2 hide-scrollbar">
              <DateTable isNonResident={isNonResident} date={date} />
            </div>
          </ScrollSyncPane>

          <Accordion
            variant="separated"
            className="!p-0"
            defaultValue={uniqueRooms[0]?.name || ""}
            classNames={{
              content: "p-0",
              // item: "border-none",
              // control:
              //   "border-t border-x border-b-0 border-solid border-gray-300",
            }}
          >
            {isNonResident &&
              uniqueRooms.map((room, index) => (
                <Accordion.Item key={index} value={room.name || ""}>
                  <Accordion.Control>
                    <span className="font-semibold text-sm">{room.name}</span>
                  </Accordion.Control>
                  <Accordion.Panel className="!p-0">
                    <ScrollSyncPane>
                      <div
                        style={{ overflow: "auto" }}
                        className="hide-scrollbar"
                      >
                        <SelectedRoomTable
                          agentRates={agentRates}
                          key={index}
                          room={room}
                          date={date}
                          guestType={guestType}
                          displayRackRates={displayRackRates}
                        />
                      </div>
                    </ScrollSyncPane>
                  </Accordion.Panel>
                </Accordion.Item>
              ))}

            {!isNonResident &&
              uniqueRooms.map((room, index) => (
                <Accordion.Item key={index} value={room.name || ""}>
                  <Accordion.Control>
                    <span className="font-semibold text-sm">{room.name}</span>
                  </Accordion.Control>
                  <Accordion.Panel className="!p-0">
                    <ScrollSyncPane>
                      <div
                        style={{ overflow: "auto" }}
                        className="hide-scrollbar"
                      >
                        <SelectedRoomTableResident
                          agentRates={agentRates}
                          key={index}
                          room={room}
                          date={date}
                          guestType={guestType}
                          displayRackRates={displayRackRates}
                        />
                      </div>
                    </ScrollSyncPane>
                  </Accordion.Panel>
                </Accordion.Item>
              ))}
          </Accordion>
        </div>
      </ScrollSync>
    </>
  );
}
