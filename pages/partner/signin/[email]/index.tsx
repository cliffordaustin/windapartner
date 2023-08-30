import React, { useEffect, useState } from "react";
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
import { GetServerSideProps } from "next";

const getCharacterValidationError = (str: string) => {
  return `Your password must have at least 1 ${str} character`;
};

function PartnerSignin(props: PaperProps) {
  const [type, toggle] = useToggle(["register", "login"]);
  const [isLoading, setLoading] = React.useState(false);

  const [loginError, setLoginError] = React.useState(false);

  const [notAPartnerError, setNotAPartnerError] = React.useState(false);

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
      email: "",
      name: "",
      password: "",
      retypePassword: "",
    },

    validate: yupResolver(schema),
  });

  useEffect(() => {
    const email = router.query.email
      ? Buffer.from(router.query.email as string, "base64").toString()
      : "";
    form.setFieldValue("email", email);
  }, [router.query.email]);

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
          `${process.env.NEXT_PUBLIC_baseURL}/user/registration/create/`,
          {
            first_name: form.values.name,
            email: form.values.email,
            password1: form.values.password,
            password2: form.values.retypePassword,
            is_partner: true,
          }
        );

        const token = response.data.key;
        Cookies.set("token", token);
        router.push({
          pathname: `/partner/lodge`,
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

  return (
    <Paper
      w={"400px"}
      mx={"auto"}
      mt={12}
      radius="md"
      p="xl"
      withBorder
      {...props}
    >
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

      <Text mb={12} size="lg" weight={700}>
        Welcome to Winda, {type} with
      </Text>

      <form onSubmit={form.onSubmit(() => {})}>
        <Stack spacing={4}>
          {type === "register" && (
            <TextInput
              label="Partner's name"
              placeholder="Your name"
              value={form.values.name}
              onChange={(event) =>
                form.setFieldValue("name", event.currentTarget.value)
              }
              radius="md"
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
            disabled
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
            />
          )}
        </Stack>

        <Group position="apart" mt="xl">
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
          <Button
            onClick={() => submit()}
            color="red"
            type="submit"
            radius="xl"
            className="flex items-center"
            disabled={isLoading}
          >
            {upperFirst(type)}
            {isLoading && <Loader size="xs" color="gray" ml={5}></Loader>}
          </Button>
        </Group>
      </form>
    </Paper>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  try {
    const checkAgentEmail = async () => {
      await axios.post(
        `${process.env.NEXT_PUBLIC_baseURL}/property-access/check-email/`,
        {
          email: Buffer.from(query.email as string, "base64").toString(
            "binary"
          ),
        }
      );
    };

    await checkAgentEmail();

    return {
      props: {},
    };
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 404) {
      return {
        notFound: true,
      };
    }
    return {
      props: {},
    };
  }
};

export default PartnerSignin;
