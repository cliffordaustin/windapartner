import {
  Button,
  Flex,
  Text,
  Grid,
  Skeleton,
  NavLink,
  Loader,
  Pagination,
} from "@mantine/core";
import { getUser } from "../../api/user";
import { GetServerSideProps } from "next";
import { Stay, UserTypes } from "@/utils/types";
import Cookies from "js-cookie";
import { AxiosError } from "axios";
import getToken from "@/utils/getToken";
import { dehydrate, QueryClient, useQuery } from "react-query";
import Navbar from "@/components/Agent/Navbar";
import { getPartnerStays } from "@/pages/api/stays";
import { NextRouter, useRouter } from "next/router";
import {
  IconInfoCircle,
  IconCalculator,
  IconArrowRight,
  IconArrowLeft,
  IconArrowBarToLeft,
  IconArrowBarToRight,
  IconGripHorizontal,
} from "@tabler/icons-react";
import Listing from "@/components/Agent/Listing";
import { Context } from "@/context/AgentPage";
import { useContext, useEffect, useState } from "react";
import Link from "next/link";

export default function AgentPage() {
  const token = Cookies.get("token");
  const router: NextRouter = useRouter();
  const { data: user } = useQuery<UserTypes | null>("user", () =>
    getUser(token)
  );

  const {
    data: stays,
    isLoading: isStayLoading,
    refetch,
  } = useQuery<Stay[]>("partner-stays", () =>
    getPartnerStays(router.query.location as string, "")
  );

  useEffect(() => {
    refetch();
  }, [router.query.location]);

  const { state, setState } = useContext(Context);

  const [stayIds, setStayIds] = useState<string | undefined>("0");

  const itemIds = process.browser ? localStorage.getItem("stayIds") : "";

  useEffect(() => {
    const ids = localStorage.getItem("stayIds");
    const newIds = ids?.replace(/[\[\]']+/g, "");
    if (ids) {
      setStayIds(newIds || "0");
    }
  }, [itemIds]);

  const [addedStays, setAddedStays] = useState<Stay[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  // useEffect(() => {
  //   setIsLoading(true);
  //   const getStay = getPartnerStays(router.query.location as string, stayIds);
  //   getStay
  //     .then((res) => {
  //       setAddedStays(res);
  //       setIsLoading(false);
  //     })
  //     .catch((err) => {
  //       setIsLoading(false);
  //     });
  // }, [stayIds]);

  useEffect(() => {
    const storedItemIds = localStorage.getItem("stayIds");
    if (storedItemIds) {
      setState((prev) => ({ ...prev, stayIds: JSON.parse(storedItemIds) }));
    }
  }, []);

  return (
    <div className="">
      <div className="border-b border-x-0 border-t-0 border-solid border-b-gray-200">
        <Navbar user={user}></Navbar>
      </div>

      <div className="md:px-12 max-w-[1440px] mx-auto px-6">
        <Flex gap="xs" align="center" wrap="wrap" className="mt-2">
          <IconInfoCircle
            className="text-gray-600"
            size="1.3rem"
            stroke={1.5}
          />
          <Text className="text-gray-600">
            Click on the plus button on a lodge to calculate pricing
          </Text>
        </Flex>

        <Grid gutter={"xl"} className="mt-5">
          {!isStayLoading &&
            stays?.map((stay, index) => (
              <Grid.Col xl={2.7} lg={3} md={4} sm={6} xs={6} key={index}>
                <Listing stay={stay} key={index}></Listing>
              </Grid.Col>
            ))}

          {isStayLoading &&
            Array.from({ length: 8 }).map((_, index) => (
              <Grid.Col xl={2.7} lg={3} md={4} sm={6} xs={6} key={index}>
                <Skeleton height={220} radius="md" />
                <Skeleton height={10} mt={4} radius="md" />
                <Skeleton height={10} w="70%" mt={4} radius="md" />
                <Skeleton height={10} w="50%" mt={4} radius="md" />
              </Grid.Col>
            ))}
        </Grid>
      </div>

      <NavLink
        label={`Calculate pricing (${state.stayIds.length} selected)`}
        component="a"
        href="/partner/agent/calculate"
        disabled={state.stayIds.length === 0}
        className="fixed w-fit flex items-center justify-center rounded-3xl px-4 text-white z-10 bg-[#000] hover:bg-[#333] font-semibold bottom-10 left-[40%]"
        icon={
          isLoading ? (
            <Loader size="sm" color="white" />
          ) : (
            <IconCalculator size="1.4rem" className="text-white ml-1" />
          )
        }
      />

      {/* <Pagination total={10} position="center" /> */}

      {/* {addedStays && addedStays.length > 0 && !isStayLoading && (
        <NavLink
          label={`Calculate pricing (${addedStays?.length} selected)`}
          component="a"
          href="/partner/agent/calculate"
          disabled={isLoading}
          className="fixed w-fit flex items-center justify-center rounded-3xl px-4 text-white z-10 bg-[#000] hover:bg-[#333] font-semibold bottom-10 left-[40%]"
          icon={
            isLoading ? (
              <Loader size="sm" color="white" />
            ) : (
              <IconCalculator size="1.4rem" className="text-white ml-1" />
            )
          }
        />
      )} */}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const queryClient = new QueryClient();

  const token = getToken(context);

  try {
    await queryClient.fetchQuery<UserTypes | null>("user", () =>
      getUser(token)
    );

    await queryClient.fetchQuery<Stay[] | null>("partner-stays", () =>
      getPartnerStays(context.query.location as string, "")
    );

    return {
      props: {
        dehydratedState: dehydrate(queryClient),
      },
    };
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 401) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }
    return {
      props: {},
    };
  }
};
