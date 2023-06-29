import { Context } from "@/context/CalculatePage";
import { ActivityFee, Stay } from "@/utils/types";
import { Image, Switch, Text } from "@mantine/core";
import { useContext } from "react";
import { v4 as uuidv4 } from "uuid";

type ActitivityProps = {
  activity: ActivityFee;
  stay: Stay;
};

export default function Activity({ activity, stay }: ActitivityProps) {
  const { state, setState } = useContext(Context);
  const currentStay = state.find((item) => item.id === stay.id);

  const handleSwitch = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const updatedItems = state.map((item) => {
        if (item.id === stay.id) {
          return {
            ...item,
            activityFee: [
              ...item.activityFee,
              {
                id: activity.id,
                name: activity.name,
                price: activity.price,
                resident_price: activity.resident_price,
                description: activity.description,
                image: activity.image,
                priceType: activity.price_type,
              },
            ],
          };
        }
        return item;
      });
      setState(updatedItems);
    } else {
      const updatedItems = state.map((item) => {
        if (item.id === stay.id) {
          return {
            ...item,
            activityFee: item.activityFee.filter(
              (item) => item.id !== activity.id
            ),
          };
        }
        return item;
      });
      setState(updatedItems);
    }
  };
  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          {activity.image && (
            <Image
              maw={120}
              mx="auto"
              src={activity.image}
              alt="Random image"
            />
          )}

          <div className="flex flex-col gap-1 py-2">
            <Text size="md" weight={600}>
              {activity.name}
            </Text>

            <Text size="sm" className="text-gray-500">
              {activity.description}
            </Text>

            <Text size="sm" weight={600} className="text-gray-800">
              ${activity.price} / KES{activity.resident_price} (
              {activity.price_type.charAt(0).toUpperCase() +
                activity.price_type.slice(1).toLowerCase()}
              )
            </Text>
          </div>
        </div>

        <Switch
          onChange={(event) => {
            handleSwitch(event);
          }}
          color="red"
          checked={
            !!currentStay?.activityFee?.find((item) => item.id === activity.id)
          }
        ></Switch>
      </div>
    </div>
  );
}
