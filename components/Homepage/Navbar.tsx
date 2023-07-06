import Image from "next/image";
import Link from "next/link";
import UserDropdown from "./UserDropdown";
import { Link as ScrollLink } from "react-scroll";
import { UserTypes } from "@/utils/types";
import { Button, Text } from "@mantine/core";

type NavbarProps = { showJoinNowBtn?: boolean; user?: UserTypes | null };

const linkClassNames =
  "font-semibold mr-2 transition-all duration-300 cursor-pointer ease-linear rounded-3xl py-2 !text-base flex items-center gap-1";

function Navbar({ user, showJoinNowBtn = false }: NavbarProps) {
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
          ></Image>
        </div>
      </Link>

      <div className="flex items-center">
        <div className="flex items-center gap-4 mr-4">
          <Link className="no-underline text-black" href="/about-us">
            <div className="hidden md:block">
              <Text className={linkClassNames}>About us</Text>
            </div>
          </Link>
        </div>

        {showJoinNowBtn && (
          <Button className="flex items-center gap-0.5 px-2 mr-4 lg:px-4 py-2 cursor-pointer gradient-red rounded-3xl">
            <span className="text-white text-xs uppercase font-bold">
              Join now
            </span>
          </Button>
        )}
        <UserDropdown user={user}></UserDropdown>
      </div>
    </div>
  );
}

export default Navbar;
