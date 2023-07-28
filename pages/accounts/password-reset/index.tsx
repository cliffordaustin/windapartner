import { Button, Paper, TextInput } from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import axios, { AxiosError } from "axios";
import React from "react";
import { useMutation } from "react-query";
import * as Yup from "yup";

function PasswordReset() {
  type FormType = {
    email: string;
  };

  const schema = Yup.object().shape({
    email: Yup.string().email("Invalid email"),
  });

  const form = useForm<FormType>({
    initialValues: {
      email: "",
    },
    validate: yupResolver(schema),
  });

  const handleSubmit = async () => {
    await axios
      .post(`${process.env.NEXT_PUBLIC_baseURL}/rest-auth/password/reset/`, {
        email: form.values.email,
      })
      .then((res) => {
        notifications.show({
          title: "Password reset",
          message: "Please check your email for password reset link",
        });
      })
      .catch((err) => {});
  };

  const {
    mutateAsync: changePasswordMutation,
    isLoading: changePasswordLoading,
  } = useMutation(handleSubmit, {
    onSuccess: () => {},
  });
  return (
    <Paper w={"400px"} mx={"auto"} mt={12} radius="md" p="lg" withBorder>
      <h1 className="font-bold text-xl mb-4 mt-0">Change password</h1>

      <form
        onSubmit={() => {
          changePasswordMutation();
        }}
      >
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

        <div className="flex justify-between">
          <div></div>
          <Button
            loading={changePasswordLoading}
            color="red"
            className="mt-4"
            type="submit"
            radius="xl"
          >
            Reset
          </Button>
        </div>
      </form>
    </Paper>
  );
}

export default PasswordReset;
