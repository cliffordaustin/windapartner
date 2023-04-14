import { Carousel } from "@mantine/carousel";
import { Button, Image, Text, Card } from "@mantine/core";
import { Stay } from "../../utils/types";
import { createStyles } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useState, useEffect, useContext } from "react";
import { Context } from "@/context/AgentPage";

const useStyles = createStyles(() => ({
  control: {
    "&[data-inactive]": {
      opacity: 0,
      cursor: "default",
    },
  },
}));

type ListingProps = {
  stay: Stay;
};

export default function Listing({ stay }: ListingProps) {
  const { classes } = useStyles();

  const images = stay.stay_images.sort(
    (x, y) => Number(y.main) - Number(x.main)
  );

  const arrImages = images.map((image) => {
    return image.image;
  });

  const { state, setState } = useContext(Context);

  function addListingToCalculate(id: number) {
    setState((prev) => ({ ...prev, itemIds: [...prev.itemIds, id] }));
    const storedItemIds = localStorage.getItem("itemIds");
    localStorage.setItem(
      "itemIds",
      JSON.stringify([...JSON.parse(storedItemIds || "[]"), id])
    );
  }

  const isAdded = state.itemIds.includes(stay.id);

  function handleRemoveItemClick(id: number) {
    setState((prev) => ({
      ...prev,
      itemIds: prev.itemIds.filter((itemId) => itemId !== id),
    }));
    const storedItemIds = localStorage.getItem("itemIds");
    localStorage.setItem(
      "itemIds",
      JSON.stringify(
        JSON.parse(storedItemIds || "[]").filter(
          (itemId: number) => itemId !== id
        )
      )
    );
  }

  return (
    <div className="w-full relative">
      <Carousel
        w={"100%"}
        color="red"
        // className="rounded-xl relative"
        classNames={classes}
      >
        {arrImages.map((image, index) => (
          <Carousel.Slide w={"100%"} key={index}>
            <Image
              w={"100%"}
              fit="cover"
              height={220}
              radius="md"
              src={image}
              className={isAdded ? "opacity-70" : " w-full"}
              alt={"Images of " + (stay.property_name || stay.name)}
            />
          </Carousel.Slide>
        ))}
      </Carousel>

      {isAdded ? (
        <Button
          onClick={() => handleRemoveItemClick(stay.id)}
          className="w-[35px] p-0 bg-black hover:bg-black absolute left-3 bottom-[100px] h-[35px] flex items-center justify-center rounded-full"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6 text-white"
          >
            <path
              fillRule="evenodd"
              d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </Button>
      ) : (
        <Button
          color="red"
          onClick={() => addListingToCalculate(stay.id)}
          className="w-[35px] p-0 absolute left-3 bottom-[100px] h-[35px] flex items-center justify-center rounded-full"
        >
          <IconPlus size="1.4rem" className="text-white" />
        </Button>
      )}

      <div className="mt-2">
        <Text truncate weight={600} size="md">
          {stay.name}
        </Text>
        <Text size="sm" className="text-gray-600">
          {stay.property_name}
        </Text>
        <Text size="sm" className="text-gray-600">
          {stay.location}
        </Text>
      </div>
    </div>
  );
}
