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

export default function FeesSummaryPdf({
  room,
  index,
  includeClientInCalculation,
  commission,
  nights,
}: FeesSummaryProps) {
  const roomArr = [room];

  const totalGuests = pricing.getTotalGuestsByCategory(roomArr);

  function hasAdultResident(room: Room): boolean {
    return room.residentGuests.some((guest) => guest.resident === "Adult");
  }

  function hasChildResident(room: Room): boolean {
    return room.residentGuests.some((guest) => guest.resident === "Child");
  }

  function hasInfantResident(room: Room): boolean {
    return room.residentGuests.some((guest) => guest.resident === "Infant");
  }

  function hasTeenResident(room: Room): boolean {
    return room.residentGuests.some((guest) => guest.resident === "Teen");
  }

  return (
    <View style={{ flexDirection: "column" }}>
      <Text style={{ fontSize: 12, fontWeight: 600 }}>
        {index + 1}. {room.name} -{" "}
        {room.package.charAt(0).toUpperCase() +
          room.package.slice(1).toLowerCase()}
      </Text>
      <View style={{ flexDirection: "column", marginLeft: 5 }}>
        {room.residentParkFee.map((item, index) => (
          <View
            key={index}
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ fontSize: 12, color: "#777", fontWeight: 500 }}>
              {item.name} (For{" "}
              {item.guestType === "ADULT" && hasAdultResident(room)
                ? totalGuests.residentAdults +
                  (totalGuests.residentAdults > 1 ? " adults" : " adult")
                : item.guestType === "CHILD" && hasChildResident(room)
                ? totalGuests.residentChildren +
                  (totalGuests.residentChildren > 1 ? " children" : " child")
                : item.guestType === "INFANT" && hasInfantResident(room)
                ? totalGuests.residentInfants +
                  (totalGuests.residentInfants > 1 ? " infants" : " infant")
                : item.guestType === "TEEN" && hasTeenResident(room)
                ? totalGuests.residentTeens +
                  (totalGuests.residentTeens > 1 ? " teens" : " teen")
                : 0}
              )
            </Text>
            <Text style={{ fontSize: 12, color: "#777", fontWeight: 500 }}>
              KES
              {(
                item.price *
                (item.guestType === "ADULT" && hasAdultResident(room)
                  ? totalGuests.residentAdults
                  : item.guestType === "CHILD" && hasChildResident(room)
                  ? totalGuests.residentChildren
                  : item.guestType === "INFANT" && hasInfantResident(room)
                  ? totalGuests.residentInfants
                  : item.guestType === "TEEN" && hasTeenResident(room)
                  ? totalGuests.residentTeens
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
