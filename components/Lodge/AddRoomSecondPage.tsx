import { Context, Season } from "@/context/LodgeDetailPage";
import {
  Anchor,
  Container,
  Divider,
  Flex,
  NumberInput,
  Select,
  Text,
  TextInput,
  createStyles,
  getStylesRef,
  Accordion,
  Button,
  Loader,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { lowerFirst, upperFirst } from "@mantine/hooks";
import {
  IconCalendar,
  IconEdit,
  IconPencil,
  IconPlus,
  IconSelector,
  IconX,
} from "@tabler/icons-react";
import React, { useContext, useState } from "react";
import RoomSeason from "./Season";
import axios, { AxiosResponse } from "axios";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import {
  NonResidentGuestTypesData,
  ResidentGuestTypesData,
  RoomPriceProps,
  RoomReturnType,
  addRoom,
} from "@/pages/api/lodge";
import { useMutation } from "react-query";
import { addDays, format } from "date-fns";

const useStyles = createStyles((theme) => ({
  link: {
    ...theme.fn.focusStyles(),
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
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

  linkActive: {
    "&, &:hover": {
      backgroundColor: theme.fn.variant({
        variant: "light",
        color: theme.primaryColor,
      }).background,
      color: theme.fn.variant({ variant: "light", color: theme.primaryColor })
        .color,
    },
  },
}));

function AddRoomSecondPage() {
  const { state, setState } = useContext(Context);

  const [active, setActive] = useState(0);

  const { classes, cx } = useStyles();

  const router = useRouter();

  const links = state.packages.map((item, index) => (
    <Container
      className={cx(classes.link, { [classes.linkActive]: index === active })}
      key={index}
      onClick={(event) => {
        event.preventDefault();
        setActive(index);
      }}
    >
      <div className="flex flex-col gap-2">
        <Text>{state.name}</Text>
        <Text weight={600}>
          {upperFirst(item.name?.toLocaleLowerCase() || "")}
        </Text>
      </div>
    </Container>
  ));

  const addSeason = () => {
    const newSeason: Season = {
      date: [null, null],
      name: "Other season",
      guests: state.guests.map((guest) => ({ ...guest })),
    };

    const updatedPackages = state.packages.map((pkg) => {
      return {
        ...pkg,
        seasons: [...pkg.seasons, newSeason],
      };
    });

    setState((prevState) => ({
      ...prevState,
      packages: updatedPackages,
    }));
  };

  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);

    const allResidentData: ResidentGuestTypesData[][] = [];
    const allNonResidentData: NonResidentGuestTypesData[][] = [];

    for (const pkg of state.packages) {
      const response = addRoom(
        {
          name: state.name,
          capacity: state.adult_capacity,
          childCapacity: state.child_capacity,
          infantCapacity: state.infant_capacity,
          roomPackage: pkg.name,
        },
        router.query.slug as string
      );

      const res = await response;

      for (const season of pkg.seasons) {
        const residentData: ResidentGuestTypesData[] = [];
        const nonResidentData: NonResidentGuestTypesData[] = [];

        const allDates: string[] = [];

        let currentDate = season.date[0];
        let stopDate = season.date[1];

        if (currentDate && stopDate) {
          while (currentDate <= stopDate) {
            allDates.push(format(currentDate, "yyyy-MM-dd"));
            currentDate = addDays(currentDate, 1);
          }
        }

        allDates.map((date) => {
          const obj: ResidentGuestTypesData = {
            date: date,
            room_resident_guest_availabilities: season.guests.map((guest) => ({
              name: guest.guestType,
              description: guest.description,
              price: guest.residentPrice || 0,
            })),
          };

          residentData.push(obj);
        });

        allDates.map((date) => {
          const obj: NonResidentGuestTypesData = {
            date: date,
            room_non_resident_guest_availabilities: season.guests.map(
              (guest) => ({
                name: guest.guestType,
                description: guest.description,
                price: guest.nonResidentPrice || 0,
              })
            ),
          };

          nonResidentData.push(obj);
        });

        allResidentData.push(residentData);
        allNonResidentData.push(nonResidentData);
      }

      for (const guest of allResidentData) {
        await axios.post(
          `${process.env.NEXT_PUBLIC_baseURL}/room-types/${res?.slug}/resident-availabilities/`,
          guest,
          {
            headers: {
              Authorization: "Token " + Cookies.get("token"),
            },
          }
        );
      }

      for (const guest of allNonResidentData) {
        await axios.post(
          `${process.env.NEXT_PUBLIC_baseURL}/room-types/${res?.slug}/nonresident-availabilities/`,
          guest,
          {
            headers: {
              Authorization: "Token " + Cookies.get("token"),
            },
          }
        );
      }
    }
    router.reload();
    setLoading(false);
  };

  return (
    <Flex w={1100} gap={20} mt={12} mx="auto">
      <Container className="w-[30%]">
        <Text weight={700} mb={12} size="md">
          Room and Packages
        </Text>
        {links}
      </Container>

      <Container className="w-[70%]">
        <Accordion mb={10} defaultValue="0">
          {state.packages[active]?.seasons.map((season, index) => (
            <RoomSeason
              key={index}
              index={index}
              active={active}
              season={season}
            ></RoomSeason>
          ))}
        </Accordion>
        <Flex align="center" justify="space-between">
          <Anchor
            size="sm"
            type="button"
            color="blue"
            onClick={() => {
              addSeason();
            }}
          >
            Add another season
          </Anchor>

          <Button
            onClick={() => submit()}
            type="submit"
            color="red"
            className="flex items-center"
            disabled={loading}
          >
            Finish
            {loading && <Loader size="xs" color="gray" ml={5}></Loader>}
          </Button>
        </Flex>
      </Container>
    </Flex>
  );
}

export default AddRoomSecondPage;
