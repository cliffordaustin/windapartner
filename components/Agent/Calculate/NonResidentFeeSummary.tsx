import { RoomType } from "@/utils/types";
import { Room } from "@/context/CalculatePage";
import { Text } from "@mantine/core";

type FeesSummaryProps = {
  room: Room;
  index: number;
};

export default function NonResidentFeesSummary({
  room,
  index,
}: FeesSummaryProps) {
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
              {item.name}
            </Text>
            <Text size="sm" className="text-gray-600" weight={500}>
              ${item.price.toLocaleString()}
            </Text>
          </div>
        ))}
      </div>
    </div>
  );
}
