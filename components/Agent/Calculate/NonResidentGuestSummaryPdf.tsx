import { Context, GuestTotal, Room } from "@/context/CalculatePage";
import pricing from "@/utils/calculation";
import { RoomType } from "@/utils/types";
import {
  Document,
  Page,
  Text,
  View,
  Font,
  StyleSheet,
} from "@react-pdf/renderer";

type GuestsSummaryProps = {
  room: Room;
  roomTypes: RoomType[] | undefined;
  index: number;
  includeClientInCalculation: boolean;
  commission: number;
};

export default function NonResidentGuestsSummaryPdf({
  room,
  roomTypes,
  index,
  includeClientInCalculation,
  commission,
}: GuestsSummaryProps) {
  const countNonResidentGuestTypes =
    pricing.countNonResidentGuestTypesWithPrice(
      room.nonResidentGuests,
      room,
      roomTypes
    );

  return (
    <View>
      <Text style={{ fontSize: 12, fontWeight: 600 }}>
        {index + 1}. {room.name} -{" "}
        {room.package.charAt(0).toUpperCase() +
          room.package.slice(1).toLowerCase()}
      </Text>

      <View style={{ marginLeft: 10, marginTop: 5 }}>
        {countNonResidentGuestTypes.map((guestType, index) => (
          <View
            key={index}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 12, color: "gray" }}>
              {guestType.name}
            </Text>
            <Text style={{ fontSize: 12, color: "gray" }}>
              $
              {guestType.price &&
                pricing
                  .clientIncludedInPrice(
                    guestType.price,
                    includeClientInCalculation,
                    commission
                  )
                  .toLocaleString()}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
