import getToken from "@/utils/getToken";
import { GetServerSideProps } from "next";
import { UserTypes } from "@/utils/types";
import { getUser } from "@/pages/api/user";
import { AxiosError } from "axios";
import { dehydrate, QueryClient, useQuery } from "react-query";
import Cookies from "js-cookie";
import Navbar from "@/components/Agent/Navbar";
import { useContext, useEffect, useState } from "react";
import { Stay } from "@/utils/types";
import { getPartnerStays } from "@/pages/api/stays";
import { useRouter } from "next/router";
import { Divider, Tabs, Text } from "@mantine/core";
import { Context } from "@/context/CalculatePage";
import { StateType, Room } from "@/context/CalculatePage";
import { Stay as CalculateStay } from "@/components/Agent/Calculate/Stay";
import { v4 as uuidv4 } from "uuid";
import { IconCalculator } from "@tabler/icons-react";
import Summary from "@/components/Agent/Calculate/Summary";

export default function Calculate() {
  const token = Cookies.get("token");
  const router = useRouter();

  const { data: user } = useQuery<UserTypes | null>("user", () =>
    getUser(token)
  );

  const [stayIds, setStayIds] = useState<string | undefined>("");

  const { state, setState } = useContext(Context);

  useEffect(() => {
    const ids = localStorage.getItem("itemIds");
    const newIds = ids?.replace(/[\[\]']+/g, "");
    if (ids) {
      setStayIds(newIds);
    }
  }, []);

  const { data: stays, isLoading: isStayLoading } = useQuery<Stay[]>(
    "partner-stay-ids",
    () => getPartnerStays(router.query.location as string, stayIds),
    { enabled: !!stayIds }
  );

  // const uuid = uuidv4();

  useEffect(() => {
    if (stays && state.length === 0) {
      const items: StateType[] = Array.from(
        { length: stays.length },
        (_, i) => ({
          id: stays[i].id,
          slug: stays[i].slug,
          date: [null, null],
          name: stays[i].property_name || stays[i].name,
          rooms: [
            {
              id: uuidv4(),
              name: "",
              residentAdult: 0,
              residentChild: 0,
              residentInfant: 0,
              nonResidentAdult: 0,
              nonResidentChild: 0,
              nonResidentInfant: 0,
              residentGuests: [
                {
                  id: uuidv4(),
                  resident: "",
                  guestType: "",
                  description: "",
                },
              ],
              nonResidentGuests: [
                {
                  id: uuidv4(),
                  nonResident: "",
                  guestType: "",
                  description: "",
                },
              ],
              package: "",
              residentParkFee: [],
              nonResidentParkFee: [],
            },
          ],
          residentCommission: "",
          nonResidentCommission: "",
          activityFee: [],
          extraFee: [
            {
              id: uuidv4(),
              name: "",
              price: "",
              pricingType: "",
              guestType: "",
            },
          ],
        })
      );
      setState(items);
    }
  }, [stays, setState]);

  return (
    <div>
      <div className="border-b sticky top-0 z-10 bg-white left-0 right-0 border-x-0 border-t-0 border-solid border-b-gray-200">
        <Navbar user={user}></Navbar>
      </div>
      <div className="md:px-12 relative max-w-[1440px] mx-auto px-6 mt-4">
        {/* <div className="flex gap-2.5">
          {stays?.map((stay, index) => (
            <div key={index}>
              <Text className="text-xl" weight={700} color="red">
                <span className="mr-2">{stay.property_name}</span>{" "}
                {stays.length !== index + 1 && "//"}
              </Text>
            </div>
          ))}
        </div> */}
        {/* {stays && stays.length > 0 && (
          <Divider mt={4} w={"64%"} color="red" size="sm"></Divider>
        )} */}

        {stays && (
          <Tabs
            color="red"
            defaultValue={stays?.length > 0 ? stays[0].slug : ""}
            className="w-[64%]"
          >
            <Tabs.List>
              {stays?.map((stay, index) => (
                <Tabs.Tab value={stay.slug} key={index}>
                  {stay.property_name}
                </Tabs.Tab>
              ))}
            </Tabs.List>

            <div className="w-full mt-4 flex flex-col gap-4">
              {stays?.map((stay, index) => (
                <Tabs.Panel key={index} value={stay.slug} pt="xs">
                  <CalculateStay stay={stay} index={index}></CalculateStay>
                </Tabs.Panel>
              ))}
            </div>

            <div className="w-[30%] overflow-y-scroll h-[500px] flex flex-col gap-4 shadow-lg border border-solid border-gray-100 rounded-xl right-6 md:right-12 fixed top-[100px]">
              {state.map((item, index) => (
                <Tabs.Panel key={index} value={item.slug} className="h-[500px]">
                  <Summary stays={stays} calculateStay={item}></Summary>
                </Tabs.Panel>
              ))}
            </div>
          </Tabs>
        )}
      </div>
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
