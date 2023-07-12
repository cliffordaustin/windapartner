import {
  Context,
  ExtraFee,
  GuestTotal,
  StateType,
} from "@/context/CalculatePage";
import { getRoomTypes } from "@/pages/api/stays";
import pricing, { countRoomTypes } from "@/utils/calculation";
import { Stay } from "@/utils/types";
import { Button, Divider, Flex, Tabs, Text } from "@mantine/core";
import { IconCalculator, IconCalendarEvent } from "@tabler/icons-react";
import moment from "moment";
import { useQuery } from "react-query";
import GuestsSummary from "./GuestsSummary";
import FeesSummary from "./FeesSummary";
import ActivitiesSummary from "./ActivitiesSummary";
import ExtraFeesSummary from "./ExtraFeesSummary";
import { useContext, useEffect, useRef, useState } from "react";
import NonResidentGuestsSummary from "./NonResidentGuestsSummary";
import NonResidentFeesSummary from "./NonResidentFeeSummary";
import { format, differenceInCalendarDays } from "date-fns";
import ActivitiesResidentSummary from "./ActivitiesResidentSummary";

type TotalTypes = {
  id: number;
  total: number;
};

type SummaryProps = {
  calculateStay: StateType;
  stays?: Stay[];
  includeClientInCalculation: boolean;
  summarizedCalculation: boolean;
  updateTotals: (id: number, total: number, isResident: boolean) => void;
};

export default function PrintSummary({
  calculateStay,
  stays,
  includeClientInCalculation,
  summarizedCalculation,

  updateTotals,
}: SummaryProps) {
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
    totalNumberOfNonResidentGuests,
    nights
  );

  const activityResidentTotalPrice = pricing.calculateResidentActivityFees(
    calculateStay.activityFee,
    totalNumberOfGuests,
    nights
  );

  const residentTotalExtraFees = calculateStay.extraFee.filter(
    (item) => item.guestType === "Resident"
  );

  const nonResidentTotalExtraFees = calculateStay.extraFee.filter(
    (item) => item.guestType === "Non-resident"
  );

  const feePrice = pricing.calculateRoomFees(calculateStay.rooms, nights);

  let totalResidentExtraFees = pricing.calculateExtraFees(
    residentTotalExtraFees,
    totalNumberOfGuests,
    nights
  );

  totalResidentExtraFees = includeClientInCalculation
    ? totalResidentExtraFees +
      totalResidentExtraFees * ((calculateStay.residentCommission || 0) / 100)
    : totalResidentExtraFees;

  let totalNonResidentExtraFees = pricing.calculateExtraFees(
    nonResidentTotalExtraFees,
    totalNumberOfNonResidentGuests,
    nights
  );

  totalNonResidentExtraFees = includeClientInCalculation
    ? totalNonResidentExtraFees +
      totalNonResidentExtraFees *
        ((calculateStay.nonResidentCommission || 0) / 100)
    : totalNonResidentExtraFees;

  let totalResidentPrice = calculateStay.rooms.reduce((acc, room) => {
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

  totalResidentPrice = includeClientInCalculation
    ? totalResidentPrice +
      totalResidentPrice * ((calculateStay.residentCommission || 0) / 100)
    : totalResidentPrice;

  let totalNonResidentPrice = calculateStay.rooms.reduce((acc, room) => {
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

  totalNonResidentPrice = includeClientInCalculation
    ? totalNonResidentPrice +
      totalNonResidentPrice * ((calculateStay.nonResidentCommission || 0) / 100)
    : totalNonResidentPrice;

  let residentFullTotalPrice =
    totalResidentPrice +
    totalResidentParkFees +
    totalResidentExtraFees +
    activityResidentTotalPrice;

  residentFullTotalPrice = includeClientInCalculation
    ? residentFullTotalPrice
    : totalResidentPrice +
      totalResidentPrice * (Number(calculateStay.residentCommission) / 100) +
      totalResidentParkFees +
      totalResidentExtraFees +
      totalResidentExtraFees *
        (Number(calculateStay.residentCommission) / 100) +
      activityResidentTotalPrice;

  let nonResidentFullTotalPrice =
    totalNonResidentPrice +
    totalNonResidentParkFees +
    totalNonResidentExtraFees +
    activityTotalPrice;

  nonResidentFullTotalPrice = includeClientInCalculation
    ? nonResidentFullTotalPrice
    : totalNonResidentPrice +
      totalNonResidentPrice *
        (Number(calculateStay.nonResidentCommission) / 100) +
      totalNonResidentParkFees +
      totalNonResidentExtraFees +
      totalNonResidentExtraFees *
        (Number(calculateStay.nonResidentCommission) / 100) +
      activityTotalPrice;

  useEffect(() => {
    updateTotals(calculateStay.id, residentFullTotalPrice, true);
    updateTotals(calculateStay.id, nonResidentFullTotalPrice, false);
  }, []);

  const residentExtraFees: ExtraFee[] = calculateStay.extraFee.filter(
    (item) => item.guestType === "Resident"
  );

  const nonResidentExtraFees: ExtraFee[] = calculateStay.extraFee.filter(
    (item) => item.guestType === "Non-resident"
  );

  return (
    <div className="px-5 py-3">
      {!!(nonResidentFullTotalPrice || residentFullTotalPrice) && (
        <>
          <Text className={"font-bold font-serif text-xl "} mt={6} mb={8}>
            {calculateStay.name}
          </Text>

          {calculateStay.date[0] && calculateStay.date[1] && (
            <div className="mt-4 border-y border-x-0 border-solid border-gray-200 py-6">
              <div className="flex justify-between gap-8 ">
                <div className="flex w-[45%] flex-col gap-2">
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
              {/* <Divider size="xs" color="#a5a5a5" mt={8}></Divider> */}
            </div>
          )}

          <div className="relative">
            <div className="w-full py-4">
              <Text className={"font-bold font-serif text-base "} mb={4}>
                Non-Resident
              </Text>
              {calculateStay.date[0] &&
                calculateStay.date[1] &&
                totalNumberOfNonResidentGuests > 0 &&
                countRoomType.length > 0 && (
                  <div className="flex flex-col gap-2 border-b border-t-0 border-x-0 border-solid border-gray-200 pb-5 pt-2">
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
                  <div className="flex py-5 flex-col gap-2">
                    <Flex
                      justify="space-between"
                      className="mt-2"
                      align="center"
                    >
                      <Text size="sm" weight={700}>
                        Guests
                      </Text>

                      {!summarizedCalculation && (
                        <Text size="sm" weight={600}>
                          {totalNonResidentPrice
                            ? `$ ${totalNonResidentPrice.toLocaleString()}`
                            : ""}
                        </Text>
                      )}
                    </Flex>

                    <Flex direction="column" gap={2}>
                      {calculateStay.rooms.map((room, index) => (
                        <NonResidentGuestsSummary
                          key={index}
                          summarizedCalculation={summarizedCalculation}
                          includeClientInCalculation={
                            includeClientInCalculation
                          }
                          commission={Number(
                            calculateStay.nonResidentCommission
                          )}
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
                  <div className="flex py-5 border-t border-b-0 border-x-0 border-solid border-gray-200 flex-col gap-2">
                    <Flex justify="space-between" align="center">
                      <Text size="sm" weight={700}>
                        Park/conservancy fees
                      </Text>

                      {!summarizedCalculation && (
                        <Text size="sm" weight={600}>
                          {totalNonResidentParkFees
                            ? `$ ${totalNonResidentParkFees.toLocaleString()}`
                            : ""}{" "}
                        </Text>
                      )}
                    </Flex>

                    <Flex direction="column" gap={2}>
                      <NonResidentFeesSummary
                        summarizedCalculation={summarizedCalculation}
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
                  <div className="flex py-5 border-t border-b-0 border-x-0 border-solid border-gray-200 flex-col gap-2">
                    <Flex justify="space-between" align="center">
                      <Text size="sm" weight={700}>
                        Activities
                      </Text>

                      {!summarizedCalculation && (
                        <Text size="sm" weight={600}>
                          {activityTotalPrice
                            ? `$ ${activityTotalPrice.toLocaleString()}`
                            : ""}
                        </Text>
                      )}
                    </Flex>

                    <Flex direction="column" gap={2}>
                      {calculateStay.activityFee.map((activity, index) => (
                        <ActivitiesSummary
                          key={index}
                          activity={activity}
                          numberOfGuests={
                            totalNumberOfGuests + totalNumberOfNonResidentGuests
                          }
                          summarizedCalculation={summarizedCalculation}
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
                  <div className="flex py-5 border-t border-solid border-x-0 border-b-0 border-gray-200 flex-col gap-2">
                    <Flex justify="space-between" align="center">
                      <Text size="sm" weight={700} className="">
                        Extra Fees
                      </Text>

                      {!summarizedCalculation && (
                        <Text size="sm" weight={600}>
                          {totalNonResidentExtraFees
                            ? `$ ${totalNonResidentExtraFees.toLocaleString()}`
                            : ""}
                        </Text>
                      )}
                    </Flex>

                    <Flex direction="column" gap={2}>
                      {nonResidentExtraFees.map((fee, index) => (
                        <ExtraFeesSummary
                          key={index}
                          index={index}
                          fee={fee}
                          summarizedCalculation={summarizedCalculation}
                          includeClientInCalculation={
                            includeClientInCalculation
                          }
                          commission={Number(
                            calculateStay.nonResidentCommission
                          )}
                          numberOfGuests={totalNumberOfGuests}
                          nights={nights}
                        ></ExtraFeesSummary>
                      ))}
                    </Flex>
                  </div>
                )}

              {!!calculateStay.nonResidentCommission &&
                !includeClientInCalculation &&
                !summarizedCalculation && (
                  <div className="flex pt-5 border-t border-b-0 border-x-0 border-solid border-gray-200 flex-col gap-2">
                    <Flex justify="space-between" align="center">
                      <Text size="md" weight={700} className="">
                        Non-resident Commission
                      </Text>

                      <Text size="md" weight={600}>
                        {calculateStay.nonResidentCommission}%
                      </Text>
                    </Flex>
                  </div>
                )}

              {(!calculateStay.date[0] || !calculateStay.date[1]) && (
                <div className="flex flex-col mt-12 mx-auto items-center gap-2">
                  <IconCalculator></IconCalculator>
                  <Text size={"sm"} className="text-gray-600 text-center">
                    No data to display
                  </Text>
                </div>
              )}
            </div>

            {!!calculateStay.date[0] &&
              !!calculateStay.date[1] &&
              totalNumberOfNonResidentGuests > 0 &&
              !!calculateStay.rooms[0].name &&
              !!nonResidentFullTotalPrice && (
                <div className="flex pb-5 border-t-0 border-b border-x-0 border-solid border-gray-200 items-center justify-between">
                  <Text className="text-black font-bold" size="md">
                    Non-resident Total
                  </Text>
                  <Text size="md" weight={700}>
                    {nonResidentFullTotalPrice
                      ? `$ ${nonResidentFullTotalPrice.toLocaleString()}`
                      : ""}
                  </Text>
                </div>
              )}
          </div>

          {/* {residentFullTotalPrice > 0 && nonResidentFullTotalPrice > 0 && (
            <Divider size="xs" color="#a5a5a5" my={12}></Divider>
          )} */}

          {residentFullTotalPrice > 0 && (
            <div className="relative mt-5">
              <Text className={"font-bold font-serif text-base "} mb={4}>
                Resident
              </Text>
              <div className="w-full pb-4">
                {calculateStay.date[0] &&
                  calculateStay.date[1] &&
                  totalNumberOfGuests > 0 &&
                  countRoomType.length > 0 && (
                    <div className="flex flex-col gap-2 border-b border-t-0 border-x-0 border-solid border-gray-200 pb-5 pt-2">
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
                    <div className="flex py-5 flex-col gap-2">
                      <Flex
                        justify="space-between"
                        className="mt-2"
                        align="center"
                      >
                        <Text size="sm" weight={700}>
                          Guests
                        </Text>

                        {!summarizedCalculation && (
                          <Text size="sm" weight={600}>
                            {totalResidentPrice
                              ? `KES ${totalResidentPrice.toLocaleString()}`
                              : ""}{" "}
                          </Text>
                        )}
                      </Flex>

                      <Flex direction="column" gap={2}>
                        {calculateStay.rooms.map((room, index) => (
                          <GuestsSummary
                            key={index}
                            room={room}
                            summarizedCalculation={summarizedCalculation}
                            includeClientInCalculation={
                              includeClientInCalculation
                            }
                            commission={Number(
                              calculateStay.residentCommission
                            )}
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
                    <div className="flex py-5 border-t border-b-0 border-x-0 border-solid border-gray-200 flex-col gap-2">
                      <Flex justify="space-between" align="center">
                        <Text size="sm" weight={700}>
                          Park/conservancy fees
                        </Text>

                        {!summarizedCalculation && (
                          <Text size="sm" weight={600}>
                            {totalResidentParkFees
                              ? `KES ${totalResidentParkFees.toLocaleString()}`
                              : ""}{" "}
                          </Text>
                        )}
                      </Flex>

                      <Flex direction="column" gap={2}>
                        <FeesSummary
                          rooms={calculateStay.rooms}
                          summarizedCalculation={summarizedCalculation}
                          nights={days}
                        ></FeesSummary>
                      </Flex>
                    </div>
                  )}

                {calculateStay.date[0] &&
                  calculateStay.date[1] &&
                  totalNumberOfGuests > 0 &&
                  calculateStay.activityFee.length > 0 && (
                    <div className="flex py-5 border-t border-b-0 border-x-0 border-solid border-gray-200 flex-col gap-2">
                      <Flex justify="space-between" align="center">
                        <Text size="sm" weight={700}>
                          Activities
                        </Text>

                        {!summarizedCalculation && (
                          <Text size="sm" weight={600}>
                            {activityResidentTotalPrice
                              ? `$ ${activityResidentTotalPrice.toLocaleString()}`
                              : ""}
                          </Text>
                        )}
                      </Flex>

                      <Flex direction="column" gap={2}>
                        {calculateStay.activityFee.map((activity, index) => (
                          <ActivitiesResidentSummary
                            key={index}
                            activity={activity}
                            summarizedCalculation={summarizedCalculation}
                            numberOfGuests={
                              totalNumberOfGuests +
                              totalNumberOfNonResidentGuests
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
                    <div className="flex py-5 border-t border-b-0 border-x-0 border-solid border-gray-200 flex-col gap-2">
                      <Flex justify="space-between" align="center">
                        <Text size="sm" weight={700} className="">
                          Extra Fees
                        </Text>

                        {!summarizedCalculation && (
                          <Text size="sm" weight={600}>
                            {totalResidentExtraFees
                              ? `KES ${totalResidentExtraFees.toLocaleString()}`
                              : ""}{" "}
                          </Text>
                        )}
                      </Flex>

                      <Flex direction="column" gap={2}>
                        {residentExtraFees.map((fee, index) => (
                          <ExtraFeesSummary
                            key={index}
                            index={index}
                            fee={fee}
                            summarizedCalculation={summarizedCalculation}
                            includeClientInCalculation={
                              includeClientInCalculation
                            }
                            commission={Number(
                              calculateStay.nonResidentCommission
                            )}
                            numberOfGuests={totalNumberOfGuests}
                            nights={nights}
                          ></ExtraFeesSummary>
                        ))}
                      </Flex>
                    </div>
                  )}

                {calculateStay.residentCommission &&
                  !includeClientInCalculation &&
                  !summarizedCalculation && (
                    <div className="flex pt-5 border-t border-b-0 border-x-0 border-solid border-gray-200 flex-col gap-2">
                      <Flex justify="space-between" align="center">
                        <Text size="md" weight={700} className="">
                          Resident Commission
                        </Text>

                        <Text size="md" weight={600}>
                          {calculateStay.residentCommission}%
                        </Text>
                      </Flex>
                    </div>
                  )}

                {(!calculateStay.date[0] || !calculateStay.date[1]) && (
                  <div className="flex flex-col mt-12 mx-auto items-center gap-2">
                    <IconCalculator></IconCalculator>
                    <Text size={"sm"} className="text-gray-600 text-center">
                      No data to display
                    </Text>
                  </div>
                )}
              </div>

              {!!calculateStay.date[0] &&
                !!calculateStay.date[1] &&
                totalNumberOfGuests > 0 &&
                !!calculateStay.rooms[0].name &&
                !!residentFullTotalPrice && (
                  <div className="flex border-gray-200 items-center justify-between">
                    <Text className="text-black font-bold" size="md">
                      Resident Total
                    </Text>
                    <Text size="md" weight={700}>
                      {residentFullTotalPrice
                        ? `KES ${residentFullTotalPrice.toLocaleString()}`
                        : ""}
                    </Text>
                  </div>
                )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
