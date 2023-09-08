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
  ScrollArea,
  Text,
} from "@mantine/core";
import {
  IconBed,
  IconCalculator,
  IconGlobe,
  IconHomeDollar,
  IconInfoCircle,
  IconLockAccess,
  IconMailCheck,
  IconRun,
  IconSquare,
  IconTrash,
  IconUserPlus,
  IconUsersGroup,
} from "@tabler/icons-react";
import { AxiosError } from "axios";
import Cookies from "js-cookie";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
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
import AgentEmailAccess from "@/components/Lodge/AgentEmailAccess";
import AddUser from "@/components/Lodge/AddUser";
import { Auth, withSSRContext } from "aws-amplify";

function LodgeDetail() {
  const [token, setToken] = useState("");

  useEffect(() => {
    Auth.currentSession().then((res) => {
      let accessToken = res.getAccessToken();
      let jwt = accessToken.getJwtToken();

      setToken(jwt);
    });
  }, []);

  const router = useRouter();

  const { data: user } = useQuery<UserTypes | null>(
    "user",
    () => getUser(token),
    { enabled: !!token }
  );

  const { data: stay } = useQuery<LodgeStay>(
    "stay-email",
    () => getStayEmail(router.query.slug as string, token),
    { enabled: !!token }
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
    { icon: IconUsersGroup, label: "Team members" },
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
      className="rounded-r-full w-full font-semibold py-3"
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
    <div className="overflow-y-hidden">
      <div className="border-b fixed bg-white z-20 w-full left-0 right-0 top-0 border-x-0 border-t-0 border-solid border-b-gray-200">
        <Navbar
          openModal={() => {
            open();
          }}
          includeSearch={false}
          user={user}
          propertyPage={true}
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
        <div className="w-[300px]">
          <Text weight={500} px={12} my={8}>
            {stay?.property_name}
          </Text>
          {items}
          <NavLink
            label="Create quote"
            icon={<IconCalculator size="1.5rem" stroke={1.5} />}
            onClick={() => {
              if (stay) {
                console.log("all");
                let storedItemIds = localStorage.getItem("stayIds");
                // check if item is already in local storage
                if (storedItemIds) {
                  let parsedItemIds = JSON.parse(storedItemIds);
                  let isStored = parsedItemIds.includes(stay.id);
                  localStorage.setItem(
                    "lastPropertyDestinationPage",
                    router.asPath
                  );
                  if (isStored) {
                    router.push({
                      pathname: "/partner/agent/calculate",
                    });
                  } else {
                    storedItemIds = JSON.stringify([
                      ...JSON.parse(storedItemIds || "[]"),
                      stay.id,
                    ]);
                    localStorage.setItem("stayIds", storedItemIds);

                    router.push({
                      pathname: "/partner/agent/calculate",
                    });
                  }
                }
              }
            }}
            color="red"
            className="rounded-r-full font-semibold py-3"
          />
          <Divider my={6}></Divider>

          <div className="">
            <NavLink
              label="Delete property"
              icon={<IconTrash size="1.5rem" stroke={1.5} />}
              onClick={openDeleteModal}
              color="red"
              className="rounded-r-full font-semibold py-3"
              active={true}
            />
          </div>
        </div>

        <ContextProvider>
          <div className="w-full 2xl:max-w-[1600px] mx-auto px-16 py-4 right-0">
            {active === 0 && (
              <RoomPackagesEdit
                date={date}
                token={token}
                stay={stay}
              ></RoomPackagesEdit>
            )}

            {active === 1 && <PriceEdit token={token} stay={stay}></PriceEdit>}

            {active === 2 && (
              <ActivityEdit token={token} stay={stay}></ActivityEdit>
            )}

            {active === 3 && (
              <ParkFeesEdit token={token} stay={stay}></ParkFeesEdit>
            )}

            {active === 4 && (
              <AgentEmailAccess token={token} stay={stay}></AgentEmailAccess>
            )}

            {active === 5 && <AddUser token={token} stay={stay}></AddUser>}

            {active === 6 && (
              <AboutRoomEdit token={token} stay={stay}></AboutRoomEdit>
            )}
          </div>
        </ContextProvider>
      </Flex>
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
          destination: `/signin?redirect=/partner/lodge/${query.slug}`,
          permanent: false,
        },
      };
    }
    const userSession = await Auth.currentSession();
    const token = userSession.getAccessToken().getJwtToken();

    await queryClient.fetchQuery<LodgeStay | null>("stay-email", () =>
      getStayEmail(query.slug as string, token)
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
    if (error instanceof AxiosError && error.response?.status === 404) {
      return {
        notFound: true,
      };
    }
    return {
      props: {},
    };
  }
};

export default LodgeDetail;
