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

function UserSelectedStays({ stay }: ListingProps) {
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
    <div className="flex items-center gap-2 shadow-lg rounded-md px-2 w-[150px] py-2">
      <div className="relative w-[40px] h-[25px]">
        {arrImages.length > 0 && (
          <Image
            alt="stay image"
            src={arrImages[0]}
            className="w-full h-full"
            fill
            sizes="100%"
          />
        )}
      </div>

      <Text size="sm" truncate weight={500}>
        {stay.property_name}
      </Text>

      <ActionIcon onClick={() => handleRemoveItemClick(stay.id)}>
        <IconX size={20} />
      </ActionIcon>
    </div>
  );
}

UserSelectedStays.propTypes = {};

export default UserSelectedStays;
