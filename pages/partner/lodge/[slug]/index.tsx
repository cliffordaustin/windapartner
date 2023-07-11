import Navbar from "@/components/Agent/Navbar";
import AboutRoomEdit from "@/components/Lodge/AbooutRoomEdit";
import ActivityEdit from "@/components/Lodge/ActivityEdit";
import ParkFeesEdit from "@/components/Lodge/ParkFeesEdit";
import RoomNonResidentPriceEdit from "@/components/Lodge/RoomNonResidentPriceEdit";
import RoomPackagesEdit from "@/components/Lodge/RoomPackagesEdit";
import RoomResidentPriceEdit from "@/components/Lodge/RoomResidentPriceEdit";
import { getRoomTypeList, getStayEmail } from "@/pages/api/stays";
import { getUser } from "@/pages/api/user";
import getToken from "@/utils/getToken";
import { RoomType, Stay, UserTypes } from "@/utils/types";
import { Box, Container, Divider, Flex, NavLink, Text } from "@mantine/core";
import {
  IconBed,
  IconGlobe,
  IconHomeDollar,
  IconInfoCircle,
  IconRun,
} from "@tabler/icons-react";
import { AxiosError } from "axios";
import Cookies from "js-cookie";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { QueryClient, dehydrate, useQuery } from "react-query";

function LodgeDetail() {
  const token = Cookies.get("token");
  const router = useRouter();

  const { data: user } = useQuery<UserTypes | null>("user", () =>
    getUser(token)
  );

  const { data: stay } = useQuery<Stay>("stay-email", () =>
    getStayEmail(router.query.slug as string, token)
  );

  const { data: roomTypes } = useQuery<RoomType[]>("stay-room-types", () =>
    getRoomTypeList(stay)
  );

  const [active, setActive] = useState(0);

  const [date, setDate] = useState<[Date | null, Date | null]>([
    new Date(),
    new Date(new Date().setDate(new Date().getDate() + 7)),
  ]);

  const data = [
    { icon: IconBed, label: "Rooms and packages" },
    { icon: IconHomeDollar, label: "Resident prices" },
    { icon: IconGlobe, label: "Non-resident prices" },
    { icon: IconRun, label: "Activities" },
    { icon: IconBed, label: "Park fees" },
    { icon: IconInfoCircle, label: "About" },
  ];

  const items = data.map((item, index) => (
    <NavLink
      key={item.label}
      active={index === active}
      label={item.label}
      icon={<item.icon size="1.5rem" stroke={1.5} />}
      onClick={() => setActive(index)}
      color="red"
      className="rounded-r-full font-semibold py-3"
    />
  ));

  return (
    <div>
      <div className="border-b border-x-0 border-t-0 border-solid border-b-gray-200">
        <Navbar
          openModal={() => {
            open();
          }}
          includeSearch={false}
          user={user}
          showAddProperty={false}
          date={date}
          setDate={setDate}
          includeDateSearch={true}
        ></Navbar>
      </div>

      <Flex>
        <div>
          {/* <Text truncate w={230} mt={12} className="px-4">
            {stay?.property_name}
          </Text>

          <Divider my={12} /> */}

          <Box w={220} mt={12} miw={230}>
            {items}
          </Box>
        </div>

        <Container w={1000} className="px-12 mt-6" mx="auto">
          {active === 0 && (
            <RoomPackagesEdit
              roomTypes={roomTypes}
              date={date}
            ></RoomPackagesEdit>
          )}

          {active === 1 && (
            <RoomResidentPriceEdit
              stay={stay}
              date={date}
            ></RoomResidentPriceEdit>
          )}

          {active === 2 && (
            <RoomNonResidentPriceEdit date={date}></RoomNonResidentPriceEdit>
          )}

          {active === 3 && <ActivityEdit stay={stay}></ActivityEdit>}

          {active === 4 && <ParkFeesEdit stay={stay}></ParkFeesEdit>}

          {active === 5 && <AboutRoomEdit stay={stay}></AboutRoomEdit>}
        </Container>
      </Flex>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const queryClient = new QueryClient();

  const token = getToken(context);

  try {
    const user = await queryClient.fetchQuery<UserTypes | null>("user", () =>
      getUser(token)
    );

    if (user?.is_partner) {
      await queryClient.fetchQuery<Stay | null>("stay-email", () =>
        getStayEmail(context.query.slug as string, token)
      );

      return {
        props: {
          dehydratedState: dehydrate(queryClient),
        },
      };
    } else {
      return {
        redirect: {
          destination: `/partner/signin?redirect=/partner/lodge/`,
          permanent: false,
        },
      };
    }
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 401) {
      return {
        redirect: {
          destination: `/partner/signin?redirect=/partner/lodge/`,
          permanent: false,
        },
      };
    }
    return {
      props: {},
    };
  }
};

export default LodgeDetail;
