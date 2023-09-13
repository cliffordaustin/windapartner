import React, { useMemo } from "react";
import {
  Column,
  ColumnDef,
  Row,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  RoomAvailabilityNonResident,
  RoomAvailabilityResident,
  RoomAvailabilityResidentGuest,
} from "@/utils/types";
import { format } from "date-fns";
import { ScrollArea, Tooltip } from "@mantine/core";
import { AgentDiscountRateType } from "@/pages/api/stays";
import pricing from "../../../utils/calculation";

type PackagesType = {
  name: string;
  room_non_resident_availabilities: RoomAvailabilityNonResident[];
};

type UniqueRoomsType = {
  name?: string;
  packages: PackagesType[];
  adult_capacity: number;
  child_capacity: number;
  infant_capacity: number;
};

type SelectedRoomTableType = {
  room: UniqueRoomsType;
  guestType: string;
  agentRates: AgentDiscountRateType[] | undefined;
  displayRackRates: boolean;
};

type RoomAvailabilityType = {
  date: string;
  price: number | undefined;
};

type FormatDateType = {
  packageName: string;
  guestType: string;
  roomAvailability: RoomAvailabilityType[];
};

function SelectedRoomTable({
  room,
  guestType,
  agentRates,
  displayRackRates,
}: SelectedRoomTableType) {
  const data: FormatDateType[] = useMemo(
    () =>
      room.packages.map((packageName) => {
        const guestAvailability: RoomAvailabilityType[] =
          packageName.room_non_resident_availabilities.map((item) => {
            const guestAvailability =
              item.room_non_resident_guest_availabilities.find(
                (guest) =>
                  guest.name?.toLowerCase().trim() === guestType?.trim()
              );
            return {
              date: item.date,
              price: guestAvailability?.price,
            };
          });
        return {
          packageName: packageName.name,
          guestType,
          roomAvailability: guestAvailability,
        };
      }),
    [agentRates, guestType, room]
  );

  let uniqueDates = data.reduce((accumulator: string[], current) => {
    const dates = current.roomAvailability.map((item) => item.date);
    return [...accumulator, ...dates];
  }, []);

  uniqueDates = [...new Set(uniqueDates)];

  const columns = React.useMemo<ColumnDef<FormatDateType>[]>(
    () => [
      {
        header: () => room.name,
        accessorKey: "packageName" as const,
        cell: ({ getValue }) => getValue(),
      },

      ...uniqueDates.map((date) => {
        let percentage = {
          standard: false,
          rate: 0,
          start_date: "",
          end_date: "",
        };

        if (!displayRackRates) {
          percentage = pricing.findPercentageWithState(agentRates || [], date);
        }
        const rate = percentage.rate / 100;

        return {
          header: () => {
            return (
              <div
                className={
                  "relative px-5 z-0 py-4 " +
                  (percentage.standard
                    ? "bg-green-300"
                    : !percentage.standard &&
                      !displayRackRates &&
                      percentage.rate > 0
                    ? "bg-blue-400"
                    : "bg-gray-300")
                }
              >
                <span>{format(new Date(date), "dd MMM")}</span>
              </div>
            );
          },
          accessorKey: `${date}` as const,
          cell: ({ row }: { row: Row<FormatDateType> }) => {
            const roomAvailability = row.original.roomAvailability.find(
              (item) => item.date === date
            );
            const totalPrice = roomAvailability
              ? (roomAvailability.price || 0) -
                (roomAvailability.price || 0) * rate
              : 0;
            return (
              <Tooltip
                label={
                  percentage.standard ? (
                    <div className="text-center ">
                      <div className="text-sm">Nett Rate</div>
                      <div className="text-sm">{percentage.rate}%</div>
                    </div>
                  ) : percentage.start_date && percentage.end_date ? (
                    <div className="text-center">
                      <div className="text-sm">
                        {format(new Date(percentage.start_date), "dd MMM")} -{" "}
                        {format(new Date(percentage.end_date), "dd MMM")} Rate
                      </div>
                      <div className="text-sm">{percentage.rate}%</div>
                    </div>
                  ) : (
                    "Rack rate"
                  )
                }
                position="bottom"
                color="black"
                withArrow
              >
                <div
                  className={
                    "py-4 border-b-4 relative z-0 border-solid border-x-0 border-t-0 border-transparent text-center px-4"
                  }
                >
                  ${totalPrice.toFixed(2)}
                </div>
              </Tooltip>
            );
          },
        };
      }),
    ],
    [agentRates, guestType, room, displayRackRates]
  );

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <ScrollArea type="never">
      <style jsx>{`
        table {
          border-collapse: collapse;
          border-spacing: 0; /* This removes the space between table rows */
          width: 100%;
          margin-bottom: 20px;
        }

        table,
        th,
        td {
          border: 1px solid #ddd;
          padding: 0;
          margin: 0;
        }

        /* Style the table header */
        th {
          color: white;
          text-align: left;
          box-sizing: border-box;
        }

        /* Style the table rows */
        tr {
          background-color: #f8f9fa;
        }

        /* Add some hover effect on table rows */
        tr:hover {
          background-color: #e9ecef;
        }

        /* Add a bit of spacing between table cells */
      `}</style>
      <table className="">
        <thead className="">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr className="text-sm" key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  colSpan={header.colSpan}
                  className={`w-[50px] !text-black font-medium text-sm whitespace-nowrap ${
                    header.id === "packageName"
                      ? "sticky left-0 !px-6 z-10 !text-center !bg-white !text-black !font-semibold"
                      : ""
                  }`}
                  key={header.id}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="text-sm text-black">
          {table.getRowModel().rows.map((row, index) => (
            <tr
              className="w-[40px] whitespace-nowrap transition-colors duration-200 ease-linear"
              key={index}
            >
              {row.getVisibleCells().map((cell, cellIndex) => (
                <td
                  className={`p-0 text-center ${
                    cellIndex === 0
                      ? "sticky left-0 z-10 !px-2 bg-white font-semibold"
                      : " "
                  }`}
                  key={cell.id}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </ScrollArea>
  );
}

export default SelectedRoomTable;
