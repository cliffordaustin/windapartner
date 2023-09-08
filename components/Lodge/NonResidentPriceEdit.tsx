import { RoomAvailabilityResidentGuest, LodgeStay } from "@/utils/types";
import { Button, Grid, Input, NumberInput, Popover, Text } from "@mantine/core";
import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect } from "react";
import { useMutation, useQueryClient } from "react-query";

type NonResidentPriceEditProps = {
  guestType: string;
  date: string;
  nonResidentGuests: RoomAvailabilityResidentGuest[];
  stay: LodgeStay | undefined;
};

function NonResidentPriceEdit({
  guestType,
  date,
  nonResidentGuests,
  stay,
}: NonResidentPriceEditProps) {
  const nonResidentGuest: RoomAvailabilityResidentGuest | undefined =
    nonResidentGuests.find(
      (guest) =>
        guest.name?.toLowerCase().trim() ===
        guestType.toLocaleLowerCase().trim()
    );

  const [newPrice, setNewPrice] = React.useState<number | "" | undefined>();

  useEffect(() => {
    setNewPrice(nonResidentGuest?.price);
  }, []);

  const token = Cookies.get("token");

  const updatePrice = async () => {
    if (newPrice && nonResidentGuest) {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_baseURL}/nonresident-guests/${nonResidentGuest.id}/`,
        {
          price: Number(newPrice),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    }
  };

  const queryStr = stay ? "room-type-" + stay.slug : "room-type";

  const queryClient = useQueryClient();

  const { mutateAsync: editPrice, isLoading: editPriceLoading } = useMutation(
    updatePrice,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(queryStr);
      },
    }
  );
  return (
    <Grid.Col
      className="border-t-0 cursor-pointer hover:shadow-lg border-r border-l-0 border-b border-solid border-gray-300"
      span={12}
      p={0}
      xs={4}
      md={3}
      lg={2}
    >
      <Popover
        width={350}
        position="bottom-start"
        arrowOffset={60}
        withArrow
        shadow="md"
      >
        <Popover.Target>
          <div className="p-2">
            <Text weight={500}>{date}</Text>
            <Text mt={6} size="sm">
              {nonResidentGuest ? "$" + nonResidentGuest.price : "N/A"}
            </Text>
          </div>
        </Popover.Target>

        <Popover.Dropdown className="px-3">
          <NumberInput
            value={newPrice}
            onChange={(value) => setNewPrice(value)}
            placeholder="Enter new price"
            type="number"
            label="New Price"
            required
          />

          <div className="mt-4 flex justify-between">
            <div></div>
            <Button
              onClick={() => {
                editPrice();
              }}
              loading={editPriceLoading}
              color="red"
              radius="md"
              size="sm"
            >
              Update
            </Button>
          </div>
        </Popover.Dropdown>
      </Popover>
    </Grid.Col>
  );
}

export default NonResidentPriceEdit;
