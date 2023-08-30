import React from "react";
import { useToggle, upperFirst } from "@mantine/hooks";
import { useForm, yupResolver } from "@mantine/form";
import * as Yup from "yup";
import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  PaperProps,
  Button,
  Anchor,
  Stack,
  Loader,
  Divider,
} from "@mantine/core";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useGoogleLogin } from "@react-oauth/google";
import { signinWithGoogle } from "@/utils/auth";
import { notifications } from "@mantine/notifications";
import Link from "next/link";
import Image from "next/image";

const getCharacterValidationError = (str: string) => {
  return `Your password must have at least 1 ${str} character`;
};

function PartnerSignin(props: PaperProps) {
  const [type, toggle] = useToggle(["login", "register"]);
  const [isLoading, setLoading] = React.useState(false);

  const [loginError, setLoginError] = React.useState(false);
  const [notAPartnerError, setNotAPartnerError] = React.useState(false);

  const router = useRouter();

  const schema = Yup.object().shape({
    email: Yup.string().email("Invalid email"),
    password:
      type === "login"
        ? Yup.string().required("Password is required")
        : Yup.string(),
  });

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },

    validate: yupResolver(schema),
  });

  const submit = async () => {
    setLoginError(false);
    setNotAPartnerError(false);
    // check if form is valid
    if (type === "login" && form.isValid()) {
      try {
        setLoading(true);

        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_baseURL}/custom/login/`,
          {
            email: form.values.email,
            password: form.values.password,
            is_partner: true,
          }
        );

        Cookies.set("token", response.data.key);
        router.replace((router.query.redirect as string) || "/partner/lodge");
      } catch (error) {
        setLoading(false);
        if (error instanceof AxiosError) {
          if (error.response?.data?.is_partner === false) {
            setNotAPartnerError(true);
          } else {
            setLoginError(true);
          }
        }
      }
    } else if (type === "register" && form.isValid()) {
      try {
        setLoading(true);
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_baseURL}/rest-auth/registration/`,
          {
            first_name: "",
            email: form.values.email,
            password1: "",
            password2: "",
            is_partner: true,
          }
        );

        const email = Buffer.from(form.values.email, "binary").toString(
          "base64"
        );
        router.push({
          pathname: `/accounts/email-confirm/${email}`,
        });
      } catch (error) {
        setLoading(false);
        if (error instanceof AxiosError) {
          if (error.response?.data?.email?.length > 0) {
            form.setErrors({ email: error.response?.data?.email[0] });
          }
        }
      }
    }
  };

  const [googleLoading, setGoogleLoading] = React.useState(false);

  const googleSocialLogin = useGoogleLogin({
    onSuccess: async (user) => {
      setGoogleLoading(true);
      await signinWithGoogle(user.access_token, false);
      router.push((router.query.redirect as string) || "/partner/lodge");
    },
    onError: (error) => {
      setGoogleLoading(false);
      notifications.show({
        title: "Error",
        message: "Something went wrong",
      });
    },
  });

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

      <div className="flex flex-col items-center overflow-y-scroll mt-[40px] justify-center">
        <div className="w-[400px]">
          {loginError ? (
            <div className="text-white sticky top-0 z-40 right-0 w-full mb-4 text-sm py-3 rounded-lg text-center px-4 bg-red-500 font-bold">
              We couldn’t find an account matching the email or password you
              entered. Please check your email or password and try again.
            </div>
          ) : null}

          {notAPartnerError ? (
            <div className="text-white sticky top-0 z-40 right-0 w-full mb-4 text-sm py-3 rounded-lg text-center px-4 bg-red-500 font-bold">
              User is not a lodge. Please register as a lodge. Go to the{" "}
              <Link className="text-white" href={`/partner/signin/agent`}>
                agent login page
              </Link>{" "}
              if you are trying to login as an agent.
            </div>
          ) : null}

          {type === "login" && (
            <Text className="text-2xl mb-4" weight={700}>
              Sign in to your account
            </Text>
          )}

          {type === "register" && (
            <Text className="text-2xl mb-4" weight={700}>
              Create your free account
            </Text>
          )}

          <form onSubmit={form.onSubmit(() => {})}>
            <Stack spacing={4}>
              <TextInput
                required
                label="Email"
                placeholder="hello@gmail.com"
                size="lg"
                value={form.values.email}
                onChange={(event) =>
                  form.setFieldValue("email", event.currentTarget.value)
                }
                error={form.errors.email}
                radius="sm"
              />

              {type === "login" && (
                <PasswordInput
                  required={type === "login"}
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
              )}
            </Stack>

            <div className="flex items-center gap-3 mt-4 flex-col">
              <Button
                onClick={() => submit()}
                color="red"
                type="submit"
                size="lg"
                radius="sm"
                className="w-full"
                disabled={isLoading}
              >
                {type === "login" ? "Login" : "Continue"}
                {isLoading && <Loader size="xs" color="gray" ml={5}></Loader>}
              </Button>
              <Anchor
                component="button"
                type="button"
                color="dimmed"
                onClick={() => toggle()}
                size="xs"
              >
                {type === "register"
                  ? "Already have an account? Login"
                  : "Don't have an account? Register"}
              </Anchor>
            </div>
          </form>

          <Divider labelPosition="center" my={8} label="or" />

          <Button
            onClick={() => {
              googleSocialLogin();
            }}
            loading={googleLoading}
            size="lg"
            mt={10}
            leftIcon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                aria-hidden="true"
                role="img"
                width="24px"
                height="24px"
                preserveAspectRatio="xMidYMid meet"
                viewBox="0 0 48 48"
              >
                <path
                  fill="#FFC107"
                  d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
                />
                <path
                  fill="#FF3D00"
                  d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"
                />
                <path
                  fill="#4CAF50"
                  d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
                />
                <path
                  fill="#1976D2"
                  d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
                />
              </svg>
            }
            variant="default"
            color="gray"
            w={"100%"}
          >
            Continue with Google
          </Button>

          {/* <Anchor
        component="button"
        type="button"
        color="dimmed"
        onClick={() => {
          router.push("/accounts/password-reset");
        }}
        size="xs"
        mt={6}
        className="text-center"
      >
        Forgot password?
      </Anchor> */}
        </div>
      </div>
    </>
  );
}

export default PartnerSignin;
