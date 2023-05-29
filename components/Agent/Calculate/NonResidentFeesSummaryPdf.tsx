import { RoomType } from "@/utils/types";
import { Room } from "@/context/CalculatePage";
import pricing from "@/utils/calculation";
import { Text, View } from "@react-pdf/renderer";

type FeesSummaryProps = {
  room: Room;
  index: number;
  includeClientInCalculation: boolean;
  commission: number;
  nights: number;
};

export default function NonResidentFeesSummaryPdf({
  room,
  index,
  includeClientInCalculation,
  commission,
  nights,
}: FeesSummaryProps) {
  const roomArr = [room];

  const totalGuests = pricing.getTotalGuestsByCategory(roomArr);

  function hasAdultNonResident(room: Room): boolean {
    return room.nonResidentGuests.some(
      (guest) => guest.nonResident === "Adult"
    );
  }

  function hasChildNonResident(room: Room): boolean {
    return room.nonResidentGuests.some(
      (guest) => guest.nonResident === "Child"
    );
  }

  function hasInfantNonResident(room: Room): boolean {
    return room.nonResidentGuests.some(
      (guest) => guest.nonResident === "Infant"
    );
  }

  function hasTeenNonResident(room: Room): boolean {
    return room.nonResidentGuests.some((guest) => guest.nonResident === "Teen");
  }

  return (
    <View style={{ flexDirection: "column" }}>
      <Text style={{ fontSize: 12, fontWeight: 600 }}>
        {index + 1}. {room.name} -{" "}
        {room.package.charAt(0).toUpperCase() +
          room.package.slice(1).toLowerCase()}
      </Text>
      <View style={{ flexDirection: "column", marginLeft: 5 }}>
        {room.nonResidentParkFee.map((item, index) => (
          <View
            key={index}
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ fontSize: 12, color: "#777", fontWeight: 500 }}>
              {item.name} (For{" "}
              {item.guestType === "ADULT" && hasAdultNonResident(room)
                ? totalGuests.nonResidentAdults +
                  (totalGuests.nonResidentAdults > 1 ? " Adults" : " Adult")
                : item.guestType === "CHILD" && hasChildNonResident(room)
                ? totalGuests.nonResidentChildren +
                  (totalGuests.nonResidentChildren > 1 ? " Children" : " Child")
                : item.guestType === "INFANT" && hasInfantNonResident(room)
                ? totalGuests.nonResidentInfants +
                  (totalGuests.nonResidentInfants > 1 ? " Infants" : " Infant")
                : item.guestType === "TEEN" && hasTeenNonResident(room)
                ? totalGuests.nonResidentTeens +
                  (totalGuests.nonResidentTeens > 1 ? " Teens" : " Teen")
                : 0}
              )
            </Text>
            <Text style={{ fontSize: 12, color: "#777", fontWeight: 500 }}>
              $
              {(
                item.price *
                (item.guestType === "ADULT" && hasAdultNonResident(room)
                  ? totalGuests.nonResidentAdults
                  : item.guestType === "CHILD" && hasChildNonResident(room)
                  ? totalGuests.nonResidentChildren
                  : item.guestType === "INFANT" && hasInfantNonResident(room)
                  ? totalGuests.nonResidentInfants
                  : item.guestType === "TEEN" && hasTeenNonResident(room)
                  ? totalGuests.nonResidentTeens
                  : 0) *
                nights
              ).toLocaleString()}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
