import Image from "next/image";
import Link from "next/link";
import UserDropdown from "../Homepage/UserDropdown";
import { UserTypes } from "@/utils/types";
import { Input, Tooltip } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";

type NavbarProps = { user?: UserTypes | null };

export default function Navbar({ user }: NavbarProps) {
  return (
    <div className="flex items-center border-b justify-between sm:px-8 px-6 md:px-6 lg:px-12 h-[80px]">
      <Link href="/">
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
          ></Image>
        </div>
      </Link>

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
          rightSection={
            <div className="w-[30px] h-[30px] flex items-center justify-center rounded-full bg-red-500">
              <IconSearch size="1rem" className="text-white" />
            </div>
          }
        />
      </div>

      <UserDropdown user={user}></UserDropdown>
    </div>
  );
}
