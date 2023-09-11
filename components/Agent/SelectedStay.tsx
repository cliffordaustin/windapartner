import React, { useContext } from "react";
import PropTypes from "prop-types";
import { Stay } from "@/utils/types";
import Image from "next/image";
import { ActionIcon, Text } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import { Context } from "@/context/AgentPage";

type ListingProps = {
  stay: Stay;
};

function SelectedStay({ stay }: ListingProps) {
  const { state, setState } = useContext(Context);

  const images = stay.stay_images.sort(
    (x, y) => Number(y.main) - Number(x.main)
  );

  const arrImages = images.map((image) => {
    return image.image;
  });

  function handleRemoveItemClick(id: number) {
    setState((prev) => ({
      ...prev,
      stayIds: prev.stayIds.filter((stayId) => stayId !== id),
    }));
    const storedItemIds = localStorage.getItem("stayIds");
    localStorage.setItem(
      "stayIds",
      JSON.stringify(
        JSON.parse(storedItemIds || "[]").filter(
          (stayId: number) => stayId !== id
        )
      )
    );
  }
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="relative w-[40px] h-[35px]">
          {arrImages.length > 0 && (
            <Image
              alt="stay image"
              src={arrImages[0]}
              className="w-full h-full rounded-md bg-gray-300"
              fill
              sizes="100%"
            />
          )}
        </div>

        <div className="flex flex-col">
          <Text className="font-bold">{stay.property_name}</Text>
          <Text size="sm" className="text-gray-500">
            {stay.location}
          </Text>
        </div>
      </div>

      <div
        onClick={() => handleRemoveItemClick(stay.id)}
        className="w-[25px] h-[25px] rounded-full cursor-pointer bg-red-600 flex items-center justify-center"
      >
        <IconX size="1rem" className="text-white"></IconX>
      </div>
    </div>
  );
}

SelectedStay.propTypes = {};

export default SelectedStay;
