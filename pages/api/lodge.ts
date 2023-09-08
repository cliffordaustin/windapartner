import { RoomType } from "@/utils/types";
import axios from "axios";
import { format, addDays } from "date-fns";
import Cookies from "js-cookie";

export type Guest = {
  name: string;
  description: string;
  price: number | "";
};

export type RoomPriceProps = {
  residency: "Resident" | "Non-resident";
  startDate: Date;
  endDate: Date;
  guests: Guest[];
  roomSlug: string | null | undefined;
};

export type ResidentGuestTypesData = {
  date: string;
  room_resident_guest_availabilities: Guest[];
};

export type NonResidentGuestTypesData = {
  date: string;
  room_non_resident_guest_availabilities: Guest[];
};

type DeleteRoomTypeProps = {
  roomSlug: string | null | undefined;
  staySlug: string | null | undefined;
  roomType: RoomType;
  isNonResident: boolean;
};

type RoomProps = {
  name: string;
  capacity: number | "";
  childCapacity: number | "";
  infantCapacity: number | "";
  roomPackage: string | null;
  packageDescription: string;
};

export type RoomReturnType = {
  slug: string | null;
};

export const addRoom = async (
  {
    name,
    capacity,
    childCapacity,
    infantCapacity,
    roomPackage,
    packageDescription,
  }: RoomProps,
  slug: string | null
): Promise<RoomReturnType | null> => {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_baseURL}/stays/${slug}/add-room-type/`,
    {
      name: name,
      capacity: capacity,
      child_capacity: childCapacity,
      infant_capacity: infantCapacity,
      package: roomPackage,
      package_description: packageDescription,
    },
    {
      headers: {
        Authorization: "Bearer " + Cookies.get("token"),
      },
    }
  );

  return { slug: response.data.slug };
};

export const deleteRoom = async ({
  roomSlug,
  staySlug,
  roomType,
  isNonResident,
}: DeleteRoomTypeProps) => {
  if (
    roomType.room_non_resident_availabilities.length > 0 &&
    roomType.room_resident_availabilities.length > 0 &&
    isNonResident
  ) {
    await axios.delete(
      `${process.env.NEXT_PUBLIC_baseURL}/room-types/${roomSlug}/delete-nonresident-availability/`,
      {
        headers: {
          Authorization: "Bearer " + Cookies.get("token"),
        },
      }
    );
  } else if (
    roomType.room_non_resident_availabilities.length > 0 &&
    roomType.room_resident_availabilities.length > 0 &&
    !isNonResident
  ) {
    await axios.delete(
      `${process.env.NEXT_PUBLIC_baseURL}/room-types/${roomSlug}/delete-resident-availability/`,
      {
        headers: {
          Authorization: "Bearer " + Cookies.get("token"),
        },
      }
    );
  } else {
    await axios.delete(
      `${process.env.NEXT_PUBLIC_baseURL}/stays/${staySlug}/room-types/${roomSlug}/`,
      {
        headers: {
          Authorization: "Bearer " + Cookies.get("token"),
        },
      }
    );
  }
};
