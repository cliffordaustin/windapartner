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

function SmallImage({ stay }: ListingProps) {
  const { state, setState } = useContext(Context);

  const images = stay.stay_images.sort(
    (x, y) => Number(y.main) - Number(x.main)
  );

  const arrImages = images.map((image) => {
    return image.image;
  });

  return (
    <div className="relative w-[40px] h-[30px]">
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
  );
}

SmallImage.propTypes = {};

export default SmallImage;
