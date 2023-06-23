import axios from "axios";
import { RoomType, Stay } from "../../utils/types";

type StayDetailProps = {
  slug: string;
  token: string | undefined;
};

export const getHighlightedStays = async (): Promise<Stay[]> => {
  const stays = await axios.get(
    `${process.env.NEXT_PUBLIC_baseURL}/highlighted-stays/`
  );

  return stays.data.results;
};

export const getPartnerStays = async (
  location: string | undefined,
  listIds: string | undefined
): Promise<Stay[]> => {
  const stays = await axios.get(
    `${process.env.NEXT_PUBLIC_baseURL}/partner-stays/?search=${
      location || ""
    }&list_ids=${listIds || ""}`
  );

  return stays.data.results;
};

export const getStayDetail = async (slug: string): Promise<Stay> => {
  const stay = await axios.get(
    `${process.env.NEXT_PUBLIC_baseURL}/highlighted-stays/${slug}/`
  );

  return stay.data;
};

export const getStayEmail = async (
  slug: string,
  token: string | undefined
): Promise<Stay> => {
  const stay = await axios.get(
    `${process.env.NEXT_PUBLIC_baseURL}/user-stays-email/${slug}/`,
    {
      headers: {
        Authorization: "Token " + token,
      },
    }
  );

  return stay.data;
};

export const deleteStayEmail = async ({ slug, token }: StayDetailProps) => {
  await axios.delete(
    `${process.env.NEXT_PUBLIC_baseURL}/user-stays-email/${slug}/`,
    {
      headers: {
        Authorization: "Token " + token,
      },
    }
  );
};

export const getAllStaysEmail = async (
  token: string | undefined
): Promise<Stay[]> => {
  const stay = await axios.get(
    `${process.env.NEXT_PUBLIC_baseURL}/user-stays-email/`,
    {
      headers: {
        Authorization: "Token " + token,
      },
    }
  );

  return stay.data.results;
};

export const getRoomTypes = async (
  stay: Stay | undefined,
  startDate: string | null | undefined,
  endDate: string | null | undefined
): Promise<RoomType[]> => {
  const roomTypes = [];

  // subtract 1 day from end date
  if (endDate) {
    const date = new Date(endDate);
    date.setDate(date.getDate() - 1);
    endDate = date.toISOString().split("T")[0];
  }

  if (startDate && endDate && stay) {
    for (let roomType of stay.room_types) {
      const room_resident = await axios.get(
        `${process.env.NEXT_PUBLIC_baseURL}/room-types/${roomType.slug}/resident-availabilities/?start_date=${startDate}&end_date=${endDate}`
      );

      const room_non_resident = await axios.get(
        `${process.env.NEXT_PUBLIC_baseURL}/room-types/${roomType.slug}/nonresident-availabilities/?start_date=${startDate}&end_date=${endDate}`
      );

      roomTypes.push({
        id: roomType.id,
        slug: roomType.slug,
        name: roomType.name,
        capacity: roomType.capacity,
        child_capacity: roomType.child_capacity,
        infant_capacity: roomType.infant_capacity,
        package: roomType.package,
        room_resident_availabilities: room_resident.data.results,
        room_non_resident_availabilities: room_non_resident.data.results,
      });
    }
  }

  return roomTypes;
};
