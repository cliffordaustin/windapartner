import { getRoomTypes } from "@/pages/api/stays";
import pricing, { countRoomTypes } from "@/utils/calculation";
import { Stay } from "@/utils/types";
import { Divider, Flex, Tabs, Text } from "@mantine/core";
import { IconCalculator, IconCalendarEvent } from "@tabler/icons-react";
import moment from "moment";
import { useQuery } from "react-query";
import GuestsSummary from "./Calculate/GuestsSummary";
import {
  Context,
  ExtraFee,
  GuestTotal,
  StateType,
} from "@/context/CalculatePage";
import FeesSummary from "./Calculate/FeesSummary";
import ExtraFeesSummary from "./Calculate/ExtraFeesSummary";
import NonResidentFeesSummary from "./Calculate/NonResidentFeeSummary";
import NonResidentGuestsSummary from "./Calculate/NonResidentGuestsSummary";
import ActivitiesSummary from "./Calculate/ActivitiesSummary";
import { useEffect } from "react";

type SummaryProps = {
  calculateStay: StateType;
  stays?: Stay[];
  index: number;
  updateResidentTotal: (value: number, index: number) => void;
  updateNonResidentTotal: (value: number, index: number) => void;
};

export default function PdfSummary({
  calculateStay,
  stays,
  updateResidentTotal,
  updateNonResidentTotal,
  index,
}: SummaryProps) {
  const countRoomType = countRoomTypes(calculateStay.rooms);

  const currentStay = stays?.find((item) => item.id === calculateStay.id);
  const queryStr = currentStay ? currentStay.slug : "room-type";

  const { data: roomTypes, isLoading: roomTypesLoading } = useQuery(
    queryStr,
    () =>
      getRoomTypes(
        currentStay,
        moment(calculateStay.date[0]?.toLocaleDateString()).format(
          "YYYY-MM-DD"
        ),
        moment(calculateStay.date[1]?.toLocaleDateString()).format("YYYY-MM-DD")
      ),
    { enabled: calculateStay.date[0] && calculateStay.date[1] ? true : false }
  );

  const nights = moment(calculateStay.date[1]).diff(
    moment(calculateStay.date[0]),
    "days"
  );

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

  const totalGuests = pricing.getTotalGuestsByCategory(calculateStay.rooms);
  const totalPriceParkFee = pricing.getTotalParkFeesByCategory(
    calculateStay.rooms
  );

  const totalNumberOfResidentAdultGuests =
    totalPriceParkFee.residentParkFee.adult * totalGuests.residentAdults;

  const totalNumberOfResidentChildGuests =
    totalPriceParkFee.residentParkFee.child * totalGuests.residentChildren;

  const totalNumberOfResidentTeenGuests =
    totalPriceParkFee.residentParkFee.teen * totalGuests.residentTeens;

  const totalNumberOfResidentInfantGuests =
    totalPriceParkFee.residentParkFee.infant * totalGuests.residentInfants;

  const totalNumberOfNonResidentAdultGuests =
    totalPriceParkFee.nonResidentParkFee.adult * totalGuests.nonResidentAdults;

  const totalNumberOfNonResidentChildGuests =
    totalPriceParkFee.nonResidentParkFee.child *
    totalGuests.nonResidentChildren;

  const totalNumberOfNonResidentTeenGuests =
    totalPriceParkFee.nonResidentParkFee.teen * totalGuests.nonResidentTeens;

  const totalNumberOfNonResidentInfantGuests =
    totalPriceParkFee.nonResidentParkFee.infant *
    totalGuests.nonResidentInfants;

  const totalResidentFee =
    totalNumberOfResidentAdultGuests +
    totalNumberOfResidentChildGuests +
    totalNumberOfResidentTeenGuests +
    totalNumberOfResidentInfantGuests;

  const totalNonResidentFee =
    totalNumberOfNonResidentAdultGuests +
    totalNumberOfNonResidentChildGuests +
    totalNumberOfNonResidentTeenGuests +
    totalNumberOfNonResidentInfantGuests;

  const activityTotalPrice = pricing.calculateActivityFees(
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

  const feePrice = pricing.calculateRoomFees(calculateStay.rooms);

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
    feePrice.residentTotalFeePrice +
    totalResidentExtraFees;

  residentFullTotalPrice =
    residentFullTotalPrice +
    (residentFullTotalPrice * Number(calculateStay.residentCommission)) / 100;

  let nonResidentFullTotalPrice =
    totalNonResidentPrice +
    feePrice.nonResidentTotalFeePrice +
    totalNonResidentExtraFees;

  nonResidentFullTotalPrice =
    nonResidentFullTotalPrice +
    (nonResidentFullTotalPrice * Number(calculateStay.nonResidentCommission)) /
      100;

  const residentExtraFees: ExtraFee[] = calculateStay.extraFee.filter(
    (item) => item.guestType === "Resident"
  );

  const nonResidentExtraFees: ExtraFee[] = calculateStay.extraFee.filter(
    (item) => item.guestType === "Non-resident"
  );

  useEffect(() => {
    updateResidentTotal(residentFullTotalPrice, index);
  }, [residentFullTotalPrice, index, updateResidentTotal]);

  useEffect(() => {
    updateNonResidentTotal(nonResidentFullTotalPrice, index);
  }, [nonResidentFullTotalPrice, index, updateNonResidentTotal]);

  return (
    <div className="w-full px-4 py-4">
      <Text color="red" className="font-bold font-serif text-3xl" mb={8}>
        {calculateStay.name}
      </Text>

      {calculateStay.date[0] && calculateStay.date[1] && (
        <>
          <div className="flex justify-between gap-8">
            <div className="flex border w-[45%] items-center gap-2">
              <IconCalendarEvent className="text-gray-500"></IconCalendarEvent>
              <div>
                <div className="flex gap-2 items-center">
                  <Text size="sm">Check-in</Text>
                </div>

                <Text size="sm" weight={500}>
                  {moment(calculateStay.date[0]?.toLocaleDateString()).format(
                    "DD MMM YYYY"
                  )}
                </Text>
              </div>
            </div>

            <div className="flex border w-[45%] items-center gap-2">
              <IconCalendarEvent className="text-gray-500"></IconCalendarEvent>
              <div>
                <div className="flex gap-2 items-center">
                  <Text size="sm">Check-out</Text>
                </div>

                <Text size="sm" weight={500}>
                  {moment(calculateStay.date[1]?.toLocaleDateString()).format(
                    "DD MMM YYYY"
                  )}
                </Text>
              </div>
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

      <div className="flex mt-2">
        <div className="flex flex-col gap-1 pr-4 w-[50%] border-y-transparent border-l-transparent border-r border-gray-300 border-solid">
          <Text className="font-bold font-serif">Resident</Text>

          {calculateStay.date[0] &&
            calculateStay.date[1] &&
            countRoomType.length > 0 && (
              <div className="flex flex-col ml-1 gap-2">
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

          {((calculateStay.date[0] &&
            calculateStay.date[1] &&
            calculateStay.rooms[0].residentParkFee.length > 0) ||
            (calculateStay.date[0] &&
              calculateStay.date[1] &&
              calculateStay.rooms[0].nonResidentParkFee.length > 0)) && (
            <div className="flex flex-col gap-2">
              <Divider size="xs" mt={8}></Divider>
              <Flex justify="space-between" align="center">
                <Text size="sm" weight={700}>
                  Fees
                </Text>

                <Text size="sm" weight={600}>
                  {feePrice.residentTotalFeePrice
                    ? `KES ${feePrice.residentTotalFeePrice.toLocaleString()}`
                    : ""}{" "}
                </Text>
              </Flex>

              <Flex direction="column" gap={2}>
                {calculateStay.rooms.map((room, index) => (
                  <FeesSummary
                    key={index}
                    room={room}
                    index={index}
                  ></FeesSummary>
                ))}
              </Flex>
            </div>
          )}

          {calculateStay.date[0] &&
            calculateStay.date[1] &&
            calculateStay.extraFee[0].name && (
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
        </div>

        <div className="flex flex-col gap-1 w-[50%] pl-4">
          <Text className="font-bold font-serif">Non-Resident</Text>

          {calculateStay.date[0] &&
            calculateStay.date[1] &&
            countRoomType.length > 0 && (
              <div className="flex flex-col ml-1 gap-2">
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

          {((calculateStay.date[0] &&
            calculateStay.date[1] &&
            calculateStay.rooms[0].residentParkFee.length > 0) ||
            (calculateStay.date[0] &&
              calculateStay.date[1] &&
              calculateStay.rooms[0].nonResidentParkFee.length > 0)) && (
            <div className="flex flex-col gap-2">
              <Divider size="xs" mt={8}></Divider>
              <Flex justify="space-between" align="center">
                <Text size="sm" weight={700}>
                  Fees
                </Text>

                <Text size="sm" weight={600}>
                  {feePrice.nonResidentTotalFeePrice
                    ? `$ ${feePrice.nonResidentTotalFeePrice.toLocaleString()}`
                    : ""}{" "}
                </Text>
              </Flex>

              <Flex direction="column" gap={2}>
                {calculateStay.rooms.map((room, index) => (
                  <NonResidentFeesSummary
                    key={index}
                    room={room}
                    index={index}
                  ></NonResidentFeesSummary>
                ))}
              </Flex>
            </div>
          )}

          {calculateStay.date[0] &&
            calculateStay.date[1] &&
            calculateStay.extraFee[0].name && (
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
        </div>
      </div>

      {!!calculateStay.date[0] &&
        !!calculateStay.date[1] &&
        !!calculateStay.rooms[0].name &&
        !!residentFullTotalPrice && (
          <div className="flex items-center justify-between mt-2 w-full bg-white border-x-transparent border-b-transparent border-t border-t-gray-200 border-solid py-2">
            <Text className="font-serif font-bold text-sm">RESIDENT TOTAL</Text>

            <Text size="md" className="font-sans" weight={700}>
              {residentFullTotalPrice
                ? `KES ${residentFullTotalPrice.toLocaleString()}`
                : ""}{" "}
            </Text>
          </div>
        )}

      {!!calculateStay.date[0] &&
        !!calculateStay.date[1] &&
        !!calculateStay.rooms[0].name &&
        !!nonResidentFullTotalPrice && (
          <div className="flex items-center justify-between mt-2 w-full bg-white border-x-transparent border-b-transparent border-t border-t-gray-200 border-solid py-2">
            <Text className="font-serif font-bold text-sm">
              NON-RESIDENT TOTAL
            </Text>
            <Text size="md" className="font-sans" weight={700}>
              {nonResidentFullTotalPrice
                ? `$ ${nonResidentFullTotalPrice.toLocaleString()}`
                : ""}
            </Text>
          </div>
        )}

      {calculateStay.date[0] &&
        calculateStay.date[1] &&
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
    </div>
  );
}
