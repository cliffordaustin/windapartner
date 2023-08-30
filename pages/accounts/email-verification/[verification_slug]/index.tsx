import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { GetServerSideProps } from "next";
import Cookies from "js-cookie";
import Image from "next/image";
import { Button, PasswordInput, Stack, Text, TextInput } from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import * as Yup from "yup";

const getCharacterValidationError = (str: string) => {
  return `Your password must have at least 1 ${str} character`;
};

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

  const schema = Yup.object().shape({
    password: Yup.string()
      // check minimum characters
      .min(8, "Password must have at least 8 characters")
      // different error messages for different requirements
      .matches(/[0-9]/, getCharacterValidationError("digit"))
      .matches(/[a-z]/, getCharacterValidationError("lowercase"))
      .matches(/[A-Z]/, getCharacterValidationError("uppercase"))
      .required("Password is required"),
    retypePassword: Yup.string().oneOf(
      [Yup.ref("password"), ""],
      "Passwords must match"
    ),
  });

  const form = useForm({
    initialValues: {
      first_name: "",
      last_name: "",
      password: "",
      retypePassword: "",
    },

    validate: yupResolver(schema),
  });

  // useEffect(() => {
  //   if (!error) {
  //     router.replace((router.query.redirect as string) || "/partner/agent");
  //   }
  // }, [error, router, router.query.redirect]);

  return (
    <>
      <div className="border-b border-x-0 w-full h-[70px] border-t-0 flex items-center bg-gray-50 justify-between px-6 border-solid border-b-gray-200">
        <div className="relative w-28 h-9 cursor-pointer">
          <Image
            alt="Winda logo"
            src="/images/winda_logo/horizontal-blue-font.png"
            className="w-full h-full"
            sizes="(max-width: 768px) 100vw,
              (max-width: 1200px) 50vw,
              33vw"
            fill
            priority
          />
        </div>

        <div></div>
      </div>
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

      <div className="flex flex-col w-[400px] items-center overflow-y-scroll mt-[40px] justify-center">
        <div className="w-full">
          <div className="flex flex-col gap-2">
            <Text className="text-2xl mb-4" weight={700}>
              Email verified
            </Text>

            <Text color="dimmed" size="sm">
              Thank you for confirming your email address.
            </Text>

            <Text color="dimmed" size="sm"></Text>
          </div>
        </div>

        <div className="w-full">
          <div className="flex flex-col gap-2">
            <Text className="text-2xl mb-4" weight={700}>
              Create Password
            </Text>

            <Text color="dimmed" size="sm">
              Create a new password to secure your account
            </Text>
          </div>

          <form onSubmit={form.onSubmit(() => {})}>
            <Stack spacing={4}>
              <PasswordInput
                required
                label="Password"
                placeholder="Your password"
                size="lg"
                mt={4}
                value={form.values.password}
                onChange={(event) =>
                  form.setFieldValue("password", event.currentTarget.value)
                }
                error={form.errors.password}
                radius="sm"
              />

              <PasswordInput
                required
                label="Re-type new password"
                placeholder="Re-type new password"
                value={form.values.retypePassword}
                onChange={(event) =>
                  form.setFieldValue(
                    "retypePassword",
                    event.currentTarget.value
                  )
                }
                error={form.errors.retypePassword}
                radius="md"
              />
            </Stack>

            <div className="flex items-center gap-3 mt-4 flex-col">
              <Button
                color="red"
                type="submit"
                size="lg"
                radius="sm"
                className="w-full"
              >
                Continue
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

// export const getServerSideProps: GetServerSideProps = async ({
//   req,
//   res,
//   query,
//   resolvedUrl,
// }) => {
//   let notFound = false;
//   let serverErr = false;
//   let token = "";
//   await axios
//     .post(
//       `${process.env.NEXT_PUBLIC_baseURL}/account-confirm-email/${query.verification_slug}/`,
//       {
//         key: query.verification_slug,
//       }
//     )
//     .then((res) => {
//       token = res.data.key;
//     })
//     .catch((error: AxiosError) => {
//       if (error.response?.status === 404) {
//         notFound = true;
//       } else {
//         serverErr = true;
//       }
//     });

//   if (notFound) {
//     return {
//       notFound: true,
//     };
//   }

//   if (serverErr) {
//     return {
//       props: {
//         error: true,
//       },
//     };
//   }

//   return {
//     props: {
//       error: false,
//       token,
//     },
//   };
// };

export default VerificationLogin;
