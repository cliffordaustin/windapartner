import { Context, StateType } from "@/context/CalculatePage";
import {
  Flex,
  Popover,
  Text,
  Collapse,
  Divider,
  Switch,
  NumberInput,
  Container,
  Anchor,
} from "@mantine/core";
import { DateInput, DatePicker, DatePickerInput } from "@mantine/dates";
import {
  IconBellDollar,
  IconCalendar,
  IconCheck,
  IconChevronDown,
  IconMinus,
  IconPercentage,
  IconPlus,
  IconSelector,
  IconX,
} from "@tabler/icons-react";
import { useContext, useEffect, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import Activities from "./Activities";
import ExtraFees from "./ExtraFees";
import { RoomType, AgentStay } from "@/utils/types";
import Room from "./Room";
import { v4 as uuidv4 } from "uuid";
import Activity from "./Activity";
import { Mixpanel } from "@/utils/mixpanelconfig";
import { format } from "date-fns";
import { AgentDiscountRateType } from "@/pages/api/stays";

type StayProps = {
  stay: AgentStay;
  index: number;
  agentRates: AgentDiscountRateType[] | undefined;
};

export function Stay({ stay, index, agentRates }: StayProps) {
  const { state, setState } = useContext(Context);
  const [opened, { toggle }] = useDisclosure(index === 0);

  const date = state.find((item) => item.id === stay.id)?.date;
  const rooms = state.find((item) => item.id === stay.id)?.rooms;
  const extraFees = state.find((item) => item.id === stay.id)?.extraFee;
  const residentCommission = state.find(
    (item) => item.id === stay.id
  )?.residentCommission;
  const nonResidentCommission = state.find(
    (item) => item.id === stay.id
  )?.nonResidentCommission;

  const addRoom = () => {
    const updatedItems: StateType[] = state.map((item) => {
      if (item.id === stay.id) {
        return {
          ...item,
          rooms: [
            ...item.rooms,
            {
              id: uuidv4(),
              name: "",
              residentAdult: 0,
              residentChild: 0,
              residentInfant: 0,
              nonResidentAdult: 0,
              nonResidentChild: 0,
              nonResidentInfant: 0,
              package: "",
              package_description: "",
              packageDescription: "",
              residentParkFee: [],
              nonResidentParkFee: [],
              otherFees: [],
              residentGuests: [
                {
                  id: uuidv4(),
                  resident: "",
                  guestType: "",
                  numberOfGuests: 1,
                  description: "",
                },
              ],
              nonResidentGuests: [
                {
                  id: uuidv4(),
                  nonResident: "",
                  guestType: "",
                  numberOfGuests: 1,
                  description: "",
                },
              ],
            },
          ],
        };
      }
      return item;
    });
    setState(updatedItems);
    Mixpanel.track("User added a room to calculate", {
      property: stay.property_name,
    });
  };

  const addFee = () => {
    const updatedItems: StateType[] = state.map((item) => {
      if (item.id === stay.id) {
        return {
          ...item,
          extraFee: [
            ...item.extraFee,
            {
              id: uuidv4(),
              name: "",
              price: "",
              pricingType: "",
              guestType: "",
            },
          ],
        };
      }
      return item;
    });
    setState(updatedItems);
    Mixpanel.track("User added a fee to calculate", {
      property: stay.property_name,
    });
  };

  useEffect(() => {
    const item: StateType = {
      id: stay.id,
      slug: stay.slug,
      date: [null, null],
      name: stay.property_name,
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
              numberOfGuests: 0,
              description: "",
            },
          ],
          nonResidentGuests: [
            {
              id: uuidv4(),
              nonResident: "",
              numberOfGuests: 0,
              guestType: "",
              description: "",
            },
          ],
          package: "",
          package_description: "",
          residentParkFee: [],
          nonResidentParkFee: [],
          otherFees: [],
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
    };

    // add the item to the state if it doesn't exist
    if (!state.find((item) => item.id === stay.id)) {
      setState([...state, item]);
    }
  }, [setState, state, stay]);

  return (
    <div>
      {/* <Flex gap={4} mb={8} align={"center"}>
        <div
          onClick={toggle}
          className="rounded-md cursor-pointer bg-gray-200 w-6 h-6 flex items-center justify-center"
        >
          <IconChevronDown
            className={"text-gray-500 rotate-45 "}
            rotate={opened ? 0 : 180}
          ></IconChevronDown>
        </div>
        <Text
          variant="gradient"
          gradient={{ from: "#000", to: "#333", deg: 45 }}
          fz="lg"
          fw={700}
          mb={4}
        >
          {stay.name}
        </Text>
      </Flex> */}
      <div className="mt-2">
        <DatePickerInput
          type="range"
          value={date}
          onChange={(date) => {
            const updatedItems = state.map((item) => {
              if (item.id === stay.id) {
                return {
                  ...item,
                  date: date,
                };
              } else {
                return item;
              }
            });
            setState(updatedItems);
            if (date[0] && date[1]) {
              Mixpanel.track("User picked a date range", {
                property: stay.property_name,
                from_date: format(date[0], "yyyy-MM-dd"),
                to_date: format(date[1], "yyyy-MM-dd"),
              });
            }
          }}
          color="red"
          dropdownType="modal"
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

        <div className="relative">
          {rooms?.map((room, index) => (
            <Room index={index} key={index} stay={stay} room={room}></Room>
          ))}

          <Anchor
            component="button"
            type="button"
            color="blue"
            size="sm"
            onClick={() => {
              addRoom();
            }}
            className="flex absolute bottom-0 items-center gap-1"
          >
            <IconPlus size="1rem"></IconPlus>
            <Text size="sm">Add a room</Text>
          </Anchor>
        </div>

        {/* <Flex
          onClick={() => {
            addRoom();
          }}
          className="cursor-pointer w-fit"
          mt={12}
          gap={2}
          align={"center"}
        >
          <IconPlus color="red" size="1rem"></IconPlus>
          <Text color="red" size="sm">
            Add a room
          </Text>
        </Flex> */}

        {stay.activity_fees.length > 0 && (
          <>
            <Divider mt={16} mb={16} />

            <Text size="md" weight={600}>
              Activities/Extras
            </Text>
          </>
        )}

        <div className="flex flex-col gap-4 mt-4">
          {stay.activity_fees?.map((activity, index) => (
            <Activity stay={stay} key={index} activity={activity}></Activity>
          ))}
        </div>

        <Divider mt={16} mb={16} />

        <Text size="md" weight={600}>
          Extra fees
        </Text>
        <div className="relative">
          {extraFees?.map((fee, index) => (
            <ExtraFees
              key={index}
              index={index}
              fee={fee}
              stay={stay}
            ></ExtraFees>
          ))}

          <Anchor
            component="button"
            type="button"
            color="blue"
            size="sm"
            onClick={() => {
              addFee();
            }}
            className="flex absolute bottom-0 items-center gap-1"
          >
            <IconPlus size="1rem"></IconPlus>
            <Text size="sm">Add a fee</Text>
          </Anchor>

          {/* <Flex
            onClick={() => {
              addFee();
            }}
            className="cursor-pointer w-fit"
            mt={12}
            gap={2}
            align={"center"}
          >
            <IconPlus color="red" size="1rem"></IconPlus>
            <Text color="red" size="sm">
              Add a fee
            </Text>
          </Flex> */}
        </div>

        <Divider mt={16} mb={16} />
        <Text size="md" weight={600}>
          Commission
        </Text>

        <Flex mt={4} gap={16} className="items-end">
          <NumberInput
            value={nonResidentCommission}
            onChange={(value) => {
              const updatedItems = state.map((item) => {
                if (item.id === stay.id) {
                  return {
                    ...item,
                    nonResidentCommission: value,
                  };
                } else {
                  return item;
                }
              });
              setState(updatedItems);
            }}
            label="Non-resident commission (%)"
            placeholder="Enter commission"
            labelProps={{ className: "font-semibold mb-1" }}
            maw={300}
            icon={<IconPercentage className="text-gray-500" />}
            onBlur={() => {
              if (nonResidentCommission) {
                Mixpanel.track("User entered non-resident commission", {
                  property: stay.property_name,
                  non_resident_commission: nonResidentCommission,
                });
              }
            }}
          />

          <NumberInput
            value={residentCommission}
            onChange={(value) => {
              const updatedItems = state.map((item) => {
                if (item.id === stay.id) {
                  return {
                    ...item,
                    residentCommission: value,
                  };
                } else {
                  return item;
                }
              });
              setState(updatedItems);
            }}
            label="Resident commission (%)"
            placeholder="Enter commission"
            labelProps={{ className: "font-semibold mb-1" }}
            maw={300}
            icon={<IconPercentage className="text-gray-500" />}
            onBlur={() => {
              if (residentCommission) {
                Mixpanel.track("User entered resident commission", {
                  property: stay.property_name,
                  resident_commission: residentCommission,
                });
              }
            }}
          />
        </Flex>
      </div>
    </div>
  );
}
