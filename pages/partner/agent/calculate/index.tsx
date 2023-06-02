import getToken from "@/utils/getToken";
import { GetServerSideProps } from "next";
import { UserTypes } from "@/utils/types";
import { getUser } from "@/pages/api/user";
import { AxiosError } from "axios";
import {
  dehydrate,
  QueryClient,
  useQuery,
  QueryClientProvider,
} from "react-query";
import Cookies from "js-cookie";
import Navbar from "@/components/Agent/Navbar";
import { useContext, useEffect, useRef, useState } from "react";
import { Stay } from "@/utils/types";
import { getPartnerStays } from "@/pages/api/stays";
import { useRouter } from "next/router";
import {
  Button,
  Checkbox,
  Divider,
  Flex,
  Loader,
  Modal,
  NavLink,
  Popover,
  Tabs,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { Context } from "@/context/CalculatePage";
import { StateType, Room } from "@/context/CalculatePage";
import { Stay as CalculateStay } from "@/components/Agent/Calculate/Stay";
import { v4 as uuidv4 } from "uuid";
import { IconCalculator, IconDownload, IconGraph } from "@tabler/icons-react";
import Summary from "@/components/Agent/Calculate/Summary";

import {
  PDFDownloadLink,
  Document,
  pdf,
  PDFViewer,
  Page,
  Text as PdfText,
} from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import MyDocument from "@/components/Agent/Document";
import { useDisclosure } from "@mantine/hooks";

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
    const ids = localStorage.getItem("itemIds");
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

  const [totalResident, setTotalResident] = useState<number>(0);
  const [totalResidentPriceList, setTotalResidentPriceList] = useState<
    number[]
  >([]);

  const updateResidentTotal = (value: number, index: number) => {
    totalResidentPriceList[index] = value;
  };

  useEffect(() => {
    const total = totalResidentPriceList.reduce((a, b) => a + b, 0);
    setTotalResident(total);
  }, [totalResidentPriceList]);

  const [totalNonResident, setTotalNonResident] = useState<number>(0);
  const [totalNonResidentPriceList, setTotalNonResidentPriceList] = useState<
    number[]
  >([]);

  const updateNonResidentTotal = (value: number, index: number) => {
    totalNonResidentPriceList[index] = value;
  };

  useEffect(() => {
    const total = totalNonResidentPriceList.reduce((a, b) => a + b, 0);
    setTotalNonResident(total);
  }, [totalNonResidentPriceList]);

  const handleDownloadPdf = async () => {
    try {
      const fileName = "calculation.pdf";
      const blob = await pdf(
        <QueryClientProvider client={queryClient}>
          <Document>
            {state.map((item, index) => (
              <MyDocument
                key={index}
                includeClientInCalculation={includeClientInCalculation}
                summarizedCalculation={summarizedCalculation}
                calculateStay={item}
                stays={stays}
                index={index}
                updateResidentTotal={updateResidentTotal}
                updateNonResidentTotal={updateNonResidentTotal}
              ></MyDocument>
            ))}
          </Document>
        </QueryClientProvider>
      ).toBlob();
      saveAs(blob, fileName);
    } catch (error) {
      // console.error("Error generating PDF document", error);
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

                <Tabs.Panel value="summary" pt="xs">
                  <PDFViewer width="100%" height="1000px">
                    <QueryClientProvider client={queryClient}>
                      <Document>
                        {state.map((item, index) => (
                          <MyDocument
                            key={index}
                            includeClientInCalculation={
                              includeClientInCalculation
                            }
                            summarizedCalculation={summarizedCalculation}
                            calculateStay={item}
                            stays={stays}
                            index={index}
                            updateResidentTotal={updateResidentTotal}
                            updateNonResidentTotal={updateNonResidentTotal}
                          ></MyDocument>
                        ))}
                      </Document>
                    </QueryClientProvider>
                  </PDFViewer>
                </Tabs.Panel>
              </div>

              <Modal
                opened={opened}
                onClose={close}
                title="Download PDF"
                overlayProps={{
                  color:
                    theme.colorScheme === "dark"
                      ? theme.colors.dark[9]
                      : theme.colors.gray[2],
                  opacity: 0.55,
                  blur: 3,
                }}
              >
                <Checkbox
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
                ></Checkbox>

                <Flex mt={6} justify="space-between" align="center">
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
                </Flex>
              </Modal>
              <div className="w-[30%] right-6 md:right-12 fixed top-[100px]">
                <div className="flex justify-between px-4 items-center gap-4">
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
                        <span>Your calculation</span>
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
                </div>
                <div className="overflow-y-scroll h-[450px] mt-4 flex flex-col gap-4 shadow-lg border border-solid border-gray-100 rounded-xl">
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
