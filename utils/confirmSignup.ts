import { Auth } from "aws-amplify";

type ConfirmSignUpParameters = {
  username: string;
  code: string;
};

export async function confirmSignUp({
  username,
  code,
}: ConfirmSignUpParameters) {
  await Auth.confirmSignUp(username, code);
}
