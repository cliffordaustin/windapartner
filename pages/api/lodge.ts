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
};

type RoomProps = {
  name: string;
  capacity: number | "";
  childCapacity: number | "";
  infantCapacity: number | "";
  roomPackage: string | null;
};

export type RoomReturnType = {
  slug: string | null;
};

export const addRoom = async (
  { name, capacity, childCapacity, infantCapacity, roomPackage }: RoomProps,
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
    },
    {
      headers: {
        Authorization: "Token " + Cookies.get("token"),
      },
    }
  );

  return { slug: response.data.slug };
};

export const deleteRoom = async ({
  roomSlug,
  staySlug,
}: DeleteRoomTypeProps) => {
  await axios.delete(
    `${process.env.NEXT_PUBLIC_baseURL}/stays/${staySlug}/room-types/${roomSlug}/`,
    {
      headers: {
        Authorization: "Token " + Cookies.get("token"),
      },
    }
  );
};
