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
  showAddProperty?: boolean;
  includeDateSearch?: boolean;
  date?: [Date | null, Date | null];
  setDate?: (date: [Date | null, Date | null]) => void;
  openModal?: () => void;
  navBarLogoLink?: string;
};

export default function Navbar({
  user,
  calculatePage = false,
  includeSearch = true,
  showAddProperty = false,
  includeDateSearch = false,
  date,
  setDate,
  openModal,
  navBarLogoLink = "/partner/agent",
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
          search: location,
        },
      });
      return;
    } else {
      router.push({
        query: {
          search: location,
        },
      });
    }
  };
  return (
    <div className="flex items-center border-b justify-between sm:px-8 px-6 md:px-6 lg:px-12 h-[80px]">
      <Link href={navBarLogoLink}>
        <div className="relative w-28 h-9 cursor-pointer">
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
      </Link>

      {includeSearch && (
        <div className="px-3 w-[370px] flex items-center shadow-md h-[50px] rounded-3xl">
          <Input
            icon={<IconSearch size="1rem" className="text-gray-500" />}
            placeholder="Search a location"
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
        {showAddProperty && (
          <Button color="red" onClick={openModal}>
            Add your property
          </Button>
        )}
        <UserDropdown user={user}></UserDropdown>
      </div>
    </div>
  );
}
