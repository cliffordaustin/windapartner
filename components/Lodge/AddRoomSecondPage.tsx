import { Context, Season } from "@/context/LodgeDetailPage";
import {
  Anchor,
  Container,
  Divider,
  Flex,
  NumberInput,
  Select,
  Text,
  createStyles,
  getStylesRef,
  Accordion,
  Button,
  Loader,
  Modal,
  List,
  useMantineTheme,
  TypographyStylesProvider,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { lowerFirst, upperFirst, useDisclosure } from "@mantine/hooks";
import {
  IconCalendar,
  IconEdit,
  IconExclamationCircle,
  IconExclamationMark,
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

type AddRoomSecondPageProps = {
  staySlug: string;
};

function AddRoomSecondPage({ staySlug }: AddRoomSecondPageProps) {
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

  const [loadingProceed, setLoadingProceed] = useState(false);

  type SeasonDataErrorType = {
    title: string;
  };

  const [seasonDataError, setSeasonDataError] = useState<SeasonDataErrorType[]>(
    []
  );

  const [opened, { close, open }] = useDisclosure(false);

  const hasPriceInSeason = (season: Season) => {
    let hasPrice = false;

    season.guests.map((guest) => {
      if (guest.residentPrice || guest.nonResidentPrice) hasPrice = true;
    });

    return hasPrice;
  };

  const hasDateInSeason = (season: Season) => {
    let hasDate = false;

    if (season.date[0] && season.date[1]) hasDate = true;

    return hasDate;
  };

  const proceedSubmit = async () => {
    setLoadingProceed(true);

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
        staySlug
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
              season: season.name,
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
                season: season.name,
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
    setLoadingProceed(false);
  };

  const submit = async () => {
    const allResidentData: ResidentGuestTypesData[][] = [];
    const allNonResidentData: NonResidentGuestTypesData[][] = [];
    const submitSeasonDataError: SeasonDataErrorType[] = [];

    setSeasonDataError([]);

    for (const pkg of state.packages) {
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

        const hasPrice = hasPriceInSeason(season);
        const hasDate = hasDateInSeason(season);

        if (!hasPrice && hasDate) {
          setSeasonDataError((prevState) => [
            ...prevState,
            {
              title: `Date has been added to <strong>${pkg.name?.toLowerCase()}</strong> - <strong>${
                season.name
              }</strong> but no price has been added`,
            },
          ]);

          submitSeasonDataError.push({
            title: `Date has been added to <strong>${pkg.name}</strong> - <strong>${season.name}</strong> but no price has been added`,
          });
        }

        if (hasPrice && !hasDate) {
          setSeasonDataError((prevState) => [
            ...prevState,
            {
              title: `Price has been added to <strong>${pkg.name?.toLowerCase()}</strong> - <strong>${
                season.name
              }</strong> but no date has been added`,
            },
          ]);

          submitSeasonDataError.push({
            title: `Price has been added to <strong>${pkg.name?.toLowerCase()}</strong> - <strong>${
              season.name
            }</strong> but no date has been added`,
          });
        }

        if (!hasPrice && !hasDate) {
          setSeasonDataError((prevState) => [
            ...prevState,
            {
              title: `No date or price has been added to <strong>${pkg.name?.toLowerCase()}</strong> - <strong>
              ${season.name}
              </strong>`,
            },
          ]);

          submitSeasonDataError.push({
            title: `No date or price has been added to <strong>${pkg.name?.toLowerCase()}</strong> - <strong>
            ${season.name}
            </strong>`,
          });
        }

        if (hasDate && hasPrice) {
          allDates.map((date) => {
            const obj: ResidentGuestTypesData = {
              date: date,
              room_resident_guest_availabilities: season.guests.map(
                (guest) => ({
                  name: guest.guestType,
                  description: guest.description,
                  season: season.name,
                  price: guest.residentPrice || 0,
                })
              ),
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
                  season: season.name,
                  price: guest.nonResidentPrice || 0,
                })
              ),
            };

            nonResidentData.push(obj);
          });

          allResidentData.push(residentData);
          allNonResidentData.push(nonResidentData);
        }
      }
    }
    if (submitSeasonDataError.length === 0) {
      for (const pkg of state.packages) {
        setLoading(true);
        let res: RoomReturnType | null = null;

        const response = addRoom(
          {
            name: state.name,
            capacity: state.adult_capacity,
            childCapacity: state.child_capacity,
            infantCapacity: state.infant_capacity,
            roomPackage: pkg.name,
          },
          staySlug
        );

        res = await response;

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
    }
    if (submitSeasonDataError.length > 0) {
      open();
    } else if (submitSeasonDataError.length === 0) {
      router.reload();
      setLoading(false);
    }
  };

  return (
    <Flex w={1100} gap={20} mt={12} mx="auto">
      <Container className="w-[30%]">
        <Text weight={700} mb={12} size="md">
          Room and Packages
        </Text>
        {links}
      </Container>

      <Modal
        opened={opened}
        classNames={{
          header: "bg-yellow-50",
          body: "px-6 py-4 mt-4",
        }}
        onClose={close}
        title={
          <div className="flex items-center gap-2">
            <IconExclamationCircle size={20} color="#333" />
            <span className="font-bold">Note</span>
          </div>
        }
        size={500}
        overlayProps={{
          color: "#333",
          opacity: 0.4,

          zIndex: 201,
        }}
        centered
      >
        <List className="flex flex-col gap-1.5">
          {seasonDataError.map((error, index) => (
            <List.Item key={index}>
              <TypographyStylesProvider>
                <div
                  className="text-sm"
                  dangerouslySetInnerHTML={{
                    __html: error.title,
                  }}
                />
              </TypographyStylesProvider>
            </List.Item>
          ))}
        </List>

        <Flex justify="flex-end" mt={12} gap={6} align="center">
          <Button onClick={close} variant="default">
            Go back and update
          </Button>
          <Button
            onClick={() => proceedSubmit()}
            className="flex items-center"
            disabled={loadingProceed}
            color="red"
          >
            Post anyways{" "}
            {loadingProceed && <Loader size="xs" color="gray" ml={5}></Loader>}
          </Button>
        </Flex>
      </Modal>

      <Container className="w-[70%] h-screen overflow-y-scroll">
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
