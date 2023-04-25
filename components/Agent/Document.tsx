import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  Font,
  StyleSheet,
} from "@react-pdf/renderer";
import { getRoomTypes } from "@/pages/api/stays";
import pricing, { countRoomTypes } from "@/utils/calculation";
import { Stay } from "@/utils/types";
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
import { Open_Sans } from "next/font/google";
import GuestsSummaryPdf from "./Calculate/GuestSummaryPdf";
import FeesSummaryPdf from "./Calculate/FeesSummaryPdf";
import ExtraFeesSummaryPdf from "./Calculate/ExtraFeesSummaryPdf";
import NonResidentGuestsSummaryPdf from "./Calculate/NonResidentGuestSummaryPdf";
import NonResidentFeesSummaryPdf from "./Calculate/NonResidentFeesSummaryPdf";
import ActivitiesSummaryPdf from "./Calculate/ActivitySummaryPdf";
// import OpenSansBold from "../../public/fonts/OpenSans-Bold.ttf";

type SummaryProps = {
  calculateStay: StateType;
  stays?: Stay[];
  index: number;
  updateResidentTotal: (value: number, index: number) => void;
  updateNonResidentTotal: (value: number, index: number) => void;
};

Font.register({
  family: "Open Sans",
  fonts: [
    {
      src: "/fonts/OpenSans-Bold.ttf",
      fontWeight: 700,
    },
    {
      src: "/fonts/OpenSans-Medium.ttf",
      fontWeight: 600,
    },
    {
      src: "/fonts/OpenSans-Regular.ttf",
      fontWeight: 400,
    },
  ],
});

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 20,
  },
  pageTitle: {
    color: "red",
    fontFamily: "Open Sans",
    fontWeight: 700,
    fontSize: 24,
    marginBottom: 8,
  },
  section: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    fontFamily: "Open Sans",
    marginBottom: 8,
  },
  subSection: {
    display: "flex",
    width: "50%",
    fontFamily: "Open Sans",
    gap: 2,
    padding: 4,
  },
  subSectionIcon: {
    color: "#ccc",
    marginRight: 4,
  },
  subSectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    fontFamily: "Open Sans",
  },
  subSectionValue: {
    fontSize: 10,
    fontWeight: 500,
    fontFamily: "Open Sans",
  },
  nights: {
    fontSize: 12,
    fontWeight: 600,
    width: 60,
    textAlign: "center",
    border: "1 solid #ccc",
    fontFamily: "Open Sans",
    padding: 4,
  },
  divider: {
    marginTop: 8,
    borderWidth: 0.5,
    borderColor: "#ccc",
  },
});

// Create Document Component
const MyDocument = ({
  calculateStay,
  stays,
  updateResidentTotal,
  updateNonResidentTotal,
  index,
}: SummaryProps) => {
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
    <Page style={styles.page} size="A4">
      <View>
        <Text style={styles.pageTitle}>{calculateStay.name}</Text>

        {calculateStay.date[0] && calculateStay.date[1] && (
          <>
            <View style={styles.section}>
              <View
                style={{
                  ...styles.subSection,
                  borderRightWidth: 1,
                  borderRightColor: "#E5E5E5",
                }}
              >
                <IconCalendarEvent style={styles.subSectionIcon} />
                <View>
                  <Text style={styles.subSectionTitle}>Check-in</Text>
                  <Text style={styles.subSectionValue}>
                    {moment(calculateStay.date[0]?.toLocaleDateString()).format(
                      "DD MMM YYYY"
                    )}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  ...styles.subSection,
                  paddingLeft: 10,
                }}
              >
                <IconCalendarEvent style={styles.subSectionIcon} />
                <View>
                  <Text style={styles.subSectionTitle}>Check-out</Text>
                  <Text style={styles.subSectionValue}>
                    {moment(calculateStay.date[1]?.toLocaleDateString()).format(
                      "DD MMM YYYY"
                    )}
                  </Text>
                </View>
              </View>
            </View>

            <Text style={styles.nights}>
              {nights} {nights > 1 ? "nights" : "night"}
            </Text>
            <View style={styles.divider}></View>
          </>
        )}
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          borderBottomWidth: 1,
          borderColor: "#E5E5E5",
          paddingBottom: 6,
        }}
      >
        <View
          style={{
            display: "flex",
            width: "50%",
            borderRightWidth: 1,
            borderRightColor: "#E5E5E5",
            flexDirection: "column",
            marginTop: 10,
            fontFamily: "Open Sans",
            paddingRight: 10,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            Non-Resident
          </Text>

          {calculateStay.date[0] &&
            calculateStay.date[1] &&
            countRoomType.length > 0 && (
              <View style={{ marginTop: 10 }}>
                <Text style={{ fontSize: 12, fontWeight: 700 }}>Rooms</Text>
                <View style={{ flexDirection: "column", marginTop: 5 }}>
                  {countRoomType.map((item, index) => (
                    <Text key={index} style={{ fontSize: 12 }}>
                      {item}
                    </Text>
                  ))}
                </View>
              </View>
            )}

          {!!calculateStay.date[0] &&
            !!calculateStay.date[1] &&
            calculateStay.rooms[0].nonResidentGuests.length > 0 && (
              <View style={{ marginTop: 10 }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontSize: 12, fontWeight: 700 }}>Guests</Text>
                  <Text style={{ fontSize: 12, fontWeight: 600 }}>
                    {totalNonResidentPrice
                      ? `$ ${totalNonResidentPrice.toLocaleString()}`
                      : ""}
                  </Text>
                </View>
                <View style={{ marginTop: 5, flexDirection: "column" }}>
                  {calculateStay.rooms.map((room, index) => (
                    <NonResidentGuestsSummaryPdf
                      key={index}
                      room={room}
                      index={index}
                      roomTypes={roomTypes}
                    />
                  ))}
                </View>
              </View>
            )}

          {calculateStay.date[0] &&
            calculateStay.date[1] &&
            calculateStay.rooms[0].nonResidentParkFee.length > 0 && (
              <View
                style={{
                  marginTop: 8,
                  flexDirection: "column",
                  borderTopWidth: 1,
                  borderColor: "#E5E5E5",
                  paddingTop: 8,
                  paddingBottom: 8,
                }}
              >
                {/* <Divider style={{ marginTop: 8 }}></Divider> */}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontSize: 12, fontWeight: "bold" }}>Fees</Text>
                  <Text style={{ fontSize: 12, fontWeight: 600 }}>
                    {feePrice.nonResidentTotalFeePrice
                      ? `$ ${feePrice.nonResidentTotalFeePrice.toLocaleString()}`
                      : ""}
                  </Text>
                </View>
                <View style={{ marginTop: 5, flexDirection: "column" }}>
                  {calculateStay.rooms.map((room, index) => (
                    <NonResidentFeesSummaryPdf
                      key={index}
                      room={room}
                      index={index}
                    ></NonResidentFeesSummaryPdf>
                  ))}
                </View>
              </View>
            )}

          {!!calculateStay.date[0] &&
            !!calculateStay.date[1] &&
            !!calculateStay.extraFee[0].name && (
              <View
                style={{
                  marginTop: 8,
                  flexDirection: "column",
                  borderTopWidth: 1,
                  borderColor: "#E5E5E5",
                  paddingTop: 8,
                  paddingBottom: 8,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontSize: 12, fontWeight: 700 }}>
                    Extra Fees
                  </Text>

                  <Text style={{ fontSize: 12, fontWeight: 600 }}>
                    {totalNonResidentExtraFees
                      ? `KES ${totalNonResidentExtraFees.toLocaleString()}`
                      : ""}
                  </Text>
                </View>

                <View style={{ flexDirection: "column", marginTop: 5 }}>
                  {nonResidentExtraFees.map((fee, index) => (
                    <ExtraFeesSummaryPdf
                      key={index}
                      index={index}
                      fee={fee}
                      numberOfGuests={totalNumberOfGuests}
                      nights={nights}
                    />
                  ))}
                </View>
              </View>
            )}

          {!!calculateStay.residentCommission && (
            <View
              style={{
                marginTop: 8,
                borderTopWidth: 1,
                borderColor: "#E5E5E5",
                paddingTop: 8,
                paddingBottom: 8,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: 12, fontWeight: 700 }}>
                  Non-resident Commission
                </Text>
                <Text style={{ fontSize: 12, fontWeight: 600 }}>
                  {calculateStay.nonResidentCommission}%
                </Text>
              </View>
            </View>
          )}
        </View>
        <View
          style={{
            display: "flex",
            width: "50%",
            flexDirection: "column",
            marginTop: 10,
            fontFamily: "Open Sans",
            paddingLeft: 10,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            Resident
          </Text>

          {calculateStay.date[0] &&
            calculateStay.date[1] &&
            countRoomType.length > 0 && (
              <View style={{ marginTop: 10 }}>
                <Text style={{ fontSize: 12, fontWeight: 700 }}>Rooms</Text>
                <View style={{ flexDirection: "column", marginTop: 5 }}>
                  {countRoomType.map((item, index) => (
                    <Text key={index} style={{ fontSize: 12 }}>
                      {item}
                    </Text>
                  ))}
                </View>
              </View>
            )}

          {calculateStay.date[0] &&
            calculateStay.date[1] &&
            calculateStay.rooms[0].residentGuests.length > 0 && (
              <View style={{ marginTop: 10 }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontSize: 12, fontWeight: 700 }}>Guests</Text>
                  <Text style={{ fontSize: 12, fontWeight: 600 }}>
                    {totalResidentPrice
                      ? `KES ${totalResidentPrice.toLocaleString()}`
                      : ""}
                  </Text>
                </View>
                <View style={{ marginTop: 5, flexDirection: "column" }}>
                  {calculateStay.rooms.map((room, index) => (
                    <GuestsSummaryPdf
                      key={index}
                      room={room}
                      index={index}
                      roomTypes={roomTypes}
                    />
                  ))}
                </View>
              </View>
            )}

          {((calculateStay.date[0] &&
            calculateStay.date[1] &&
            calculateStay.rooms[0].residentParkFee.length > 0) ||
            (calculateStay.date[0] &&
              calculateStay.date[1] &&
              calculateStay.rooms[0].nonResidentParkFee.length > 0)) && (
            <View
              style={{
                marginTop: 8,
                flexDirection: "column",
                borderTopWidth: 1,
                borderColor: "#E5E5E5",
                paddingTop: 8,
                paddingBottom: 8,
              }}
            >
              {/* <Divider style={{ marginTop: 8 }}></Divider> */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: 12, fontWeight: "bold" }}>Fees</Text>
                <Text style={{ fontSize: 12, fontWeight: 600 }}>
                  {feePrice.residentTotalFeePrice
                    ? `KES ${feePrice.residentTotalFeePrice.toLocaleString()}`
                    : ""}
                </Text>
              </View>
              <View style={{ marginTop: 5, flexDirection: "column" }}>
                {calculateStay.rooms.map((room, index) => (
                  <FeesSummaryPdf
                    key={index}
                    room={room}
                    index={index}
                  ></FeesSummaryPdf>
                ))}
              </View>
            </View>
          )}

          {!!calculateStay.date[0] &&
            !!calculateStay.date[1] &&
            !!calculateStay.extraFee[0].name && (
              <View
                style={{
                  marginTop: 8,
                  flexDirection: "column",
                  borderTopWidth: 1,
                  borderColor: "#E5E5E5",
                  paddingTop: 8,
                  paddingBottom: 8,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontSize: 12, fontWeight: 700 }}>
                    Extra Fees
                  </Text>

                  <Text style={{ fontSize: 12, fontWeight: 600 }}>
                    {totalResidentExtraFees
                      ? `KES ${totalResidentExtraFees.toLocaleString()}`
                      : ""}
                  </Text>
                </View>

                <View style={{ flexDirection: "column", marginTop: 5 }}>
                  {residentExtraFees.map((fee, index) => (
                    <ExtraFeesSummaryPdf
                      key={index}
                      index={index}
                      fee={fee}
                      numberOfGuests={totalNumberOfGuests}
                      nights={nights}
                    />
                  ))}
                </View>
              </View>
            )}

          {!!calculateStay.residentCommission && (
            <View
              style={{
                marginTop: 8,
                borderTopWidth: 1,
                borderColor: "#E5E5E5",
                paddingTop: 8,
                paddingBottom: 8,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: 12, fontWeight: 700 }}>
                  Resident Commission
                </Text>
                <Text style={{ fontSize: 12, fontWeight: 600 }}>
                  {calculateStay.residentCommission}%
                </Text>
              </View>
            </View>
          )}
        </View>
      </View>

      <View
        style={{
          flexDirection: "column",
          marginTop: 10,
        }}
      >
        {!!calculateStay.date[0] &&
          !!calculateStay.date[1] &&
          !!calculateStay.rooms[0].name &&
          !!nonResidentFullTotalPrice && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                borderBottom: 1,
                borderColor: "#DCDCDC",
                padding: 4,
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: "Open Sans",
                  fontWeight: 700,
                }}
              >
                NON-RESIDENT TOTAL
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: "Open Sans",
                  fontWeight: 700,
                }}
              >
                {nonResidentFullTotalPrice
                  ? `$ ${nonResidentFullTotalPrice.toLocaleString()}`
                  : ""}
              </Text>
            </View>
          )}

        {!!calculateStay.date[0] &&
          !!calculateStay.date[1] &&
          !!calculateStay.rooms[0].name &&
          !!residentFullTotalPrice && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                borderBottom: 1,
                borderColor: "#DCDCDC",
                padding: 4,
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: "Open Sans",
                  fontWeight: 700,
                }}
              >
                RESIDENT TOTAL
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: "Open Sans",
                  fontWeight: 700,
                }}
              >
                {residentFullTotalPrice
                  ? `KES ${residentFullTotalPrice.toLocaleString()}`
                  : ""}
              </Text>
            </View>
          )}
      </View>

      {!!calculateStay.date[0] &&
        calculateStay.date[1] &&
        calculateStay.activityFee.length > 0 && (
          <View
            style={{
              fontFamily: "Open Sans",
            }}
          >
            {/* <Divider size="xs" style={{ marginTop: 8 }}></Divider> */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 7,
              }}
            >
              <Text style={{ fontSize: 12, fontWeight: 600 }}>Activities</Text>

              <Text style={{ fontSize: 12, fontWeight: 600 }}>
                {activityTotalPrice
                  ? `$ ${activityTotalPrice.toLocaleString()}`
                  : ""}
              </Text>
            </View>

            <View style={{ flexDirection: "column", marginTop: 7 }}>
              {calculateStay.activityFee.map((activity, index) => (
                <ActivitiesSummaryPdf
                  key={index}
                  activity={activity}
                  numberOfGuests={
                    totalNumberOfGuests + totalNumberOfNonResidentGuests
                  }
                  nights={nights}
                ></ActivitiesSummaryPdf>
              ))}
            </View>
          </View>
        )}
    </Page>
  );
};

export default MyDocument;
