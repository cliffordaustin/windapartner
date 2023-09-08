import { Auth } from "aws-amplify";

type ResendConfCodeParameters = {
  username: string;
};

export async function resendConfirmationCode({
  username,
}: ResendConfCodeParameters) {
  await Auth.resendSignUp(username);
}
