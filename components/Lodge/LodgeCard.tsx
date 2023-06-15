import { Stay } from "@/utils/types";
import { Carousel } from "@mantine/carousel";
import { Button, Image, Text, createStyles } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import Link from "next/link";
import React from "react";

type LodgeProps = {
  stay: Stay;
  setStayIds: React.Dispatch<React.SetStateAction<number[]>>;
  stayIds: number[];
};

const useStyles = createStyles(() => ({
  control: {
    "&[data-inactive]": {
      opacity: 0,
      cursor: "default",
    },
  },
}));

function LodgeCard({ stay, stayIds, setStayIds }: LodgeProps) {
  const { classes } = useStyles();

  const images = stay.stay_images.sort(
    (x, y) => Number(y.main) - Number(x.main)
  );

  const arrImages = images.map((image) => {
    return image.image;
  });

  const isAdded = stayIds.includes(stay.id);

  function handleRemoveItemClick(id: number) {
    setStayIds((prev) => prev.filter((stayId) => stayId !== id));
    const storedItemIds = localStorage.getItem("lodge-stay-ids");
    localStorage.setItem(
      "lodge-stay-ids",
      JSON.stringify(
        JSON.parse(storedItemIds || "[]").filter(
          (stayId: number) => stayId !== id
        )
      )
    );
  }

  function addListingToCalculate(id: number) {
    setStayIds((prev) => [...prev, id]);
    const storedItemIds = localStorage.getItem("lodge-stay-ids");
    localStorage.setItem(
      "lodge-stay-ids",
      JSON.stringify([...JSON.parse(storedItemIds || "[]"), id])
    );
  }
  return (
    <div className="w-full rounded-md relative shadow border">
      <Carousel
        classNames={classes}
        className="rounded-md"
        w={"100%"}
        color="red"
      >
        {arrImages.map((image, index) => (
          <Carousel.Slide className="rounded-md" w={"100%"} key={index}>
            <Image
              w={"100%"}
              fit="cover"
              height={120}
              className="overflow-hidden rounded-t-lg"
              src={image}
              alt={"Images of " + (stay.property_name || stay.name)}
            />
          </Carousel.Slide>
        ))}
      </Carousel>

      <div className="p-2">
        <Text truncate weight={600} size="md">
          {stay.property_name}
        </Text>

        <Text truncate size="sm" className="text-gray-600">
          {stay.location}
        </Text>
        <Link href={`/partner/lodge/${stay.slug}`}>
          <Button
            size="xs"
            color="red"
            variant="light"
            className="w-full mt-1 !py-2"
          >
            Add a room
          </Button>
        </Link>
      </div>

      {isAdded ? (
        <Button
          onClick={() => handleRemoveItemClick(stay.id)}
          className="w-[30px] p-0 bg-black hover:bg-black absolute left-1 bottom-[100px] h-[30px] flex items-center justify-center rounded-full"
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
          className="w-[30px] p-0 absolute left-1 bottom-[100px] h-[30px] flex items-center justify-center rounded-full"
        >
          <IconPlus size="1.4rem" className="text-white" />
        </Button>
      )}
    </div>
  );
}

export default LodgeCard;
