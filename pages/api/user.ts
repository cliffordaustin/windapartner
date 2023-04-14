import { UserTypes } from "../../utils/types";
import axios from "axios";

export const getUser = async (
  token: string | undefined
): Promise<UserTypes | null> => {
  if (token) {
    try {
      const user = await axios.get(`${process.env.NEXT_PUBLIC_baseURL}/user/`, {
        headers: {
          Authorization: "Token " + token,
        },
      });

      return user.data[0];
    } catch (error: unknown) {
      throw error;
    }
  }

  return null;
};
