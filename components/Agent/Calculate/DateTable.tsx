import React, { useMemo } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { format } from "date-fns";

type DateTableType = {
  date: [Date | null, Date | null];
  isNonResident: boolean;
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

function DateTable({ date, isNonResident }: DateTableType) {
  let uniqueDates: string[] = [];

  // get all the dates between price start and end date and store in uniqueDates
  const startDate = date[0] ? new Date(date[0]) : null;
  const endDate = date[1] ? new Date(date[1]) : null;

  if (startDate && endDate) {
    let currentDate = startDate;
    while (currentDate < endDate) {
      uniqueDates.push(format(currentDate, "yyyy-MM-dd"));
      currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
    }
  }

  const columns = React.useMemo<ColumnDef<Date | null>[]>(
    () => [
      {
        header: () => (
          <div className="w-[118px] text-center font-semibold">Rooms</div>
        ),
        accessorKey: "date-spacing" as const,
        cell: ({ getValue }) => "",
      },

      ...uniqueDates.map((date) => {
        return {
          header: () => {
            return (
              <div
                className={
                  "py-4 border-b-4 relative z-0 border-solid border-x-0 border-t-0 border-transparent text-center " +
                  (isNonResident ? "!w-[100px]" : "!w-[120px]")
                }
              >
                <span>{format(new Date(date), "dd MMM")}</span>
              </div>
            );
          },

          accessorKey: `${date}` as const,
        };
      }),
    ],
    [date, isNonResident]
  );

  const table = useReactTable({
    columns,
    data: date,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <div>
      <style jsx>{`
        table {
          border-collapse: collapse;
          border-spacing: 0; /* This removes the space between table rows */
           {
            /* width: 100%;
          margin-bottom: 20px; */
          }
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
                  className={`!text-black font-medium text-sm whitespace-nowrap ${
                    header.id === "date-spacing"
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
    </div>
  );
}

export default DateTable;
