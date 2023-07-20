import { Stay, stayImages } from "@/utils/types";
import { Button, Flex, Loader, Text } from "@mantine/core";
import axios from "axios";
import Cookies from "js-cookie";
import Image from "next/image";
import React from "react";
import { useMutation, useQueryClient } from "react-query";

type StayImagesProps = {
  stay: Stay;
  image: stayImages;
};

function StayImages({ stay, image }: StayImagesProps) {
  const token = Cookies.get("token");
  const queryClient = useQueryClient();

  const getImageName = (url: string) => {
    let splitUrl = url.split("/");
    let split = splitUrl[splitUrl.length - 1];
    // remove the ? after name
    let split2 = split.split("?")[0];

    return split2;
  };

  const deleteImage = async (index: number) => {
    await axios.delete(
      `${process.env.NEXT_PUBLIC_baseURL}/stays/${stay.slug}/images/${index}/`,
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    );
  };

  const { mutateAsync: delImage, isLoading: deleteImageLoading } = useMutation(
    deleteImage,
    {
      onSuccess: () => {
        // refetch stays
        queryClient.invalidateQueries("stay-email");
      },
    }
  );
  return (
    <Flex justify="space-between" gap={3}>
      <div className="flex w-[75%] items-center gap-3">
        <div className="rounded-lg">
          <Image
            src={image.image}
            alt="stay image"
            width={30}
            height={30}
            className="overflow-hidden object-cover"
          ></Image>
        </div>

        <Text size="sm" truncate>
          {getImageName(image.image)}
        </Text>
      </div>

      <Button
        size="xs"
        color="red"
        variant="light"
        loading={deleteImageLoading}
        onClick={() => delImage(image.id)}
      >
        Delete
      </Button>
    </Flex>
  );
}

export default StayImages;
