import { Auth } from "aws-amplify";
import { UserTypes } from "../../utils/types";
import axios from "axios";

export const getUser = async (
  ssrToken: string | undefined = ""
): Promise<UserTypes | null> => {
  let token = "";
  if (ssrToken) {
    token = ssrToken;
  } else {
    const currentSession = await Auth.currentSession();
    const accessToken = currentSession.getAccessToken();
    token = accessToken.getJwtToken();
  }

  try {
    const user = await axios.get(`${process.env.NEXT_PUBLIC_baseURL}/user/`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    return user.data[0];
  } catch (error: unknown) {
    throw error;
  }
};
