import React, { useEffect, useState } from "react";

import axios, { AxiosError } from "axios";
import Link from "next/link";
import Image from "next/image";

import { useRouter } from "next/router";
import { Button } from "@mantine/core";
import { GetServerSideProps } from "next";
import { notifications } from "@mantine/notifications";
import Cookies from "js-cookie";
import { format } from "date-fns";

const EmailVerification = ({
  error,
  badRequest,
}: {
  error: boolean;
  badRequest: boolean;
}) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [timeToRequestForNewEmail, setTimeToRequestForNewEmail] =
    useState<number>(120);

  useEffect(() => {
    if (timeToRequestForNewEmail > 0) {
      setTimeout(() => {
        setTimeToRequestForNewEmail(timeToRequestForNewEmail - 1);
      }, 1000);
    }
  }, [timeToRequestForNewEmail]);

  let currentTimer = 120;

  const resend = async () => {
    currentTimer += 120;
    setLoading(true);
    axios
      .post(`${process.env.NEXT_PUBLIC_baseURL}/sendconfirmationemail/`, {
        email: Buffer.from(router.query.email as string, "base64").toString(
          "binary"
        ),
      })
      .then((res) => {
        setLoading(false);
        notifications.show({
          title: "Email sent",
          message: "Email confirmation sent successfully",
        });
      })
      .catch((error) => {
        setLoading(false);
      });

    setTimeToRequestForNewEmail(currentTimer);
  };

  const sendConfirmationEmail = async () => {
    await axios
      .post(`${process.env.NEXT_PUBLIC_baseURL}/sendconfirmationemail/`, {
        email: Buffer.from(router.query.email as string, "base64").toString(
          "binary"
        ),
      })
      .then((res) => {})
      .catch((error) => {});
  };

  useEffect(() => {
    if (Cookies.get("email-verification") !== "true") {
      sendConfirmationEmail();
      Cookies.set("email-verification", "true");
    }
  }, []);
  return (
    <div className="relative">
      {(error || !badRequest) && (
        <div>
          <div className="mt-8 w-full flex items-center justify-center">
            <Link className="relative w-28 h-9 cursor-pointer" href="/">
              <Image
                alt="Logo"
                src="/images/winda_logo/horizontal-blue-font.png"
                priority
                fill
              ></Image>
            </Link>
          </div>
          <div className="mx-auto max-w-[500px] px-4 py-2 mt-8 rounded-xl border border-solid border-gray-200">
            <h1 className="text-center font-bold text-xl">Already verified</h1>
            <p className="mt-4">
              It looks like you have already verified your email
            </p>
          </div>
        </div>
      )}

      {!error && badRequest && (
        <div>
          <div className="mt-8 w-full flex items-center justify-center">
            <Link className="relative w-28 h-9 cursor-pointer" href="/">
              <Image
                alt="Logo"
                src="/images/winda_logo/horizontal-blue-font.png"
                fill
                priority
              ></Image>
            </Link>
          </div>

          <div className="mx-auto flex flex-col items-center max-w-[500px] px-4 py-2 mt-8 rounded-xl border border-solid border-gray-200">
            <h1 className="text-center font-bold text-xl">
              Confirm your email
            </h1>
            <p className="mt-4 text-center">
              Please check your email for confirmation mail. Click link in email
              to verify your account.
            </p>

            <div className="relative w-[170px] h-[170px]">
              <Image
                src={"/images/mail-sent.png"}
                alt={"Mail sent"}
                sizes="100%"
                fill
              />
            </div>

            <div className="mt-6 flex flex-col items-center gap-2 mb-4">
              <p className="text-gray-500 text-sm">
                Didn&apos;t get confirmation mail?
              </p>
              <Button
                onClick={() => {
                  resend();
                }}
                loading={loading}
                color="red"
                disabled={timeToRequestForNewEmail > 0}
              >
                <span>
                  Resend email confirmation
                  {timeToRequestForNewEmail > 0 &&
                    `(${format(
                      new Date(timeToRequestForNewEmail * 1000),
                      "mm:ss"
                    )})`}
                </span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  query,
  resolvedUrl,
}) => {
  let notFound = false;
  let badRequest = false;
  let serverErr = false;
  await axios
    .post(`${process.env.NEXT_PUBLIC_baseURL}/checkconfirmationemail/`, {
      email: Buffer.from(query.email as string, "base64").toString("binary"),
    })
    .then((res) => {})
    .catch((error: AxiosError) => {
      if (error.response?.status === 404) {
        notFound = true;
      } else if (error.response?.status === 400) {
        badRequest = true;
      } else {
        serverErr = true;
      }
    });

  if (notFound) {
    return {
      notFound: true,
    };
  }

  if (badRequest) {
    return {
      props: {
        badRequest: true,
      },
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
    props: {},
  };
};

export default EmailVerification;
