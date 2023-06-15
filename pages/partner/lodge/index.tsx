import React, { useEffect } from "react";
import { GetServerSideProps } from "next";
import { Stay, UserTypes } from "@/utils/types";
import { AxiosError } from "axios";
import getToken from "@/utils/getToken";
import { dehydrate, QueryClient, useQuery } from "react-query";
import { getAllStaysEmail } from "@/pages/api/stays";
import { getUser } from "@/pages/api/user";
import Cookies from "js-cookie";
import LodgeCard from "@/components/Lodge/LodgeCard";
import { useRouter } from "next/router";
import {
  Button,
  ChevronIcon,
  Container,
  Divider,
  Flex,
  Grid,
  Modal,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import AddRoomFirstPage from "@/components/Lodge/AddRoomFirstPage";
import { ContextProvider } from "@/context/LodgeDetailPage";
import {
  IconCalendar,
  IconChevronLeft,
  IconChevronRight,
  IconSelector,
} from "@tabler/icons-react";
import { Carousel } from "@mantine/carousel";
import AddRoomSecondPage from "@/components/Lodge/AddRoomSecondPage";
import { EmblaCarouselType } from "embla-carousel-react";
import Navbar from "@/components/Agent/Navbar";
import { DatePickerInput } from "@mantine/dates";
import SelectedStays from "@/components/Lodge/SelectedStays";

function Lodge({}) {
  const token = Cookies.get("token");
  const { data: user } = useQuery<UserTypes | null>("user", () =>
    getUser(token)
  );
  const { data: stays, isLoading: isStayLoading } = useQuery<Stay[]>(
    "all-stay-email",
    () => getAllStaysEmail(token)
  );

  const [stayIds, setStayIds] = React.useState<number[]>([]);

  const [selectedStays, setSelectedStays] = React.useState<
    (Stay | undefined)[] | undefined
  >([]);

  useEffect(() => {
    const selected = stays?.map((stay) => {
      if (stayIds.includes(stay.id)) {
        return stay;
      } else {
        return;
      }
    });
    setSelectedStays(selected);
  }, [stayIds, stays]);

  useEffect(() => {
    const storedItemIds = localStorage.getItem("lodge-stay-ids");
    if (storedItemIds) {
      setStayIds(JSON.parse(storedItemIds));
    }
  }, []);

  const [date, setDate] = React.useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  return (
    <div className="overflow-x-hidden">
      <div className="border-b border-x-0 border-t-0 border-solid border-b-gray-200">
        <Navbar includeSearch={false} user={user}></Navbar>
      </div>
      <Grid className="" gutter="xl">
        <Grid.Col xl={6} lg={6} md={6}>
          <Grid px={18} py={10} mt={8} gutter={"sm"} className="">
            {stays?.map((stay, index) => (
              <Grid.Col xl={3} lg={4} md={6} sm={6} xs={6} key={index}>
                <LodgeCard
                  stayIds={stayIds}
                  setStayIds={setStayIds}
                  stay={stay}
                />
              </Grid.Col>
            ))}
          </Grid>
        </Grid.Col>

        <Grid.Col
          xl={"auto"}
          className="relative h-[calc(100vh-60px)]"
          lg={"auto"}
          md={"auto"}
        >
          <Container className="border-l bg-gray-50 border-l-gray-300 border-solid border-y-0 border-r-0 sticky h-[calc(100vh-70px)] overflow-auto">
            <div className="py-4 flex justify-center border-solid border-x-0 border-t-0 border-b border-b-gray-300">
              <DatePickerInput
                type="range"
                value={date}
                onChange={(date) => {
                  setDate(date);
                }}
                color="red"
                label="Select date range"
                placeholder="Select dates"
                styles={{ input: { paddingTop: 13, paddingBottom: 13 } }}
                labelProps={{ className: "font-semibold mb-1" }}
                rightSection={<IconSelector className="text-gray-500" />}
                className="max-w-fit min-w-[300px]"
                minDate={new Date()}
                icon={<IconCalendar className="text-gray-500" />}
                numberOfColumns={2}
                autoSave="true"
              />
            </div>

            <Container>
              {selectedStays?.map((stay, index) => (
                <SelectedStays key={index} stay={stay} date={date} />
              ))}
            </Container>
          </Container>
          {/* <div className="absolute h-[25px] w-[25px] rounded-full z-10 top-[50%] left-[1px]">
            <div className="h-[25px] cursor-pointer w-[25px] fixed bg-black rounded-full z-10 flex items-center justify-center">
              <IconChevronLeft size={20} className="mr-[2px]" color="white" />
            </div>
          </div> */}
        </Grid.Col>
      </Grid>
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
      await queryClient.fetchQuery<Stay[] | null>("all-stay-email", () =>
        getAllStaysEmail(token)
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

export default Lodge;
