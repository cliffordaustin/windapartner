import React, { useEffect } from "react";
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
  PinInput,
  Alert,
} from "@mantine/core";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useGoogleLogin } from "@react-oauth/google";
import { signinWithGoogle } from "@/utils/auth";
import { notifications } from "@mantine/notifications";
import Link from "next/link";
import Image from "next/image";
import { signUp } from "@/utils/signup";
import { confirmSignUp } from "@/utils/confirmSignup";
import { resendConfirmationCode } from "@/utils/resendConfirmationCode";
import { Auth } from "aws-amplify";
import { AuthErrorStrings } from "@aws-amplify/auth";
import { IconAlertCircle, IconInfoCircle } from "@tabler/icons-react";
import { signIn } from "@/utils/signin";

const getCharacterValidationError = (str: string) => {
  return `Your password must have at least 1 ${str} character`;
};

function PartnerSignin(props: PaperProps) {
  const router = useRouter();
  const [type, toggle] = useToggle(["login", "register"]);

  useEffect(() => {
    if (router.query.register === "1") {
      toggle();
    }
  }, [router.query.register]);
  const [isLoading, setLoading] = React.useState(false);

  const [loginError, setLoginError] = React.useState(false);
  const [notAPartnerError, setNotAPartnerError] = React.useState(false);

  const schema = Yup.object().shape({
    email: Yup.string().email("Invalid email"),
    password: Yup.string().required("Password is required").min(8),

    retypePassword:
      type === "login"
        ? Yup.string()
        : Yup.string().oneOf([Yup.ref("password"), ""], "Passwords must match"),
  });

  const form = useForm({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      retypePassword: "",
    },

    validate: yupResolver(schema),
  });

  const [showVerifyEmail, setShowVerifyEmail] = React.useState(false);

  const [showUserFullName, setShowUserFullName] = React.useState(false);

  const [code, setCode] = React.useState("");

  const [forgotPasswordCode, setForgotPasswordCode] = React.useState("");

  const [showErrorAlert, setShowErrorAlert] = React.useState<string | null>(
    null
  );

  const [userNotConfirmed, setUserNotConfirmed] = React.useState(false);

  const [codeLoading, setCodeLoading] = React.useState(false);

  const [resendCodeLoading, setResendCodeLoading] = React.useState(false);

  const [showForgotPasswordView, setShowForgotPasswordView] =
    React.useState(false);

  const [showForgotPasswordProcess, setShowForgotPasswordProcess] =
    React.useState(false);

  const submit = async () => {
    setShowErrorAlert(null);
    if (type === "login" && form.isValid()) {
      try {
        setLoading(true);
        await signIn({
          username: form.values.email,
          password: form.values.password,
        });

        // get the user access token
        await Auth.currentSession().then(async (res) => {
          let accessToken = res.getAccessToken();
          let jwt = accessToken.getJwtToken();

          await axios.get(`${process.env.NEXT_PUBLIC_baseURL}/user-profile/`, {
            headers: {
              Authorization: "Bearer " + jwt,
            },
          });
        });
        setLoading(false);
        if (router.query.next_state === "agent") {
          router.push((router.query.redirect as string) || "/partner/agent");
        } else {
          router.push((router.query.redirect as string) || "/partner/lodge");
        }
      } catch (error: any) {
        setLoading(false);
        if (error?.code === "UserNotConfirmedException") {
          setUserNotConfirmed(true);
        } else {
          setShowErrorAlert(error?.message);
        }
      }
    } else if (type === "register" && form.isValid()) {
      try {
        setLoading(true);
        await signUp({
          email: form.values.email,
          password: form.values.password,
        });
        setShowVerifyEmail(true);
      } catch (error: any) {
        setLoading(false);
        setShowErrorAlert(error?.message);
      }
    }
  };

  const verifyCode = async () => {
    setShowErrorAlert(null);
    try {
      setCodeLoading(true);
      await Auth.confirmSignUp(form.values.email, code);

      await signIn({
        username: form.values.email,
        password: form.values.password,
      });

      await Auth.currentSession()
        .then(async (res) => {
          let accessToken = res.getAccessToken();
          let jwt = accessToken.getJwtToken();

          await axios.get(`${process.env.NEXT_PUBLIC_baseURL}/user-profile/`, {
            headers: {
              Authorization: "Bearer " + jwt,
            },
          });

          const user = await Auth.currentAuthenticatedUser();

          await axios.post(
            `${process.env.NEXT_PUBLIC_baseURL}/update-userprofile/`,
            {
              primary_email: user.attributes.email,
            },
            {
              headers: {
                Authorization: "Bearer " + jwt,
              },
            }
          );
          setShowUserFullName(true);
          setCodeLoading(false);
          setShowVerifyEmail(false);
        })
        .catch((err) => {
          setCodeLoading(false);
          setShowErrorAlert("An error occured. Please try again");
        });
    } catch (error: any) {
      setCodeLoading(false);
      setShowErrorAlert(error.message);
    }
  };

  const [updateUserProfileLoading, setUpdateUserProfileLoading] =
    React.useState(false);

  const updateUserProfile = async () => {
    const user = await Auth.currentAuthenticatedUser();

    try {
      setUpdateUserProfileLoading(true);
      await Auth.updateUserAttributes(user, {
        given_name: form.values.first_name,
        family_name: form.values.last_name,
      });

      await Auth.currentSession().then(async (res) => {
        let accessToken = res.getAccessToken();
        let jwt = accessToken.getJwtToken();

        await axios.post(
          `${process.env.NEXT_PUBLIC_baseURL}/update-userprofile/`,
          {
            first_name: form.values.first_name,
            last_name: form.values.last_name,
          },
          {
            headers: {
              Authorization: "Bearer " + jwt,
            },
          }
        );

        if (router.query.next_state === "agent") {
          router.push((router.query.redirect as string) || "/partner/agent");
        } else {
          router.push((router.query.redirect as string) || "/partner/lodge");
        }
      });
    } catch (error) {
      console.log(error);
      setUpdateUserProfileLoading(false);
      setShowErrorAlert("An error occured. Please try again");
    }
  };

  const resendCode = async () => {
    setShowErrorAlert(null);
    try {
      await resendConfirmationCode({
        username: form.values.email,
      });
    } catch (error: any) {
      setShowErrorAlert(error?.message);
    }
  };

  const [resetPasswordLoading, setResetPasswordLoading] = React.useState(false);

  const sendResetPassword = async () => {
    setShowErrorAlert(null);
    try {
      setResetPasswordLoading(true);
      await Auth.forgotPassword(form.values.email);
      setResetPasswordLoading(false);
      setShowForgotPasswordProcess(true);
    } catch (error: any) {
      setResetPasswordLoading(false);
      if (error?.code === "UserNotFoundException") {
        setShowErrorAlert("User not found");
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

  const forgotPasswordSchema = Yup.object().shape({
    password: Yup.string().required("Password is required").min(8),
    retypePassword: Yup.string().oneOf(
      [Yup.ref("password"), ""],
      "Passwords must match"
    ),
  });

  const forgotPasswordForm = useForm({
    initialValues: {
      password: "",
      retypePassword: "",
    },

    validate: yupResolver(forgotPasswordSchema),
  });

  const submitForgotPassord = async () => {
    setShowErrorAlert(null);
    if (forgotPasswordForm.isValid()) {
      try {
        setResetPasswordLoading(true);
        await Auth.forgotPasswordSubmit(
          form.values.email,
          forgotPasswordCode,
          forgotPasswordForm.values.password
        );
        setResetPasswordLoading(false);
        setShowForgotPasswordView(false);
        setShowForgotPasswordProcess(false);

        form.setFieldValue("email", "");
        form.setFieldValue("password", "");
        form.setFieldValue("retypePassword", "");

        forgotPasswordForm.setFieldValue("password", "");
        forgotPasswordForm.setFieldValue("retypePassword", "");
        setForgotPasswordCode("");

        notifications.show({
          title: "Success",
          message: "Password reset successful. Please login",
        });
      } catch (error: any) {
        setResetPasswordLoading(false);
        setShowErrorAlert(error.message);
      }
    }
  };

  return (
    <>
      <div className="border-b border-x-0 w-full h-[70px] border-t-0 flex items-center bg-gray-50 justify-between px-6 border-solid border-b-gray-200">
        <Link className="" href="/">
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
        </Link>

        <div></div>
      </div>

      {showErrorAlert && (
        <Alert
          icon={<IconAlertCircle size="1rem" />}
          title="An error occured"
          className="w-full sm:w-[400px] mx-auto"
          color="red"
          withCloseButton
          onClose={() => {
            setShowErrorAlert(null);
          }}
        >
          {showErrorAlert}
        </Alert>
      )}

      {!showVerifyEmail &&
        !userNotConfirmed &&
        !showForgotPasswordView &&
        !showUserFullName && (
          <div
            className={
              "flex flex-col px-4 sm:px-0 items-center overflow-y-scroll justify-center " +
              (showErrorAlert ? "mt-[20px]" : "mt-[40px]")
            }
          >
            <div className="w-full sm:w-[400px]">
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

                  {type === "register" && (
                    <div className="flex items-center gap-1">
                      <IconInfoCircle className="text-gray-500" size="0.8rem" />
                      <span className="text-gray-500 text-sm">
                        Passwords must be at least 8 characters.
                      </span>
                    </div>
                  )}

                  {type === "register" && (
                    <PasswordInput
                      required
                      label="Confirm password"
                      placeholder="Re-type password"
                      value={form.values.retypePassword}
                      size="lg"
                      mt={4}
                      onChange={(event) =>
                        form.setFieldValue(
                          "retypePassword",
                          event.currentTarget.value
                        )
                      }
                      error={form.errors.retypePassword}
                      radius="sm"
                    />
                  )}

                  {type === "login" && (
                    <Group position="right">
                      <Anchor
                        component="button"
                        type="button"
                        color="dimmed"
                        size="sm"
                        onClick={() => {
                          setShowForgotPasswordView(true);
                        }}
                      >
                        Forgot password?
                      </Anchor>
                    </Group>
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
                    {type === "login" ? "Login" : "Create account"}
                    {isLoading && (
                      <Loader size="xs" color="gray" ml={5}></Loader>
                    )}
                  </Button>
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
                </div>
              </form>

              {/* <Divider labelPosition="center" my={8} label="or" />

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
            </Button> */}

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
        )}

      {(showVerifyEmail || userNotConfirmed) &&
        !showForgotPasswordView &&
        !showUserFullName && (
          <div
            className={
              "flex flex-col items-center px-4 sm:px-0 overflow-y-scroll justify-center " +
              (showErrorAlert ? "mt-[20px]" : "mt-[40px]")
            }
          >
            <div className="w-full sm:w-[400px]">
              <Text className="text-2xl text-center mb-2" weight={700}>
                {userNotConfirmed ? "We Emailed You" : "Verify Your Email"}
              </Text>

              <Text size="sm" color="dimmed" className="mb-4 text-center">
                {userNotConfirmed
                  ? "Your code is on the way. To log in, enter the code we sent you. It may take a minute to arrive."
                  : `
                Your code is on the way. To log in, enter the code we emailed to
              ${form.values.email}. It may take a minute to arrive.`}
              </Text>

              <Group position="center">
                <PinInput
                  required
                  length={6}
                  size="lg"
                  type="number"
                  onChange={(value) => setCode(value)}
                ></PinInput>
              </Group>

              <div className="mt-6 flex flex-col gap-3 items-center">
                <Button
                  size="lg"
                  className="w-full"
                  disabled={code.length !== 6}
                  loading={codeLoading}
                  onClick={() => {
                    verifyCode();
                  }}
                  color="red"
                >
                  Confirm
                </Button>
                <Button
                  size="lg"
                  className="w-full"
                  loading={resendCodeLoading}
                  variant="default"
                  onClick={() => {
                    resendCode();
                  }}
                  color="dimmed"
                >
                  Resend code
                </Button>
              </div>
            </div>
          </div>
        )}

      {!showVerifyEmail &&
        !userNotConfirmed &&
        showForgotPasswordView &&
        !showUserFullName && (
          <div
            className={
              "flex flex-col items-center px-4 sm:px-0 overflow-y-scroll justify-center " +
              (showErrorAlert ? "mt-[20px]" : "mt-[40px]")
            }
          >
            <div className="w-full sm:w-[400px]">
              <Text className="text-2xl text-center mb-2" weight={700}>
                Reset Password
              </Text>
              {!showForgotPasswordProcess && (
                <>
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
                  <div className="mt-6 flex flex-col gap-3 items-center">
                    <Button
                      size="lg"
                      className="w-full"
                      disabled={!form.values.email}
                      loading={resetPasswordLoading}
                      onClick={() => {
                        sendResetPassword();
                      }}
                      color="red"
                    >
                      Send code
                    </Button>
                    <Button
                      size="lg"
                      className="w-full"
                      loading={resendCodeLoading}
                      variant="default"
                      onClick={() => {
                        setShowForgotPasswordView(false);
                      }}
                      color="dimmed"
                    >
                      Back to login
                    </Button>
                  </div>
                </>
              )}

              {showForgotPasswordProcess && (
                <form onSubmit={forgotPasswordForm.onSubmit(() => {})}>
                  <Group position="center">
                    <PinInput
                      required
                      length={6}
                      size="lg"
                      type="number"
                      onChange={(value) => setForgotPasswordCode(value)}
                    ></PinInput>
                  </Group>

                  <PasswordInput
                    required
                    label="Password"
                    placeholder="Your password"
                    size="lg"
                    mt={4}
                    value={forgotPasswordForm.values.password}
                    onChange={(event) =>
                      forgotPasswordForm.setFieldValue(
                        "password",
                        event.currentTarget.value
                      )
                    }
                    error={forgotPasswordForm.errors.password}
                    radius="sm"
                  />

                  <div className="flex items-center gap-1">
                    <IconInfoCircle className="text-gray-500" size="0.8rem" />
                    <span className="text-gray-500 text-sm">
                      Passwords must be at least 8 characters.
                    </span>
                  </div>

                  <PasswordInput
                    required
                    label="Confirm password"
                    placeholder="Re-type password"
                    value={forgotPasswordForm.values.retypePassword}
                    size="lg"
                    mt={4}
                    onChange={(event) =>
                      forgotPasswordForm.setFieldValue(
                        "retypePassword",
                        event.currentTarget.value
                      )
                    }
                    error={forgotPasswordForm.errors.retypePassword}
                    radius="sm"
                  />
                  <div className="mt-6 flex flex-col gap-3 items-center">
                    <Button
                      size="lg"
                      onClick={() => {
                        submitForgotPassord();
                      }}
                      className="w-full"
                      loading={resetPasswordLoading}
                      disabled={forgotPasswordCode.length !== 6}
                      type="submit"
                      color="red"
                    >
                      Submit
                    </Button>
                    <Button
                      size="lg"
                      className="w-full"
                      loading={resendCodeLoading}
                      variant="default"
                      onClick={() => {
                        setShowForgotPasswordView(false);
                        setShowForgotPasswordProcess(false);
                      }}
                      color="dimmed"
                    >
                      Back to login
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      {!showVerifyEmail &&
        !userNotConfirmed &&
        !showForgotPasswordView &&
        showUserFullName && (
          <div
            className={
              "flex flex-col items-center px-4 sm:px-0 overflow-y-scroll justify-center " +
              (showErrorAlert ? "mt-[20px]" : "mt-[40px]")
            }
          >
            <div className="w-full sm:w-[400px]">
              <Text className="text-2xl" weight={700}>
                Welcome to SafariPricer
              </Text>

              <Text className="text-sm mb-4" color="dimmed">
                To start, what&apos;s your name?
              </Text>

              <TextInput
                required
                label="First name"
                placeholder="Enter your first name"
                size="lg"
                value={form.values.first_name}
                onChange={(event) =>
                  form.setFieldValue("first_name", event.currentTarget.value)
                }
                error={form.errors.first_name}
                radius="sm"
              />
              <TextInput
                label="Last name"
                placeholder="Enter your last name"
                size="lg"
                value={form.values.last_name}
                onChange={(event) =>
                  form.setFieldValue("last_name", event.currentTarget.value)
                }
                className="mt-2"
                error={form.errors.last_name}
                radius="sm"
              />
              <div className="mt-6">
                <Button
                  size="lg"
                  className="w-full"
                  loading={updateUserProfileLoading}
                  onClick={() => {
                    updateUserProfile();
                  }}
                  color="red"
                >
                  Continue
                </Button>
              </div>

              {showForgotPasswordProcess && (
                <form onSubmit={forgotPasswordForm.onSubmit(() => {})}>
                  <Group position="center">
                    <PinInput
                      required
                      length={6}
                      size="lg"
                      type="number"
                      onChange={(value) => setForgotPasswordCode(value)}
                    ></PinInput>
                  </Group>

                  <PasswordInput
                    required
                    label="Password"
                    placeholder="Your password"
                    size="lg"
                    mt={4}
                    value={forgotPasswordForm.values.password}
                    onChange={(event) =>
                      forgotPasswordForm.setFieldValue(
                        "password",
                        event.currentTarget.value
                      )
                    }
                    error={forgotPasswordForm.errors.password}
                    radius="sm"
                  />

                  <div className="flex items-center gap-1">
                    <IconInfoCircle className="text-gray-500" size="0.8rem" />
                    <span className="text-gray-500 text-sm">
                      Passwords must be at least 8 characters.
                    </span>
                  </div>

                  <PasswordInput
                    required
                    label="Confirm password"
                    placeholder="Re-type password"
                    value={forgotPasswordForm.values.retypePassword}
                    size="lg"
                    mt={4}
                    onChange={(event) =>
                      forgotPasswordForm.setFieldValue(
                        "retypePassword",
                        event.currentTarget.value
                      )
                    }
                    error={forgotPasswordForm.errors.retypePassword}
                    radius="sm"
                  />
                  <div className="mt-6 flex flex-col gap-3 items-center">
                    <Button
                      size="lg"
                      onClick={() => {
                        submitForgotPassord();
                      }}
                      className="w-full"
                      loading={resetPasswordLoading}
                      disabled={forgotPasswordCode.length !== 6}
                      type="submit"
                      color="red"
                    >
                      Submit
                    </Button>
                    <Button
                      size="lg"
                      className="w-full"
                      loading={resendCodeLoading}
                      variant="default"
                      onClick={() => {
                        setShowForgotPasswordView(false);
                        setShowForgotPasswordProcess(false);
                      }}
                      color="dimmed"
                    >
                      Back to login
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
    </>
  );
}

export default PartnerSignin;
