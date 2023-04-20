import { RoomType } from "@/utils/types";
import { Room } from "@/context/CalculatePage";
import { Text } from "@mantine/core";
import pricing from "@/utils/calculation";

type FeesSummaryProps = {
  room: Room;
  index: number;
};

export default function FeesSummary({ room, index }: FeesSummaryProps) {
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
    <div>
      <Text size="sm" weight={600}>
        {index + 1}. {room.name} -{" "}
        {room.package.charAt(0).toUpperCase() +
          room.package.slice(1).toLowerCase()}
      </Text>
      <div className="flex flex-col gap-1 ml-1">
        {room.residentParkFee.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <Text size="sm" className="text-gray-600" weight={500}>
              {item.name} (For {""}
              {item.guestType === "ADULT" && hasAdultResident(room)
                ? totalGuests.residentAdults
                : item.guestType === "CHILD" && hasChildResident(room)
                ? totalGuests.residentChildren
                : item.guestType === "INFANT" && hasInfantResident(room)
                ? totalGuests.residentInfants
                : item.guestType === "TEEN" && hasTeenResident(room)
                ? totalGuests.residentTeens
                : 0}
              )
            </Text>
            <Text size="sm" className="text-gray-600" weight={500}>
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
                  : 0)
              ).toLocaleString()}
            </Text>
          </div>
        ))}
      </div>
    </div>
  );
}
