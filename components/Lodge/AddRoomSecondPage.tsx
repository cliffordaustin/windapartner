import { Context, Package, Season } from "@/context/LodgeDetailPage";
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
  const [activeRoom, setActiveRoom] = useState(0);

  const { classes, cx } = useStyles();

  const router = useRouter();

  const links = state.rooms.map((room, roomIndex) =>
    room.packages.map((item, index) => (
      <Container
        className={cx(classes.link, {
          [classes.linkActive]: index === active && roomIndex === activeRoom,
        })}
        key={index}
        onClick={(event) => {
          event.preventDefault();
          setActive(index);
          setActiveRoom(roomIndex);
        }}
      >
        <div className="flex flex-col gap-2">
          <Text>{room.name}</Text>
          <Text weight={600}>
            {upperFirst(item.name?.toLocaleLowerCase() || "")}
          </Text>
        </div>
      </Container>
    ))
  );

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

  function hasDateInSeason(season: Season): boolean {
    for (const [firstDate, secondDate] of season.date) {
      if (!firstDate || !secondDate) {
        return false;
      }
    }
    return true;
  }

  const proceedSubmit = async () => {
    setLoadingProceed(true);

    for (const room of state.rooms) {
      for (const pkg of room.packages) {
        const allResidentData: ResidentGuestTypesData[][] = [];
        const allNonResidentData: NonResidentGuestTypesData[][] = [];
        const response = addRoom(
          {
            name: room.name,
            capacity: Number(room.adult_capacity),
            childCapacity: Number(room.child_capacity),
            infantCapacity: Number(room.infant_capacity),
            roomPackage: pkg.name,
            packageDescription: pkg.description,
          },
          staySlug
        );

        const res = await response;

        for (const season of pkg.seasons) {
          const residentData: ResidentGuestTypesData[] = [];
          const nonResidentData: NonResidentGuestTypesData[] = [];

          const allDates: string[] = [];

          season.date.map((date) => {
            let currentDate = date[0];
            let stopDate = date[1];

            if (currentDate && stopDate) {
              while (currentDate <= stopDate) {
                allDates.push(format(currentDate, "yyyy-MM-dd"));
                currentDate = addDays(currentDate, 1);
              }
            }
          });

          const sumOfResidentPrice = season.guests.reduce(
            (acc, guest) => acc + (guest.residentPrice || 0),
            0
          );

          const sumOfNonResidentPrice = season.guests.reduce(
            (acc, guest) => acc + (guest.nonResidentPrice || 0),
            0
          );

          if (sumOfResidentPrice > 0) {
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
          }

          if (sumOfNonResidentPrice > 0) {
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
          }

          allResidentData.push(residentData);
          allNonResidentData.push(nonResidentData);
        }

        for (const guest of allResidentData) {
          await axios.post(
            `${process.env.NEXT_PUBLIC_baseURL}/room-types/${res?.slug}/resident-availabilities/`,
            guest,
            {
              headers: {
                Authorization: "Bearer " + Cookies.get("token"),
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
                Authorization: "Bearer " + Cookies.get("token"),
              },
            }
          );
        }
      }
    }
    router.reload();
  };

  const submit = async () => {
    const submitSeasonDataError: SeasonDataErrorType[] = [];

    setSeasonDataError([]);

    // To perform checks
    for (const room of state.rooms) {
      for (const pkg of room.packages) {
        for (const season of pkg.seasons) {
          const hasPrice = hasPriceInSeason(season);
          const hasDate = hasDateInSeason(season);

          if (!hasPrice && hasDate) {
            setSeasonDataError((prevState): SeasonDataErrorType[] => [
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
            setSeasonDataError((prevState): SeasonDataErrorType[] => [
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
            setSeasonDataError((prevState): SeasonDataErrorType[] => [
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
        }
      }
    }

    if (submitSeasonDataError.length === 0) {
      for (const room of state.rooms) {
        for (const pkg of room.packages) {
          const allResidentData: ResidentGuestTypesData[][] = [];
          const allNonResidentData: NonResidentGuestTypesData[][] = [];
          setLoading(true);
          for (const season of pkg.seasons) {
            const residentData: ResidentGuestTypesData[] = [];
            const nonResidentData: NonResidentGuestTypesData[] = [];

            const allDates: string[] = [];

            season.date.map((date) => {
              let currentDate = date[0];
              let stopDate = date[1];

              if (currentDate && stopDate) {
                while (currentDate <= stopDate) {
                  allDates.push(format(currentDate, "yyyy-MM-dd"));
                  currentDate = addDays(currentDate, 1);
                }
              }
            });

            const sumOfResidentPrice = season.guests.reduce(
              (acc, guest) => acc + (guest.residentPrice || 0),
              0
            );

            const sumOfNonResidentPrice = season.guests.reduce(
              (acc, guest) => acc + (guest.nonResidentPrice || 0),
              0
            );

            if (sumOfResidentPrice > 0) {
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
            }

            if (sumOfNonResidentPrice > 0) {
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
            }

            allResidentData.push(residentData);
            allNonResidentData.push(nonResidentData);
          }

          let res: RoomReturnType | null = null;

          const response = addRoom(
            {
              name: room.name,
              capacity: Number(room.adult_capacity),
              childCapacity: Number(room.child_capacity),
              infantCapacity: Number(room.infant_capacity),
              roomPackage: pkg.name,
              packageDescription: pkg.description,
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
                  Authorization: "Bearer " + Cookies.get("token"),
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
                  Authorization: "Bearer " + Cookies.get("token"),
                },
              }
            );
          }
        }
      }
      router.reload();
    } else if (submitSeasonDataError.length > 0) {
      open();
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

      <Container className="w-[70%] overflow-y-scroll">
        <Accordion mb={10} defaultValue="0">
          {state.rooms[activeRoom].packages[active]?.seasons.map(
            (season, index) => (
              <RoomSeason
                key={index}
                seasonIndex={index}
                active={active}
                activeRoom={activeRoom}
                season={season}
              ></RoomSeason>
            )
          )}
        </Accordion>
        <Flex align="center" className="mb-6" justify="space-between">
          <div></div>

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
