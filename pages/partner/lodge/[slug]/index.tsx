import { useEffect, useState } from "react";
import {
  createStyles,
  Navbar,
  Group,
  Code,
  getStylesRef,
  rem,
  NavLink,
  ScrollArea,
  Modal,
  Flex,
  Button,
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
  IconSwitchHorizontal,
  IconLogout,
} from "@tabler/icons-react";
import Link from "next/link";
import Image from "next/image";
import { useDisclosure } from "@mantine/hooks";
import {
  QueryClient,
  dehydrate,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";
import { deleteStayEmail, getStayEmail } from "@/pages/api/stays";
import { useRouter } from "next/router";
import { Auth, withSSRContext } from "aws-amplify";
import { LodgeStay, UserTypes } from "@/utils/types";
import { ContextProvider } from "@/context/LodgeDetailPage";
import RoomPackagesEdit from "@/components/Lodge/RoomPackagesEdit";
import { getUser } from "@/pages/api/user";
import PriceEdit from "@/components/Lodge/PriceEdit";
import ActivityEdit from "@/components/Lodge/ActivityEdit";
import ParkFeesEdit from "@/components/Lodge/ParkFeesEdit";
import AgentEmailAccess from "@/components/Lodge/AgentEmailAccess";
import AddUser from "@/components/Lodge/AddUser";
import AboutRoomEdit from "@/components/Lodge/AbooutRoomEdit";
import UserDropdown from "@/components/Homepage/UserDropdown";
import { GetServerSideProps } from "next";
import { AxiosError } from "axios";

const useStyles = createStyles((theme) => ({
  header: {
    paddingBottom: theme.spacing.md,
    marginBottom: `calc(${theme.spacing.md} * 1.5)`,
    borderBottom: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[2]
    }`,
  },

  footer: {
    paddingTop: theme.spacing.md,
    marginTop: theme.spacing.md,
    borderTop: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[2]
    }`,
  },

  link: {
    ...theme.fn.focusStyles(),
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
    fontSize: theme.fontSizes.sm,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[1]
        : theme.colors.gray[7],
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    borderRadius: theme.radius.sm,
    fontWeight: 500,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
      color: theme.colorScheme === "dark" ? theme.white : theme.black,

      [`& .${getStylesRef("icon")}`]: {
        color: theme.colorScheme === "dark" ? theme.white : theme.black,
      },
    },
  },

  linkIcon: {
    ref: getStylesRef("icon"),
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[2]
        : theme.colors.gray[6],
    marginRight: theme.spacing.sm,
  },

  linkActive: {
    "&, &:hover": {
      backgroundColor: theme.fn.variant({
        variant: "light",
        color: theme.primaryColor,
      }).background,
      color: theme.fn.variant({ variant: "light", color: theme.primaryColor })
        .color,
      [`& .${getStylesRef("icon")}`]: {
        color: theme.fn.variant({ variant: "light", color: theme.primaryColor })
          .color,
      },
    },
  },
}));

const data = [
  { icon: IconBed, label: "Rooms and packages" },
  { icon: IconHomeDollar, label: "prices" },
  { icon: IconRun, label: "Activities/Extras" },
  { icon: IconSquare, label: "Park fees" },
  { icon: IconLockAccess, label: "Agent access" },
  { icon: IconUsersGroup, label: "Team members" },
  { icon: IconInfoCircle, label: "About" },
];

export default function NavbarSimple() {
  const { classes, cx } = useStyles();
  const [active, setActive] = useState(0);

  const router = useRouter();

  const { data: stay } = useQuery<LodgeStay>("stay-email", () =>
    getStayEmail(router.query.slug as string)
  );

  const { data: user } = useQuery<UserTypes | null>("user", () => getUser());

  const [date, setDate] = useState<[Date | null, Date | null]>([
    new Date(),
    new Date(new Date().setDate(new Date().getDate() + 7)),
  ]);

  const items = data.map((item, index) => (
    <NavLink
      className="w-full py-3"
      key={item.label}
      onClick={() => setActive(index)}
      active={index === active}
      color="red"
      label={item.label}
      icon={<item.icon size="1.5rem" stroke={1.5} />}
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
    <div className="flex">
      <ScrollArea className="h-screen w-[400px]">
        <Navbar className="w-full" p="md">
          <Navbar.Section grow>
            <Group className={classes.header} position="apart">
              <Link href="/partner/lodge">
                <div className="relative w-28 h-9 cursor-pointer">
                  <Image
                    alt="Winda logo"
                    src="/images/winda_logo/horizontal-blue-font.png"
                    className="w-full h-full"
                    sizes="(max-width: 768px) 100vw,
              (max-width: 1200px) 50vw,
              33vw"
                    fill
                    priority
                  />
                </div>
              </Link>
              <Code sx={{ fontWeight: 700 }}>beta</Code>
            </Group>
            {items}
          </Navbar.Section>

          <Navbar.Section className={classes.footer}>
            <NavLink
              label="Delete property"
              icon={<IconTrash size="1.5rem" stroke={1.5} />}
              onClick={openDeleteModal}
              color="red"
              className="py-3"
              //   active={true}
            />

            {/* <a
              href="#"
              className={classes.link}
              onClick={(event) => event.preventDefault()}
            >
              <IconLogout className={classes.linkIcon} stroke={1.5} />
              <span>Logout</span>
            </a> */}
          </Navbar.Section>
        </Navbar>
      </ScrollArea>

      <Modal
        opened={deleteModal}
        onClose={closeDelteModal}
        title={"Delete property"}
        classNames={{
          title: "text-lg font-bold",
          close:
            "text-black hover:text-gray-700 w-[40px] h-[30px] hover:bg-gray-100",
          body: "max-h-[500px] overflow-y-scroll px-10 pb-8 w-full",
          content: "rounded-2xl",
        }}
        centered
      >
        <p>
          Are you sure you want to delete this property? All rates associated to
          this property will also be deleted. This action cannot be undone.
        </p>
        <Flex justify="space-between" mt={20} gap={6} align="center">
          <Button
            onClick={closeDelteModal}
            variant="light"
            color="gray"
            size="sm"
          >
            Close
          </Button>

          <Button
            onClick={() => {
              if (stay) {
                deleteProperty({
                  slug: stay.slug,
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

      <ContextProvider>
        <div className="w-full 2xl:max-w-[1600px] mx-auto right-0">
          <div className="flex items-center bg-gray-50 px-4 py-2 justify-between">
            <Text className="font-semibold">{stay?.property_name}</Text>
            <div className="flex items-center gap-3">
              <Button
                variant="light"
                onClick={() => {
                  router.push("/partner/agent");
                  // localStorage.setItem(
                  //   "lastPropertyDestinationPage",
                  //   router.asPath
                  // );

                  // const lastAgentDestinationPage = localStorage.getItem(
                  //   "lastAgentDestinationPage"
                  // );

                  // if (lastAgentDestinationPage) {
                  //   router.push(lastAgentDestinationPage);
                  // } else {
                  //   router.push("/partner/agent");
                  // }
                }}
                className="font-semibold hover:bg-gray-100 rounded-full bg-transparent text-black"
              >
                Switch to agent
              </Button>
              <UserDropdown
                navBarAccountLink="/account/lodge"
                user={user}
              ></UserDropdown>
            </div>
          </div>
          {active === 0 && (
            <RoomPackagesEdit date={date} stay={stay}></RoomPackagesEdit>
          )}

          {active === 1 && <PriceEdit stay={stay}></PriceEdit>}

          {active === 2 && <ActivityEdit stay={stay}></ActivityEdit>}

          {active === 3 && <ParkFeesEdit stay={stay}></ParkFeesEdit>}

          {active === 4 && <AgentEmailAccess stay={stay}></AgentEmailAccess>}

          {active === 5 && <AddUser stay={stay}></AddUser>}

          {active === 6 && <AboutRoomEdit stay={stay}></AboutRoomEdit>}
        </div>
      </ContextProvider>
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
          destination: `/signin?redirect=/partner/lodge`,
          permanent: false,
        },
      };
    }

    const currentSession = await Auth.currentSession();
    const accessToken = currentSession.getAccessToken();
    const ssrToken = accessToken.getJwtToken();

    await queryClient.fetchQuery<LodgeStay | null>("stay-email", () =>
      getStayEmail(query.slug as string, ssrToken)
    );

    await queryClient.fetchQuery<UserTypes | null>("user", () =>
      getUser(ssrToken)
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
