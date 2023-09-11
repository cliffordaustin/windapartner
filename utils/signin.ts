import { Auth } from "aws-amplify";

type SignInParameters = {
  username: string;
  password: string;
};

export async function signIn({ username, password }: SignInParameters) {
  await Auth.signIn(username, password);
}
