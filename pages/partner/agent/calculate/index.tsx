import getToken from "@/utils/getToken";
import { GetServerSideProps } from "next";
import { UserTypes } from "@/utils/types";
import { getUser } from "@/pages/api/user";
import { AxiosError } from "axios";
import { dehydrate, QueryClient, useQuery } from "react-query";
import Cookies from "js-cookie";
import Navbar from "@/components/Agent/Navbar";
import { useContext, useEffect, useRef, useState } from "react";
import { Stay } from "@/utils/types";
import { getPartnerStays } from "@/pages/api/stays";
import { useRouter } from "next/router";
import {
  Alert,
  Anchor,
  Button,
  Checkbox,
  Divider,
  FileInput,
  Flex,
  Loader,
  Modal,
  rem,
  Select,
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
  IconGraph,
  IconUpload,
} from "@tabler/icons-react";
import Summary from "@/components/Agent/Calculate/Summary";
import { useReactToPrint } from "react-to-print";

import { saveAs } from "file-saver";
import { useDisclosure } from "@mantine/hooks";
import PrintSummary from "@/components/Agent/Calculate/PrintSummary";
import Image from "next/image";

export default function Calculate() {
  const token = Cookies.get("token");
  const router = useRouter();

  const [includeClientInCalculation, setIncludeResidentInCalculation] =
    useState(false);

  const [summarizedCalculation, setSummarizedCalculation] = useState(false);

  const { data: user } = useQuery<UserTypes | null>("user", () =>
    getUser(token)
  );

  const [queryClient] = useState(() => new QueryClient());

  const [stayIds, setStayIds] = useState<string | undefined>("");

  const { state, setState } = useContext(Context);

  useEffect(() => {
    const ids = localStorage.getItem("stayIds");
    const newIds = ids?.replace(/[\[\]']+/g, "");
    if (ids) {
      setStayIds(newIds);
    }
  }, []);

  const { data: stays, isLoading: isStayLoading } = useQuery<Stay[]>(
    "partner-stay-ids",
    () => getPartnerStays(router.query.location as string, stayIds),
    { enabled: !!stayIds }
  );

  useEffect(() => {
    if (stays && state.length === 0) {
      const items: StateType[] = Array.from(
        { length: stays.length },
        (_, i) => ({
          id: stays[i].id,
          slug: stays[i].slug,
          date: [null, null],
          name: stays[i].property_name || stays[i].name,
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
        })
      );
      setState(items);
    }
  }, [stays, setState]);

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

  return (
    <div>
      <div className="border-b sticky top-0 z-10 bg-white left-0 right-0 border-x-0 border-t-0 border-solid border-b-gray-200">
        <Navbar calculatePage={true} user={user}></Navbar>
      </div>

      {!isStayLoading && (
        <div className="md:px-12 relative max-w-[1440px] mx-auto px-6 mt-4">
          {stays && (
            <Tabs
              color="red"
              defaultValue={stays?.length > 0 ? stays[0].slug : ""}
              className="w-[64%] mb-4"
            >
              <Tabs.List>
                {stays?.map((stay, index) => (
                  <Tabs.Tab value={stay.slug} key={index}>
                    {stay.property_name}
                  </Tabs.Tab>
                ))}

                {/* <Tabs.Tab value="summary">Summary</Tabs.Tab> */}
              </Tabs.List>

              <div className="w-full mt-4 flex flex-col gap-4">
                {stays?.map((stay, index) => (
                  <Tabs.Panel key={index} value={stay.slug} pt="xs">
                    <CalculateStay stay={stay} index={index}></CalculateStay>
                  </Tabs.Panel>
                ))}
              </div>

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
                    ></Checkbox>

                    <Checkbox
                      label="Download summary quote for client"
                      mt={12}
                      mb={8}
                      checked={summarizedCalculation}
                      onChange={(event) =>
                        setSummarizedCalculation(event.currentTarget.checked)
                      }
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
                          ></PrintSummary>
                        </div>
                      ))}

                      <Divider></Divider>

                      <div className="px-4 flex flex-col gap-2 mt-4">
                        {totalNonResidentSum && (
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
                        {totalResidentSum && (
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
                      <Summary stays={stays} calculateStay={item}></Summary>
                    </Tabs.Panel>
                  ))}
                </div>

                <Flex mt={18} className="w-full" gap={10}>
                  <Button
                    onClick={open}
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const queryClient = new QueryClient();

  const token = getToken(context);

  try {
    await queryClient.fetchQuery<UserTypes | null>("user", () =>
      getUser(token)
    );

    return {
      props: {
        dehydratedState: dehydrate(queryClient),
      },
    };
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 401) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }
    return {
      props: {},
    };
  }
};
