import Image from "next/image";
import Link from "next/link";
import UserDropdown from "../Homepage/UserDropdown";
import { UserTypes } from "@/utils/types";
import { Button, Container, Input, Tooltip } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { useState } from "react";
import { useRouter } from "next/router";

type NavbarProps = {
  user?: UserTypes | null;
  calculatePage?: boolean;
  includeSearch?: boolean;
  showAddProperty?: boolean;
  openModal?: () => void;
};

export default function Navbar({
  user,
  calculatePage = false,
  includeSearch = true,
  showAddProperty = false,
  openModal,
}: NavbarProps) {
  const [location, setLocation] = useState("");
  const router = useRouter();
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      search();
    }
  };

  const search = () => {
    if (calculatePage) {
      router.push({
        pathname: "/partner/agent",
        query: {
          location: location,
        },
      });
      return;
    } else {
      router.push({
        query: {
          location: location,
        },
      });
    }
  };
  return (
    <div className="flex items-center border-b justify-between sm:px-8 px-6 md:px-6 lg:px-12 h-[80px]">
      <Link href="/partner/agent">
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
              <div
                onClick={() => {
                  search();
                }}
                className="w-[30px] h-[30px] cursor-pointer flex items-center justify-center rounded-full bg-red-500"
              >
                <IconSearch size="1rem" className="text-white" />
              </div>
            }
          />
        </div>
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
