import axios from "axios";
import {
  ActivityFee,
  OtherFeesNonResident,
  OtherFeesResident,
  RoomType,
  Stay,
} from "../../utils/types";

type StayDetailProps = {
  slug: string;
  token: string | undefined;
};

export type ParkFee = {
  id: number;
  name: string | null;
  resident_adult_price: number | null;
  resident_teen_price: number | null;
  resident_child_price: number | null;
  non_resident_adult_price: number | null;
  non_resident_teen_price: number | null;
  non_resident_child_price: number | null;
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
    `${process.env.NEXT_PUBLIC_baseURL}/partner-stays/?search=${location || ""}`
  );

  return stays.data.results;
};

export const getDetailPartnerStays = async (
  listIds: string | undefined
): Promise<Stay[]> => {
  const stays = await axios.get(
    `${process.env.NEXT_PUBLIC_baseURL}/partner-stays/${listIds || ""}/`
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
  // subtract 1 day from end date
  if (endDate) {
    const date = new Date(endDate);
    date.setDate(date.getDate() - 1);
    endDate = date.toISOString().split("T")[0];
  }

  if (startDate && endDate && stay) {
    const room_types = await axios.get(
      `${process.env.NEXT_PUBLIC_baseURL}/stays/${stay.slug}/room-types/?start_date=${startDate}&end_date=${endDate}`
    );

    return room_types.data.results;
  }

  return [];
};

export const getParkFees = async (
  stay: Stay | undefined
): Promise<ParkFee[]> => {
  if (stay) {
    const park_fees = await axios.get(
      `${process.env.NEXT_PUBLIC_baseURL}/partner-stays/${stay.slug}/park-fees/`
    );

    return park_fees.data.results;
  }

  return [];
};

export const getStayActivities = async (
  stay: Stay | undefined
): Promise<ActivityFee[]> => {
  if (stay) {
    const activities = await axios.get(
      `${process.env.NEXT_PUBLIC_baseURL}/partner-stays/${stay.slug}/activities/`
    );

    return activities.data.results;
  }

  return [];
};
