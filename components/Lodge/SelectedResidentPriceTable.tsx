import { RoomType } from "@/utils/types";
import React from "react";

type SelectedResidentPriceTableProps = {
  roomType: RoomType;
  staySlug: string | undefined;
};

function SelectedResidentPriceTable({
  roomType,
  staySlug,
}: SelectedResidentPriceTableProps) {
  return <div>SelectedResidentPriceTable</div>;
}

export default SelectedResidentPriceTable;
