import getToken from "@/utils/getToken";
import { GetServerSideProps } from "next";
import { UserTypes } from "@/utils/types";
import { getUser } from "@/pages/api/user";
import axios, { AxiosError } from "axios";
import { dehydrate, QueryClient, useMutation, useQuery } from "react-query";
import Cookies from "js-cookie";
import Navbar from "@/components/Agent/Navbar";
import {
  use,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Stay } from "@/utils/types";
import {
  AgentDiscountRateType,
  getAgentDiscountRates,
  getDetailPartnerStays,
} from "@/pages/api/stays";
import { useRouter } from "next/router";
import {
  Accordion,
  ActionIcon,
  Alert,
  Anchor,
  Button,
  Checkbox,
  Divider,
  Drawer,
  FileInput,
  Flex,
  Grid,
  Loader,
  Modal,
  rem,
  ScrollArea,
  Select,
  Slider,
  Switch,
  Tabs,
  Text,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import { Context } from "@/context/CalculatePage";
import { StateType } from "@/context/CalculatePage";
import { Stay as CalculateStay } from "@/components/Agent/Calculate/Stay";
import { v4 as uuidv4 } from "uuid";
import {
  IconAlertCircle,
  IconCalculator,
  IconCalendar,
  IconChevronUp,
  IconGraph,
  IconSelector,
  IconTrash,
  IconUpload,
  IconX,
} from "@tabler/icons-react";
import Summary from "@/components/Agent/Calculate/Summary";
import { useReactToPrint } from "react-to-print";

import { saveAs } from "file-saver";
import { useDisclosure } from "@mantine/hooks";
import PrintSummary from "@/components/Agent/Calculate/PrintSummary";
import Image from "next/image";
import { Mixpanel } from "@/utils/mixpanelconfig";
import { Auth, withSSRContext } from "aws-amplify";
import { DatePickerInput } from "@mantine/dates";
import { format } from "date-fns";
import AgentPriceTable from "@/components/Agent/Calculate/AgentPriceTable";
import RequestAccess from "@/components/Agent/Calculate/RequestAccess";
import MobileSummary from "@/components/Agent/Calculate/MobileSummary";

export default function Calculate() {
  const router = useRouter();

  const [includeClientInCalculation, setIncludeResidentInCalculation] =
    useState(false);

  const [summarizedCalculation, setSummarizedCalculation] = useState(false);

  const { data: user } = useQuery<UserTypes | null>("user", () => getUser());

  const [queryClient] = useState(() => new QueryClient());

  const [stayIds, setStayIds] = useState<string | undefined>("");

  const { state, setState } = useContext(Context);

  const dynamicRoute = useRouter().asPath;

  useEffect(() => {
    const ids = localStorage.getItem("stayIds");
    const newIds = ids?.replace(/[\[\]']+/g, "");
    if (ids) {
      setStayIds(newIds);
    }
  }, [stayIds]);

  const { data: stays, isLoading: isStayLoading } = useQuery<Stay[]>(
    "partner-stay-ids",
    () => getDetailPartnerStays(stayIds),
    { enabled: !!stayIds }
  );

  type TotalTypes = {
    id: number;
    total: number;
  };

  const [totalResident, setTotalResident] = useState<TotalTypes[]>([]);

  const [totalNonResident, setTotalNonResident] = useState<TotalTypes[]>([]);

  const updateTotals = (id: number, total: number, isResident: boolean) => {
    if (isResident) {
      setTotalResident((prevTotalResident) => {
        const existingIndex = prevTotalResident.findIndex(
          (total) => total.id === id
        );
        if (existingIndex !== -1) {
          const updatedTotals = [...prevTotalResident];
          updatedTotals[existingIndex] = { id, total };
          return updatedTotals;
        } else {
          return [...prevTotalResident, { id, total }];
        }
      });
    } else {
      setTotalNonResident((prevTotalNonResident) => {
        const existingIndex = prevTotalNonResident.findIndex(
          (total) => total.id === id
        );
        if (existingIndex !== -1) {
          const updatedTotals = [...prevTotalNonResident];
          updatedTotals[existingIndex] = { id, total };
          return updatedTotals;
        } else {
          return [...prevTotalNonResident, { id, total }];
        }
      });
    }
  };

  const handleDownloadClick = async (
    pdfUrl: string | undefined,
    lodgeName: string | undefined
  ) => {
    if (pdfUrl) {
      const name = lodgeName?.replace(/\s/g, "");
      const fileName = `${name}pricing_sheet.pdf`;
      saveAs(pdfUrl, fileName);
    }
  };

  const [opened, { open, close }] = useDisclosure(false);
  const theme = useMantineTheme();

  const [pdfTitle, setPdfTitle] = useState("Winda Safari");

  const [style, setStyle] = useState<string | null>("default");

  const [files, setFiles] = useState<File>();

  const componentRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const sumOfResidentCommission = state.reduce(
    (a, b) => a + Number(b.residentCommission),
    0
  );

  const sumOfNonResidentCommission = state.reduce(
    (a, b) => a + Number(b.nonResidentCommission),
    0
  );

  const totalResidentSum = totalResident.reduce(
    (a, b) => a + Number(b.total),
    0
  );

  const totalNonResidentSum = totalNonResident.reduce(
    (a, b) => a + Number(b.total),
    0
  );

  // function handleRemoveItemClick(id: number) {
  //   const filterStayIds = stayIds?.split(",").filter((stayId) => {
  //     return stayId !== String(id);
  //   });

  //   setStayIds(filterStayIds?.join(","));

  //   const storedItemIds = localStorage.getItem("stayIds");
  //   localStorage.setItem(
  //     "stayIds",
  //     JSON.stringify(
  //       JSON.parse(storedItemIds || "[]").filter(
  //         (stayId: number) => stayId !== id
  //       )
  //     )
  //   );
  //   refetch();
  // }

  const [
    discountRateModalOpened,
    { open: openDiscountRateModalOpen, close: closeDiscountRateModalOpen },
  ] = useDisclosure(false);

  const [date, setDate] = useState<[Date | null, Date | null]>([null, null]);

  const { data: agents, refetch } = useQuery<AgentDiscountRateType[]>(
    "agent-discount-rates",
    () => getAgentDiscountRates(selectedTab),
    { enabled: false }
  );

  const agentNetRate = agents?.find((agent) => {
    return !agent.start_date && !agent.end_date;
  });

  const otherAgentRates = agents?.filter((agent) => {
    return agent.start_date && agent.end_date;
  });

  const [applyForAllDates, setApplyForAllDates] = useState(false);

  const [sliderValue, setSliderValue] = useState(agentNetRate?.percentage);

  const [sliderValueCustomRate, setSliderValueCustomRate] = useState(0);

  const [residentSliderValue, setResidentSliderValue] = useState(
    agentNetRate?.resident_percentage
  );

  const [residentSliderValueCustomRate, setResidentSliderValueCustomRate] =
    useState(0);

  const getInitialSelectedTab = useCallback((data: Stay[] | undefined) => {
    if (data && data.length > 0) {
      return data[0].slug;
    }
    return null;
  }, []);

  const initialSelectedTab = useMemo(
    () => getInitialSelectedTab(stays),
    [stays]
  );

  const [selectedTab, setSelectedTab] = useState<string | null>("");

  useEffect(() => {
    setSelectedTab(initialSelectedTab);
  }, [initialSelectedTab]);

  useEffect(() => {
    if (selectedTab) {
      refetch();
    }
  }, [selectedTab]);

  const addAgentRate = async () => {
    if (selectedTab) {
      const currentSession = await Auth.currentSession();
      const accessToken = currentSession.getAccessToken();
      const token = accessToken.getJwtToken();

      try {
        if (date[0] && date[1]) {
          await axios.post(
            `${process.env.NEXT_PUBLIC_baseURL}/stays/${selectedTab}/agent-discounts/`,
            {
              start_date: format(date[0], "yyyy-MM-dd"),
              end_date: format(date[1], "yyyy-MM-dd"),
              percentage: sliderValueCustomRate,
              resident_percentage: residentSliderValueCustomRate,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        }

        refetch();
      } catch (error) {}
    }
  };

  const addAgentNettRate = async () => {
    if (selectedTab) {
      const currentSession = await Auth.currentSession();
      const accessToken = currentSession.getAccessToken();
      const token = accessToken.getJwtToken();

      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_baseURL}/stays/${selectedTab}/agent-discounts/`,
          {
            start_date: null,
            end_date: null,
            percentage: sliderValue,
            resident_percentage: residentSliderValue,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        refetch();
      } catch (error) {}
    }
  };

  const deleteAgentRate = async (id: number) => {
    if (selectedTab) {
      const currentSession = await Auth.currentSession();
      const accessToken = currentSession.getAccessToken();
      const token = accessToken.getJwtToken();
      await axios
        .delete(
          `${process.env.NEXT_PUBLIC_baseURL}/stays/${selectedTab}/agent-discounts/${id}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then(() => {
          refetch();
        });
    }
  };

  const { mutateAsync: addAgentRateMutation, isLoading: addAgentRateLoading } =
    useMutation(addAgentRate, {
      onSuccess: () => {},
    });

  const {
    mutateAsync: addAgentNettRateMutation,
    isLoading: addAgentNettRateLoading,
  } = useMutation(addAgentNettRate, {
    onSuccess: () => {},
  });

  const [displayRackRates, setDisplayRackRates] = useState(false);

  const [isNonResident, setIsNonResident] = useState<boolean>(true);

  const [
    requestContractModal,
    { open: openRequestContractModal, close: closeRequestContractModal },
  ] = useDisclosure(false);

  const [drawerOpened, { open: openDrawer, close: closeDrawer }] =
    useDisclosure(false);

  return (
    <div className="relative">
      <div className="border-b sticky top-0 z-10 bg-white left-0 right-0 border-x-0 border-t-0 border-solid border-b-gray-200">
        <Navbar user={user} calculatePage={true}></Navbar>
      </div>

      {!isStayLoading && (
        <div className="px-6 lg:px-12 relative max-w-[1440px] mx-auto mt-4 mb-16">
          {stays && stays.length > 0 && (
            <Tabs
              color="red"
              defaultValue={stays[0].slug}
              className="w-full mb-4"
              onTabChange={(value) => {
                setSelectedTab(value);
              }}
              keepMounted={false}
            >
              <div className="md:hidden">
                {state.map((item, index) => (
                  <Tabs.Panel
                    key={index}
                    value={item.slug}
                    className="w-full fixed z-10 bg-white bottom-0 left-0"
                  >
                    <div className="w-full bg-white shadow-lg bottom-0 z-20 flex px-6 py-3 items-center justify-between rounded-t-xl border border-gray-200 border-solid">
                      {/* <Text className="font-semibold text-base">
                      {stays?.length} properties
                    </Text> */}
                      <div className="flex items-center gap-1">
                        <Text size="lg" weight={700}>
                          {!!totalNonResidentSum &&
                            `$ ${totalNonResidentSum.toLocaleString(undefined, {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 2,
                            })}`}
                        </Text>{" "}
                        {!!totalNonResidentSum && !!totalResidentSum && (
                          <Text color="dimmed" size="xl">
                            /
                          </Text>
                        )}
                        <Text size="lg" weight={700}>
                          {!!totalResidentSum &&
                            `KES ${totalResidentSum.toLocaleString(undefined, {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 2,
                            })}`}
                        </Text>
                        {!totalNonResidentSum && !totalResidentSum && (
                          <Text size="sm">
                            Select dates and rooms to view your rate
                          </Text>
                        )}
                      </div>
                      <div
                        onClick={openDrawer}
                        className="w-[30px] cursor-pointer h-[30px] border border-solid border-gray-200 rounded-full flex items-center justify-center"
                      >
                        <IconChevronUp size={17}></IconChevronUp>
                      </div>
                    </div>

                    <Drawer
                      opened={drawerOpened}
                      onClose={closeDrawer}
                      title={item.name}
                      closeButtonProps={{
                        style: {
                          width: 30,
                          height: 30,
                        },
                      }}
                      classNames={{
                        title: "font-bold",
                        body: "px-0 py-0",
                      }}
                      position="bottom"
                      overlayProps={{ opacity: 0.5, blur: 4 }}
                    >
                      <MobileSummary
                        agentRates={agents}
                        stays={stays}
                        calculateStay={item}
                        open={() => {
                          closeDrawer();
                          open();
                        }}
                      ></MobileSummary>
                    </Drawer>
                  </Tabs.Panel>
                ))}
              </div>
              <div className="flex gap-4 justify-between">
                <div className="w-full md:w-[60%]">
                  <ScrollArea>
                    <div className="flex w-full ">
                      <Tabs.List className="!flex-none ">
                        {stays?.map((stay, index) => (
                          <Tabs.Tab
                            onClick={() => {
                              Mixpanel.track("Switched to a different tab", {
                                property: stay.property_name,
                              });
                            }}
                            value={stay.slug}
                            key={index}
                          >
                            <div className="flex items-center gap-1.5">
                              <span>{stay.property_name}</span>

                              {/* <ActionIcon
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveItemClick(stay.id);
                              Mixpanel.track("User removed property from tab", {
                                property: stay.property_name,
                              });
                            }}
                            size="sm"
                            className="hover:bg-gray-200"
                          >
                            <IconX></IconX>
                          </ActionIcon> */}
                            </div>
                          </Tabs.Tab>
                        ))}

                        {/* <Tabs.Tab value="summary">Summary</Tabs.Tab> */}
                      </Tabs.List>
                    </div>
                  </ScrollArea>

                  <div className="mt-4 flex flex-col gap-4">
                    {stays?.map((stay, index) => (
                      <Tabs.Panel key={index} value={stay.slug} pt="xs">
                        <Alert
                          icon={<IconAlertCircle size="1rem" />}
                          classNames={{
                            wrapper: "items-center",
                          }}
                          className="w-full mx-auto"
                          color="yellow"
                          // withCloseButton
                          onClose={() => {}}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <Text>
                              {agents && agents.length > 0
                                ? "Please note, the rates shown are nett"
                                : "Please note, the rates shown are rack. To view nett rates,"}
                            </Text>
                            <div className="flex items-center gap-3">
                              {/* {!stay.has_property_access && (
                                <Button
                                  onClick={() => {
                                    openRequestContractModal();
                                  }}
                                  className="text-black"
                                  variant="light"
                                  color="gray"
                                >
                                  Request contract
                                </Button>
                              )} */}
                              <Button
                                onClick={() => {
                                  openDiscountRateModalOpen();
                                }}
                                className="text-black"
                                variant="white"
                              >
                                {!stay.has_property_access
                                  ? "Add own nett rates"
                                  : "Edit nett rates"}
                              </Button>
                            </div>
                          </div>
                        </Alert>
                        <CalculateStay
                          agentRates={agents}
                          stay={stay}
                          index={index}
                        ></CalculateStay>

                        <Modal
                          opened={discountRateModalOpened}
                          onClose={closeDiscountRateModalOpen}
                          title={stay.property_name}
                          classNames={{
                            title: "text-lg font-semibold",
                            close:
                              "text-black hover:text-gray-700 hover:bg-gray-200",
                          }}
                          fullScreen
                          transitionProps={{
                            transition: "slide-up",
                            duration: 200,
                          }}
                          closeButtonProps={{
                            style: {
                              width: 30,
                              height: 30,
                            },
                            iconSize: 20,
                          }}
                        >
                          <div className="flex md:flex-row flex-col gap-6">
                            <div className="md:w-[400px] w-full h-fit border md:order-1 order-2 border-solid border-gray-200 px-4 bg-white rounded-xl py-4 shadow-round">
                              <Text className="font-bold text-base">
                                {isNonResident ? "Non-resident" : "Resident"}{" "}
                                Rates
                              </Text>

                              <div className="flex flex-col gap-2 mt-4">
                                {agentNetRate &&
                                  !agentNetRate.start_date &&
                                  !agentNetRate.end_date && (
                                    <div>
                                      {isNonResident &&
                                        !!agentNetRate.percentage && (
                                          <div className="w-full px-3 flex justify-between items-center py-3 rounded-lg bg-green-50 border border-solid border-green-400">
                                            <div className="px-2 py-1 bg-white rounded-lg shadow-sm w-fit">
                                              <Text className="text-sm font-medium">
                                                Nett rate
                                              </Text>
                                            </div>

                                            <div className="flex items-center gap-2">
                                              <Text className="text-sm medium">
                                                {agentNetRate.percentage}%
                                              </Text>

                                              <ActionIcon
                                                onClick={() => {
                                                  deleteAgentRate(
                                                    agentNetRate.id
                                                  );
                                                }}
                                                color="red"
                                                size="sm"
                                              >
                                                <IconTrash></IconTrash>
                                              </ActionIcon>
                                            </div>
                                          </div>
                                        )}

                                      {!isNonResident &&
                                        !!agentNetRate.resident_percentage && (
                                          <div className="w-full px-3 flex justify-between items-center py-3 rounded-lg bg-green-50 border border-solid border-green-400">
                                            <div className="px-2 py-1 bg-white rounded-lg shadow-sm w-fit">
                                              <Text className="text-sm font-medium">
                                                Nett rate
                                              </Text>
                                            </div>

                                            <div className="flex items-center gap-2">
                                              <Text className="text-sm medium">
                                                {
                                                  agentNetRate.resident_percentage
                                                }
                                                %
                                              </Text>

                                              <ActionIcon
                                                onClick={() => {
                                                  deleteAgentRate(
                                                    agentNetRate.id
                                                  );
                                                }}
                                                color="red"
                                                size="sm"
                                              >
                                                <IconTrash></IconTrash>
                                              </ActionIcon>
                                            </div>
                                          </div>
                                        )}
                                    </div>
                                  )}

                                {isNonResident &&
                                  (!agentNetRate ||
                                    !agentNetRate.percentage) && (
                                    <Text className="text-sm text-center font-bold">
                                      No nett rate added yet
                                    </Text>
                                  )}

                                {!isNonResident &&
                                  (!agentNetRate ||
                                    !agentNetRate.resident_percentage) && (
                                    <Text className="text-sm text-center font-bold">
                                      No nett rate added yet
                                    </Text>
                                  )}

                                {isNonResident && (
                                  <div className="my-2">
                                    <span className="text-sm text-gray-600">
                                      Slide to set rate
                                    </span>
                                    <Slider
                                      value={sliderValue}
                                      label={(label) => `${label}%`}
                                      className=""
                                      onChange={setSliderValue}
                                      color="red"
                                    />
                                  </div>
                                )}

                                {!isNonResident && (
                                  <div className="my-2">
                                    <span className="text-sm text-gray-600">
                                      Slide to set rate
                                    </span>
                                    <Slider
                                      value={residentSliderValue}
                                      label={(label) => `${label}%`}
                                      className=""
                                      onChange={setResidentSliderValue}
                                      color="red"
                                    />
                                  </div>
                                )}

                                <div className="flex items-center justify-between">
                                  <div></div>

                                  {isNonResident && (
                                    <Button
                                      onClick={() => {
                                        addAgentNettRateMutation();
                                      }}
                                      loading={addAgentNettRateLoading}
                                      color="red"
                                      className=""
                                      variant="filled"
                                      disabled={!sliderValue}
                                    >
                                      Add nett rate
                                    </Button>
                                  )}

                                  {!isNonResident && (
                                    <Button
                                      onClick={() => {
                                        addAgentNettRateMutation();
                                      }}
                                      loading={addAgentNettRateLoading}
                                      color="red"
                                      className=""
                                      variant="filled"
                                      disabled={!residentSliderValue}
                                    >
                                      Add nett rate
                                    </Button>
                                  )}
                                </div>

                                <Divider
                                  label="Or"
                                  labelPosition="center"
                                  className="my-2"
                                ></Divider>

                                <Accordion
                                  variant="contained"
                                  className="w-full"
                                >
                                  <Accordion.Item value="1">
                                    <Accordion.Control>
                                      <Text className="font-semibold text-sm">
                                        set additional discounts
                                      </Text>
                                    </Accordion.Control>
                                    <Accordion.Panel>
                                      {otherAgentRates?.map((agent) => (
                                        <div className="w-full" key={agent.id}>
                                          {agent.start_date &&
                                            agent.end_date &&
                                            !!agent.percentage &&
                                            isNonResident && (
                                              <div className="w-full px-3 flex justify-between items-center py-3 rounded-lg bg-blue-50 border border-solid border-blue-400">
                                                <div className="px-2 py-1 bg-white rounded-lg shadow-sm w-fit">
                                                  <Text className="text-sm font-medium">
                                                    {format(
                                                      new Date(
                                                        agent.start_date
                                                      ),
                                                      "dd MMM"
                                                    )}{" "}
                                                    -{" "}
                                                    {format(
                                                      new Date(agent.end_date),
                                                      "dd MMM"
                                                    )}
                                                  </Text>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                  <Text className="text-sm font-medium">
                                                    {agent.percentage}%
                                                  </Text>

                                                  <ActionIcon
                                                    onClick={() => {
                                                      deleteAgentRate(agent.id);
                                                    }}
                                                    color="red"
                                                    size="sm"
                                                  >
                                                    <IconTrash></IconTrash>
                                                  </ActionIcon>
                                                </div>
                                              </div>
                                            )}

                                          {agent.start_date &&
                                            agent.end_date &&
                                            !!agent.resident_percentage &&
                                            !isNonResident && (
                                              <div className="w-full px-3 flex justify-between items-center py-3 rounded-lg bg-blue-50 border border-solid border-blue-400">
                                                <div className="px-2 py-1 bg-white rounded-lg shadow-sm w-fit">
                                                  <Text className="text-sm font-medium">
                                                    {format(
                                                      new Date(
                                                        agent.start_date
                                                      ),
                                                      "dd MMM"
                                                    )}{" "}
                                                    -{" "}
                                                    {format(
                                                      new Date(agent.end_date),
                                                      "dd MMM"
                                                    )}
                                                  </Text>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                  <Text className="text-sm font-medium">
                                                    {agent.resident_percentage}%
                                                  </Text>

                                                  <ActionIcon
                                                    onClick={() => {
                                                      deleteAgentRate(agent.id);
                                                    }}
                                                    color="red"
                                                    size="sm"
                                                  >
                                                    <IconTrash></IconTrash>
                                                  </ActionIcon>
                                                </div>
                                              </div>
                                            )}
                                        </div>
                                      ))}

                                      {otherAgentRates?.length === 0 && (
                                        <Text className="text-sm my-4 text-center font-bold">
                                          No additional discount added yet
                                        </Text>
                                      )}

                                      <DatePickerInput
                                        type="range"
                                        value={date}
                                        onChange={(date) => {
                                          setDate(date);
                                        }}
                                        color="red"
                                        placeholder="Select date range"
                                        styles={{
                                          input: {
                                            paddingTop: 13,
                                            paddingBottom: 13,
                                          },
                                        }}
                                        labelProps={{
                                          className: "font-semibold mb-1",
                                        }}
                                        rightSection={
                                          <IconSelector className="text-gray-500" />
                                        }
                                        className="w-full mt-2"
                                        minDate={new Date()}
                                        icon={
                                          <IconCalendar className="text-gray-500" />
                                        }
                                        numberOfColumns={2}
                                        autoSave="true"
                                        disabled={applyForAllDates}
                                        dropdownType="modal"
                                        modalProps={{
                                          closeOnClickOutside: true,
                                          overlayProps: {
                                            color: "#333",
                                            opacity: 0.4,
                                            zIndex: 201,
                                          },
                                        }}
                                      />

                                      <div className="mt-2">
                                        <span className="text-sm text-gray-600">
                                          {!date[0] || !date[1]
                                            ? "Select date range to set custom rate"
                                            : "Slide to set custom rate"}
                                        </span>
                                        {isNonResident && (
                                          <Slider
                                            value={sliderValueCustomRate}
                                            label={(label) => `${label}%`}
                                            className=""
                                            onChange={setSliderValueCustomRate}
                                            color="red"
                                            disabled={!date[0] || !date[1]}
                                            // labelAlwaysOn
                                          />
                                        )}

                                        {!isNonResident && (
                                          <Slider
                                            value={
                                              residentSliderValueCustomRate
                                            }
                                            label={(label) => `${label}%`}
                                            className=""
                                            onChange={
                                              setResidentSliderValueCustomRate
                                            }
                                            color="red"
                                            disabled={!date[0] || !date[1]}
                                            // labelAlwaysOn
                                          />
                                        )}
                                      </div>

                                      <div className="flex items-center justify-between">
                                        <div></div>

                                        {isNonResident && (
                                          <Button
                                            onClick={() => {
                                              addAgentRateMutation();
                                            }}
                                            loading={addAgentRateLoading}
                                            color="red"
                                            className="mt-4"
                                            variant="filled"
                                            disabled={
                                              !date[0] ||
                                              !date[1] ||
                                              !sliderValueCustomRate
                                            }
                                          >
                                            Add custom rate
                                          </Button>
                                        )}

                                        {!isNonResident && (
                                          <Button
                                            onClick={() => {
                                              addAgentRateMutation();
                                            }}
                                            loading={addAgentRateLoading}
                                            color="red"
                                            className="mt-4"
                                            variant="filled"
                                            disabled={
                                              !date[0] ||
                                              !date[1] ||
                                              !residentSliderValueCustomRate
                                            }
                                          >
                                            Add custom rate
                                          </Button>
                                        )}
                                      </div>
                                    </Accordion.Panel>
                                  </Accordion.Item>
                                </Accordion>
                              </div>

                              {/* <div className="mt-6 py-2 border-t border-solid border-b-0 border-x-0 border-gray-100">
                      <DatePickerInput
                        type="range"
                        value={date}
                        onChange={(date) => {
                          setDate(date);
                        }}
                        color="red"
                        placeholder="Select date range"
                        styles={{
                          input: { paddingTop: 13, paddingBottom: 13 },
                        }}
                        labelProps={{ className: "font-semibold mb-1" }}
                        rightSection={
                          <IconSelector className="text-gray-500" />
                        }
                        className="w-full"
                        minDate={new Date()}
                        icon={<IconCalendar className="text-gray-500" />}
                        numberOfColumns={2}
                        autoSave="true"
                        disabled={applyForAllDates}
                        dropdownType="modal"
                        modalProps={{
                          closeOnClickOutside: true,
                          overlayProps: {
                            color: "#333",
                            opacity: 0.4,
                            zIndex: 201,
                          },
                        }}
                      />

                      <Divider
                        label="Or"
                        labelPosition="center"
                        className="my-2"
                      ></Divider>

                      <Checkbox
                        label="Set your default net rate"
                        className="mt-2 mb-4"
                        color="red"
                        checked={applyForAllDates}
                        onChange={(event) => {
                          setApplyForAllDates(event.currentTarget.checked);
                        }}
                      ></Checkbox>
                      <Divider className="my-2"></Divider>

                      <span className="text-sm">Resident rates</span>
                      <Slider
                        value={residentSliderValue}
                        className=""
                        onChange={setResidentSliderValue}
                        color="red"
                        // labelAlwaysOn
                      />

                      <div className="flex items-center justify-between">
                        <div></div>

                        <Button
                          onClick={() => {
                            addAgentRateMutation();
                          }}
                          loading={addAgentRateLoading}
                          color="red"
                          className="mt-4"
                          variant="filled"
                          disabled={!date[0] && !date[1] && !applyForAllDates}
                        >
                          Add discount rate
                        </Button>
                      </div>
                    </div> */}
                            </div>
                            <div className="md:w-[calc(100%-400px)] w-full md:order-2 order-1">
                              <div className="w-fit mb-4 mx-auto border rounded-lg border-solid border-gray-200 px-6 py-3 flex items-center gap-6">
                                <span className="text-sm">
                                  Toggle to view resident rate
                                </span>
                                <Switch
                                  checked={!isNonResident}
                                  onChange={() => {
                                    setIsNonResident(!isNonResident);
                                  }}
                                  color="red"
                                ></Switch>
                              </div>
                              <AgentPriceTable
                                agentRates={agents}
                                staySlug={selectedTab}
                                displayRackRates={displayRackRates}
                                setDisplayRackRate={setDisplayRackRates}
                                setIsNonResident={setIsNonResident}
                                isNonResident={isNonResident}
                              />
                            </div>
                          </div>
                        </Modal>
                      </Tabs.Panel>
                    ))}
                  </div>
                </div>

                <div className="w-[33%] fixed top-[90px] md:block hidden right-6 lg:right-12">
                  <div className="overflow-y-scroll h-[410px] mt-4 flex flex-col gap-4 shadow-lg border border-solid border-gray-100 rounded-xl">
                    {state.map((item, index) => (
                      <Tabs.Panel
                        key={index}
                        value={item.slug}
                        className="h-[500px]"
                      >
                        <Summary
                          agentRates={agents}
                          stays={stays}
                          calculateStay={item}
                          updateTotals={updateTotals}
                        ></Summary>
                      </Tabs.Panel>
                    ))}
                  </div>

                  <Flex mt={18} className="w-full" gap={10}>
                    <Button
                      onClick={() => {
                        open();
                        Mixpanel.track("User clicked on print quote");
                      }}
                      className="flex w-full justify-center items-center font-semibold p-2 rounded-md cursor-pointer"
                      size="sm"
                      color="red"
                    >
                      <IconCalculator></IconCalculator>
                      <span className="ml-1.5">Print quote</span>
                    </Button>

                    {stays.map((item, index) => (
                      <Tabs.Panel
                        className="w-full"
                        key={index}
                        value={item.slug}
                      >
                        {item.lodge_price_data_pdf && (
                          <Button
                            onClick={() => {
                              Mixpanel.track("User checked contract rates", {
                                property: item.property_name,
                              });
                              handleDownloadClick(
                                item.lodge_price_data_pdf,
                                item.property_name
                              );
                            }}
                            className="flex w-full justify-center items-center gap-8 font-semibold p-2 rounded-md cursor-pointer"
                            size="sm"
                            color="red"
                            variant="outline"
                          >
                            <IconGraph></IconGraph>
                            <span className="ml-1.5">Contract rates</span>
                          </Button>
                        )}
                      </Tabs.Panel>
                    ))}
                  </Flex>
                </div>
              </div>
            </Tabs>
          )}
        </div>
      )}

      <Modal
        opened={requestContractModal}
        onClose={closeRequestContractModal}
        title={"Request contract rates"}
        size="lg"
        classNames={{
          title: "text-lg font-bold",
          close:
            "text-black hover:text-gray-700 w-[40px] h-[30px] hover:bg-gray-100",
          body: "max-h-[500px] overflow-y-scroll px-10 pb-8 w-full",
          content: "rounded-2xl",
        }}
        centered
      >
        <RequestAccess staySlug={stayIds}></RequestAccess>
      </Modal>

      <Modal
        opened={opened}
        onClose={close}
        title="Print Quotation"
        classNames={{
          title: "text-xl font-bold",
          close: "text-black hover:text-gray-700 hover:bg-gray-200",
          header: "border-b border-x-0 border-t-0 border-gray-200 border-solid",
        }}
        fullScreen
        transitionProps={{ transition: "fade", duration: 200 }}
        closeButtonProps={{
          style: {
            width: 30,
            height: 30,
          },
          iconSize: 20,
        }}
      >
        <div className="relative mt-4 flex justify-between md:flex-row flex-col max-w-[1080px] mx-auto">
          <div className="w-full md:w-[300px] md:fixed z-40 top-[100px]">
            <Checkbox
              label="Download itemized quote for client"
              checked={includeClientInCalculation}
              onChange={(event) =>
                setIncludeResidentInCalculation(event.currentTarget.checked)
              }
              onClick={() => {
                Mixpanel.track("User selected itemized quote");
              }}
            ></Checkbox>

            <Checkbox
              label="Download summary quote for client"
              mt={12}
              mb={8}
              checked={summarizedCalculation}
              onChange={(event) =>
                setSummarizedCalculation(event.currentTarget.checked)
              }
              onClick={() => {
                Mixpanel.track("User selected summarized quote");
              }}
            ></Checkbox>

            <Divider my="xs" label="STYLE" labelPosition="center" />

            <FileInput
              label="Your logo"
              placeholder="Select one image"
              accept="image/png, image/jpeg, image/jpg"
              name="files"
              icon={<IconUpload size={rem(14)} />}
              onChange={(payload: File) => {
                setFiles(payload);
              }}
              required
              clearable
            />
          </div>

          <div className="w-full md:w-[65%] lg:w-[75%] md:pl-12 flex md:absolute right-0 flex-col gap-5">
            {!sumOfResidentCommission &&
              !sumOfNonResidentCommission &&
              (includeClientInCalculation || summarizedCalculation) && (
                <Alert icon={<IconAlertCircle size="1rem" />} color="yellow">
                  No commission has been added yet.
                </Alert>
              )}

            <Button
              onClick={() => {
                handlePrint();
                Mixpanel.track("User printed quotation!!!");
              }}
              pos={"absolute"}
              right={0}
              top={30}
              color="red"
              className="hidden md:block"
            >
              Print Quotation
            </Button>
            <div className="mb-12" ref={componentRef}>
              <div className="flex mt-4 items-center justify-center">
                <div className="flex items-center gap-2">
                  {files && (
                    <Image
                      src={files ? URL.createObjectURL(files) : ""}
                      alt="logo"
                      className="object-contain"
                      width={120}
                      height={60}
                    />
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div></div>
                <Button
                  onClick={() => {
                    handlePrint();
                    Mixpanel.track("User printed quotation!!!");
                  }}
                  color="red"
                  className="md:hidden"
                >
                  Print Quotation
                </Button>
              </div>

              {state.map((item, index) => (
                <div key={index} className="w-full">
                  <PrintSummary
                    stays={stays}
                    calculateStay={item}
                    updateTotals={updateTotals}
                    includeClientInCalculation={includeClientInCalculation}
                    summarizedCalculation={summarizedCalculation}
                    agentRates={agents}
                  ></PrintSummary>
                </div>
              ))}

              <Divider></Divider>

              <div className="flex flex-col gap-2 mt-4">
                {!!totalNonResidentSum && (
                  <div className="flex items-center justify-between">
                    <Text className="text-black text-base font-bold">
                      Grand Non-resident Total
                    </Text>
                    <Text size="lg" weight={700}>
                      {totalNonResidentSum
                        ? `$ ${totalNonResidentSum.toLocaleString(undefined, {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 2,
                          })}`
                        : ""}
                    </Text>
                  </div>
                )}
                {!!totalResidentSum && (
                  <div className="flex items-center justify-between">
                    <Text className="text-black text-base font-bold">
                      Grand Resident Total
                    </Text>
                    <Text size="lg" weight={700}>
                      {totalResidentSum
                        ? `KES ${totalResidentSum.toLocaleString(undefined, {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 2,
                          })}`
                        : ""}
                    </Text>
                  </div>
                )}
              </div>
            </div>

            <Button
              onClick={() => {
                handlePrint();
                Mixpanel.track("User printed quotation!!!");
              }}
              mt={12}
              pos={"absolute"}
              right={0}
              bottom={4}
              color="red"
            >
              Print Quotation
            </Button>
          </div>
        </div>
        {/* <Checkbox
                  label="Download calculation for client"
                  checked={includeClientInCalculation}
                  onChange={(event) =>
                    setIncludeResidentInCalculation(event.currentTarget.checked)
                  }
                ></Checkbox>

                <Checkbox
                  label="Don't include price for each section"
                  mt={12}
                  mb={8}
                  checked={summarizedCalculation}
                  onChange={(event) =>
                    setSummarizedCalculation(event.currentTarget.checked)
                  }
                ></Checkbox> */}

        {/* <Flex mt={6} justify="space-between" align="center">
                  <Text
                    onClick={() => {
                      close();
                    }}
                    size="sm"
                    color="blue"
                    className="hover:underline cursor-pointer"
                  >
                    Cancel
                  </Text>

                  <Button
                    onClick={() => {
                      handleDownloadPdf();
                    }}
                    color="red"
                  >
                    Download now
                  </Button>
                </Flex> */}
      </Modal>

      {isStayLoading && (
        <div className="absolute top-[50%] left-[50%] -translate-x-2/4">
          <Loader color="red" />
        </div>
      )}
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
          destination: `/signin?redirect=/partner/agent`,
          permanent: false,
        },
      };
    }

    const currentSession = await Auth.currentSession();
    const accessToken = currentSession.getAccessToken();
    const ssrToken = accessToken.getJwtToken();

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
