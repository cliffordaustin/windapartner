import {
  Context,
  ExtraFee,
  GuestTotal,
  StateType,
} from "@/context/CalculatePage";
import { getRoomTypes } from "@/pages/api/stays";
import pricing, { countRoomTypes } from "@/utils/calculation";
import { Stay } from "@/utils/types";
import { Divider, Flex, Tabs, Text } from "@mantine/core";
import { IconCalculator, IconCalendarEvent } from "@tabler/icons-react";
import moment from "moment";
import { useQuery } from "react-query";
import GuestsSummary from "./GuestsSummary";
import FeesSummary from "./FeesSummary";
import ActivitiesSummary from "./ActivitiesSummary";
import ExtraFeesSummary from "./ExtraFeesSummary";
import { useContext, useEffect, useState } from "react";
import NonResidentGuestsSummary from "./NonResidentGuestsSummary";
import NonResidentFeesSummary from "./NonResidentFeeSummary";
import { format, differenceInCalendarDays } from "date-fns";
import ActivitiesResidentSummary from "./ActivitiesResidentSummary";
import { Mixpanel } from "@/utils/mixpanelconfig";

type SummaryProps = {
  calculateStay: StateType;
  stays?: Stay[];
};

export default function Summary({ calculateStay, stays }: SummaryProps) {
  const countRoomType = countRoomTypes(calculateStay.rooms);

  const currentStay = stays?.find((item) => item.id === calculateStay.id);
  const queryStr = currentStay ? currentStay.slug : "room-type";

  const { data: roomTypes, isLoading: roomTypesLoading } = useQuery(
    queryStr,
    () =>
      getRoomTypes(
        currentStay,
        format(calculateStay.date[0] || new Date(), "yyyy-MM-dd"),
        format(calculateStay.date[1] || new Date(), "yyyy-MM-dd")
      ),
    { enabled: calculateStay.date[0] && calculateStay.date[1] ? true : false }
  );

  const nights =
    calculateStay.date[0] && calculateStay.date[1]
      ? differenceInCalendarDays(calculateStay.date[1], calculateStay.date[0])
      : 1;
  // to include the last day, add 1
  const days = nights + 1;

  const totalNumberOfGuests = calculateStay.rooms.reduce((acc, room) => {
    const countResidentGuestTypes = pricing.countResidentGuestTypesWithPrice(
      room.residentGuests,
      room,
      roomTypes
    );
    const roomTotal = countResidentGuestTypes.reduce((acc, item) => {
      const numGuests = parseInt(item.name.split(" ")[0]);
      return acc + numGuests;
    }, 0);
    return acc + roomTotal;
  }, 0);

  const totalNumberOfNonResidentGuests = calculateStay.rooms.reduce(
    (acc, room) => {
      const countNonResidentGuestTypes =
        pricing.countNonResidentGuestTypesWithPrice(
          room.nonResidentGuests,
          room,
          roomTypes
        );
      const roomTotal = countNonResidentGuestTypes.reduce((acc, item) => {
        const numGuests = parseInt(item.name.split(" ")[0]);
        return acc + numGuests;
      }, 0);
      return acc + roomTotal;
    },
    0
  );

  let totalResidentParkFees = pricing.getTotalResidentParkFees(
    calculateStay.rooms
  );

  totalResidentParkFees = totalResidentParkFees * days;

  let totalNonResidentParkFees = pricing.getTotalNonResidentParkFees(
    calculateStay.rooms
  );

  totalNonResidentParkFees = totalNonResidentParkFees * days;

  const activityTotalPrice = pricing.calculateActivityFees(
    calculateStay.activityFee,
    totalNumberOfGuests + totalNumberOfNonResidentGuests,
    nights
  );

  const activityResidentTotalPrice = pricing.calculateResidentActivityFees(
    calculateStay.activityFee,
    totalNumberOfGuests + totalNumberOfNonResidentGuests,
    nights
  );

  const residentTotalExtraFees = calculateStay.extraFee.filter(
    (item) => item.guestType === "Resident"
  );

  const nonResidentTotalExtraFees = calculateStay.extraFee.filter(
    (item) => item.guestType === "Non-resident"
  );

  const totalResidentExtraFees = pricing.calculateExtraFees(
    residentTotalExtraFees,
    totalNumberOfGuests,
    nights
  );

  const totalNonResidentExtraFees = pricing.calculateExtraFees(
    nonResidentTotalExtraFees,
    totalNumberOfNonResidentGuests,
    nights
  );

  const totalResidentPrice = calculateStay.rooms.reduce((acc, room) => {
    const countResidentGuestTypes = pricing.countResidentGuestTypesWithPrice(
      room.residentGuests,
      room,
      roomTypes
    );
    const roomTotal = countResidentGuestTypes.reduce(
      (acc, item) => acc + (item.price || 0),
      0
    );
    return acc + roomTotal;
  }, 0);

  const totalNonResidentPrice = calculateStay.rooms.reduce((acc, room) => {
    const countResidentGuestTypes = pricing.countNonResidentGuestTypesWithPrice(
      room.nonResidentGuests,
      room,
      roomTypes
    );
    const roomTotal = countResidentGuestTypes.reduce(
      (acc, item) => acc + (item.price || 0),
      0
    );
    return acc + roomTotal;
  }, 0);

  let residentFullTotalPrice =
    totalResidentPrice +
    totalResidentPrice * (Number(calculateStay.residentCommission) / 100) +
    totalResidentParkFees +
    totalResidentExtraFees +
    totalResidentExtraFees * (Number(calculateStay.residentCommission) / 100) +
    activityResidentTotalPrice;

  let nonResidentFullTotalPrice =
    totalNonResidentPrice +
    totalNonResidentPrice *
      (Number(calculateStay.nonResidentCommission) / 100) +
    totalNonResidentParkFees +
    totalNonResidentExtraFees +
    totalNonResidentExtraFees *
      (Number(calculateStay.nonResidentCommission) / 100) +
    activityTotalPrice;

  const residentExtraFees: ExtraFee[] = calculateStay.extraFee.filter(
    (item) => item.guestType === "Resident"
  );

  const nonResidentExtraFees: ExtraFee[] = calculateStay.extraFee.filter(
    (item) => item.guestType === "Non-resident"
  );

  return (
    <Tabs
      color="red"
      variant="outline"
      defaultValue={
        residentFullTotalPrice && !nonResidentFullTotalPrice
          ? "resident"
          : "non-resident"
      }
    >
      <Tabs.List className="fixed w-[30%] bg-white" grow>
        <Tabs.Tab
          onClick={() => {
            Mixpanel.track("User switched to the non-resident tab", {
              property: currentStay?.property_name,
            });
          }}
          value="non-resident"
        >
          <div className="flex items-center justify-center gap-2">
            <span>Non-resident</span>
            {totalNumberOfNonResidentGuests > 0 && (
              <div className="w-5 h-5 flex items-center justify-center rounded-full bg-red-500 text-white">
                {totalNumberOfNonResidentGuests}
              </div>
            )}
          </div>
        </Tabs.Tab>

        <Tabs.Tab
          onClick={() => {
            Mixpanel.track("User switched to the resident tab", {
              property: currentStay?.property_name,
            });
          }}
          value="resident"
        >
          <div className="flex items-center justify-center gap-2">
            <span>Resident</span>
            {totalNumberOfGuests > 0 && (
              <div className="w-5 h-5 flex items-center justify-center rounded-full bg-red-500 text-white">
                {totalNumberOfGuests}
              </div>
            )}
          </div>
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="non-resident">
        <div className="">
          <div className="w-full px-4 py-4">
            <Text className="font-bold mt-10" mb={8}>
              {calculateStay.name}
            </Text>
            {calculateStay.date[0] && calculateStay.date[1] && (
              <>
                <div className="flex justify-between gap-8">
                  <div className="flex border w-[45%] flex-col gap-2">
                    <div className="flex gap-2 items-center">
                      <IconCalendarEvent></IconCalendarEvent>
                      <Text size="sm">Check-in</Text>
                    </div>

                    <Text size="sm" weight={700} ml={4}>
                      {/* {moment(
                          calculateStay.date[0]
                        ).format("DD MMM YYYY")} */}

                      {format(calculateStay.date[0], "dd MMM yyyy")}
                    </Text>
                  </div>

                  <div className="flex w-[45%] flex-col gap-2">
                    <div className="flex gap-2 items-center">
                      <IconCalendarEvent></IconCalendarEvent>
                      <Text size="sm">Check-out</Text>
                    </div>

                    <Text size="sm" weight={700} ml={4}>
                      {/* {moment(
                          calculateStay.date[1]?.toLocaleDateString()
                        ).format("DD MMM YYYY")} */}

                      {format(calculateStay.date[1], "dd MMM yyyy")}
                    </Text>
                  </div>
                </div>

                <Text
                  size="sm"
                  weight={600}
                  className="mt-2 border border-solid w-fit px-2 border-gray-200"
                >
                  {nights} {nights > 1 ? "nights" : "night"}
                </Text>
                <Divider size="xs" mt={8}></Divider>
              </>
            )}

            {calculateStay.date[0] &&
              calculateStay.date[1] &&
              totalNumberOfNonResidentGuests > 0 &&
              countRoomType.length > 0 && (
                <div className="flex flex-col gap-2">
                  <Text size="sm" weight={700} className="mt-2">
                    Rooms
                  </Text>

                  <Flex direction="column" gap={2}>
                    {countRoomType.map((item, index) => (
                      <Text size="sm" key={index}>
                        {item}
                      </Text>
                    ))}
                  </Flex>
                </div>
              )}

            {calculateStay.date[0] &&
              calculateStay.date[1] &&
              totalNumberOfNonResidentGuests > 0 &&
              calculateStay.rooms[0].name && (
                <div className="flex flex-col gap-2">
                  <Flex justify="space-between" className="mt-2" align="center">
                    <Text size="sm" weight={700}>
                      Guests
                    </Text>

                    <Text size="sm" weight={600}>
                      {totalNonResidentPrice
                        ? `$ ${totalNonResidentPrice.toLocaleString()}`
                        : ""}
                    </Text>
                  </Flex>

                  <Flex direction="column" gap={2}>
                    {calculateStay.rooms.map((room, index) => (
                      <NonResidentGuestsSummary
                        key={index}
                        room={room}
                        index={index}
                        roomTypes={roomTypes}
                      ></NonResidentGuestsSummary>
                    ))}
                  </Flex>
                </div>
              )}

            {calculateStay.date[0] &&
              calculateStay.date[1] &&
              totalNonResidentParkFees > 0 && (
                <div className="flex flex-col gap-2">
                  <Divider size="xs" mt={8}></Divider>
                  <Flex justify="space-between" align="center">
                    <Text size="sm" weight={700}>
                      Park/conservancy fees
                    </Text>

                    <Text size="sm" weight={600}>
                      {totalNonResidentParkFees
                        ? `$ ${totalNonResidentParkFees.toLocaleString()}`
                        : ""}{" "}
                    </Text>
                  </Flex>

                  <Flex direction="column" gap={2}>
                    <NonResidentFeesSummary
                      rooms={calculateStay.rooms}
                      nights={days}
                    ></NonResidentFeesSummary>
                  </Flex>
                </div>
              )}

            {calculateStay.date[0] &&
              calculateStay.date[1] &&
              totalNumberOfNonResidentGuests > 0 &&
              calculateStay.activityFee.length > 0 && (
                <div className="flex flex-col gap-2">
                  <Divider size="xs" mt={8}></Divider>
                  <Flex justify="space-between" align="center">
                    <Text size="sm" weight={700}>
                      Activities
                    </Text>

                    <Text size="sm" weight={600}>
                      {activityTotalPrice
                        ? `$ ${activityTotalPrice.toLocaleString()}`
                        : ""}
                    </Text>
                  </Flex>

                  <Flex direction="column" gap={2}>
                    {calculateStay.activityFee.map((activity, index) => (
                      <ActivitiesSummary
                        key={index}
                        activity={activity}
                        numberOfGuests={
                          totalNumberOfGuests + totalNumberOfNonResidentGuests
                        }
                        nights={nights}
                      ></ActivitiesSummary>
                    ))}
                  </Flex>
                </div>
              )}

            {calculateStay.date[0] &&
              calculateStay.date[1] &&
              totalNumberOfNonResidentGuests > 0 &&
              calculateStay.extraFee[0].name &&
              totalNonResidentExtraFees > 0 && (
                <div className="flex flex-col gap-2">
                  <Divider size="xs" mt={8}></Divider>
                  <Flex justify="space-between" align="center">
                    <Text size="sm" weight={700} className="">
                      Extra Fees
                    </Text>

                    <Text size="sm" weight={600}>
                      {totalNonResidentExtraFees
                        ? `$ ${totalNonResidentExtraFees.toLocaleString()}`
                        : ""}
                    </Text>
                  </Flex>

                  <Flex direction="column" gap={2}>
                    {nonResidentExtraFees.map((fee, index) => (
                      <ExtraFeesSummary
                        key={index}
                        index={index}
                        fee={fee}
                        numberOfGuests={totalNumberOfGuests}
                        nights={nights}
                      ></ExtraFeesSummary>
                    ))}
                  </Flex>
                </div>
              )}

            {calculateStay.nonResidentCommission && (
              <div className="flex flex-col gap-2">
                <Divider size="xs" mt={8}></Divider>

                <Flex justify="space-between" align="center">
                  <Text size="sm" weight={700} className="">
                    Non-resident Commission
                  </Text>

                  <Text size="sm" weight={600}>
                    {calculateStay.nonResidentCommission}%
                  </Text>
                </Flex>
              </div>
            )}

            {(!calculateStay.date[0] || !calculateStay.date[1]) && (
              <div className="flex flex-col mt-12 mx-auto items-center gap-2">
                <IconCalculator></IconCalculator>
                <Text size={"sm"} className="text-gray-600 text-center">
                  Enter your dates and non-resident guests (if available) to
                  begin the calculation.
                </Text>
              </div>
            )}
          </div>

          {!!calculateStay.date[0] &&
            !!calculateStay.date[1] &&
            totalNumberOfNonResidentGuests > 0 &&
            !!calculateStay.rooms[0].name &&
            !!nonResidentFullTotalPrice && (
              <div className="sticky flex items-center py-1 px-2 left-4 bottom-0 w-full bg-white border-x-transparent border-b-transparent shadow-md border-t border-t-gray-200 border-solid h-[60px]">
                <div className="flex flex-col">
                  <Text className="text-gray-400" size="xs">
                    TOTAL
                  </Text>
                  <Text size="lg" weight={700}>
                    {nonResidentFullTotalPrice
                      ? `$ ${nonResidentFullTotalPrice.toLocaleString()}`
                      : ""}
                  </Text>
                </div>
              </div>
            )}
        </div>
      </Tabs.Panel>

      <Tabs.Panel value="resident">
        <div className="">
          <div className="w-full px-4 py-4">
            <Text className="font-bold mt-10" mb={8}>
              {calculateStay.name}
            </Text>
            {calculateStay.date[0] && calculateStay.date[1] && (
              <>
                <div className="flex justify-between gap-8">
                  <div className="flex border w-[45%] flex-col gap-2">
                    <div className="flex gap-2 items-center">
                      <IconCalendarEvent></IconCalendarEvent>
                      <Text size="sm">Check-in</Text>
                    </div>

                    <Text size="sm" weight={700} ml={4}>
                      {moment(
                        calculateStay.date[0]?.toLocaleDateString()
                      ).format("DD MMM YYYY")}
                    </Text>
                  </div>

                  <div className="flex w-[45%] flex-col gap-2">
                    <div className="flex gap-2 items-center">
                      <IconCalendarEvent></IconCalendarEvent>
                      <Text size="sm">Check-out</Text>
                    </div>

                    <Text size="sm" weight={700} ml={4}>
                      {moment(
                        calculateStay.date[1]?.toLocaleDateString()
                      ).format("DD MMM YYYY")}
                    </Text>
                  </div>
                </div>

                <Text
                  size="sm"
                  weight={600}
                  className="mt-2 border border-solid w-fit px-2 border-gray-200"
                >
                  {nights} {nights > 1 ? "nights" : "night"}
                </Text>
                <Divider size="xs" mt={8}></Divider>
              </>
            )}

            {calculateStay.date[0] &&
              calculateStay.date[1] &&
              totalNumberOfGuests > 0 &&
              countRoomType.length > 0 && (
                <div className="flex flex-col gap-2">
                  <Text size="sm" weight={700} className="mt-2">
                    Rooms
                  </Text>

                  <Flex direction="column" gap={2}>
                    {countRoomType.map((item, index) => (
                      <Text size="sm" key={index}>
                        {item}
                      </Text>
                    ))}
                  </Flex>
                </div>
              )}

            {calculateStay.date[0] &&
              calculateStay.date[1] &&
              totalNumberOfGuests > 0 &&
              calculateStay.rooms[0].residentGuests.length > 0 && (
                <div className="flex flex-col gap-2">
                  <Flex justify="space-between" className="mt-2" align="center">
                    <Text size="sm" weight={700}>
                      Guests
                    </Text>

                    <Text size="sm" weight={600}>
                      {totalResidentPrice
                        ? `KES ${totalResidentPrice.toLocaleString()}`
                        : ""}{" "}
                    </Text>
                  </Flex>

                  <Flex direction="column" gap={2}>
                    {calculateStay.rooms.map((room, index) => (
                      <GuestsSummary
                        key={index}
                        room={room}
                        index={index}
                        roomTypes={roomTypes}
                      ></GuestsSummary>
                    ))}
                  </Flex>
                </div>
              )}

            {calculateStay.date[0] &&
              calculateStay.date[1] &&
              totalResidentParkFees > 0 && (
                <div className="flex flex-col gap-2">
                  <Divider size="xs" mt={8}></Divider>
                  <Flex justify="space-between" align="center">
                    <Text size="sm" weight={700}>
                      Park/conservancy fees
                    </Text>

                    <Text size="sm" weight={600}>
                      {totalResidentParkFees
                        ? `KES ${totalResidentParkFees.toLocaleString()}`
                        : ""}{" "}
                    </Text>
                  </Flex>

                  <Flex direction="column" gap={2}>
                    <FeesSummary
                      rooms={calculateStay.rooms}
                      nights={days}
                    ></FeesSummary>
                  </Flex>
                </div>
              )}

            {calculateStay.date[0] &&
              calculateStay.date[1] &&
              totalNumberOfGuests > 0 &&
              calculateStay.activityFee.length > 0 && (
                <div className="flex flex-col gap-2">
                  <Divider size="xs" mt={8}></Divider>
                  <Flex justify="space-between" align="center">
                    <Text size="sm" weight={700}>
                      Activities
                    </Text>

                    <Text size="sm" weight={600}>
                      {activityResidentTotalPrice
                        ? `KES ${activityResidentTotalPrice.toLocaleString()}`
                        : ""}
                    </Text>
                  </Flex>

                  <Flex direction="column" gap={2}>
                    {calculateStay.activityFee.map((activity, index) => (
                      <ActivitiesResidentSummary
                        key={index}
                        activity={activity}
                        numberOfGuests={
                          totalNumberOfGuests + totalNumberOfNonResidentGuests
                        }
                        nights={nights}
                      ></ActivitiesResidentSummary>
                    ))}
                  </Flex>
                </div>
              )}

            {calculateStay.date[0] &&
              calculateStay.date[1] &&
              totalNumberOfGuests > 0 &&
              calculateStay.extraFee[0].name &&
              totalResidentExtraFees > 0 && (
                <div className="flex flex-col gap-2">
                  <Divider size="xs" mt={8}></Divider>
                  <Flex justify="space-between" align="center">
                    <Text size="sm" weight={700} className="">
                      Extra Fees
                    </Text>

                    <Text size="sm" weight={600}>
                      {totalResidentExtraFees
                        ? `KES ${totalResidentExtraFees.toLocaleString()}`
                        : ""}{" "}
                    </Text>
                  </Flex>

                  <Flex direction="column" gap={2}>
                    {residentExtraFees.map((fee, index) => (
                      <ExtraFeesSummary
                        key={index}
                        index={index}
                        fee={fee}
                        numberOfGuests={totalNumberOfGuests}
                        nights={nights}
                      ></ExtraFeesSummary>
                    ))}
                  </Flex>
                </div>
              )}

            {calculateStay.residentCommission && (
              <div className="flex flex-col gap-2">
                <Divider size="xs" mt={8}></Divider>

                <Flex justify="space-between" align="center">
                  <Text size="sm" weight={700} className="">
                    Resident Commission
                  </Text>

                  <Text size="sm" weight={600}>
                    {calculateStay.residentCommission}%
                  </Text>
                </Flex>
              </div>
            )}

            {(!calculateStay.date[0] || !calculateStay.date[1]) && (
              <div className="flex flex-col mt-12 mx-auto items-center gap-2">
                <IconCalculator></IconCalculator>
                <Text size={"sm"} className="text-gray-600 text-center">
                  Enter your dates and resident guests (if available) to begin
                  the calculation.
                </Text>
              </div>
            )}
          </div>

          {!!calculateStay.date[0] &&
            !!calculateStay.date[1] &&
            totalNumberOfGuests > 0 &&
            !!calculateStay.rooms[0].name &&
            !!residentFullTotalPrice && (
              <div className="sticky flex items-center py-1 px-2 left-4 bottom-0 w-full bg-white border-x-transparent border-b-transparent shadow-md border-t border-t-gray-200 border-solid h-[60px]">
                <div className="flex flex-col">
                  <Text className="text-gray-400" size="xs">
                    TOTAL
                  </Text>
                  <Text size="lg" weight={700}>
                    {residentFullTotalPrice
                      ? `KES ${residentFullTotalPrice.toLocaleString()}`
                      : ""}{" "}
                  </Text>
                </div>
              </div>
            )}
        </div>
      </Tabs.Panel>
    </Tabs>
  );
}
