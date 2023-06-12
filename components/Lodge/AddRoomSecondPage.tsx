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
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { lowerFirst, upperFirst } from "@mantine/hooks";
import {
  IconCalendar,
  IconPlus,
  IconSelector,
  IconX,
} from "@tabler/icons-react";
import React, { useContext, useState } from "react";

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
  return (
    <Flex w={1000} gap={20} mt={12} mx="auto">
      <Container className="w-[30%]">
        <Text weight={700} mb={12} size="md">
          Room and Packages
        </Text>
        {links}
      </Container>

      <Container className="w-[70%]">
        <Accordion mb={10} defaultValue="0">
          {state.packages[active]?.seasons.map((season, index) => (
            <Accordion.Item key={index} value={index.toString()}>
              <Flex align="center">
                <Accordion.Control>
                  <span className="font-semibold">{season.name}</span>
                </Accordion.Control>

                {index > 1 && (
                  <IconX
                    size={20}
                    color="red"
                    className="cursor-pointer"
                    onClick={() => {
                      const newPackages = [...state.packages];
                      newPackages[active].seasons.splice(index, 1);
                      setState((prev) => ({ ...prev, packages: newPackages }));
                    }}
                  />
                )}
              </Flex>
              <Accordion.Panel>
                <DatePickerInput
                  type="range"
                  value={season.date}
                  onChange={(date) => {
                    const newPackages = [...state.packages];
                    newPackages[active].seasons[index].date = date;
                    setState((prev) => ({ ...prev, packages: newPackages }));
                  }}
                  color="red"
                  label="Pick date range"
                  placeholder="Select dates"
                  styles={{ input: { paddingTop: 13, paddingBottom: 13 } }}
                  labelProps={{ className: "font-semibold mb-1" }}
                  rightSection={<IconSelector className="text-gray-500" />}
                  className="max-w-fit min-w-[250px]"
                  minDate={new Date()}
                  icon={<IconCalendar className="text-gray-500" />}
                  numberOfColumns={2}
                  autoSave="true"
                />

                <Flex mt={10} direction="column">
                  <Flex className="w-full" direction="column" mt={10} gap={8}>
                    {season.guests.map((guest, guestIndex) => (
                      <Flex className="w-full" key={guestIndex} gap={8}>
                        <TextInput
                          w="20%"
                          label="Guest Type"
                          className="w-[50%]"
                          value={guest.guestType}
                          disabled
                          radius="sm"
                        />

                        <TextInput
                          w="20%"
                          label="Description"
                          className="w-[50%]"
                          value={guest.description}
                          disabled
                          radius="sm"
                        />

                        <NumberInput
                          hideControls
                          w="50%"
                          label="Resident price(KES)"
                          placeholder="eg. 2000"
                          value={guest.residentPrice}
                          onChange={(value) => {
                            const newPackages = [...state.packages];
                            newPackages[active].seasons[index].guests[
                              guestIndex
                            ].residentPrice = value;
                            setState((prev) => ({
                              ...prev,
                              packages: newPackages,
                            }));
                          }}
                          radius="sm"
                        />

                        <NumberInput
                          w="50%"
                          hideControls
                          label="Non-resident price($)"
                          placeholder="eg. 100"
                          value={guest.nonResidentPrice}
                          onChange={(value) => {
                            const newPackages = [...state.packages];
                            newPackages[active].seasons[index].guests[
                              guestIndex
                            ].nonResidentPrice = value;
                            setState((prev) => ({
                              ...prev,
                              packages: newPackages,
                            }));
                          }}
                          radius="sm"
                        />
                      </Flex>
                    ))}
                  </Flex>
                </Flex>
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
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
      </Container>
    </Flex>
  );
}

export default AddRoomSecondPage;
