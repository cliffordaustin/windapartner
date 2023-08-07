import axios from "axios";
import {
  ActivityFee,
  OtherFeesNonResident,
  OtherFeesResident,
  RoomType,
  Stay,
  LodgeStay,
  AgentStay,
} from "../../utils/types";

type StayDetailProps = {
  slug: string;
  token: string | undefined;
};

export type RoomTypeDetail = {
  id: number;
  slug?: string | undefined;
  name?: string | undefined;
  capacity: number;
  child_capacity: number;
  infant_capacity: number;
  package: string;
  package_description: string | null;
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

export type getPartnerStaysType = {
  results: Stay[];
  count: number;
  page_size: number;
  next: string | null;
  previous: string | null;
  total_pages: number;
};

export type AgentType = {
  id: number;

  first_name: string;
  last_name: string;
  email: string;
  profile_pic: string | null;
};

export type AgentStayType = {
  id: number;
  user: {
    first_name: string;
    last_name: string;
    email: string;
    profile_pic: string | null;
  };
  approved: boolean;
};

export const getHighlightedStays = async (): Promise<Stay[]> => {
  const stays = await axios.get(
    `${process.env.NEXT_PUBLIC_baseURL}/highlighted-stays/`
  );

  return stays.data.results;
};

export const getPartnerStays = async (
  location: string | undefined,
  page: number | undefined,
  token: string | undefined
): Promise<getPartnerStaysType> => {
  const stays = await axios.get(
    `${process.env.NEXT_PUBLIC_baseURL}/partner-stays/?search=${
      location || ""
    }&page=${page || 1}`,
    {
      headers: {
        Authorization: "Token " + token,
      },
    }
  );

  return {
    results: stays.data.results,
    count: stays.data.count,
    page_size: stays.data.page_size,
    next: stays.data.next,
    previous: stays.data.previous,
    total_pages: stays.data.total_pages,
  };
};

export const getPartnerStaysWithoutAccess = async (
  location: string | undefined,
  page: number | undefined,
  token: string | undefined
): Promise<getPartnerStaysType> => {
  const stays = await axios.get(
    `${process.env.NEXT_PUBLIC_baseURL}/partner-stays-without-access/?search=${
      location || ""
    }&page=${page || 1}`,
    {
      headers: {
        Authorization: "Token " + token,
      },
    }
  );

  return {
    results: stays.data.results,
    count: stays.data.count,
    page_size: stays.data.page_size,
    next: stays.data.next,
    previous: stays.data.previous,
    total_pages: stays.data.total_pages,
  };
};

export const getDetailPartnerStays = async (
  listIds: string | undefined,
  token: string | undefined
): Promise<Stay[]> => {
  const stays = await axios.get(
    `${process.env.NEXT_PUBLIC_baseURL}/partner-stays/${listIds || ""}/`,
    {
      headers: {
        Authorization: "Token " + token,
      },
    }
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
): Promise<LodgeStay> => {
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
): Promise<LodgeStay[]> => {
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

export const getAllAgents = async (
  token: string | undefined
): Promise<AgentType[]> => {
  const agents = await axios.get(`${process.env.NEXT_PUBLIC_baseURL}/agents/`, {
    headers: {
      Authorization: "Token " + token,
    },
  });

  return agents.data;
};

export const getStayAgents = async (
  token: string | undefined,
  stay: LodgeStay | undefined
): Promise<AgentStayType[]> => {
  if (stay) {
    const agents = await axios.get(
      `${process.env.NEXT_PUBLIC_baseURL}/user-stays-email/${stay.slug}/agents/`,
      {
        headers: {
          Authorization: "Token " + token,
        },
      }
    );

    return agents.data.results;
  }
  return [];
};

export const getStayAgentsNotVerified = async (
  token: string | undefined,
  stay: LodgeStay | undefined
): Promise<AgentStayType[]> => {
  if (stay) {
    const agents = await axios.get(
      `${process.env.NEXT_PUBLIC_baseURL}/user-stays-email/${stay.slug}/agents-not-verified/`,
      {
        headers: {
          Authorization: "Token " + token,
        },
      }
    );

    return agents.data.results;
  }
  return [];
};

export const getRoomTypes = async (
  stay: LodgeStay | AgentStay | undefined,
  startDate: string | null | undefined,
  endDate: string | null | undefined
): Promise<RoomType[]> => {
  // subtract 1 day from end date

  if (startDate && endDate && stay) {
    const room_types = await axios.get(
      `${process.env.NEXT_PUBLIC_baseURL}/stays/${stay.slug}/room-types/?start_date=${startDate}&end_date=${endDate}`
    );

    return room_types.data.results;
  }

  return [];
};

export const getParkFees = async (
  stay: LodgeStay | AgentStay | undefined
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
  stay: LodgeStay | AgentStay | undefined
): Promise<ActivityFee[]> => {
  if (stay) {
    const activities = await axios.get(
      `${process.env.NEXT_PUBLIC_baseURL}/partner-stays/${stay.slug}/activities/`
    );

    return activities.data.results;
  }

  return [];
};

export const getRoomTypeList = async (
  stay: Stay | undefined
): Promise<RoomTypeDetail[]> => {
  if (stay) {
    const room_types = await axios.get(
      `${process.env.NEXT_PUBLIC_baseURL}/stays/${stay.slug}/room-detail-types/`
    );

    return room_types.data.results;
  }

  return [];
};

export const getRoomTypeDetail = async (
  stay: Stay | undefined,
  slug: string
): Promise<RoomTypeDetail | undefined> => {
  if (stay) {
    const room_types = await axios.get(
      `${process.env.NEXT_PUBLIC_baseURL}/stays/${stay.slug}/room-detail-types/${slug}/`
    );

    return room_types.data;
  }
};
