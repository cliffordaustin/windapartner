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
              {item.guestType === "ADULT"
                ? totalGuests.residentAdults
                : item.guestType === "CHILD"
                ? totalGuests.residentChildren
                : item.guestType === "INFANT"
                ? totalGuests.residentInfants
                : item.guestType === "TEEN"
                ? totalGuests.residentTeens
                : 0}
              )
            </Text>
            <Text size="sm" className="text-gray-600" weight={500}>
              KES
              {(
                item.price *
                (item.guestType === "ADULT"
                  ? totalGuests.residentAdults
                  : item.guestType === "CHILD"
                  ? totalGuests.residentChildren
                  : item.guestType === "INFANT"
                  ? totalGuests.residentInfants
                  : item.guestType === "TEEN"
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
