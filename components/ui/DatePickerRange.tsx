import { DateRange, DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

type DatePickerRangeProps = {
  selected: DateRange | undefined;
  onSelect: (date: DateRange | undefined) => void;
  disableDates?: Date[];
  numberOfMonths?: number;
};

export default function DatePickerRange({
  selected,
  onSelect,
  disableDates,
  numberOfMonths = 1,
}: DatePickerRangeProps) {
  const dates = disableDates ? disableDates : [];
  return (
    <div>
      <style jsx global>{`
        .rdp-day_selected,
        .rdp-day_selected:focus-visible {
          background-color: black;
        }

        .rdp-day_selected:hover {
          background-color: #eef0f2;
          color: black;
        }

        .rdp-button:hover {
          background-color: #eef0f2 !important;
        }

        .rdp-day_range_start,
        .rdp-day_range_end {
          background-color: #eef0f2;
          color: white !important;
          z-index: 1;
        }

        .rdp-day_range_start:after,
        .rdp-day_range_end:after {
          content: "";
          position: absolute;
          background-color: black;
          border-radius: 100px !important;
          z-index: -1;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          width: 100%;
        }

        .rdp-day_range_middle {
          position: relative;
          border: none;
          background-color: #eef0f2;
          color: black;
        }
      `}</style>
      <DayPicker
        mode="range"
        numberOfMonths={numberOfMonths}
        disabled={[{ before: new Date() }, ...dates]}
        selected={selected}
        onSelect={(date) => {
          onSelect(date);
        }}
      />
    </div>
  );
}
