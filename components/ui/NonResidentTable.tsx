import React from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  RoomAvailabilityNonResident,
  RoomAvailabilityResidentGuest,
} from "@/utils/types";
import { format } from "date-fns";

type TableProps = {
  nonResidentData: RoomAvailabilityNonResident[];
  roomTypeName: string | undefined;
  nonResidentGuestTypes: (string | undefined)[];
};

const nonResidentColumnHelper =
  createColumnHelper<RoomAvailabilityNonResident>();

function NonResidentTable({
  nonResidentData,
  roomTypeName,
  nonResidentGuestTypes,
}: TableProps) {
  const nonResidentColumns = [
    nonResidentColumnHelper.accessor("date", {
      header: () => "Date",
      cell: (info) => (
        <span>{format(new Date(info.getValue()), "dd MMM yyyy")}</span>
      ),
    }),
    nonResidentColumnHelper.group({
      header: roomTypeName || "Pricing",
      columns: [
        ...nonResidentGuestTypes.map((guestType, index) =>
          nonResidentColumnHelper.accessor(
            (row) => row.room_non_resident_guest_availabilities,
            {
              id: `room_non_resident_guest_availabilities_${index}`,
              header: () => guestType,
              cell: (info) => {
                const roomNonResidentGuestAvailabilities: RoomAvailabilityResidentGuest[] =
                  info.getValue();
                const roomNonResidentGuestAvailability =
                  roomNonResidentGuestAvailabilities.find(
                    (item) => item.name?.toLowerCase() === guestType
                  );
                return <span>${roomNonResidentGuestAvailability?.price}</span>;
              },
            }
          )
        ),
      ],
    }),
  ];
  const column = nonResidentColumns;
  const data = nonResidentData;
  const columns = [...column];

  // Use the state and functions returned from useTable to build your UI
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
  });

  // Render the UI for your table
  return (
    <table className="!w-full">
      <thead>
        {table.getHeaderGroups().map((headerGroup, index) => (
          <tr className="px-6 py-2 bg-gray-100 text-sm font-medium" key={index}>
            {headerGroup.headers.map((header, index) => (
              <th
                colSpan={header.colSpan}
                className="text-gray-600"
                key={index}
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
      <tbody className="text-sm text-gray-600">
        {table.getRowModel().rows.map((row, index) => (
          <tr
            className="hover:bg-gray-100 border-b transition-colors duration-200 ease-linear"
            key={index}
          >
            {row.getVisibleCells().map((cell) => (
              <td className="p-1" key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default NonResidentTable;
