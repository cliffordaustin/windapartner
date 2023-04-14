import { GetServerSidePropsContext } from "next";

export default function getToken(context: GetServerSidePropsContext) {
  let token;
  if (context.req) {
    if (context.req.headers.cookie) {
      token = context.req.headers.cookie
        .split(";")
        .map((element) => element.trim());
      token = token.find((c) => c.startsWith("token="));

      if (token) {
        token = token.split("=")[1];
      }
    }
  }

  return token;
}
