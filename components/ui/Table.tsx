import React from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  RoomAvailabilityResident,
  RoomAvailabilityResidentGuest,
  RoomType,
} from "@/utils/types";
import { format } from "date-fns";

type TableProps = {
  data: RoomAvailabilityResident[];
  roomTypeName: string | undefined;
  residentGuestTypes: (string | undefined)[];

  isResident: boolean;
};

const residentColumnHelper = createColumnHelper<RoomAvailabilityResident>();

function Table({ data, roomTypeName, residentGuestTypes }: TableProps) {
  const columns = [
    residentColumnHelper.accessor("date", {
      header: () => "Date",
      cell: (info) => info.getValue(),
    }),
    residentColumnHelper.group({
      header: roomTypeName || "Pricing",
      columns: [
        ...residentGuestTypes.map((guestType) =>
          residentColumnHelper.accessor("room_resident_guest_availabilities", {
            header: () => guestType,
            cell: (info) => {
              const roomResidentGuestAvailabilities: RoomAvailabilityResidentGuest[] =
                info.getValue();
              const roomResidentGuestAvailability =
                roomResidentGuestAvailabilities.find(
                  (item) => item.name?.toLowerCase() === guestType
                );
              return roomResidentGuestAvailability?.price;
            },
          })
        ),
      ],
    }),
  ];

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
        {table.getHeaderGroups().map((headerGroup) => (
          <tr
            className="px-6 py-2 bg-gray-100 text-sm font-medium"
            key={headerGroup.id}
          >
            {headerGroup.headers.map((header) => (
              <th className="text-gray-600" key={header.id}>
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
        {table.getRowModel().rows.map((row) => (
          <tr
            className="hover:bg-gray-100 border-b transition-colors duration-200 ease-linear"
            key={row.id}
          >
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

Table.propTypes = {};

export default Table;
