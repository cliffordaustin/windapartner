import { RoomType } from "@/utils/types";
import { Room } from "@/context/CalculatePage";
import { Text } from "@mantine/core";
import pricing from "@/utils/calculation";

type FeesSummaryProps = {
  room: Room;
  index: number;
  nights: number;
};

export default function NonResidentFeesSummary({
  room,
  index,
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
    <div>
      <Text size="sm" weight={600}>
        {index + 1}. {room.name} -{" "}
        {room.package.charAt(0).toUpperCase() +
          room.package.slice(1).toLowerCase()}
      </Text>
      <div className="flex flex-col gap-1 ml-1">
        {room.nonResidentParkFee.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <Text size="sm" className="text-gray-600" weight={500}>
              {item.name} (For {""}{" "}
              {item.guestType === "ADULT" && hasAdultNonResident(room)
                ? totalGuests.nonResidentAdults +
                  (totalGuests.nonResidentAdults > 1 ? " adults" : " adult")
                : item.guestType === "CHILD" && hasChildNonResident(room)
                ? totalGuests.nonResidentChildren +
                  (totalGuests.nonResidentChildren > 1 ? " children" : " child")
                : item.guestType === "INFANT" && hasInfantNonResident(room)
                ? totalGuests.nonResidentInfants +
                  (totalGuests.nonResidentInfants > 1 ? " infants" : " infant")
                : item.guestType === "TEEN" && hasTeenNonResident(room)
                ? totalGuests.nonResidentTeens +
                  (totalGuests.nonResidentTeens > 1 ? " teens" : " teen")
                : 0}
              )
            </Text>
            <Text size="sm" className="text-gray-600" weight={500}>
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
          </div>
        ))}
      </div>
    </div>
  );
}
