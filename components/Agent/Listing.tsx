import { Carousel } from "@mantine/carousel";
import { Button, Text, Card } from "@mantine/core";
import { Stay } from "../../utils/types";
import { createStyles } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useState, useEffect, useContext } from "react";
import { Context } from "@/context/AgentPage";
import axios from "axios";
import Cookies from "js-cookie";
import Image from "next/image";

const useStyles = createStyles(() => ({
  control: {
    "&[data-inactive]": {
      opacity: 0,
      cursor: "default",
    },
  },
}));

type ListingProps = {
  stay: Stay | undefined;
};

export default function Listing({ stay }: ListingProps) {
  const { classes } = useStyles();

  const images = stay?.stay_images?.sort(
    (x, y) => Number(y.main) - Number(x.main)
  );

  const arrImages = images?.map((image) => {
    return image.image;
  });

  const { state, setState } = useContext(Context);

  // interface Item {
  //   id: number;
  //   timestamp: number;
  // }

  // function addListingToCalculate(id: number): void {
  //   const now = new Date().getTime();
  //   setState((prev) => ({
  //     ...prev,
  //     stayIds: [
  //       ...prev.stayIds,
  //       {
  //         id,
  //         timestamp: now,
  //       },
  //     ],
  //   }));

  //   const storedItemIds = localStorage.getItem("stayIds");
  //   let stayIds: Item[] = [];

  //   if (storedItemIds) {
  //     const parsedItemIds = JSON.parse(storedItemIds) as Item[];
  //     stayIds = parsedItemIds.filter((item) => {
  //       // Check if the timestamp is less than 1 minute old
  //       return now - item.timestamp < 1 * 60 * 1000;
  //     });
  //   }

  //   // Add the filtered items and the new item with a timestamp
  //   stayIds.push({ id, timestamp: now });

  //   // Store the updated stayIds array in localStorage
  //   localStorage.setItem("stayIds", JSON.stringify(stayIds));
  // }

  function addListingToCalculate(id: number) {
    setState((prev) => ({ ...prev, stayIds: [...prev.stayIds, id] }));
    const storedItemIds = localStorage.getItem("stayIds");
    localStorage.setItem(
      "stayIds",
      JSON.stringify([...JSON.parse(storedItemIds || "[]"), id])
    );
  }

  // function addListingToCalculate(id: number) {
  //   const sessionKey = Cookies.get("sessionid");

  //   axios
  //     .post(
  //       `${process.env.NEXT_PUBLIC_baseURL}/stays/add-to-calculate/`,
  //       {
  //         stay_id: id,
  //       },
  //       {
  //         withCredentials: true,
  //       }
  //     )
  //     .then((res) => {
  //       console.log(res.data);
  //     });
  // }

  const isAdded = state.stayIds.includes(stay?.id || 0);

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
    <div className="w-full relative">
      <Carousel
        w={"100%"}
        color="red"
        // className="rounded-xl relative"
        classNames={classes}
      >
        {arrImages &&
          arrImages.map((image, index) => (
            <Carousel.Slide w={"100%"} h={220} key={index}>
              <Image
                src={image}
                className={
                  isAdded ? "opacity-70 rounded-lg" : " w-full rounded-lg"
                }
                alt={"Images of " + (stay?.property_name || stay?.name)}
                fill
              />
            </Carousel.Slide>
          ))}
      </Carousel>

      {isAdded ? (
        <Button
          onClick={() => handleRemoveItemClick(stay?.id || 0)}
          className="w-[35px] p-0 bg-black hover:bg-black absolute left-3 bottom-[70px] h-[35px] flex items-center justify-center rounded-full"
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
          onClick={() => addListingToCalculate(stay?.id || 0)}
          className="w-[35px] p-0 absolute left-3 bottom-[70px] h-[35px] flex items-center justify-center rounded-full"
        >
          <IconPlus size="1.4rem" className="text-white" />
        </Button>
      )}

      <div className="mt-2">
        <Text truncate weight={600} size="md">
          {stay?.property_name}
        </Text>

        <Text size="sm" className="text-gray-600">
          {stay?.location}
        </Text>
      </div>
    </div>
  );
}
