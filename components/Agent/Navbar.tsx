import Image from "next/image";
import Link from "next/link";
import UserDropdown from "../Homepage/UserDropdown";
import { UserTypes } from "@/utils/types";
import { Button, Container, Input, Tooltip } from "@mantine/core";
import {
  IconCalendar,
  IconSearch,
  IconSelector,
  IconX,
} from "@tabler/icons-react";
import { useState } from "react";
import { useRouter } from "next/router";
import { DatePickerInput } from "@mantine/dates";
import { Mixpanel } from "@/utils/mixpanelconfig";

type NavbarProps = {
  user?: UserTypes | null;
  calculatePage?: boolean;
  includeSearch?: boolean;
  propertyPage?: boolean;
  showAddProperty?: boolean;
  showGrantAccess?: boolean;
  includeDateSearch?: boolean;
  date?: [Date | null, Date | null];
  setDate?: (date: [Date | null, Date | null]) => void;
  openModal?: () => void;
  grantAccessModal?: () => void;
  navBarLogoLink?: string;
  navBarAccountLink?: string;
};

export default function Navbar({
  user,
  calculatePage = false,
  includeSearch = true,
  propertyPage = false,
  showAddProperty = false,
  showGrantAccess = false,
  includeDateSearch = false,
  date,
  setDate,
  openModal,
  grantAccessModal,
  navBarLogoLink = "/partner/agent",
  navBarAccountLink = "/account/agent",
}: NavbarProps) {
  const router = useRouter();
  const [location, setLocation] = useState(
    (router.query.search as string) || ""
  );
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      search();
    }
  };

  const search = () => {
    Mixpanel.track("User interated with the search bar", {
      search_term: location,
    });
    if (calculatePage) {
      router.push({
        pathname: "/partner/agent",
        query: {
          ...router.query,
          search: location,
        },
      });
      return;
    } else {
      router.push({
        query: {
          ...router.query,
          search: location,
        },
      });
    }
  };
  return (
    <div className="flex items-center gap-2 md:gap-0 border-b justify-between px-4 md:px-6 lg:px-12 h-[80px]">
      <Link href={navBarLogoLink}>
        <div className="relative w-24 h-8 md:w-28 hidden sm:block md:h-9 cursor-pointer">
          <Image
            alt="Winda logo"
            src="/images/winda_logo/horizontal-blue-font.png"
            className="w-full h-full"
            sizes="(max-width: 768px) 100vw,
              (max-width: 1200px) 50vw,
              33vw"
            fill
            priority
          />
        </div>
        <div className="relative w-7 h-10 md:w-28 md:h-9 sm:hidden cursor-pointer">
          <Image
            alt="Winda logo"
            src="/images/winda_logo/winda-logo.png"
            className="w-full h-full"
            sizes="(max-width: 768px) 100vw,
              (max-width: 1200px) 50vw,
              33vw"
            fill
            priority
          />
        </div>
      </Link>

      {includeSearch && (
        <div className="px-3 w-[300px] md:w-[370px] flex items-center shadow-md h-[50px] rounded-3xl">
          <Input
            icon={<IconSearch size="1rem" className="text-gray-500" />}
            placeholder="Search a location"
            className="w-full"
            w={350}
            styles={{
              input: {
                borderColor: "transparent",
                "&:focus": {
                  borderColor: "transparent",
                },
              },
            }}
            value={location}
            onChange={(event) => setLocation(event.currentTarget.value)}
            onKeyDown={handleKeyPress}
            rightSection={
              <div className="flex items-center gap-2">
                {router.query.search && location && (
                  <div
                    onClick={() => {
                      setLocation("");
                      router.push({
                        pathname: "/partner/agent",
                        query: {
                          ...router.query,
                          search: "",
                        },
                      });
                    }}
                    className="w-[15px] h-[15px] cursor-pointer flex items-center justify-center rounded-full bg-gray-800"
                  >
                    <IconX size="0.6rem" className="text-white" />
                  </div>
                )}
                <div
                  onClick={() => {
                    search();
                  }}
                  className="w-[30px] h-[30px] cursor-pointer flex items-center justify-center rounded-full bg-red-500"
                >
                  <IconSearch size="1rem" className="text-white" />
                </div>
              </div>
            }
          />
        </div>
      )}

      {includeDateSearch && date && setDate && (
        <DatePickerInput
          type="range"
          value={date}
          onChange={(date) => {
            setDate(date);
          }}
          color="red"
          placeholder="Select dates"
          styles={{ input: { paddingTop: 13, paddingBottom: 13 } }}
          labelProps={{ className: "font-semibold mb-1" }}
          rightSection={<IconSelector className="text-gray-500" />}
          className="w-[400px]"
          minDate={new Date()}
          icon={<IconCalendar className="text-gray-500" />}
          numberOfColumns={2}
          autoSave="true"
        />
      )}

      <div className="flex items-center gap-4">
        {propertyPage && (
          <Button
            variant="light"
            onClick={() => {
              router.push("/partner/agent");

              // localStorage.setItem(
              //   "lastPropertyDestinationPage",
              //   router.asPath
              // );

              // const lastAgentDestinationPage = localStorage.getItem(
              //   "lastAgentDestinationPage"
              // );

              // if (lastAgentDestinationPage) {
              //   router.push(lastAgentDestinationPage);
              // } else {
              //   router.push("/partner/agent");
              // }
            }}
            className="font-semibold hidden md:block hover:bg-gray-100 rounded-full bg-transparent text-black"
          >
            Switch to agent
          </Button>
        )}
        {!propertyPage && (
          <Button
            variant="light"
            onClick={() => {
              router.push("/partner/lodge");
              // localStorage.setItem("lastAgentDestinationPage", router.asPath);

              // const lastPropertyDestinationPage = localStorage.getItem(
              //   "lastPropertyDestinationPage"
              // );

              // if (lastPropertyDestinationPage) {
              //   router.push(lastPropertyDestinationPage);
              // } else {
              //   router.push("/partner/lodge");
              // }
            }}
            className="font-semibold hidden md:block hover:bg-gray-100 rounded-full bg-transparent text-black"
          >
            Switch to property
          </Button>
        )}
        {showAddProperty && (
          <Button
            variant="light"
            color="red"
            className="rounded-full"
            onClick={openModal}
          >
            Add your property
          </Button>
        )}

        {/* {showGrantAccess && (
          <Button className="bg-blue-600" onClick={grantAccessModal}>
            Grant access
          </Button>
        )} */}
        <UserDropdown
          navBarAccountLink={navBarAccountLink}
          propertyPage={propertyPage}
          user={user}
        ></UserDropdown>
      </div>
    </div>
  );
}
