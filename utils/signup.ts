import { Auth } from "aws-amplify";

type SignUpParameters = {
  password: string;
  email: string;
};

export async function signUp({ password, email }: SignUpParameters) {
  await Auth.signUp({
    username: email,
    password,

    autoSignIn: {
      // optional - enables auto sign in after user is confirmed
      enabled: true,
    },
  });
}
