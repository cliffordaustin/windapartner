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
import { Button, Divider, Tabs, Text } from "@mantine/core";
import { Context } from "@/context/CalculatePage";
import { StateType, Room } from "@/context/CalculatePage";
import { Stay as CalculateStay } from "@/components/Agent/Calculate/Stay";
import { v4 as uuidv4 } from "uuid";
import { IconCalculator } from "@tabler/icons-react";
import Summary from "@/components/Agent/Calculate/Summary";
import PdfSummary from "@/components/Agent/PdfSummary";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function Calculate() {
  const token = Cookies.get("token");
  const router = useRouter();

  const { data: user } = useQuery<UserTypes | null>("user", () =>
    getUser(token)
  );

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
                  description: "",
                },
              ],
              nonResidentGuests: [
                {
                  id: uuidv4(),
                  nonResident: "",
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

  const contentRef = useRef<HTMLDivElement>(null);

  const handleGeneratePdf = () => {
    if (contentRef.current) {
      html2canvas(contentRef.current, { scale: 4 }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save("calculation.pdf");
      });
    }
  };

  // const handleGeneratePdf = () => {
  //   if (contentRef.current) {
  //     const contentHeight = contentRef.current.clientHeight;
  //     const pageHeight = 900; // adjust this value as needed
  //     const pageCount = Math.ceil(contentHeight / pageHeight);
  //     let pdf: jsPDF | null = null;

  //     // Generate each page of the PDF document
  //     for (let i = 0; i < pageCount; i++) {
  //       const canvas = document.createElement("canvas");
  //       const canvasContext = canvas.getContext("2d");
  //       const contentOffset = i * pageHeight;
  //       canvas.width = contentRef.current.clientWidth;
  //       canvas.height = Math.min(pageHeight, contentHeight - contentOffset);
  //       canvasContext?.translate(0, -contentOffset);
  //       html2canvas(contentRef.current, {
  //         canvas: canvas,
  //         y: contentOffset,
  //       }).then((canvas) => {
  //         const imgData = canvas.toDataURL("image/png");
  //         if (!pdf) {
  //           pdf = new jsPDF("p", "pt", [canvas.width, canvas.height]);
  //         } else {
  //           pdf.addPage();
  //         }
  //         pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
  //         if (i === pageCount - 1) {
  //           pdf.save("calculation.pdf");
  //         }
  //       });
  //     }
  //   }
  // };

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

  return (
    <div>
      <div className="border-b sticky top-0 z-10 bg-white left-0 right-0 border-x-0 border-t-0 border-solid border-b-gray-200">
        <Navbar user={user}></Navbar>
      </div>
      <div className="md:px-12 relative max-w-[1440px] mx-auto px-6 mt-4">
        {stays && (
          <Tabs
            color="red"
            defaultValue={stays?.length > 0 ? stays[0].slug : ""}
            className="w-[64%]"
          >
            <Tabs.List>
              {stays?.map((stay, index) => (
                <Tabs.Tab value={stay.slug} key={index}>
                  {stay.property_name}
                </Tabs.Tab>
              ))}

              <Tabs.Tab value="summary">
                <div className="flex items-center">
                  <IconCalculator size={20} className="mr-2" />
                  <Text>Summary</Text>
                </div>
              </Tabs.Tab>
            </Tabs.List>

            <div className="w-full mt-4 flex flex-col gap-4">
              {stays?.map((stay, index) => (
                <Tabs.Panel key={index} value={stay.slug} pt="xs">
                  <CalculateStay stay={stay} index={index}></CalculateStay>
                </Tabs.Panel>
              ))}

              <Tabs.Panel value="summary" pt="xs">
                <div ref={contentRef}>
                  {state.map((item, index) => (
                    <PdfSummary
                      calculateStay={item}
                      stays={stays}
                      key={index}
                      index={index}
                      updateResidentTotal={updateResidentTotal}
                      updateNonResidentTotal={updateNonResidentTotal}
                    ></PdfSummary>
                  ))}

                  <Divider mb="xs" label="SUM TOTAL" labelPosition="center" />

                  {totalResident && (
                    <div className="flex items-center justify-between mt-2 w-full bg-white border-x-transparent border-t-transparent border-b-gray-200 border-solid py-2">
                      <Text className="font-serif font-bold text-sm">
                        RESIDENT TOTAL
                      </Text>

                      <Text size="md" className="font-sans" weight={700}>
                        {totalResident
                          ? `KES ${totalResident.toLocaleString()}`
                          : ""}{" "}
                      </Text>
                    </div>
                  )}

                  {totalNonResident && (
                    <div className="flex items-center justify-between w-full bg-white py-2">
                      <Text className="font-serif font-bold text-sm">
                        NON-RESIDENT TOTAL
                      </Text>

                      <Text size="md" className="font-sans" weight={700}>
                        {totalNonResident
                          ? `$ ${totalNonResident.toLocaleString()}`
                          : ""}{" "}
                      </Text>
                    </div>
                  )}
                </div>

                <Button onClick={handleGeneratePdf}>Generate PDF</Button>
              </Tabs.Panel>
            </div>

            <div className="w-[30%] overflow-y-scroll h-[500px] flex flex-col gap-4 shadow-lg border border-solid border-gray-100 rounded-xl right-6 md:right-12 fixed top-[100px]">
              {state.map((item, index) => (
                <Tabs.Panel key={index} value={item.slug} className="h-[500px]">
                  <Summary stays={stays} calculateStay={item}></Summary>
                </Tabs.Panel>
              ))}
            </div>
          </Tabs>
        )}
      </div>
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
