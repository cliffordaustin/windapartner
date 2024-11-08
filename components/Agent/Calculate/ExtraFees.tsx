import { Context, ExtraFee, StateType } from "@/context/CalculatePage";
import { Mixpanel } from "@/utils/mixpanelconfig";
import { AgentStay } from "@/utils/types";
import {
  Anchor,
  Flex,
  Input,
  NumberInput,
  Popover,
  Text,
  TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus, IconSelector, IconX } from "@tabler/icons-react";
import { useContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";

type ExtraFeesProps = {
  fee: ExtraFee;
  stay: AgentStay;
  index: number;
};

const guestClassName =
  "h-[35px] hover:bg-red-500 cursor-pointer hover:border-red-500 hover:text-white transition-all duration-300 flex text-gray-600 items-center justify-center w-[35px] border border-solid border-gray-400 ";

export default function ExtraFees({ fee, stay, index }: ExtraFeesProps) {
  const { state, setState } = useContext(Context);
  const handleFeeNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedItems = state.map((item) => {
      if (item.id === stay.id) {
        return {
          ...item,
          extraFee: item.extraFee.map((extraFee) => {
            if (extraFee.id === fee.id) {
              return {
                ...extraFee, // Create a new object for each extraFee item
                name: event.target.value,
              };
            }
            return extraFee;
          }),
        };
      }
      return item;
    });
    setState(updatedItems);
  };

  type GuestType = "Resident" | "Non-resident";
  type PricingType = "PER PERSON" | "WHOLE GROUP" | "PER PERSON PER NIGHT";

  const handleFeePriceChange = (value: number | "") => {
    const updatedItems = state.map((item) => {
      if (item.id === stay.id) {
        return {
          ...item,
          extraFee: item.extraFee.map((extraFee) => {
            if (extraFee.id === fee.id) {
              return {
                ...extraFee,
                price: value,
              };
            }
            return extraFee;
          }),
        };
      }
      return item;
    });
    setState(updatedItems);
  };

  const handleGuestTypeChange = (guestType: GuestType) => {
    const updatedItems: StateType[] = state.map((item) => {
      if (item.id === stay.id) {
        return {
          ...item,
          extraFee: item.extraFee.map((extraFee) => {
            if (extraFee.id === fee.id) {
              return {
                ...extraFee,
                guestType,
                pricingType: "",
                price: "",
              };
            }
            return extraFee;
          }),
        };
      }
      return item;
    });
    setState(updatedItems);
  };

  const handleGuestTypeDeselect = () => {
    const updatedItems: StateType[] = state.map((item) => {
      if (item.id === stay.id) {
        return {
          ...item,
          extraFee: item.extraFee.map((extraFee) => {
            if (extraFee.id === fee.id) {
              return {
                ...extraFee,
                guestType: "",
                pricingType: "",
                price: "",
              };
            }
            return extraFee;
          }),
        };
      }
      return item;
    });
    setState(updatedItems);
  };

  const handlePricingTypeChange = (pricingType: PricingType) => {
    const updatedItems: StateType[] = state.map((item) => {
      if (item.id === stay.id) {
        return {
          ...item,
          extraFee: item.extraFee.map((extraFee) => {
            if (extraFee.id === fee.id) {
              return {
                ...extraFee,
                pricingType,
                price: "",
              };
            }
            return extraFee;
          }),
        };
      }
      return item;
    });
    setState(updatedItems);
  };

  const handlePricingTypeDeselect = () => {
    const updatedItems: StateType[] = state.map((item) => {
      if (item.id === stay.id) {
        return {
          ...item,
          extraFee: item.extraFee.map((extraFee) => {
            if (extraFee.id === fee.id) {
              return {
                ...extraFee,
                pricingType: "",
                price: "",
              };
            }
            return extraFee;
          }),
        };
      }
      return item;
    });
    setState(updatedItems);
  };

  const guestTypes: GuestType[] = ["Non-resident", "Resident"];
  const pricingTypes: PricingType[] = [
    "PER PERSON",
    "WHOLE GROUP",
    "PER PERSON PER NIGHT",
  ];

  const removeFee = () => {
    const updatedItems = state.map((item) => {
      if (item.id === stay.id) {
        return {
          ...item,
          extraFee: item.extraFee.filter((extraFee) => extraFee.id !== fee.id),
        };
      }
      return item;
    });
    setState(updatedItems);
  };

  const hasContentInFirstFee = state.find((item) => {
    if (item.id === stay.id) {
      if (
        item.extraFee[0].name ||
        item.extraFee[0].price ||
        item.extraFee[0].guestType ||
        item.extraFee[0].pricingType
      ) {
        return true;
      } else {
        return false;
      }
    }
    return false;
  });

  const clearFee = () => {
    // clear all fields in first fee state
    const updatedItems: StateType[] = state.map((item) => {
      if (item.id === stay.id) {
        return {
          ...item,
          extraFee: item.extraFee.map((extraFee) => {
            if (extraFee.id === fee.id) {
              return {
                ...extraFee,
                name: "",
                price: "",
                guestType: "",
                pricingType: "",
              };
            }
            return extraFee;
          }),
        };
      }
      return item;
    });

    setState(updatedItems);
  };

  const [opened, setOpened] = useState(false);

  const [pricingTypeOpened, setPricingTypeOpened] = useState(false);

  return (
    <div className="items-center">
      <div className="flex mb-1 flex-col w-full">
        <Flex w="100%" mt={18}>
          <Flex
            justify={"space-between"}
            align={"center"}
            className="px-2 py-1 cursor-pointer border border-solid w-[50%] lg:w-[33.3%] xl:w-[220px] border-gray-300"
          >
            <Flex direction="column" className="w-full" gap={2}>
              {/* <Text size="xs" weight={600} className="text-gray-500">
                Fee name
              </Text> */}

              <TextInput
                placeholder="Enter fee name"
                className="w-full"
                value={fee.name}
                id={fee.id}
                classNames={{
                  input:
                    "border-none px-0 !py-0 !w-full focus:ring-0 focus:outline-none",
                  wrapper: "w-full",
                }}
                onChange={(event) => {
                  handleFeeNameChange(event);
                }}
                onBlur={() => {
                  if (fee.name) {
                    Mixpanel.track("User entered an extra fee name", {
                      property: stay.property_name,
                      extra_fee: fee.name,
                    });
                  }
                }}
              ></TextInput>
            </Flex>

            {/* <IconSelector className="text-gray-500"></IconSelector> */}
          </Flex>

          <Popover
            width={300}
            position="bottom-start"
            arrowOffset={60}
            withArrow
            shadow="md"
          >
            <Popover.Target>
              <Flex
                justify={"space-between"}
                align={"center"}
                className="px-2 py-1 cursor-pointer border-l border-l-transparent border border-solid w-[50%] lg:w-[33.3%] xl:w-[220px] border-gray-300"
              >
                <Flex direction="column" gap={4}>
                  <Text size="xs" weight={600} className="text-gray-500">
                    Guest type
                  </Text>
                  <Text size="sm" weight={600}>
                    {fee.guestType ? fee.guestType : "Select guest type"}
                  </Text>
                </Flex>

                <IconSelector className="text-gray-500"></IconSelector>
              </Flex>
            </Popover.Target>

            <Popover.Dropdown className="px-3">
              {guestTypes.map((guestType, index) => (
                <Flex
                  key={index}
                  justify={"space-between"}
                  align={"center"}
                  onClick={() => {
                    if (guestType === fee.guestType) {
                      handleGuestTypeDeselect();
                    } else {
                      handleGuestTypeChange(guestType);
                      Mixpanel.track("User selected an extra fee guest type", {
                        property: stay.property_name,
                        guest_type: fee.guestType,
                      });
                    }
                  }}
                  // onMouseUp={() => {
                  //   setOpened(false);
                  // }}
                  className={
                    "py-2 px-2 rounded-md mt-1 cursor-pointer " +
                    (fee.guestType === guestType
                      ? "bg-[#FA5252] text-white"
                      : "hover:bg-gray-100")
                  }
                >
                  <Text size="sm" weight={600}>
                    {guestType.charAt(0).toUpperCase() +
                      guestType.slice(1).toLowerCase()}
                  </Text>
                </Flex>
              ))}
            </Popover.Dropdown>
          </Popover>

          <Popover
            width={350}
            position="bottom-start"
            arrowOffset={60}
            withArrow
            shadow="md"
          >
            <Popover.Target>
              <div className="hidden lg:block w-[50%] lg:w-[33.3%] xl:w-[220px]">
                <Flex
                  justify={"space-between"}
                  align={"center"}
                  className="px-2 py-1 cursor-pointer border-l border-l-transparent border border-solid w-full border-gray-300"
                >
                  <Flex direction="column" gap={4}>
                    <Text size="xs" weight={600} className="text-gray-500">
                      Pricing type
                    </Text>
                    <Text size="sm" weight={600}>
                      {fee.pricingType
                        ? fee.pricingType.charAt(0).toUpperCase() +
                          fee.pricingType.slice(1).toLowerCase()
                        : "Select pricing type"}
                    </Text>
                  </Flex>

                  <IconSelector className="text-gray-500"></IconSelector>
                </Flex>
              </div>
            </Popover.Target>

            <Popover.Dropdown className="px-3">
              {pricingTypes.map((pricingType, index) => (
                <Flex
                  key={index}
                  justify={"space-between"}
                  align={"center"}
                  onClick={() => {
                    // handlePricingTypeChange(pricingType);
                    if (pricingType === fee.pricingType) {
                      handlePricingTypeDeselect();
                    } else {
                      handlePricingTypeChange(pricingType);
                      Mixpanel.track(
                        "User selected an extra fee pricing type",
                        {
                          property: stay.property_name,
                          pricing_type: fee.pricingType,
                        }
                      );
                    }
                  }}
                  // onMouseUp={() => {
                  //   setPricingTypeOpened(false);
                  // }}
                  className={
                    "py-2 px-2 rounded-md mt-1 cursor-pointer " +
                    (fee.pricingType === pricingType
                      ? "bg-[#FA5252] text-white"
                      : "hover:bg-gray-100")
                  }
                >
                  <Text size="sm" weight={600}>
                    {pricingType.charAt(0).toUpperCase() +
                      pricingType.slice(1).toLowerCase()}
                  </Text>
                </Flex>
              ))}
            </Popover.Dropdown>
          </Popover>

          <Flex
            justify={"space-between"}
            align={"center"}
            className="px-2 py-1 hidden xl:flex cursor-pointer border border-l-transparent border-solid w-[220px] border-gray-300"
          >
            <Flex direction="column" className="w-full" gap={4}>
              {/* <Text size="xs" weight={600} className="text-gray-500">
                Price
              </Text> */}
              <NumberInput
                placeholder="Enter fee price"
                value={fee.price}
                classNames={{
                  input:
                    "border-none px-0 !h-full !w-full !py-0 focus:ring-0 focus:outline-none",
                  wrapper: "h-[40px] !w-full",
                }}
                onBlur={() => {
                  if (fee.price) {
                    Mixpanel.track("User entered an extra fee price", {
                      property: stay.property_name,
                      extra_fee_prce: fee.price,
                    });
                  }
                }}
                icon={
                  fee.guestType === "Resident" && fee.price
                    ? "KES"
                    : fee.guestType === "Non-resident" && fee.price
                    ? "$"
                    : ""
                }
                onChange={(value) => {
                  handleFeePriceChange(value);
                }}
              ></NumberInput>
            </Flex>

            {/* <IconSelector className="text-gray-500"></IconSelector> */}
          </Flex>
        </Flex>

        <Flex w="100%">
          <Popover
            width={300}
            position="bottom-start"
            arrowOffset={60}
            withArrow
            shadow="md"
          >
            <Popover.Target>
              <div className="lg:hidden block w-[50%] lg:w-[220px]">
                <Flex
                  justify={"space-between"}
                  align={"center"}
                  className="px-2 py-1 cursor-pointer border-l border-r-0 border-t-transparent border border-solid w-full border-gray-300"
                >
                  <Flex direction="column" gap={4}>
                    <Text size="xs" weight={600} className="text-gray-500">
                      Pricing type
                    </Text>
                    <Text size="sm" weight={600}>
                      {fee.pricingType
                        ? fee.pricingType.charAt(0).toUpperCase() +
                          fee.pricingType.slice(1).toLowerCase()
                        : "Select pricing type"}
                    </Text>
                  </Flex>

                  <IconSelector className="text-gray-500"></IconSelector>
                </Flex>
              </div>
            </Popover.Target>

            <Popover.Dropdown className="px-3">
              {pricingTypes.map((pricingType, index) => (
                <Flex
                  key={index}
                  justify={"space-between"}
                  align={"center"}
                  onClick={() => {
                    // handlePricingTypeChange(pricingType);
                    if (pricingType === fee.pricingType) {
                      handlePricingTypeDeselect();
                    } else {
                      handlePricingTypeChange(pricingType);
                      Mixpanel.track(
                        "User selected an extra fee pricing type",
                        {
                          property: stay.property_name,
                          pricing_type: fee.pricingType,
                        }
                      );
                    }
                  }}
                  // onMouseUp={() => {
                  //   setPricingTypeOpened(false);
                  // }}
                  className={
                    "py-2 px-2 rounded-md mt-1 cursor-pointer " +
                    (fee.pricingType === pricingType
                      ? "bg-[#FA5252] text-white"
                      : "hover:bg-gray-100")
                  }
                >
                  <Text size="sm" weight={600}>
                    {pricingType.charAt(0).toUpperCase() +
                      pricingType.slice(1).toLowerCase()}
                  </Text>
                </Flex>
              ))}
            </Popover.Dropdown>
          </Popover>

          <Flex
            justify={"space-between"}
            align={"center"}
            className="px-2 cursor-pointer border border-t-0 border-solid xl:hidden block w-[50%] lg:w-[33.3%] border-gray-300"
          >
            <Flex direction="column" className="w-full bg-green-300" gap={4}>
              {/* <Text size="xs" weight={600} className="text-gray-500">
                Price
              </Text> */}
              <NumberInput
                placeholder="Enter fee price"
                value={fee.price}
                classNames={{
                  input:
                    "border-none px-0 !h-full !w-full !rounded-none !py-0 focus:ring-0 focus:outline-none",
                  wrapper: "h-[52.4px] !w-full",
                }}
                onBlur={() => {
                  if (fee.price) {
                    Mixpanel.track("User entered an extra fee price", {
                      property: stay.property_name,
                      extra_fee_prce: fee.price,
                    });
                  }
                }}
                icon={
                  fee.guestType === "Resident" && fee.price
                    ? "KES"
                    : fee.guestType === "Non-resident" && fee.price
                    ? "$"
                    : ""
                }
                onChange={(value) => {
                  handleFeePriceChange(value);
                }}
              ></NumberInput>
            </Flex>

            {/* <IconSelector className="text-gray-500"></IconSelector> */}
          </Flex>
        </Flex>
      </div>

      <div className="flex items-center justify-between">
        <div></div>
        <Anchor
          component="button"
          type="button"
          color="red"
          size="sm"
          onClick={() => {
            if (index === 0) {
              clearFee();
            } else {
              removeFee();
            }
          }}
        >
          Clear
        </Anchor>
      </div>

      {/* <div
        onClick={() => {
          removeFee();
        }}
        className="mt-5 cursor-pointer"
      >
        {index > 0 && <IconX className="text-gray-600"></IconX>}
      </div>

      <div
        onClick={() => {
          clearFee();
        }}
        className="mt-5 cursor-pointer"
      >
        {index === 0 && hasContentInFirstFee && (
          <IconX className="text-gray-600"></IconX>
        )}
      </div> */}
    </div>
  );
}
