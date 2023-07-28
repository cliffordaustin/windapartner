import { UserTypes } from "@/utils/types";
import { Popover, NavLink, Avatar, Divider, Text, Button } from "@mantine/core";
import {
  IconUserCheck,
  IconUserPlus,
  IconUser,
  IconLogout,
  IconNews,
  IconInfoCircle,
} from "@tabler/icons-react";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

type UserDropdownProps = {
  user?: UserTypes | null;
};

export default function UserDropdown({ user }: UserDropdownProps) {
  const fullName = (user?.first_name || "") + " " + (user?.last_name || "");
  const router = useRouter();
  return (
    <>
      <Popover width={250} position="bottom-end" withArrow shadow="md">
        <Popover.Target>
          <div className="flex items-center gap-1 px-1 py-1 rounded-3xl cursor-pointer">
            {!user && <Avatar color="red" radius="xl" />}
            {user && user.profile_pic && (
              <div className="relative w-9 h-9 rounded-full">
                <Avatar
                  radius="xl"
                  src={user?.profile_pic}
                  alt="profile image of a user"
                />
              </div>
            )}

            {user && !user.profile_pic && user.avatar_url && (
              <div className="relative w-9 h-9 rounded-full">
                <Avatar
                  radius="xl"
                  src={user.avatar_url}
                  alt="profile image of a user"
                />
              </div>
            )}

            {user && !user.profile_pic && !user.avatar_url && (
              <Avatar color="red" radius="xl">
                {fullName
                  .split(" ")
                  .map((name) => name[0])
                  .join("")
                  .toUpperCase()}
              </Avatar>
            )}

            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6 text-gray-500"
            >
              <path
                fillRule="evenodd"
                d="M11.47 4.72a.75.75 0 011.06 0l3.75 3.75a.75.75 0 01-1.06 1.06L12 6.31 8.78 9.53a.75.75 0 01-1.06-1.06l3.75-3.75zm-3.75 9.75a.75.75 0 011.06 0L12 17.69l3.22-3.22a.75.75 0 111.06 1.06l-3.75 3.75a.75.75 0 01-1.06 0l-3.75-3.75a.75.75 0 010-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </Popover.Target>
        <Popover.Dropdown className="px-3 py-2">
          {!user && (
            <>
              <NavLink
                label="Signup"
                component="a"
                href="/signup"
                icon={<IconUserPlus size="1rem" stroke={1.5} />}
              />
              <NavLink
                label="Login"
                component="a"
                href="/login"
                icon={<IconUserCheck size="1rem" stroke={1.5} />}
              />
            </>
          )}
          {!user && <Divider size="xs" />}
          {/* <NavLink
            label="About us"
            component="a"
            href="/about-us"
            icon={<IconInfoCircle size="1rem" stroke={1.5} />}
          />
          <NavLink
            label="Blogs"
            component="a"
            href="/blogs"
            icon={<IconNews size="1rem" stroke={1.5} />}
          /> */}

          {/* {user && <Divider size="xs" />} */}

          {user && (
            <NavLink
              label="Your account"
              component="a"
              href="/account"
              icon={<IconUser size="1rem" stroke={1.5} />}
            />
          )}

          {user && (
            <NavLink
              onClick={async () => {
                await axios.post(
                  `${process.env.NEXT_PUBLIC_baseURL}/rest-auth/logout/`,
                  "",
                  {
                    headers: {
                      Authorization: "Token " + Cookies.get("token"),
                    },
                  }
                );
                Cookies.remove("token");
                router.reload();
              }}
              label="Logout"
              component="div"
              icon={<IconLogout size="1rem" stroke={1.5} />}
            />
          )}
        </Popover.Dropdown>
      </Popover>
    </>
  );
}
