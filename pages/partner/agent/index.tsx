import {
  Button,
  Flex,
  Text,
  Grid,
  Skeleton,
  NavLink,
  Loader,
  Pagination,
  ScrollArea,
} from "@mantine/core";
import { getUser } from "../../api/user";
import { GetServerSideProps } from "next";
import { Stay, UserTypes } from "@/utils/types";
import Cookies from "js-cookie";
import { AxiosError } from "axios";
import getToken from "@/utils/getToken";
import { dehydrate, QueryClient, useQuery } from "react-query";
import Navbar from "@/components/Agent/Navbar";
import {
  getDetailPartnerStays,
  getPartnerStays,
  getPartnerStaysType,
} from "@/pages/api/stays";
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
import Image from "next/image";
import UserSelectedStays from "@/components/Agent/UserSelectedStays";
import { add } from "date-fns";
import { Mixpanel } from "@/utils/mixpanelconfig";

export default function AgentPage() {
  const token = Cookies.get("token");
  const router: NextRouter = useRouter();
  // const { data: user } = useQuery<UserTypes | null>("user", () =>
  //   getUser(token)
  // );

  const {
    data: stayList,
    isLoading: isStayLoading,
    refetch,
  } = useQuery<getPartnerStaysType>("partner-stays", () =>
    getPartnerStays(
      router.query.search as string,
      Number(router.query.page || 1)
    )
  );

  useEffect(() => {
    refetch();
  }, [router.query.search, router.query.page]);

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

  useEffect(() => {
    setIsLoading(true);
    const getStay = getDetailPartnerStays(stayIds);
    getStay
      .then((res) => {
        setAddedStays(res);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  }, [stayIds]);

  useEffect(() => {
    const storedItemIds = localStorage.getItem("stayIds");
    if (storedItemIds) {
      setState((prev) => ({ ...prev, stayIds: JSON.parse(storedItemIds) }));
    }
  }, []);

  return (
    <div className="">
      <div className="border-b border-x-0 border-t-0 border-solid border-b-gray-200">
        <Navbar></Navbar>
      </div>

      {addedStays && addedStays.length > 0 && !isLoading && (
        <div className="sticky flex bg-white border-b border-solid border-x-0 border-t-0 border-gray-200 top-0 z-40 left-0 right-0">
          <div className="w-[calc(100vw-230px)]">
            <ScrollArea>
              <div className="sticky top-0 left-0 right-0 flex items-center gap-4 h-[70px] px-6">
                {addedStays?.map((stay, index) => (
                  <UserSelectedStays
                    stay={stay}
                    key={stay.id}
                  ></UserSelectedStays>
                ))}
              </div>
            </ScrollArea>
          </div>
          <div className="w-[230px] flex items-center justify-center absolute right-0 h-full px-8">
            <div
              onClick={() => {
                Mixpanel.track("User moved to the calculate page");
              }}
            >
              <Button
                leftIcon={
                  isLoading ? (
                    <Loader size="sm" color="white" />
                  ) : (
                    <IconCalculator size="1.4rem" className="text-white ml-1" />
                  )
                }
                onClick={() => {
                  router.push("/partner/agent/calculate");
                }}
                disabled={state.stayIds.length === 0 || isLoading}
                className="w-fit flex items-center justify-center rounded-lg px-4 text-white z-10 bg-[#000] hover:bg-[#333] font-semibold"
              >
                Calculate pricing
              </Button>
            </div>
          </div>
        </div>
      )}

      {addedStays && addedStays.length > 0 && isLoading && (
        <div className="sticky bg-white z-40 top-0 left-0 right-0">
          <ScrollArea>
            <div className="border-b sticky top-0 left-0 right-0 border-t-0 flex items-center gap-4 border-solid border-x-0 border-gray-200 py-4 px-6">
              <Skeleton height={40} w={"150px"} radius="md" />
              <Skeleton height={40} w={"150px"} radius="md" />
              <Skeleton height={40} w={"150px"} radius="md" />
              <Skeleton height={40} w={"150px"} radius="md" />
            </div>
          </ScrollArea>
        </div>
      )}

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
            stayList?.results.map((stay, index) => (
              <Grid.Col xl={2.7} lg={3} md={4} sm={6} xs={6} key={stay.id}>
                <Listing stay={stay}></Listing>
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

      {stayList && stayList.total_pages > 1 && (
        <Pagination
          radius="lg"
          color="red"
          mb={12}
          total={stayList.total_pages}
          position="center"
          value={Number(router.query.page || 1)}
          onChange={(page) => {
            router.push(
              `/partner/agent?page=${page}&search=${router.query.search || ""}`
            );
          }}
        />
      )}

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
    // await queryClient.fetchQuery<UserTypes | null>("user", () =>
    //   getUser(token)
    // );

    // await queryClient.fetchQuery<Stay[] | null>("partner-stays", () =>
    //   getPartnerStays(context.query.location as string, "")
    // );

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
