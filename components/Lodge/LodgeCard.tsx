import { ContextProvider } from "@/context/LodgeDetailPage";
import { Stay } from "@/utils/types";
import { Carousel } from "@mantine/carousel";
import {
  Button,
  Container,
  Flex,
  Image,
  Modal,
  Text,
  createStyles,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconChevronLeft,
  IconChevronRight,
  IconPlus,
} from "@tabler/icons-react";
import Link from "next/link";
import React from "react";
import { EmblaCarouselType } from "embla-carousel-react";
import AddRoomFirstPage from "./AddRoomFirstPage";
import AddRoomSecondPage from "./AddRoomSecondPage";

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
  const [opened, { open, close }] = useDisclosure(false);

  const [embla, setEmbla] = React.useState<EmblaCarouselType | null>(null);

  const [currentSlideIndex, setCurrentSlideIndex] = React.useState(0);

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

        <Button
          size="xs"
          color="red"
          variant="light"
          className="w-full mt-1 !py-2"
          onClick={open}
        >
          Add rates
        </Button>
      </div>

      <ContextProvider>
        <Modal
          opened={opened}
          onClose={close}
          title={"Add rates"}
          classNames={{
            title: "text-xl font-bold",
            close: "text-black hover:text-gray-700 hover:bg-gray-200",
            header: "bg-gray-100",
          }}
          fullScreen
          transitionProps={{ transition: "fade", duration: 200 }}
          closeButtonProps={{
            style: {
              width: 30,
              height: 30,
            },
            iconSize: 20,
          }}
        >
          <Carousel
            getEmblaApi={(embla) => {
              setEmbla(embla);
            }}
            withControls={false}
            onSlideChange={(index) => {
              setCurrentSlideIndex(index);
            }}
            speed={14}
            mx="auto"
            mb={30}
            withKeyboardEvents={false}
          >
            <Carousel.Slide>
              <AddRoomFirstPage></AddRoomFirstPage>
            </Carousel.Slide>
            <Carousel.Slide>
              <AddRoomSecondPage staySlug={stay.slug}></AddRoomSecondPage>
            </Carousel.Slide>
          </Carousel>

          <Container
            pos="fixed"
            bottom={0}
            right={0}
            w="100%"
            className="w-full bg-gray-100 flex justify-between items-center text-right px-10"
          >
            {currentSlideIndex === 0 && <div></div>}
            {currentSlideIndex === 1 && (
              <Flex
                onClick={() => {
                  embla?.scrollPrev();
                }}
                className="cursor-pointer"
                gap={4}
                align="center"
              >
                <IconChevronLeft className="w-5 h-5" />
                <p>Previous</p>
              </Flex>
            )}
            {currentSlideIndex === 0 && (
              <Flex
                onClick={() => {
                  embla?.scrollNext();
                }}
                className="cursor-pointer"
                gap={4}
                align="center"
              >
                <p>Next</p>
                <IconChevronRight className="w-5 h-5" />
              </Flex>
            )}
          </Container>
        </Modal>
      </ContextProvider>

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
