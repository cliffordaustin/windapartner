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
  Divider,
  Checkbox,
  Anchor,
  Stack,
  Loader,
} from "@mantine/core";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useGoogleLogin } from "@react-oauth/google";
import { signinWithGoogle } from "@/utils/auth";
import { IconBrandGoogle } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import Link from "next/link";

const getCharacterValidationError = (str: string) => {
  return `Your password must have at least 1 ${str} character`;
};

type AgentSigninProps = {
  name: string;
  email: string;
};

function AgentSignin({ name, email }: AgentSigninProps) {
  const [type, toggle] = useToggle(["register", "login"]);
  const [isLoading, setLoading] = React.useState(false);

  const [loginError, setLoginError] = React.useState(false);

  const [notAnAgentError, setNotAnAgentError] = React.useState(false);

  const router = useRouter();

  const schema = Yup.object().shape({
    email: Yup.string().email("Invalid email"),
    password:
      type === "login"
        ? Yup.string().required("Password is required")
        : Yup.string()
            // check minimum characters
            .min(8, "Password must have at least 8 characters")
            // different error messages for different requirements
            .matches(/[0-9]/, getCharacterValidationError("digit"))
            .matches(/[a-z]/, getCharacterValidationError("lowercase"))
            .matches(/[A-Z]/, getCharacterValidationError("uppercase"))
            .required("Password is required"),
    retypePassword:
      type === "login"
        ? Yup.string()
        : Yup.string().oneOf([Yup.ref("password"), ""], "Passwords must match"),
  });

  const form = useForm({
    initialValues: {
      email: email,
      name: name,
      password: "",
      retypePassword: "",
    },

    validate: yupResolver(schema),
  });

  const submit = async () => {
    setLoginError(false);
    setNotAnAgentError(false);
    // check if form is valid
    if (type === "login" && form.isValid()) {
      try {
        setLoading(true);

        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_baseURL}/custom/login/`,
          {
            email: form.values.email,
            password: form.values.password,
            is_agent: true,
          }
        );

        Cookies.set("token", response.data.key);
        router.replace((router.query.redirect as string) || "/partner/agent");
      } catch (error) {
        setLoading(false);
        if (error instanceof AxiosError) {
          if (error.response?.data?.is_agent === false) {
            console.log("not an agent");
            setNotAnAgentError(true);
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
            first_name: form.values.name,
            email: form.values.email,
            password1: form.values.password,
            password2: form.values.retypePassword,
            is_agent: true,
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
      await signinWithGoogle(user.access_token);
      router.push((router.query.redirect as string) || "/partner/agent");
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
    <div>
      {loginError ? (
        <div className="text-white sticky top-0 z-40 right-0 w-full mb-4 text-sm py-3 rounded-lg text-center px-4 bg-red-500 font-bold">
          We couldn’t find an account matching the email or password you
          entered. Please check your email or password and try again.
        </div>
      ) : null}

      {notAnAgentError ? (
        <div className="text-white sticky top-0 z-40 right-0 w-full mb-4 text-sm py-3 rounded-lg text-center px-4 bg-red-500 font-bold">
          User is not an agent. Please register as an agent. Go to the{" "}
          <Link className="text-white" href={`/`}>
            property login page
          </Link>{" "}
          if you are trying to login as a property owner.
        </div>
      ) : null}

      {type === "login" ? (
        <Text
          className={
            "font-bold mb-2 text-center text-lg self-baseline sm:text-xl md:text-2xl xl:text-2xl text-black"
          }
        >
          Login to your account
        </Text>
      ) : (
        <Text
          className={
            "font-bold mb-2 text-center text-lg self-baseline sm:text-xl md:text-2xl xl:text-2xl text-black"
          }
        >
          Signup for the preview release
        </Text>
      )}
      <form className="mt-4" onSubmit={form.onSubmit(() => {})}>
        <Stack spacing={6}>
          {type === "register" && (
            <TextInput
              label="Partner's name"
              placeholder="Your name"
              value={form.values.name}
              onChange={(event) =>
                form.setFieldValue("name", event.currentTarget.value)
              }
              radius="md"
              size="md"
            />
          )}

          <TextInput
            required
            label="Email"
            placeholder="hello@gmail.com"
            value={form.values.email}
            onChange={(event) =>
              form.setFieldValue("email", event.currentTarget.value)
            }
            error={form.errors.email}
            radius="md"
            size="md"
          />

          <PasswordInput
            required
            label="Password"
            placeholder="Your password"
            value={form.values.password}
            onChange={(event) =>
              form.setFieldValue("password", event.currentTarget.value)
            }
            error={form.errors.password}
            radius="md"
            size="md"
          />

          {type === "register" && (
            <PasswordInput
              required
              label="Re-type new password"
              placeholder="Re-type new password"
              value={form.values.retypePassword}
              onChange={(event) =>
                form.setFieldValue("retypePassword", event.currentTarget.value)
              }
              error={form.errors.retypePassword}
              radius="md"
              size="md"
            />
          )}
        </Stack>

        <Group position="apart" mt="md">
          <Anchor
            component="button"
            type="button"
            color="dimmed"
            onClick={() => toggle()}
            size="sm"
          >
            {type === "register"
              ? "Already have an account? Login"
              : "Don't have an account? Register"}
          </Anchor>
          <Button
            onClick={() => submit()}
            color="red"
            type="submit"
            radius="xl"
            className="flex items-center"
            disabled={isLoading}
            size="md"
          >
            {upperFirst(type)}
            {isLoading && <Loader size="xs" color="gray" ml={5}></Loader>}
          </Button>
        </Group>
      </form>

      <Button
        onClick={() => {
          googleSocialLogin();
        }}
        loading={googleLoading}
        size="md"
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
    </div>
  );
}

export default AgentSignin;
