import getToken from "@/utils/getToken";
import { GetServerSideProps } from "next";
import { UserTypes } from "@/utils/types";
import { getUser } from "@/pages/api/user";
import axios, { AxiosError } from "axios";
import { dehydrate, QueryClient, useMutation, useQuery } from "react-query";
import Cookies from "js-cookie";
import Navbar from "@/components/Agent/Navbar";
import { use, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Stay } from "@/utils/types";
import {
  AgentDiscountRateType,
  getAgentDiscountRates,
  getDetailPartnerStays,
} from "@/pages/api/stays";
import { useRouter } from "next/router";
import {
  ActionIcon,
  Alert,
  Anchor,
  Button,
  Checkbox,
  Divider,
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

export default function Calculate() {
  const [token, setToken] = useState("");

  useEffect(() => {
    Auth.currentSession().then((res) => {
      let accessToken = res.getAccessToken();
      let jwt = accessToken.getJwtToken();

      setToken(jwt);
    });
  }, []);

  const router = useRouter();

  const [includeClientInCalculation, setIncludeResidentInCalculation] =
    useState(false);

  const [summarizedCalculation, setSummarizedCalculation] = useState(false);

  const { data: user } = useQuery<UserTypes | null>(
    "user",
    () => getUser(token),
    { enabled: !!token }
  );

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
    () => getDetailPartnerStays(stayIds, token),
    { enabled: !!stayIds && !!token }
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

  const [applyForAllDates, setApplyForAllDates] = useState(false);

  const [sliderValue, setSliderValue] = useState(5);

  const [selectedTab, setSelectedTab] = useState<string | null>("");

  useEffect(() => {
    if (stays && stays.length > 0) {
      setSelectedTab(stays[0].slug);
    }
  }, [stays]);

  const { data: agents, refetch } = useQuery<AgentDiscountRateType[]>(
    "agent-discount-rates",
    () => getAgentDiscountRates(selectedTab, token),
    { enabled: false }
  );

  useEffect(() => {
    if (selectedTab) {
      refetch();
    }
  }, [selectedTab]);

  const addAgentRate = async () => {
    if (selectedTab) {
      await axios
        .post(
          `${process.env.NEXT_PUBLIC_baseURL}/stays/${selectedTab}/agent-discounts/`,
          {
            start_date: applyForAllDates
              ? null
              : format(date[0]!, "yyyy-MM-dd"),
            end_date: applyForAllDates ? null : format(date[1]!, "yyyy-MM-dd"),
            percentage: sliderValue,
          },
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

  const deleteAgentRate = async (id: number) => {
    if (selectedTab) {
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

  const [displayRackRates, setDisplayRackRates] = useState(false);

  return (
    <div>
      <div className="border-b sticky top-0 z-10 bg-white left-0 right-0 border-x-0 border-t-0 border-solid border-b-gray-200">
        <Navbar user={user} calculatePage={true}></Navbar>
      </div>

      {!isStayLoading && (
        <div className="md:px-12 relative max-w-[1440px] mx-auto px-6 mt-4">
          {stays && stays.length > 0 && (
            <Tabs
              color="red"
              defaultValue={stays[0].slug}
              className="w-[64%] mb-4"
              onTabChange={(value) => {
                setSelectedTab(value);
              }}
              keepMounted={false}
            >
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

              <div className="w-full mt-4 flex flex-col gap-4">
                {stays?.map((stay, index) => (
                  <Tabs.Panel key={index} value={stay.slug} pt="xs">
                    <Alert
                      icon={<IconAlertCircle size="1rem" />}
                      title="No discount added"
                      className="w-full mx-auto"
                      color="yellow"
                      // withCloseButton
                      onClose={() => {}}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <Text>No discount rate has been added yet.</Text>
                        <Button
                          onClick={() => {
                            openDiscountRateModalOpen();
                          }}
                          className="text-black"
                          variant="white"
                        >
                          Add discount rate
                        </Button>
                      </div>
                    </Alert>
                    <CalculateStay
                      agentRates={agents}
                      stay={stay}
                      index={index}
                    ></CalculateStay>
                  </Tabs.Panel>
                ))}
              </div>

              <Modal
                opened={discountRateModalOpened}
                onClose={closeDiscountRateModalOpen}
                title=""
                classNames={{
                  title: "text-xl font-semibold",
                  close: "text-black hover:text-gray-700 hover:bg-gray-200",
                }}
                fullScreen
                transitionProps={{ transition: "slide-up", duration: 200 }}
                closeButtonProps={{
                  style: {
                    width: 30,
                    height: 30,
                  },
                  iconSize: 20,
                }}
              >
                <div className="flex gap-6 mt-5">
                  <div className="w-[400px] border border-solid border-gray-200 px-4 bg-white rounded-xl py-4 shadow-round">
                    <div className="flex items-center justify-between">
                      <div></div>

                      <Switch
                        className=""
                        label="Display rack rates"
                        color="red"
                        checked={displayRackRates}
                        onChange={(event) =>
                          setDisplayRackRates(event.currentTarget.checked)
                        }
                      />
                    </div>
                    <Text className="font-bold text-xl">Discount Rates</Text>
                    <div className="flex justify-between mt-4">
                      <div></div>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-1">
                          <div className="w-[10px] h-[10px] bg-green-500"></div>
                          <Text size="sm">
                            Default rate given to you by a property
                          </Text>
                        </div>

                        <div className="flex items-center gap-1">
                          <div className="w-[10px] h-[10px] bg-blue-500"></div>
                          <Text size="sm">
                            Rates given to you on special occasions
                          </Text>
                        </div>
                      </div>
                    </div>
                    {/* <p>
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Excepturi eveniet illo id delectus qui molestias dolore,
                      dolor iusto cum! Laboriosam, id impedit? Exercitationem,
                      corrupti quae? Libero asperiores excepturi doloribus
                      corrupti?
                    </p> */}

                    <div className="flex flex-col gap-2 mt-4">
                      {/* <div className="w-full px-3 flex justify-between items-center py-3 rounded-lg bg-green-100 border border-solid border-green-400">
                        <div className="px-1 py-1 bg-green-300 w-fit">
                          <Text className="text-sm">Standard rate</Text>
                        </div>
                        <Text className="text-sm">10%</Text>
                      </div>

                      <div className="w-full px-3 flex justify-between items-center py-3 rounded-lg bg-blue-100 border border-solid border-blue-400">
                        <div className="px-1 py-1 bg-blue-300 w-fit">
                          <Text className="text-sm">2nd sep - 14th oct</Text>
                        </div>
                        <Text className="text-sm">14%</Text>
                      </div> */}

                      {agents?.map((agent) => (
                        <div className="w-full" key={agent.id}>
                          {!agent.start_date && !agent.end_date && (
                            <div className="w-full px-3 flex justify-between items-center py-3 rounded-lg bg-green-50 border border-solid border-green-400">
                              <div className="px-2 py-1 bg-white rounded-lg shadow-sm w-fit">
                                <Text className="text-sm font-medium">
                                  Nett rate
                                </Text>
                              </div>

                              <div className="flex items-center gap-2">
                                <Text className="text-sm medium">
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

                          {agent.start_date && agent.end_date && (
                            <div className="w-full px-3 flex justify-between items-center py-3 rounded-lg bg-blue-50 border border-solid border-blue-400">
                              <div className="px-2 py-1 bg-white rounded-lg shadow-sm w-fit">
                                <Text className="text-sm font-medium">
                                  {format(new Date(agent.start_date), "dd MMM")}{" "}
                                  - {format(new Date(agent.end_date), "dd MMM")}
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
                        </div>
                      ))}

                      {agents?.length === 0 && (
                        <Text className="text-sm my-4 text-center font-bold">
                          No discount rates added yet
                        </Text>
                      )}
                    </div>

                    <div className="mt-6 py-2 border-t border-solid border-b-0 border-x-0 border-gray-100">
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

                      <Checkbox
                        label="Apply across all dates"
                        className="mt-2"
                        color="red"
                        checked={applyForAllDates}
                        onChange={(event) => {
                          setApplyForAllDates(event.currentTarget.checked);
                        }}
                      ></Checkbox>

                      <Slider
                        value={sliderValue}
                        className="mt-4"
                        onChange={setSliderValue}
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
                    </div>
                  </div>
                  <div className="w-[calc(100%-400px)]">
                    <AgentPriceTable
                      agentRates={agents}
                      staySlug={selectedTab}
                      token={token}
                      displayRackRates={displayRackRates}
                    />
                  </div>
                </div>
              </Modal>

              <Modal
                opened={opened}
                onClose={close}
                title="Print Quotation"
                classNames={{
                  title: "text-xl font-semibold",
                  close: "text-black hover:text-gray-700 hover:bg-gray-200",
                  header: "bg-gray-100",
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
                <Flex
                  mt={6}
                  className="relative w-[1080px] mx-auto"
                  justify="space-between"
                >
                  <div className="w-[300px] fixed z-40 top-[75px]">
                    <Checkbox
                      label="Download itemized quote for client"
                      checked={includeClientInCalculation}
                      onChange={(event) =>
                        setIncludeResidentInCalculation(
                          event.currentTarget.checked
                        )
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

                    {/* <Select
                      label="Select a style"
                      placeholder="Pick one"
                      value={style}
                      mt={10}
                      onChange={(value) => setStyle(value)}
                      data={[
                        { value: "default", label: "Default" },
                        { value: "style1", label: "Style 1" },
                        { value: "style2", label: "Style 2" },
                        { value: "style3", label: "Style 3" },
                      ]}
                    /> */}
                  </div>

                  <div className="w-[75%] pl-12 absolute right-0 flex flex-col gap-5">
                    {!sumOfResidentCommission &&
                      !sumOfNonResidentCommission &&
                      (includeClientInCalculation || summarizedCalculation) && (
                        <Alert
                          icon={<IconAlertCircle size="1rem" />}
                          color="yellow"
                        >
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
                      top={50}
                      color="red"
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

                      {state.map((item, index) => (
                        <div key={index} className="w-full">
                          <PrintSummary
                            stays={stays}
                            calculateStay={item}
                            updateTotals={updateTotals}
                            includeClientInCalculation={
                              includeClientInCalculation
                            }
                            summarizedCalculation={summarizedCalculation}
                            agentRates={agents}
                            token={token}
                          ></PrintSummary>
                        </div>
                      ))}

                      <Divider></Divider>

                      <div className="px-4 flex flex-col gap-2 mt-4">
                        {!!totalNonResidentSum && (
                          <div className="flex items-center justify-between">
                            <Text className="text-black text-base font-bold">
                              Grand Non-resident Total
                            </Text>
                            <Text size="lg" weight={700}>
                              {totalNonResidentSum
                                ? `$ ${totalNonResidentSum.toLocaleString()}`
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
                                ? `KES ${totalResidentSum.toLocaleString()}`
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
                </Flex>
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
              <div className="w-[30%] right-6 md:right-12 fixed top-[90px]">
                {/* <div className="flex justify-between px-4 items-center gap-4">
                  <div></div>

                  <Popover width={200} position="bottom" withArrow shadow="md">
                    <Popover.Target>
                      <Button
                        variant="gradient"
                        gradient={{
                          from: "red",
                          to: "red",
                        }}
                        className="flex items-center gap-4"
                      >
                        <IconDownload></IconDownload>
                        <span>Download</span>
                      </Button>
                    </Popover.Target>
                    <Popover.Dropdown>
                      <Text
                        onClick={open}
                        className="hover:bg-gray-100 flex items-center gap-2 font-semibold p-2 rounded-md cursor-pointer"
                        size="sm"
                      >
                        <IconCalculator></IconCalculator>
                        <span>View Quotation</span>
                      </Text>
                      {stays.map((item, index) => (
                        <Tabs.Panel key={index} value={item.slug}>
                          {item.lodge_price_data_pdf && (
                            <Text
                              onClick={() => {
                                handleDownloadClick(
                                  item.lodge_price_data_pdf,
                                  item.property_name
                                );
                              }}
                              className="hover:bg-gray-100 flex items-center gap-2 p-2 rounded-md cursor-pointer"
                              size="sm"
                            >
                              <IconGraph></IconGraph>
                              <span>Lodge price data</span>
                            </Text>
                          )}
                        </Tabs.Panel>
                      ))}
                    </Popover.Dropdown>
                  </Popover>
                </div> */}

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
            </Tabs>
          )}
        </div>
      )}

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
          destination: `/signin?redirect=/partner/agent/calculate`,
          permanent: false,
        },
      };
    }
    const userSession = await Auth.currentSession();
    const token = userSession.getAccessToken().getJwtToken();

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
