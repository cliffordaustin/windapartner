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
  Tabs,
  Switch,
  ActionIcon,
  Tooltip,
} from "@mantine/core";
import { getUser } from "../../api/user";
import { GetServerSideProps } from "next";
import { LodgeStay, Stay, UserTypes } from "@/utils/types";
import Cookies from "js-cookie";
import { AxiosError } from "axios";
import getToken from "@/utils/getToken";
import { dehydrate, QueryClient, useQuery } from "react-query";
import Navbar from "@/components/Agent/Navbar";
import {
  getAllStaysEmail,
  getDetailPartnerStays,
  getPartnerAllStays,
  getPartnerStays,
  getPartnerStaysType,
  getPartnerStaysWithoutAccess,
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
  IconChevronUp,
  IconChevronDown,
  IconX,
  IconChevronsDown,
} from "@tabler/icons-react";
import Listing from "@/components/Agent/Listing";
import { Context } from "@/context/AgentPage";
import { useCallback, useContext, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import UserSelectedStays from "@/components/Agent/UserSelectedStays";
import { add } from "date-fns";
import { Mixpanel } from "@/utils/mixpanelconfig";
import { API, Auth, withSSRContext } from "aws-amplify";
import SmallImage from "@/components/Agent/SmallImage";
import SelectedStay from "@/components/Agent/SelectedStay";

export default function AgentPage() {
  const [token, setToken] = useState("");

  useEffect(() => {
    Auth.currentSession().then((res) => {
      let accessToken = res.getAccessToken();
      let jwt = accessToken.getJwtToken();

      setToken(jwt);
    });
  }, []);

  const router: NextRouter = useRouter();

  const { data: allPartnerStays, isLoading: allPartnerStaysLoading } =
    useQuery<getPartnerStaysType>(
      "all-partner-stays",
      () =>
        getPartnerAllStays(
          router.query.search as string,
          Number(router.query.second_page || 1),
          token
        ),
      { enabled: !!token }
    );

  const { data: user } = useQuery<UserTypes | null>(
    "user",
    () => getUser(token),
    { enabled: !!token }
  );

  const { state, setState } = useContext(Context);

  const itemIds = process.browser ? localStorage.getItem("stayIds") : "";

  const [addedStays, setAddedStays] = useState<Stay[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (token) {
      setIsLoading(true);

      const ids = localStorage.getItem("stayIds");
      let newIds = ids?.replace(/[\[\]']+/g, "");

      newIds = newIds || "0";

      const getStay = getDetailPartnerStays(newIds, token);
      getStay
        .then((res) => {
          setAddedStays(res);
          setIsLoading(false);
        })
        .catch((err) => {
          setIsLoading(false);
        });
    }
  }, [itemIds, token]);

  useEffect(() => {
    const storedItemIds = localStorage.getItem("stayIds");
    if (storedItemIds) {
      setState((prev) => ({ ...prev, stayIds: JSON.parse(storedItemIds) }));
    }
  }, []);

  const [showListOfStaysWithoutAccess, setShowListOfStaysWithoutAccess] =
    useState<boolean>(router.query.contracts === "1" ? false : true);

  const [showCalculatePricingPopup, setShowCalculatePricingPopup] =
    useState<boolean>(false);

  return (
    <div className="relative">
      <div className="border-b border-x-0 border-t-0 border-solid border-b-gray-200">
        <Navbar user={user}></Navbar>
      </div>

      <div className="mb-[110px]">
        {addedStays && addedStays.length > 0 && !isLoading && (
          <>
            {showCalculatePricingPopup && (
              <div className="fixed z-40 bottom-[100px] left-0 shadow-lg right-0 shadow-top max-h-[300px] flex flex-col items-center justify-center gap-2 w-full bg-white">
                <ScrollArea className="w-[450px] h-full">
                  <div className="flex justify-between px-4 py-2 border-b border-solid border-x-0 border-t-0 border-gray-200 items-center">
                    <div></div>

                    <Button
                      className="rounded-full bg-transparent text-black hover:bg-gray-200"
                      onClick={() => {
                        localStorage.setItem("stayIds", "[]");
                        setState((prev) => ({
                          ...prev,
                          stayIds: [],
                        }));
                        setShowCalculatePricingPopup(false);
                      }}
                      variant="light"
                    >
                      Clear all
                    </Button>
                  </div>
                  <div className="px-4 py-2 flex flex-col gap-3">
                    {addedStays?.map((stay, index) => (
                      <SelectedStay stay={stay} key={stay.id}></SelectedStay>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}

            <div
              className={
                "fixed bottom-0 z-[40] bg-white left-0 shadow-top right-0 h-[100px] flex flex-col items-center justify-center gap-3 py-4 w-full " +
                (showCalculatePricingPopup
                  ? "!bg-gray-100 border-t border-solid border-gray-200 border-x-0 border-b-0"
                  : "")
              }
            >
              <div className="flex justify-center gap-3 items-center">
                {addedStays?.map((stay, index) => (
                  <Tooltip
                    multiline
                    width={220}
                    key={stay.id}
                    color="white"
                    // position="bottom"
                    label={
                      <div className="border border-solid p-1.5 rounded-md border-gray-200">
                        <Text className="font-bold text-black">
                          {stay.property_name}
                        </Text>
                        <Text size="sm" className="text-gray-500">
                          {stay.location}
                        </Text>
                      </div>
                    }
                    p={0}
                    className="text-gray-800 font-semibold border-gray-200 border border-solid"
                  >
                    {/* <SmallImage stay={stay}></SmallImage> */}
                    <div className="">
                      <SmallImage stay={stay}></SmallImage>
                    </div>
                  </Tooltip>
                ))}

                <ActionIcon
                  onClick={() => {
                    setShowCalculatePricingPopup((prev) => !prev);
                  }}
                >
                  {showCalculatePricingPopup ? (
                    <IconChevronDown
                      className={"text-gray-500 rotate-180 "}
                      rotate={270}
                    ></IconChevronDown>
                  ) : (
                    <IconChevronUp
                      className={"text-gray-500 rotate-180 "}
                      rotate={270}
                    ></IconChevronUp>
                  )}
                </ActionIcon>
              </div>

              <Link className="no-underline" href="/partner/agent/calculate">
                <Button
                  leftIcon={
                    isLoading ? (
                      <Loader size="sm" color="white" />
                    ) : (
                      <IconCalculator
                        size="1.4rem"
                        className="text-white ml-1"
                      />
                    )
                  }
                  disabled={isLoading}
                  className="flex mx-auto items-center justify-center rounded-full w-[300px] text-white bg-[#000] hover:bg-[#333] font-semibold"
                >
                  Create quote
                </Button>
              </Link>
            </div>
          </>
        )}

        <div className="max-w-[640px] mx-auto mt-4 px-4 py-6 border border-solid rounded-lg border-gray-200 flex items-center">
          <div className="w-[150px] px-4 border-r border-y-0 border-l-0 border-solid border-gray-200">
            <Text className="font-bold">My contracts</Text>
          </div>
          <div className="px-4 flex gap-7 items-center">
            <Text size="sm" className="text-gray-500">
              View only the properties you have a contract with
            </Text>

            <Switch
              color="red"
              checked={!showListOfStaysWithoutAccess}
              onChange={() => {
                setShowListOfStaysWithoutAccess((prev) => !prev);
                router.replace({
                  query: {
                    contracts: showListOfStaysWithoutAccess ? "1" : "",
                  },
                });
              }}
            ></Switch>
          </div>
        </div>
        <div className="md:px-12 max-w-[1440px] mt-4 mx-auto px-6">
          {/* {!router.query.search &&
              stayList &&
              stayList.results.length > 0 && (
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
              )} */}

          {router.query.search &&
            allPartnerStays &&
            allPartnerStays.results.length === 0 && (
              <div className="flex ml-6 items-center gap-2 mt-4">
                <Text size="lg" className="text-gray-600">
                  No results found for{" "}
                  <span className="font-semibold">{router.query.search}</span>
                </Text>
                <Link className="text-blue-500" href="/partner/agent">
                  clear search
                </Link>
              </div>
            )}

          <Grid gutter={"xl"} className="mt-5">
            {!allPartnerStaysLoading &&
              allPartnerStays?.results.map((item, index) => (
                <Grid.Col xl={2.7} lg={3} md={4} sm={6} xs={6} key={item.id}>
                  <Listing
                    stay={item}
                    withoutAccess={item.has_property_access ? false : true}
                  ></Listing>
                </Grid.Col>
              ))}

            {allPartnerStaysLoading &&
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

        {allPartnerStays && allPartnerStays.total_pages > 1 && (
          <Pagination
            radius="lg"
            color="red"
            className="my-8"
            total={allPartnerStays.total_pages}
            position="center"
            value={Number(router.query.page || 1)}
            onChange={(page) => {
              router.push(
                `/partner/agent?page=${page}&search=${
                  router.query.search || ""
                }`
              );
            }}
          />
        )}
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  query,
}) => {
  const queryClient = new QueryClient();

  const { Auth, API } = withSSRContext({ req });

  const userIsAuthenticated = await Auth.currentAuthenticatedUser()
    .then(() => true)
    .catch(() => false);

  try {
    if (!userIsAuthenticated) {
      return {
        redirect: {
          destination: `/signin?redirect=/partner/agent/`,
          permanent: false,
        },
      };
    }
    const userSession = await Auth.currentSession();
    const token = userSession.getAccessToken().getJwtToken();

    await queryClient.fetchQuery<getPartnerStaysType>("all-partner-stays", () =>
      getPartnerAllStays(query.search as string, Number(query.page || 1), token)
    );

    await queryClient.fetchQuery<UserTypes | null>("user", () =>
      getUser(token)
    );

    return {
      props: {
        dehydratedState: dehydrate(queryClient),
      },
    };
  } catch (error) {
    return {
      props: {},
    };
  }
};
