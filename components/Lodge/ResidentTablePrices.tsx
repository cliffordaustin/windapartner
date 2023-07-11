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
} from "@/utils/types";
import { format } from "date-fns";

type TableProps = {
  residentData: RoomAvailabilityResident[];
  roomTypeName: string | undefined;
  residentGuestTypes: (string | undefined)[];
};

const residentColumnHelper = createColumnHelper<RoomAvailabilityResident>();

function ResidentTablePrice({
  residentData,
  roomTypeName,
  residentGuestTypes,
}: TableProps) {
  const residentColumns = [
    residentColumnHelper.accessor("date", {
      header: () => "Date",
      cell: (info) => (
        <span>{format(new Date(info.getValue()), "dd MMM yyyy")}</span>
      ),
    }),

    residentColumnHelper.group({
      header: roomTypeName || "Pricing",
      columns: [
        ...residentGuestTypes.map((guestType, index) => {
          return residentColumnHelper.accessor(
            (row) => row.room_resident_guest_availabilities,
            {
              id: `room_resident_guest_availabilities_${index}`,
              header: () => guestType,
              cell: (info) => {
                const roomResidentGuestAvailabilities: RoomAvailabilityResidentGuest[] =
                  info.getValue();
                const roomResidentGuestAvailability =
                  roomResidentGuestAvailabilities.find(
                    (item) =>
                      item.name?.toLowerCase().trim() === guestType?.trim()
                  );
                return <span>KES{roomResidentGuestAvailability?.price}</span>;
              },
            }
          );
        }),
      ],
    }),
  ];

  const column = residentColumns;
  const data = residentData;
  const columns = [...column];

  // Use the state and functions returned from useTable to build your UI
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
  });

  // Render the UI for your table
  return (
    <table className="!w-full border border-solid">
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr
            className="px-6 py-2 bg-gray-100 border-b-2 border-gray-400 border-solid text-sm font-medium"
            key={headerGroup.id}
          >
            {headerGroup.headers.map((header) => (
              <th
                colSpan={header.colSpan}
                className="text-gray-600"
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
      <tbody className="text-sm text-gray-600">
        {table.getRowModel().rows.map((row, index) => (
          <tr
            className="hover:bg-gray-100 !border !border-solid transition-colors duration-200 ease-linear"
            key={index}
          >
            {row.getVisibleCells().map((cell) => (
              <td className="py-2 px-1" key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

ResidentTablePrice.propTypes = {};

export default ResidentTablePrice;
