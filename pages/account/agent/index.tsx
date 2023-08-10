import React, { useState } from "react";
import PropTypes from "prop-types";
import axios, { AxiosError } from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";

import Image from "next/image";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import Head from "next/head";
import { GetServerSideProps } from "next";
import { getUser } from "../../api/user";
import { UserTypes } from "@/utils/types";
import getToken from "@/utils/getToken";
import { QueryClient, dehydrate, useMutation, useQuery } from "react-query";
import Navbar from "@/components/Agent/Navbar";
import {
  Avatar,
  Button,
  FileInput,
  Flex,
  PasswordInput,
  Text,
  rem,
} from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import { IconUpload } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";

const getCharacterValidationError = (str: string) => {
  return `Your password must have at least 1 ${str} character`;
};

const AboutUs = () => {
  const token = Cookies.get("token");

  const { data: user } = useQuery<UserTypes | null>("user-account", () =>
    getUser(token)
  );

  const fullName = (user?.first_name || "") + " " + (user?.last_name || "");

  const router = useRouter();

  const schema = Yup.object().shape({
    password: Yup.string()
      // check minimum characters
      .min(8, "Password must have at least 8 characters")
      // different error messages for different requirements
      .matches(/[0-9]/, getCharacterValidationError("digit"))
      .matches(/[a-z]/, getCharacterValidationError("lowercase"))
      .matches(/[A-Z]/, getCharacterValidationError("uppercase")),
    retypePassword: Yup.string().oneOf(
      [Yup.ref("password"), ""],
      "Passwords must match"
    ),
  });

  const [file, setFile] = useState<File>();

  const uploadImage = async () => {
    if (file) {
      const formData = new FormData();
      formData.append("profile_pic", file);
      await axios.patch(
        `${process.env.NEXT_PUBLIC_baseURL}/user/${user?.id}/`,
        formData,
        {
          headers: {
            Authorization: `Token ${Cookies.get("token")}`,
          },
        }
      );

      setFile(undefined);
    }
  };

  // const queryClient = new QueryClient();

  const { mutateAsync: uploadImageMutation, isLoading: uploadImageLoading } =
    useMutation(uploadImage, {
      onSuccess: () => {
        router.reload();
      },
    });

  type FormType = {
    oldPassword: string;
    password: string;
    retypePassword: string;
  };

  const form = useForm<FormType>({
    initialValues: {
      oldPassword: "",
      password: "",
      retypePassword: "",
    },
    validate: yupResolver(schema),
  });

  const changePassword = async (values: FormType) => {
    await axios
      .post(
        `${process.env.NEXT_PUBLIC_baseURL}/rest-auth/password/change/`,
        {
          old_password: values.oldPassword,
          new_password1: values.password,
          new_password2: values.retypePassword,
        },
        {
          headers: {
            Authorization: "Token " + Cookies.get("token"),
          },
        }
      )
      .then((res) => {
        values.oldPassword = "";
        values.password = "";
        values.retypePassword = "";

        notifications.show({
          title: "Password changed successfully",
          message: "Your password has been changed successfully",
        });
      })
      .catch((err) => {
        console.log(err);
        if (err instanceof AxiosError) {
          if (err.response?.status === 400) {
            notifications.show({
              title: "Error",
              message: "Old password is incorrect",
              color: "red",
            });
          }
        }
      });
  };

  const {
    mutateAsync: changePasswordMutation,
    isLoading: changePasswordLoading,
  } = useMutation(changePassword, {
    onSuccess: () => {},
  });
  return (
    <div className="relative">
      <Head>
        <title>SafariPricer | Your account</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <div className="border-b border-x-0 border-t-0 border-solid border-b-gray-200">
        <Navbar includeSearch={false} user={user}></Navbar>
      </div>

      <div className="max-w-[1100px] px-6 md:px-12 xl:px-0 mx-auto mt-6">
        <div className="flex md:flex-row flex-col items-center gap-3">
          {user && user.profile_pic && (
            <Avatar
              src={user?.profile_pic}
              alt="profile image of a user"
              size={rem(100)}
              className="rounded-full"
            />
          )}

          {user && !user.profile_pic && user.avatar_url && (
            <Avatar
              src={user.avatar_url}
              alt="profile image of a user"
              size={rem(100)}
              className="rounded-full"
            />
          )}

          {user && !user.profile_pic && !user.avatar_url && (
            <Avatar size={rem(100)} color="red" className="rounded-full">
              {fullName
                .split(" ")
                .map((name) => name[0])
                .join("")
                .toUpperCase()}
            </Avatar>
          )}

          <div className="flex flex-col items-center md:items-start">
            <div className="font-bold text-2xl capitalize">{fullName}</div>
            <Text truncate className="text-gray-500">
              {user?.email}
            </Text>
            <Flex align="flex-end" mt={6} gap={4}>
              <FileInput
                label="Your profile picture"
                placeholder="Select one image"
                accept="image/png, image/jpeg, image/jpg"
                name="file"
                value={file}
                icon={<IconUpload size={rem(14)} />}
                onChange={(payload: File) => {
                  setFile(payload);
                }}
                w={220}
                required
                clearable
              />

              <Button
                onClick={() => {
                  uploadImageMutation();
                }}
                disabled={!file}
                color="red"
                loading={uploadImageLoading}
              >
                <span>Update</span>
              </Button>
            </Flex>
          </div>
        </div>

        <div className="mt-8">
          <h1 className="font-bold text-xl mb-4">Change password</h1>

          <form
            onSubmit={form.onSubmit((values) => {
              changePasswordMutation(values);
            })}
          >
            <div className="sm:w-[70%] md:w-[40%] flex flex-col gap-2 w-full">
              <div>
                <PasswordInput
                  required
                  label="Old password"
                  placeholder="Your old password"
                  value={form.values.oldPassword}
                  onChange={(event) =>
                    form.setFieldValue("oldPassword", event.currentTarget.value)
                  }
                  error={form.errors.oldPassword}
                  radius="md"
                />
              </div>

              <div>
                <PasswordInput
                  required
                  label="New password"
                  placeholder="Your new password"
                  value={form.values.password}
                  onChange={(event) =>
                    form.setFieldValue("password", event.currentTarget.value)
                  }
                  error={form.errors.password}
                  radius="md"
                />
              </div>

              <div>
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
              </div>
            </div>

            <Button
              type="submit"
              mt={12}
              color="red"
              loading={changePasswordLoading}
            >
              <span>Change password</span>
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const queryClient = new QueryClient();

  const token = getToken(context);

  try {
    const user = await queryClient.fetchQuery<UserTypes | null>(
      "user-account",
      () => getUser(token)
    );

    if (!user) {
      return {
        redirect: {
          destination: `/partner/signin/agent?redirect=/account`,
          permanent: false,
        },
      };
    }

    return {
      props: {
        dehydratedState: dehydrate(queryClient),
      },
    };
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 401) {
      return {
        redirect: {
          destination: `/partner/signin/agent?redirect=/account`,
          permanent: false,
        },
      };
    }
    return {
      props: {},
    };
  }
};

export default AboutUs;
