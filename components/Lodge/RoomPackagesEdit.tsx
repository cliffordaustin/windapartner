import { RoomType } from "@/utils/types";
import { Accordion, Container, Flex, Text } from "@mantine/core";
import { format } from "date-fns";
import React from "react";

type RoomPackagesEditProps = {
  date: [Date | null, Date | null];
  roomTypes: RoomType[] | undefined;
};

type UniqueRoomsType = {
  name?: string;
  packages: string[];
};

function RoomPackagesEdit({ date, roomTypes }: RoomPackagesEditProps) {
  const uniqueRooms: UniqueRoomsType[] =
    roomTypes?.reduce((accumulator: UniqueRoomsType[], current: RoomType) => {
      const roomName = current.name?.toLowerCase();
      const index = accumulator.findIndex(
        (room) => room.name?.toLowerCase().trim() === roomName?.trim()
      );
      if (index >= 0) {
        // If roomName already exists, add package to the existing room object
        accumulator[index].packages.push(current.package);
      } else {
        // If roomName doesn't exist, create a new room object with the roomName and package
        accumulator.push({ name: current.name, packages: [current.package] });
      }
      return accumulator;
    }, []) || [];

  return (
    <div className="border border-solid w-full border-gray-200 rounded-xl p-5">
      <Text className="font-semibold" size="lg">
        Rooms and Packages
      </Text>

      <Container className="mt-5 p-0 w-full">
        <Accordion defaultValue="0">
          {uniqueRooms.map((room, index) => (
            <Accordion.Item key={index} value={index.toString()}>
              <Accordion.Control>
                <div className="flex items-center">
                  <Text w={150} className="text-gray-600" size="sm">
                    Name
                  </Text>
                  <Text className="font-semibold" size="md">
                    {room.name}
                  </Text>
                </div>
              </Accordion.Control>
              <Accordion.Panel>
                <div className="flex">
                  <Text w={150} className="text-gray-600" size="sm">
                    Packages
                  </Text>
                  <Flex gap={8} direction="column">
                    {room.packages.map((packageItem, index) => (
                      <Text key={index} transform="capitalize" size="md">
                        {packageItem.charAt(0).toUpperCase() +
                          packageItem.slice(1).toLowerCase()}
                      </Text>
                    ))}
                  </Flex>
                </div>
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
      </Container>
    </div>
  );
}

export default RoomPackagesEdit;
