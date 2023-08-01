import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { GetServerSideProps } from "next";
import Cookies from "js-cookie";

function VerificationLogin({
  error,
  token,
}: {
  error: boolean;
  token: string;
}) {
  const router = useRouter();

  useEffect(() => {
    Cookies.set("token", token);
    Cookies.remove("email-verification");
  }, []);

  useEffect(() => {
    if (!error) {
      router.replace((router.query.redirect as string) || "/partner/agent");
    }
  }, [error, router, router.query.redirect]);

  return (
    <>
      {!error && (
        <div className="relative">
          <div className="w-full font-bold bg-[#0A1A44] text-center py-2 px-2 text-white">
            Your email has been confirmed.
          </div>
        </div>
      )}

      {error && (
        <div className="h-screen flex items-center justify-center">
          <span className="text-gray-600">An error has occurred</span>
        </div>
      )}
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  query,
  resolvedUrl,
}) => {
  let notFound = false;
  let serverErr = false;
  let token = "";
  await axios
    .post(
      `${process.env.NEXT_PUBLIC_baseURL}/account-confirm-email/${query.verification_slug}/`,
      {
        key: query.verification_slug,
      }
    )
    .then((res) => {
      token = res.data.key;
    })
    .catch((error: AxiosError) => {
      if (error.response?.status === 404) {
        notFound = true;
      } else {
        serverErr = true;
      }
    });

  if (notFound) {
    return {
      notFound: true,
    };
  }

  if (serverErr) {
    return {
      props: {
        error: true,
      },
    };
  }

  return {
    props: {
      error: false,
      token,
    },
  };
};

export default VerificationLogin;
