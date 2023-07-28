import axios from "axios";
import Cookies from "js-cookie";

export const signinWithGoogle = async (
  access_token: string,
  isAgent = true
) => {
  let response;
  try {
    const formData = new FormData();
    formData.append("access_token", access_token);
    if (isAgent) {
      formData.append("is_agent", "true");
    } else {
      formData.append("is_partner", "true");
    }
    response = await axios.post(
      `${process.env.NEXT_PUBLIC_baseURL}/auth/google/`,
      formData
    );

    Cookies.set("token", response.data.key);
  } catch (error) {}
};
