import Navbar from "@/components/Homepage/Navbar";
import Amenities from "@/components/Stay/Amenities";
import { ImageGallery } from "@/components/Stay/ImageGallery";
import { ScrollTo } from "@/components/Stay/ScrollTo";
import ListItem from "@/components/ui/ListItem";
import PopoverBox from "@/components/ui/Popover";
import { getStayDetail } from "@/pages/api/stays";
import { getUser } from "@/pages/api/user";
import getToken from "@/utils/getToken";
import { Stay, UserTypes, OtherPackages } from "@/utils/types";
import { Icon } from "@iconify/react";
import { AxiosError } from "axios";
import Cookies from "js-cookie";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { dehydrate, QueryClient, useQuery } from "react-query";
import { Element } from "react-scroll";
import { DateRange } from "react-day-picker";
import DatePickerRange from "@/components/ui/DatePickerRange";
import moment from "moment";
import Button from "@/components/ui/Button";
import Carousel from "@/components/ui/Carousel";
import Package from "@/components/Stay/Package";
import Link from "next/link";
import Map from "@/components/Stay/Map";
import Price from "@/components/ui/Price";
import Image from "next/image";
import Book from "@/components/Stay/Book";

export default function StayDetail() {
  const router = useRouter();

  const startingDateStr = router.query.starting_date;

  // Check if starting_date is a valid date
  const startingDate = moment(startingDateStr, "YYYY-MM-DD", true);
  const isStartingDateValid = startingDate.isValid();

  // Get the end_date from router.query
  const endDateStr = router.query.end_date;

  // Check if end_date is a valid date
  const endDate = moment(endDateStr, "YYYY-MM-DD", true);
  const isEndDateValid = endDate.isValid();

  // Define the default start date as the current date
  let startDate = moment();

  // If starting_date is valid, use it as the start date
  if (isStartingDateValid) {
    startDate = startingDate;
  }

  // Calculate the default end date as start date + 1 days
  let endingDate = startDate.clone().add(1, "days");

  // If end_date is valid, use it as the end date
  if (isEndDateValid) {
    endingDate = endDate;
  } else if (isStartingDateValid) {
    // Otherwise, if starting_date is valid but end_date is not, use the default end date
    endingDate = startDate.clone().add(1, "days");
  }

  const numberOfNights = endingDate.diff(startDate, "days");

  const token = Cookies.get("token");

  const [showAllImages, setShowAllImages] = useState(false);

  const [showShare, setShowShare] = useState(false);

  const { data: stay } = useQuery<Stay>("stay", () =>
    getStayDetail(router.query.slug as string)
  );

  const { data: user } = useQuery<UserTypes | null>("user", () =>
    getUser(token)
  );

  const images = stay?.stay_images.sort(
    (x, y) => Number(y.main) - Number(x.main)
  );

  const arrImages = images?.map((image) => {
    return image.image;
  });

  const [showAllDescription, setShowAllDescription] = useState(false);

  const [showAllUniqueFeature, setShowAllUniqueFeature] = useState(false);

  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const getFullBoardPackageImage = () => {
    const sortedImages = stay?.private_safari
      ? stay.private_safari.private_safari_images.sort(
          (x, y) => Number(y.main) - Number(x.main)
        )
      : [];

    const images = sortedImages.map((image) => {
      return image.image;
    });
    return images;
  };

  const getGamePackageImages = () => {
    const sortedImages = stay?.shared_safari
      ? stay.shared_safari.shared_safari_images.sort(
          (x, y) => Number(y.main) - Number(x.main)
        )
      : [];

    const images = sortedImages.map((image) => {
      return image.image;
    });
    return images;
  };

  const getAllInclusiveImages = () => {
    const sortedImages = stay?.all_inclusive
      ? stay.all_inclusive.all_inclusive_images.sort(
          (x, y) => Number(y.main) - Number(x.main)
        )
      : [];

    const images = sortedImages.map((image) => {
      return image.image;
    });
    return images;
  };

  const packageBtnClicked = (option: number) => {
    router.push({
      query: {
        ...router.query,
        adults: Number(router.query.adults) || 1,
        rooms: Number(router.query.rooms) || 1,
        starting_date: moment(startDate).format("YYYY-MM-DD"),
        end_date: moment(endingDate).format("YYYY-MM-DD"),
        checkout_page: 1,
        option: option,
      },
    });
  };

  const otherOptionPackageBtnClicked = (option: number, index: number) => {
    router.push({
      query: {
        ...router.query,
        adults: Number(router.query.adults) || 1,
        rooms: Number(router.query.rooms) || 1,
        starting_date: moment(startDate).format("YYYY-MM-DD"),
        end_date: moment(endingDate).format("YYYY-MM-DD"),
        checkout_page: 1,
        option: option,
        other_option: index,
      },
    });
  };

  const getOtherOptionImages = (option: OtherPackages) => {
    const sortedImages = option
      ? option.other_option_images.sort(
          (x, y) => Number(y.main) - Number(x.main)
        )
      : [];

    const images = sortedImages.map((image) => {
      return image.image;
    });
    return images;
  };

  const checkAvailability = () => {
    if (dateRange?.from && dateRange.to) {
      router.replace(
        {
          query: {
            ...router.query,
            starting_date: moment(dateRange?.from).format("YYYY-MM-DD"),
            end_date: moment(dateRange?.to).format("YYYY-MM-DD"),
          },
        },
        undefined,
        { scroll: false }
      );
    }
  };

  const getOptionPrice =
    router.query.option === "1"
      ? stay?.private_safari.price
      : router.query.option === "2"
      ? stay?.shared_safari.price
      : router.query.option === "3"
      ? stay?.all_inclusive.price
      : router.query.option === "4"
      ? stay?.other_options[Number(router.query.other_option)].price
      : 0;

  const getOptionImage =
    router.query.option === "1"
      ? getFullBoardPackageImage()[0]
      : router.query.option === "2"
      ? getGamePackageImages()[0]
      : router.query.option === "3"
      ? getAllInclusiveImages()[0]
      : router.query.option === "4" && stay
      ? getOtherOptionImages(
          stay?.other_options[Number(router.query.other_option)]
        )[0]
      : arrImages && arrImages[0];

  return (
    <div>
      <Head>
        <title>{stay?.name || stay?.property_name}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <div className="bg-white sticky top-0 left-0 right-0 z-20">
        <Navbar user={user}></Navbar>
      </div>

      {router.query.checkout_page !== "1" && (
        <div className="relative">
          <div className={"mt-4 px-3"}>
            <div className="text-sm text-gray-700 font-medium flex items-center">
              <div>
                <div className="inline transition-colors duration-200 ease-in-out">
                  {stay?.location}, {stay?.country}
                </div>{" "}
              </div>
            </div>
            <div className="text-xl font-black">
              {stay?.name || stay?.property_name}
            </div>
          </div>

          <div className="relative">
            <div>
              <ImageGallery
                images={arrImages}
                name={stay?.property_name || stay?.name}
              ></ImageGallery>
            </div>

            <div
              onClick={() => {
                setShowShare(true);
              }}
              className="p-2.5 flex items-center justify-center rounded-full bg-white absolute top-4 right-3"
            >
              <Icon className="w-6 h-6" icon="material-symbols:ios-share" />
            </div>

            <div
              onClick={() => {
                setShowAllImages(true);
              }}
              className="px-2 cursor-pointer text-sm font-bold absolute bottom-4 rounded-lg right-3 z-10 py-1.5 bg-white flex items-center justify-center gap-1"
            >
              <Icon className="w-6 h-6" icon="gg:menu-grid-o" />
              <h1>Show all photos</h1>
            </div>
          </div>

          <div className="h-[60px] bg-white sticky z-20 top-[70px] left-0 right-0 border-b border-gray-200 w-[100%] px-3 lg:px-10">
            <ScrollTo stay={stay}></ScrollTo>
          </div>

          <Element className="" name="about">
            <div className="flex bg-[#edede9]">
              <div className="flex flex-col w-full">
                <div className="text-gray-500 flex justify-between md:justify-start gap-4 md:gap-2 text-sm truncate flex-wrap">
                  {stay?.room_type && (
                    <div className="px-4 py-3 w-[45%] md:w-fit flex flex-col justify-center items-center md:gap-1">
                      <h1 className="font-bold text-base md:text-lg text-gray-800">
                        Type of room
                      </h1>
                      <div className="text-gray-600 capitalize">
                        {stay.room_type.toLowerCase()}
                      </div>
                    </div>
                  )}
                  {stay?.type_of_stay && (
                    <div className="px-4 border-gray-300 w-[45%] md:w-fit flex flex-col justify-center items-center md:gap-1">
                      <h1 className="font-bold text-base md:text-lg text-gray-800">
                        Type of stay
                      </h1>
                      <div className="text-gray-600 capitalize">
                        {stay.type_of_stay.toLowerCase()}
                      </div>
                    </div>
                  )}
                  {stay?.capacity && (
                    <div className="px-4 border-gray-300 w-[45%] md:w-fit flex flex-col justify-center items-center md:gap-1">
                      <h1 className="font-bold text-base md:text-lg text-gray-800">
                        Capacity
                      </h1>
                      <div className="text-gray-600">{stay.capacity} max</div>
                    </div>
                  )}
                  {stay?.rooms && (
                    <div className="px-4 border-gray-300 w-[45%] md:w-fit flex flex-col justify-center items-center md:gap-1">
                      <h1 className="font-bold text-base md:text-lg text-gray-800">
                        Rooms
                      </h1>
                      <div className="text-gray-600">{stay.rooms} rooms</div>
                    </div>
                  )}
                  {stay?.beds && (
                    <div className="px-4 border-gray-300 w-[45%] md:w-fit flex flex-col justify-center items-center md:gap-1">
                      <h1 className="font-bold text-base md:text-lg text-gray-800">
                        Beds
                      </h1>
                      <div className="text-gray-600">{stay.beds} bedrooms</div>
                    </div>
                  )}
                  {stay?.bathrooms && (
                    <div className="px-4 border-gray-300 w-[45%] md:w-fit flex flex-col justify-center items-center md:gap-1">
                      <h1 className="font-bold text-base md:text-lg text-gray-800">
                        Bathrooms
                      </h1>
                      <div className="text-gray-600">
                        {stay.bathrooms} baths
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 px-6">
              <p className="font-normal">
                {!showAllDescription && stay?.description?.slice(0, 500)}
                {!showAllDescription &&
                  stay?.description &&
                  stay?.description?.length > 500 &&
                  "..."}

                {!showAllDescription && (
                  <span
                    onClick={() => {
                      setShowAllDescription(true);
                    }}
                    className="text-blue-700 font-medium hover:underline cursor-pointer"
                  >
                    (show more)
                  </span>
                )}

                {showAllDescription && stay?.description}

                {showAllDescription && (
                  <span
                    onClick={() => {
                      setShowAllDescription(false);
                    }}
                    className="text-blue-700 font-medium hover:underline cursor-pointer"
                  >
                    (show less)
                  </span>
                )}
              </p>
            </div>

            {stay?.unique_about_place && (
              <div className="mt-6 px-6">
                <h1 className="font-black text-xl mb-4">
                  What makes this listing unique
                </h1>

                <p className="font-normal">
                  {!showAllUniqueFeature &&
                    stay?.unique_about_place?.slice(0, 500)}
                  {!showAllUniqueFeature &&
                    stay?.unique_about_place &&
                    stay?.unique_about_place?.length > 500 &&
                    "..."}

                  {!showAllUniqueFeature && (
                    <span
                      onClick={() => {
                        setShowAllUniqueFeature(true);
                      }}
                      className="text-blue-700 font-medium hover:underline cursor-pointer"
                    >
                      (show more)
                    </span>
                  )}

                  {showAllUniqueFeature && stay?.unique_about_place}

                  {showAllUniqueFeature && (
                    <span
                      onClick={() => {
                        setShowAllUniqueFeature(false);
                      }}
                      className="text-blue-700 font-medium hover:underline cursor-pointer"
                    >
                      (show less)
                    </span>
                  )}
                </p>
              </div>
            )}
          </Element>

          <Element name="activities" className={"flex flex-col pt-8 px-6"}>
            {stay && stay?.inclusions.length > 0 && (
              <div className="flex flex-col">
                <div className="mb-4">
                  <span className="font-black text-xl">
                    Included activities
                  </span>
                </div>

                <div className="flex gap-2 flex-wrap">
                  {stay.inclusions.map((inclusion, index) => (
                    <div key={index} className="w-full md:w-[48%]">
                      <ListItem>{inclusion.name}</ListItem>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {stay && stay?.extras_included.length > 0 && (
              <div className="flex flex-col mt-6">
                <div className="mb-4">
                  <span className="font-black text-xl">Extras</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {stay?.extras_included.map((activity, index) => (
                    <div key={index} className="w-[48%]">
                      <ListItem>{activity.name}</ListItem>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Element>

          <Element name="amenities" className={"flex flex-col pt-8 px-6"}>
            <div className="w-full">
              <div className="mb-4">
                <span className="font-black text-xl">Amenities</span>
              </div>

              <Amenities stay={stay}></Amenities>

              {stay && stay?.facts.length > 0 && (
                <div className="mt-4">
                  <div className="flex gap-2 flex-wrap">
                    {stay.facts.map((fact, index) => (
                      <div key={index} className="w-full md:w-[48%]">
                        <ListItem>{fact.name}</ListItem>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Element>

          {stay?.has_options && (
            <Element name="options" className="pt-8 px-6">
              <div className="flex flex-col gap-3">
                <h1 className="font-black text-xl">
                  Pick an option that suits you
                </h1>

                <div className="my-2 flex flex-wrap gap-3">
                  <div>
                    <PopoverBox
                      btnChildren={
                        <div className="border rounded-md cursor-pointer border-gray-600 flex items-center gap-2 px-2 py-[5px]">
                          <Icon icon="fontisto:date" className="w-6 h-6" />
                          <div className="flex flex-col">
                            <span className="text-sm font-bold self-start">
                              Select a date
                            </span>
                            <span className="text-gray-500 text-sm">
                              {dateRange?.from &&
                                dateRange?.to &&
                                moment(dateRange?.from).format("Do MMM") +
                                  " - " +
                                  moment(dateRange?.to).format("Do MMM")}

                              {!dateRange?.from && (
                                <span className="text-gray-500 text-sm">
                                  Select check-in date
                                </span>
                              )}

                              {dateRange?.from && !dateRange?.to && (
                                <span className="text-gray-500 text-sm">
                                  Select check-out date
                                </span>
                              )}
                            </span>
                          </div>
                        </div>
                      }
                      panelClassName="h-fit rounded-lg bg-white left-0 border shadow-lg mt-1 top-full"
                    >
                      <DatePickerRange
                        selected={dateRange}
                        onSelect={(date) => {
                          setDateRange(date);
                        }}
                        numberOfMonths={2}
                      ></DatePickerRange>
                    </PopoverBox>
                  </div>

                  <div
                    onClick={() => {
                      checkAvailability();
                    }}
                    className="px-3 flex py-[14px] cursor-pointer self-start items-center justify-center gradient-red w-fit text-white font-semibold rounded-md"
                  >
                    Check availability
                  </div>
                </div>

                <div className="flex flex-wrap w-full gap-6">
                  {stay.private_safari && (
                    <Package
                      images={getFullBoardPackageImage()}
                      price={
                        stay?.private_safari.price
                          ? stay?.private_safari.price
                          : 0
                      }
                      stayName={stay.name}
                      numberOfNights={numberOfNights}
                      title="Full Board Package"
                      about="accommodation and all meals"
                      onClick={() => {
                        packageBtnClicked(1);
                      }}
                    ></Package>
                  )}

                  {stay.shared_safari && (
                    <Package
                      images={getGamePackageImages()}
                      price={
                        stay?.shared_safari.price
                          ? stay?.shared_safari.price
                          : 0
                      }
                      numberOfNights={numberOfNights}
                      stayName={stay.name}
                      title="Game Package"
                      about="accommodation, all meals, and game drives"
                      onClick={() => {
                        packageBtnClicked(2);
                      }}
                    ></Package>
                  )}

                  {stay.all_inclusive && (
                    <Package
                      images={getAllInclusiveImages()}
                      price={
                        stay?.all_inclusive.price
                          ? stay?.all_inclusive.price
                          : 0
                      }
                      numberOfNights={numberOfNights}
                      stayName={stay.name}
                      title="All Inclusive"
                      about="accommodation, all meals, game drives, and drinks ie. sodas,
                      juice, tea coffee, and some alcoholic drinks"
                      onClick={() => {
                        packageBtnClicked(3);
                      }}
                    ></Package>
                  )}

                  {stay.other_options.map((option, index) => {
                    const images = getOtherOptionImages(option);
                    return (
                      <Package
                        key={index}
                        images={images}
                        numberOfNights={numberOfNights}
                        price={option.price ? option.price : 0}
                        stayName={stay.name}
                        title={option.title}
                        about={option.about}
                        onClick={() => {
                          otherOptionPackageBtnClicked(4, index);
                        }}
                      ></Package>
                    );
                  })}
                </div>
              </div>
            </Element>
          )}

          <Element name="policies" className={"w-full pt-8 pb-6 px-6"}>
            <h1 className="font-black text-xl">Policies</h1>

            <div className="mt-3">
              <div className="py-2 border-b border-gray-100">
                <span className="font-semibold">Cancellation Policy</span>
              </div>

              <div className="mt-2 flex flex-col gap-2">
                <ListItem>You should have CV-19 travel insurance</ListItem>
                <div className="flex">
                  <ListItem>See the full cancellation policy more </ListItem>
                  <Link href="/policies">
                    <div className="text-blue-500 underline inline ml-1">
                      {" "}
                      here
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <div className="py-2 border-b border-gray-100">
                <span className="font-semibold">Health and safety policy</span>
              </div>

              <div className="mt-2 flex gap-2">
                <ListItem>
                  This property is compliant with Winda.guide&apos;s CV-19
                  requirements. More{" "}
                </ListItem>
                <Link href="/safety">
                  <div className="text-blue-500 inline underline"> here</div>
                </Link>
              </div>
            </div>

            <div className="mt-4">
              <div className="py-2 border-b border-gray-100">
                <span className="font-semibold">Damage policy</span>
              </div>

              <div className="mt-2 flex flex-col gap-2">
                <ListItem>
                  The guest is liable for any damages caused by them during
                  their stay.
                </ListItem>
              </div>
            </div>
          </Element>
        </div>
      )}

      {router.query.checkout_page === "1" && (
        <div className="mt-4 max-w-[1080px] mx-auto">
          <div className="flex md:flex-row flex-col gap-4 px-4">
            <div className="md:w-[40%] md:px-2 md:h-[90vh] mt-0 md:sticky top-[80px]">
              <div
                onClick={() => {
                  router.back();
                }}
                className="flex gap-1 mb-3 font-bold cursor-pointer items-center text-black"
              >
                <Icon className="w-6 h-6" icon="bx:chevron-left" />
                <span>Back</span>
              </div>

              <div className="h-fit shadow-lg border px-4 py-4 w-full rounded-lg">
                <div className="flex h-28 gap-2">
                  <div className="relative h-full bg-gray-300 w-32 rounded-xl overflow-hidden">
                    {getOptionImage && (
                      <Image
                        fill
                        unoptimized={true}
                        className="object-cover"
                        src={getOptionImage}
                        alt="Main image of the order"
                        priority
                      ></Image>
                    )}
                  </div>

                  <div className="flex flex-col gap-1">
                    <h1 className="text-gray-600 text-xs uppercase">
                      {stay?.location}
                    </h1>
                    <h1 className="font-bold">
                      {stay?.name || stay?.property_name}
                    </h1>
                    <h1 className="text-sm">
                      {router.query.option === "1"
                        ? "Full Board Package"
                        : router.query.option === "2"
                        ? "Game Package"
                        : router.query.option === "3"
                        ? "All Inclusiv Package"
                        : router.query.option === "4"
                        ? stay?.other_options[Number(router.query.other_option)]
                            .title
                        : "Lodge"}
                    </h1>
                    <p className="mt-0.5 text-sm text-gray-600 flex items-center gap-1">
                      <Icon icon="akar-icons:clock" /> {numberOfNights} nights
                    </p>
                  </div>
                </div>
                <div className="h-[0.6px] w-full bg-gray-400 mt-3"></div>
                <h1 className="font-bold text-xl mt-3">Breakdown</h1>

                <div className="mt-3 flex flex-col items-center gap-4">
                  <div className="text-gray-600 flex items-center w-full justify-between">
                    <div className="flex gap-1.5 items-center w-[70%]">
                      Check-in
                    </div>

                    <div className="text-sm font-bold">
                      {moment(startDate).format("DD MMM YYYY")}
                    </div>
                  </div>

                  <div className="text-gray-600 flex items-center w-full justify-between">
                    <div className="flex gap-1.5 items-center w-[70%]">
                      Check-out
                    </div>

                    <div className="text-sm font-bold">
                      {moment(endingDate).format("DD MMM YYYY")}
                    </div>
                  </div>

                  <div className="h-[0.4px] w-[100%] bg-gray-400"></div>

                  <div className="flex flex-col gap-3 justify-between w-full items-center">
                    <div className="text-gray-600 flex items-center w-full justify-between">
                      <div className="flex gap-1.5 text-sm items-center w-[70%]">
                        Price per night
                      </div>

                      <div className="text-sm font-bold">
                        {getOptionPrice ? (
                          <Price
                            price={getOptionPrice}
                            className="!text-sm !text-gray-600"
                          ></Price>
                        ) : (
                          "No data"
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="h-[0.4px] w-[100%] bg-gray-400"></div>

                  <div className="text-gray-600 flex items-center w-full justify-between">
                    <div className="flex gap-1.5 items-center">Total price</div>

                    {getOptionPrice ? (
                      <Price
                        price={getOptionPrice * numberOfNights}
                        className="!text-gray-600 !text-base"
                      ></Price>
                    ) : (
                      "No data"
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="md:w-[60%] w-full md:pl-4">
              <div className="h-[0.4px] w-[100%] my-4 bg-gray-400 md:hidden"></div>

              <h1 className="font-bold text-xl mb-4">Your details</h1>

              <div className="my-4">
                <Book
                  handleSubmit={(values) => {}}
                  price={getOptionPrice}
                  nights={numberOfNights}
                ></Book>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const queryClient = new QueryClient();

  const token = getToken(context);

  try {
    await queryClient.fetchQuery<Stay>("stay", () =>
      getStayDetail(context.query.slug as string)
    );

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
