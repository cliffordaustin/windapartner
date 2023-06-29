import { Stay } from "@/utils/types";
import { format } from "date-fns";
import React from "react";
import SelectedRoom from "./SelectedRoom";
import { useQuery } from "react-query";
import { getRoomTypes } from "@/pages/api/stays";
import { Accordion, Loader, Text } from "@mantine/core";
import ParkFees from "./ParkFees";
import Activities from "./Activities";

type SelectedStaysProps = {
  stay: Stay | undefined;
  date: [Date | null, Date | null];
  isNonResident: boolean;
  index: number;
};
function SelectedStays({
  stay,
  date,
  isNonResident,
  index,
}: SelectedStaysProps) {
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
    <Accordion.Item value={index.toString()}>
      <Accordion.Control>
        <span className="font-semibold text-base">{stay?.property_name}</span>
      </Accordion.Control>

      <Accordion.Panel>
        <Accordion
          classNames={{
            item: "!bg-white rounded-md shadow-md hover:!bg-white",
          }}
          variant="contained"
          mb={10}
        >
          <Accordion.Item value="0">
            <Accordion.Control>
              <span className="font-semibold text-base">Rooms & Prices</span>
            </Accordion.Control>

            <Accordion.Panel>
              {date[0] && date[1] ? (
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
              ) : (
                <Text className="text-center font-semibold" size="sm">
                  Add a date range to view rooms and prices
                </Text>
              )}

              {date[0] && date[1] && roomTypes && roomTypes.length === 0 && (
                <Text className="text-center font-semibold" size="sm">
                  No rooms or prices available
                </Text>
              )}
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item mt={6} value="1">
            <Accordion.Control>
              <span className="font-semibold text-base">
                Park/Conservancy fees
              </span>
            </Accordion.Control>

            <Accordion.Panel>
              <ParkFees stay={stay} />
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item mt={6} value="2">
            <Accordion.Control>
              <span className="font-semibold text-base">Activities</span>
            </Accordion.Control>

            <Accordion.Panel>
              <Activities stay={stay} />
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Accordion.Panel>
    </Accordion.Item>
  );
}

export default SelectedStays;
