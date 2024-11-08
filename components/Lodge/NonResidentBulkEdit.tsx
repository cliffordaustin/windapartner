import {
  RoomAvailabilityResidentGuest,
  RoomType,
  LodgeStay,
} from "@/utils/types";
import { Button, Flex, NumberInput, Radio, TextInput } from "@mantine/core";
import { Auth } from "aws-amplify";
import axios, { AxiosResponse } from "axios";
import { format } from "date-fns";
import Cookies from "js-cookie";
import React from "react";
import { useMutation, useQueryClient } from "react-query";

type SelectedGuestType = {
  name?: string;
  description?: string;
};

type BulkEditProps = {
  guestType: string;
  description: string;
  date: [Date | null, Date | null];
  roomName: string;
  packageName: string;
  selectedRoomType: RoomType | undefined;
  setSelectedNonResidentGuestType: React.Dispatch<
    React.SetStateAction<SelectedGuestType | undefined>
  >;
  stay: LodgeStay | undefined;
  closeModal: () => void;
};

function NonResidentBulkEdit({
  guestType,
  description,
  date,
  roomName,
  packageName,
  selectedRoomType,
  setSelectedNonResidentGuestType,
  stay,
  closeModal,
}: BulkEditProps) {
  const [guestTypeValue, setGuestTypeValue] = React.useState<string>(guestType);
  const [descriptionValue, setDescriptionValue] =
    React.useState<string>(description);
  const [newPrice, setNewPrice] = React.useState<number | "" | undefined>();
  const [value, setValue] = React.useState("date");

  const objectWithPrice = {
    price: Number(newPrice),
    name: guestTypeValue,
    description: descriptionValue,
  };

  const objectWithoutPrice = {
    name: guestTypeValue,
    description: descriptionValue,
  };

  const updateDate = async () => {
    const currentSession = await Auth.currentSession();
    const accessToken = currentSession.getAccessToken();
    const token = accessToken.getJwtToken();
    if (selectedRoomType && value === "date") {
      for (const room of selectedRoomType.room_non_resident_availabilities) {
        const nonResidentGuest: RoomAvailabilityResidentGuest | undefined =
          room.room_non_resident_guest_availabilities.find(
            (guest) =>
              guest.name?.toLowerCase().trim() ===
              guestType.toLocaleLowerCase().trim()
          );

        if (nonResidentGuest) {
          await axios.patch(
            `${process.env.NEXT_PUBLIC_baseURL}/nonresident-guests/${nonResidentGuest.id}/`,
            newPrice ? objectWithPrice : objectWithoutPrice,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        }
      }
    } else if (stay && value === "all") {
      const room_types: AxiosResponse<any> = await axios.get(
        `${process.env.NEXT_PUBLIC_baseURL}/stays/${stay.slug}/room-types/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const room_types_results: RoomType[] | undefined =
        room_types.data.results;

      if (room_types_results) {
        const selectedRoom: RoomType | undefined = room_types_results.find(
          (room) =>
            room.name?.toLowerCase() === roomName.toLowerCase() &&
            room.package === packageName
        );
        if (selectedRoom) {
          for (const roomAvailability of selectedRoom.room_non_resident_availabilities) {
            const nonResidentGuest: RoomAvailabilityResidentGuest | undefined =
              roomAvailability.room_non_resident_guest_availabilities.find(
                (guest) =>
                  guest.name?.toLowerCase().trim() ===
                  guestType.toLocaleLowerCase().trim()
              );

            if (nonResidentGuest) {
              await axios.patch(
                `${process.env.NEXT_PUBLIC_baseURL}/nonresident-guests/${nonResidentGuest.id}/`,
                newPrice ? objectWithPrice : objectWithoutPrice,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
            }
          }
        }
      }
    }
  };

  const queryStr = stay ? "room-type-" + stay.slug : "room-type";

  const queryClient = useQueryClient();

  const { mutateAsync: update, isLoading: updateLoading } = useMutation(
    updateDate,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(queryStr);
        setSelectedNonResidentGuestType(undefined);
        closeModal();
      },
    }
  );
  return (
    <div>
      <Radio.Group
        value={value}
        onChange={setValue}
        name="edit-range"
        label="Edit range"
        description={
          value === "date"
            ? `
         This will edit all occurrences of ${roomName} > ${packageName} > ${guestType} from ${format(
                date[0] as Date,
                "dd/MM/yyyy"
              )} - ${format(date[1] as Date, "dd/MM/yyyy")}
        `
            : `This will edit all occurrences of ${guestType}`
        }
      >
        <div className="flex gap-3 mt-2 items-center">
          <Radio value="date" label={`Selected dates`} />

          <Radio value="all" label="All occurrences" />
        </div>
      </Radio.Group>
      <Flex gap={4} mt={12} direction="column">
        <TextInput
          value={guestTypeValue}
          onChange={(event) => setGuestTypeValue(event.currentTarget.value)}
          label="Guest type"
          placeholder="Guest type"
          required
        />

        <TextInput
          value={descriptionValue}
          onChange={(event) => setDescriptionValue(event.currentTarget.value)}
          label="Description"
          placeholder="Description"
        />
        <NumberInput
          value={newPrice}
          onChange={(value) => setNewPrice(value)}
          placeholder="Enter new price"
          type="number"
          label="New Price"
        />
      </Flex>

      <Flex mt={12} justify="space-between" align="center">
        <div></div>
        <Button
          onClick={() => {
            update();
          }}
          loading={updateLoading}
          color="red"
          radius="md"
          size="sm"
        >
          Bulk update
        </Button>
      </Flex>
    </div>
  );
}

export default NonResidentBulkEdit;
