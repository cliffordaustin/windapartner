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
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

const getCharacterValidationError = (str: string) => {
  return `Your password must have at least 1 ${str} character`;
};

function PartnerSignin(props: PaperProps) {
  const [type, toggle] = useToggle(["login", "register"]);
  const [isLoading, setLoading] = React.useState(false);

  const [loginError, setLoginError] = React.useState(false);

  const router = useRouter();

  const schema = Yup.object().shape({
    email: Yup.string().email("Invalid email"),
    password:
      type === "login"
        ? Yup.string()
        : Yup.string()
            // check minimum characters
            .min(8, "Password must have at least 8 characters")
            // different error messages for different requirements
            .matches(/[0-9]/, getCharacterValidationError("digit"))
            .matches(/[a-z]/, getCharacterValidationError("lowercase"))
            .matches(/[A-Z]/, getCharacterValidationError("uppercase")),
  });

  const form = useForm({
    initialValues: {
      email: "",
      name: "",
      password: "",
    },

    validate: yupResolver(schema),
  });

  const submit = async () => {
    // check if form is valid
    if (type === "login" && form.isValid()) {
      try {
        setLoading(true);
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_baseURL}/rest-auth/login/`,
          {
            email: form.values.email,
            password: form.values.password,
          }
        );

        Cookies.set("token", response.data.key);
        setLoginError(false);
        router.replace((router.query.redirect as string) || "/partner/lodge");
      } catch (error) {
        setLoading(false);
        setLoginError(true);
      }
    } else if (type === "register" && form.isValid()) {
      try {
        setLoading(true);
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_baseURL}/rest-auth/registration/`,
          {
            name: form.values.name,
            email: form.values.email,
            password1: form.values.password,
            password2: form.values.password,
            is_agent: true,
          }
        );

        Cookies.set("token", response.data.key);

        router.replace((router.query.redirect as string) || "/partner/lodge");
      } catch (error) {
        setLoading(false);
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

      <Text mb={12} size="lg" weight={700}>
        Welcome to Winda, {type} with
      </Text>

      <form onSubmit={form.onSubmit(() => {})}>
        <Stack>
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
            error={form.errors.email && "Invalid email"}
            radius="md"
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

export default PartnerSignin;
