import React, { useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";

function LogoutPage() {
  const router = useRouter();

  const logout = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_baseURL}/rest-auth/logout/`,
        "",
        {
          headers: {
            Authorization: "Token " + Cookies.get("token"),
          },
        }
      );
      Cookies.remove("token");
      router.push("/partner/lodge");
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 401) {
        Cookies.remove("token");
        router.push("/partner/lodge");
      }
    }
  };

  useEffect(() => {
    logout();
  }, []);
  return (
    <div>
      <Head>
        <title>Logout</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
    </div>
  );
}

export default LogoutPage;
