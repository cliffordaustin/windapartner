import Navbar from "@/components/Agent/Navbar";
import AboutRoomEdit from "@/components/Lodge/AbooutRoomEdit";
import ActivityEdit from "@/components/Lodge/ActivityEdit";
import ParkFeesEdit from "@/components/Lodge/ParkFeesEdit";
import RoomPackagesEdit from "@/components/Lodge/RoomPackagesEdit";
import PriceEdit from "@/components/Lodge/PriceEdit";
import { getStayEmail } from "@/pages/api/stays";
import { getUser } from "@/pages/api/user";
import getToken from "@/utils/getToken";
import { ContextProvider } from "@/context/LodgeDetailPage";
import { RoomType, LodgeStay, UserTypes } from "@/utils/types";
import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Modal,
  NavLink,
  Text,
} from "@mantine/core";
import {
  IconBed,
  IconGlobe,
  IconHomeDollar,
  IconInfoCircle,
  IconLockAccess,
  IconRun,
  IconSquare,
} from "@tabler/icons-react";
import { AxiosError } from "axios";
import Cookies from "js-cookie";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useState } from "react";
import {
  QueryClient,
  dehydrate,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";
import { deleteStayEmail } from "@/pages/api/stays";
import { useDisclosure } from "@mantine/hooks";
import Access from "@/components/Lodge/Access";

function LodgeDetail() {
  const token = Cookies.get("token");
  const router = useRouter();

  const { data: user } = useQuery<UserTypes | null>("user", () =>
    getUser(token)
  );

  const { data: stay } = useQuery<LodgeStay>("stay-email", () =>
    getStayEmail(router.query.slug as string, token)
  );

  const [active, setActive] = useState(0);

  const [date, setDate] = useState<[Date | null, Date | null]>([
    new Date(),
    new Date(new Date().setDate(new Date().getDate() + 7)),
  ]);

  const data = [
    { icon: IconBed, label: "Rooms and packages" },
    { icon: IconHomeDollar, label: "prices" },
    { icon: IconRun, label: "Activities/Extras" },
    { icon: IconSquare, label: "Park fees" },
    { icon: IconLockAccess, label: "Agent access" },
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

  const queryClient = useQueryClient();

  const [deleteModal, { open: openDeleteModal, close: closeDelteModal }] =
    useDisclosure(false);

  const { mutateAsync: deleteProperty, isLoading: deleteLoading } = useMutation(
    deleteStayEmail,
    {
      onSuccess: () => {
        // refetch stays
        queryClient.invalidateQueries("all-stay-email");
        router.push("/partner/lodge");
      },
    }
  );

  return (
    <div>
      <div className="border-b fixed bg-white z-20 w-full left-0 right-0 top-0 border-x-0 border-t-0 border-solid border-b-gray-200">
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
          navBarLogoLink="/partner/lodge"
          navBarAccountLink="/account/lodge"
        ></Navbar>
      </div>

      <Modal
        opened={deleteModal}
        onClose={closeDelteModal}
        title={"Delete property"}
        classNames={{
          title: "text-xl font-bold",
          close: "text-black hover:text-gray-700 hover:bg-gray-200",
          header: "bg-gray-100",
        }}
        transitionProps={{ transition: "fade", duration: 200 }}
        closeButtonProps={{
          style: {
            width: 30,
            height: 30,
          },
          iconSize: 20,
        }}
      >
        <p>
          Are you sure you want to delete this property? All rates associated to
          this property will also be deleted. This action cannot be undone.
        </p>
        <Flex justify="flex-end" mt={12} gap={6} align="center">
          <Button onClick={closeDelteModal} variant="default">
            Close
          </Button>

          <Button
            onClick={() => {
              if (stay) {
                deleteProperty({
                  slug: stay.slug,
                  token: token,
                });
              }
            }}
            className="flex items-center"
            loading={deleteLoading}
            color="red"
          >
            Proceed
          </Button>
        </Flex>
      </Modal>

      <Flex className="mt-20">
        <div className="fixed overflow-y-scroll w-[230px] left-0">
          <Text weight={500} px={12} mt={8}>
            {stay?.property_name}
          </Text>
          <Box w={220} mt={12} miw={230}>
            {items}
          </Box>

          <Divider my={6}></Divider>

          <div className="px-4">
            <Button
              size="xs"
              color="red"
              variant="outline"
              onClick={openDeleteModal}
              className="w-full mt-1 !py-2"
            >
              Delete property
            </Button>
          </div>
        </div>
        <ContextProvider>
          <div className="w-full bg-red-500">
            <Container
              w={1000}
              className="px-12 absolute right-0 mt-6"
              mx="auto"
            >
              {active === 0 && (
                <RoomPackagesEdit date={date} stay={stay}></RoomPackagesEdit>
              )}

              {active === 1 && <PriceEdit date={date} stay={stay}></PriceEdit>}

              {active === 2 && <ActivityEdit stay={stay}></ActivityEdit>}

              {active === 3 && <ParkFeesEdit stay={stay}></ParkFeesEdit>}

              {active === 4 && <Access stay={stay}></Access>}

              {active === 5 && <AboutRoomEdit stay={stay}></AboutRoomEdit>}
            </Container>
          </div>
        </ContextProvider>
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
      await queryClient.fetchQuery<LodgeStay | null>("stay-email", () =>
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
          destination: `/partner/signin?redirect=/partner/lodge/${context.query.slug}`,
          permanent: false,
        },
      };
    }
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 401) {
      return {
        redirect: {
          destination: `/partner/signin?redirect=/partner/lodge/${context.query.slug}`,
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
