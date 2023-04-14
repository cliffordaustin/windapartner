import { Context, GuestTotal, Room } from "@/context/CalculatePage";
import pricing from "@/utils/calculation";
import { RoomType } from "@/utils/types";
import { Flex, Text } from "@mantine/core";
import { useContext, useEffect } from "react";

type GuestsSummaryProps = {
  room: Room;
  roomTypes: RoomType[] | undefined;
  index: number;
};

export default function NonResidentGuestsSummary({
  room,
  roomTypes,
  index,
}: GuestsSummaryProps) {
  const priceSingleNonResidentAdultAllInclusive =
    pricing.singleNonResidentAdultAllInclusivePrice(
      room.nonResidentAdult,
      room.package,
      roomTypes
    );

  const priceSingleNonResidentAdultGamePackage =
    pricing.singleNonResidentAdultGamePackagePrice(
      room.nonResidentAdult,
      room.package,
      roomTypes
    );

  const priceSingleNonResidentAdultHalfBoard =
    pricing.singleNonResidentAdultHalfBoardPrice(
      room.nonResidentAdult,
      room.package,
      roomTypes
    );

  const priceSingleNonResidentAdultFullBoard =
    pricing.singleNonResidentAdultFullBoardPrice(
      room.nonResidentAdult,
      room.package,
      roomTypes
    );

  const priceSingleNonResidentAdultBedAndBreakfast =
    pricing.singleNonResidentAdultBedAndBreakfastPrice(
      room.nonResidentAdult,
      room.package,
      roomTypes
    );

  const priceDoubleNonResidentAdultGamePackage =
    pricing.doubleNonResidentAdultGamePackagePrice(
      room.nonResidentAdult,
      room.package,
      roomTypes
    );

  const priceDoubleNonResidentAdultHalfBoard =
    pricing.doubleNonResidentAdultHalfBoardPrice(
      room.nonResidentAdult,
      room.package,
      roomTypes
    );

  const priceDoubleNonResidentAdultFullBoard =
    pricing.doubleNonResidentAdultFullBoardPrice(
      room.nonResidentAdult,
      room.package,
      roomTypes
    );

  const priceDoubleNonResidentAdultBedAndBreakfast =
    pricing.doubleNonResidentAdultBedAndBreakfastPrice(
      room.nonResidentAdult,
      room.package,
      roomTypes
    );

  const priceSingleNonResidentChildAllInclusive =
    pricing.singleNonResidentChildAllInclusivePrice(
      room.nonResidentChild,
      room.package,
      roomTypes
    );

  const priceSingleNonResidentChildGamePackage =
    pricing.singleNonResidentChildGamePackagePrice(
      room.nonResidentChild,
      room.package,
      roomTypes
    );

  const priceSingleNonResidentChildHalfBoard =
    pricing.singleNonResidentChildHalfBoardPrice(
      room.nonResidentChild,
      room.package,
      roomTypes
    );

  const priceSingleNonResidentChildFullBoard =
    pricing.singleNonResidentChildFullBoardPrice(
      room.nonResidentChild,
      room.package,
      roomTypes
    );

  const priceSingleNonResidentChildBedAndBreakfast =
    pricing.singleNonResidentChildBedAndBreakfastPrice(
      room.nonResidentChild,
      room.package,
      roomTypes
    );

  const priceDoubleNonResidentAdultAllInclusive =
    pricing.doubleNonResidentAdultAllInclusivePrice(
      room.nonResidentAdult,
      room.package,
      roomTypes
    );

  const priceDoubleNonResidentChildGamePackage =
    pricing.doubleNonResidentChildGamePackagePrice(
      room.nonResidentChild,
      room.package,
      roomTypes
    );

  const priceDoubleNonResidentChildHalfBoard =
    pricing.doubleNonResidentChildHalfBoardPrice(
      room.nonResidentChild,
      room.package,
      roomTypes
    );

  const priceDoubleNonResidentChildFullBoard =
    pricing.doubleNonResidentChildFullBoardPrice(
      room.nonResidentChild,
      room.package,
      roomTypes
    );

  const priceDoubleNonResidentChildBedAndBreakfast =
    pricing.doubleNonResidentChildBedAndBreakfastPrice(
      room.nonResidentChild,
      room.package,
      roomTypes
    );

  const priceTripleNonResidentAdultAllInclusive =
    pricing.tripleNonResidentAdultAllInclusivePrice(
      room.nonResidentAdult,
      room.package,
      roomTypes
    );

  const priceTripleNonResidentChildGamePackage =
    pricing.tripleNonResidentChildGamePackagePrice(
      room.nonResidentChild,
      room.package,
      roomTypes
    );

  const priceTripleNonResidentChildHalfBoard =
    pricing.tripleNonResidentChildHalfBoardPrice(
      room.nonResidentChild,
      room.package,
      roomTypes
    );

  const priceTripleNonResidentChildFullBoard =
    pricing.tripleNonResidentChildFullBoardPrice(
      room.nonResidentChild,
      room.package,
      roomTypes
    );

  const priceTripleNonResidentChildBedAndBreakfast =
    pricing.tripleNonResidentChildBedAndBreakfastPrice(
      room.nonResidentChild,
      room.package,
      roomTypes
    );

  const priceTripleNonResidentAdultGamePackage =
    pricing.tripleNonResidentAdultGamePackagePrice(
      room.nonResidentAdult,
      room.package,
      roomTypes
    );

  const priceTripleNonResidentAdultHalfBoard =
    pricing.tripleNonResidentAdultHalfBoardPrice(
      room.nonResidentAdult,
      room.package,
      roomTypes
    );

  const priceTripleNonResidentAdultFullBoard =
    pricing.tripleNonResidentAdultFullBoardPrice(
      room.nonResidentAdult,
      room.package,
      roomTypes
    );

  const priceTripleNonResidentAdultBedAndBreakfast =
    pricing.tripleNonResidentAdultBedAndBreakfastPrice(
      room.nonResidentAdult,
      room.package,
      roomTypes
    );

  const priceDoubleNonResidentChildAllInclusive =
    pricing.doubleNonResidentChildAllInclusivePrice(
      room.nonResidentChild,
      room.package,
      roomTypes
    );

  const priceNonResidentInfantAllInclusive =
    pricing.nonResidentInfantAllInclusivePrice(
      room.nonResidentInfant,
      room.package,
      roomTypes
    );

  const priceNonResidentInfantGamePackage =
    pricing.nonResidentInfantGamePackagePrice(
      room.nonResidentInfant,
      room.package,
      roomTypes
    );

  const priceNonResidentInfantHalfBoard =
    pricing.nonResidentInfantHalfBoardPrice(
      room.nonResidentInfant,
      room.package,
      roomTypes
    );

  const priceTripleNonResidentChildAllInclusive =
    pricing.tripleNonResidentChildAllInclusivePrice(
      room.nonResidentChild,
      room.package,
      roomTypes
    );

  const priceNonResidentInfantFullBoard =
    pricing.nonResidentInfantFullBoardPrice(
      room.nonResidentInfant,
      room.package,
      roomTypes
    );

  const priceNonResidentInfantBedAndBreakfast =
    pricing.nonResidentInfantBedAndBreakfastPrice(
      room.nonResidentInfant,
      room.package,
      roomTypes
    );

  const nonResidentPriceTotal =
    (priceSingleNonResidentAdultAllInclusive || 0) +
    (priceSingleNonResidentAdultGamePackage || 0) +
    (priceSingleNonResidentAdultHalfBoard || 0) +
    (priceSingleNonResidentAdultFullBoard || 0) +
    (priceSingleNonResidentAdultBedAndBreakfast || 0) +
    (priceSingleNonResidentChildAllInclusive || 0) +
    (priceSingleNonResidentChildGamePackage || 0) +
    (priceSingleNonResidentChildHalfBoard || 0) +
    (priceSingleNonResidentChildFullBoard || 0) +
    (priceSingleNonResidentChildBedAndBreakfast || 0) +
    (priceDoubleNonResidentAdultAllInclusive || 0) +
    (priceDoubleNonResidentAdultGamePackage || 0) +
    (priceDoubleNonResidentAdultHalfBoard || 0) +
    (priceDoubleNonResidentAdultFullBoard || 0) +
    (priceDoubleNonResidentAdultBedAndBreakfast || 0) +
    (priceDoubleNonResidentChildAllInclusive || 0) +
    (priceDoubleNonResidentChildGamePackage || 0) +
    (priceDoubleNonResidentChildHalfBoard || 0) +
    (priceDoubleNonResidentChildFullBoard || 0) +
    (priceDoubleNonResidentChildBedAndBreakfast || 0) +
    (priceTripleNonResidentAdultAllInclusive || 0) +
    (priceTripleNonResidentAdultGamePackage || 0) +
    (priceTripleNonResidentAdultHalfBoard || 0) +
    (priceTripleNonResidentAdultFullBoard || 0) +
    (priceTripleNonResidentAdultBedAndBreakfast || 0) +
    (priceTripleNonResidentChildAllInclusive || 0) +
    (priceTripleNonResidentChildGamePackage || 0) +
    (priceTripleNonResidentChildHalfBoard || 0) +
    (priceTripleNonResidentChildFullBoard || 0) +
    (priceTripleNonResidentChildBedAndBreakfast || 0) +
    (priceNonResidentInfantAllInclusive || 0) +
    (priceNonResidentInfantGamePackage || 0) +
    (priceNonResidentInfantHalfBoard || 0) +
    (priceNonResidentInfantFullBoard || 0) +
    (priceNonResidentInfantBedAndBreakfast || 0);

  const { setPriceTotal } = useContext(Context);

  useEffect(() => {
    const newGuestTotal: GuestTotal = {
      id: room.id,
      resident: 0,
      nonResident: nonResidentPriceTotal,
    };

    setPriceTotal((prevState) => {
      const existingIndex = prevState.guestTotal.findIndex(
        (guest) => guest.id === newGuestTotal.id
      );
      if (existingIndex !== -1) {
        // If the id already exists, replace the existing object with the new object
        return {
          ...prevState,
          guestTotal: prevState.guestTotal.map((guest, index) =>
            index === existingIndex ? newGuestTotal : guest
          ),
        };
      } else {
        // If the id doesn't exist, add the new object to the array
        return {
          ...prevState,
          guestTotal: [...prevState.guestTotal, newGuestTotal],
        };
      }
    });
  }, [nonResidentPriceTotal]);

  return (
    <div>
      <Text size="sm" weight={600}>
        {index + 1}. {room.name} -{" "}
        {room.package.charAt(0).toUpperCase() +
          room.package.slice(1).toLowerCase()}
      </Text>

      <div className="ml-1 mt-1 flex flex-col gap-1">
        {!!priceSingleNonResidentAdultAllInclusive && (
          <Flex align="center" justify="space-between">
            <Text className="text-gray-600" size="sm">
              {" "}
              {room.nonResidentAdult} x Non-Resident Adult
            </Text>

            <Text className="text-gray-600" size="sm">
              {" "}
              ${priceSingleNonResidentAdultAllInclusive.toLocaleString()}
            </Text>
          </Flex>
        )}

        {!!priceSingleNonResidentAdultGamePackage && (
          <Flex align="center" justify="space-between">
            <Text className="text-gray-600" size="sm">
              {" "}
              {room.nonResidentAdult} x Non-Resident Adult
            </Text>

            <Text className="text-gray-600" size="sm">
              {" "}
              ${priceSingleNonResidentAdultGamePackage.toLocaleString()}
            </Text>
          </Flex>
        )}

        {!!priceSingleNonResidentAdultHalfBoard && (
          <Flex align="center" justify="space-between">
            <Text className="text-gray-600" size="sm">
              {" "}
              {room.nonResidentAdult} x Non-Resident Adult
            </Text>

            <Text className="text-gray-600" size="sm">
              {" "}
              ${priceSingleNonResidentAdultHalfBoard.toLocaleString()}
            </Text>
          </Flex>
        )}

        {!!priceSingleNonResidentAdultFullBoard && (
          <Flex align="center" justify="space-between">
            <Text className="text-gray-600" size="sm">
              {" "}
              {room.nonResidentAdult} x Non-Resident Adult
            </Text>

            <Text className="text-gray-600" size="sm">
              {" "}
              ${priceSingleNonResidentAdultFullBoard.toLocaleString()}
            </Text>
          </Flex>
        )}

        {!!priceSingleNonResidentAdultBedAndBreakfast && (
          <Flex align="center" justify="space-between">
            <Text className="text-gray-600" size="sm">
              {" "}
              {room.nonResidentAdult} x Non-Resident Adult
            </Text>

            <Text className="text-gray-600" size="sm">
              {" "}
              ${priceSingleNonResidentAdultBedAndBreakfast.toLocaleString()}
            </Text>
          </Flex>
        )}

        {!!priceDoubleNonResidentAdultAllInclusive && (
          <Flex align="center" justify="space-between">
            <Text className="text-gray-600" size="sm">
              {" "}
              {room.nonResidentAdult} x Non-Resident Adult
            </Text>

            <Text className="text-gray-600" size="sm">
              {" "}
              ${priceDoubleNonResidentAdultAllInclusive.toLocaleString()}
            </Text>
          </Flex>
        )}

        {!!priceDoubleNonResidentAdultGamePackage && (
          <Flex align="center" justify="space-between">
            <Text className="text-gray-600" size="sm">
              {" "}
              {room.nonResidentAdult} x Non-Resident Adult
            </Text>

            <Text className="text-gray-600" size="sm">
              {" "}
              ${priceDoubleNonResidentAdultGamePackage.toLocaleString()}
            </Text>
          </Flex>
        )}

        {!!priceDoubleNonResidentAdultFullBoard && (
          <Flex align="center" justify="space-between">
            <Text className="text-gray-600" size="sm">
              {" "}
              {room.nonResidentAdult} x Non-Resident Adult
            </Text>

            <Text className="text-gray-600" size="sm">
              {" "}
              ${priceDoubleNonResidentAdultFullBoard.toLocaleString()}
            </Text>
          </Flex>
        )}

        {!!priceDoubleNonResidentAdultHalfBoard && (
          <Flex align="center" justify="space-between">
            <Text className="text-gray-600" size="sm">
              {" "}
              {room.nonResidentAdult} x Non-Resident Adult
            </Text>

            <Text className="text-gray-600" size="sm">
              {" "}
              ${priceDoubleNonResidentAdultHalfBoard.toLocaleString()}
            </Text>
          </Flex>
        )}

        {!!priceDoubleNonResidentAdultBedAndBreakfast && (
          <Flex align="center" justify="space-between">
            <Text className="text-gray-600" size="sm">
              {" "}
              {room.nonResidentAdult} x Non-Resident Adult
            </Text>

            <Text className="text-gray-600" size="sm">
              {" "}
              ${priceDoubleNonResidentAdultBedAndBreakfast.toLocaleString()}
            </Text>
          </Flex>
        )}

        {!!priceTripleNonResidentAdultAllInclusive && (
          <Flex align="center" justify="space-between">
            <Text className="text-gray-600" size="sm">
              {" "}
              {room.nonResidentAdult} x Non-Resident Adult
            </Text>

            <Text className="text-gray-600" size="sm">
              {" "}
              ${priceTripleNonResidentAdultAllInclusive.toLocaleString()}
            </Text>
          </Flex>
        )}

        {!!priceTripleNonResidentAdultGamePackage && (
          <Flex align="center" justify="space-between">
            <Text className="text-gray-600" size="sm">
              {" "}
              {room.nonResidentAdult} x Non-Resident Adult
            </Text>

            <Text className="text-gray-600" size="sm">
              {" "}
              ${priceTripleNonResidentAdultGamePackage.toLocaleString()}
            </Text>
          </Flex>
        )}

        {!!priceTripleNonResidentAdultFullBoard && (
          <Flex align="center" justify="space-between">
            <Text className="text-gray-600" size="sm">
              {" "}
              {room.nonResidentAdult} x Non-Resident Adult
            </Text>

            <Text className="text-gray-600" size="sm">
              {" "}
              ${priceTripleNonResidentAdultFullBoard.toLocaleString()}
            </Text>
          </Flex>
        )}

        {!!priceTripleNonResidentAdultHalfBoard && (
          <Flex align="center" justify="space-between">
            <Text className="text-gray-600" size="sm">
              {" "}
              {room.nonResidentAdult} x Non-Resident Adult
            </Text>

            <Text className="text-gray-600" size="sm">
              {" "}
              ${priceTripleNonResidentAdultHalfBoard.toLocaleString()}
            </Text>
          </Flex>
        )}

        {!!priceTripleNonResidentAdultBedAndBreakfast && (
          <Flex align="center" justify="space-between">
            <Text className="text-gray-600" size="sm">
              {" "}
              {room.nonResidentAdult} x Non-Resident Adult
            </Text>

            <Text className="text-gray-600" size="sm">
              {" "}
              ${priceTripleNonResidentAdultBedAndBreakfast.toLocaleString()}
            </Text>
          </Flex>
        )}

        {!!priceSingleNonResidentChildAllInclusive && (
          <Flex align="center" justify="space-between">
            <Text className="text-gray-600" size="sm">
              {" "}
              {room.nonResidentChild} x Non-Resident Child
            </Text>

            <Text className="text-gray-600" size="sm">
              {" "}
              ${priceSingleNonResidentChildAllInclusive.toLocaleString()}
            </Text>
          </Flex>
        )}

        {!!priceSingleNonResidentChildGamePackage && (
          <Flex align="center" justify="space-between">
            <Text className="text-gray-600" size="sm">
              {" "}
              {room.nonResidentChild} x Non-Resident Child
            </Text>

            <Text className="text-gray-600" size="sm">
              {" "}
              ${priceSingleNonResidentChildGamePackage.toLocaleString()}
            </Text>
          </Flex>
        )}

        {!!priceSingleNonResidentChildFullBoard && (
          <Flex align="center" justify="space-between">
            <Text className="text-gray-600" size="sm">
              {" "}
              {room.nonResidentChild} x Non-Resident Child
            </Text>

            <Text className="text-gray-600" size="sm">
              {" "}
              ${priceSingleNonResidentChildFullBoard.toLocaleString()}
            </Text>
          </Flex>
        )}

        {!!priceSingleNonResidentChildHalfBoard && (
          <Flex align="center" justify="space-between">
            <Text className="text-gray-600" size="sm">
              {" "}
              {room.nonResidentChild} x Non-Resident Child
            </Text>

            <Text className="text-gray-600" size="sm">
              {" "}
              ${priceSingleNonResidentChildHalfBoard.toLocaleString()}
            </Text>
          </Flex>
        )}

        {!!priceSingleNonResidentChildBedAndBreakfast && (
          <Flex align="center" justify="space-between">
            <Text className="text-gray-600" size="sm">
              {" "}
              {room.nonResidentChild} x Non-Resident Child
            </Text>

            <Text className="text-gray-600" size="sm">
              {" "}
              ${priceSingleNonResidentChildBedAndBreakfast.toLocaleString()}
            </Text>
          </Flex>
        )}

        {!!priceDoubleNonResidentChildAllInclusive && (
          <Flex align="center" justify="space-between">
            <Text className="text-gray-600" size="sm">
              {" "}
              {room.nonResidentChild} x Non-Resident Child
            </Text>

            <Text className="text-gray-600" size="sm">
              {" "}
              ${priceDoubleNonResidentChildAllInclusive.toLocaleString()}
            </Text>
          </Flex>
        )}

        {!!priceDoubleNonResidentChildGamePackage && (
          <Flex align="center" justify="space-between">
            <Text className="text-gray-600" size="sm">
              {" "}
              {room.nonResidentChild} x Non-Resident Child
            </Text>

            <Text className="text-gray-600" size="sm">
              {" "}
              ${priceDoubleNonResidentChildGamePackage.toLocaleString()}
            </Text>
          </Flex>
        )}

        {!!priceDoubleNonResidentChildFullBoard && (
          <Flex align="center" justify="space-between">
            <Text className="text-gray-600" size="sm">
              {" "}
              {room.nonResidentChild} x Non-Resident Child
            </Text>

            <Text className="text-gray-600" size="sm">
              {" "}
              ${priceDoubleNonResidentChildFullBoard.toLocaleString()}
            </Text>
          </Flex>
        )}

        {!!priceDoubleNonResidentChildHalfBoard && (
          <Flex align="center" justify="space-between">
            <Text className="text-gray-600" size="sm">
              {" "}
              {room.nonResidentChild} x Non-Resident Child
            </Text>

            <Text className="text-gray-600" size="sm">
              {" "}
              ${priceDoubleNonResidentChildHalfBoard.toLocaleString()}
            </Text>
          </Flex>
        )}

        {!!priceDoubleNonResidentChildBedAndBreakfast && (
          <Flex align="center" justify="space-between">
            <Text className="text-gray-600" size="sm">
              {" "}
              {room.nonResidentChild} x Non-Resident Child
            </Text>

            <Text className="text-gray-600" size="sm">
              {" "}
              ${priceDoubleNonResidentChildBedAndBreakfast.toLocaleString()}
            </Text>
          </Flex>
        )}

        {!!priceTripleNonResidentChildAllInclusive && (
          <Flex align="center" justify="space-between">
            <Text className="text-gray-600" size="sm">
              {" "}
              {room.nonResidentChild} x Non-Resident Child
            </Text>

            <Text className="text-gray-600" size="sm">
              {" "}
              ${priceTripleNonResidentChildAllInclusive.toLocaleString()}
            </Text>
          </Flex>
        )}

        {!!priceTripleNonResidentChildGamePackage && (
          <Flex align="center" justify="space-between">
            <Text className="text-gray-600" size="sm">
              {" "}
              {room.nonResidentChild} x Non-Resident Child
            </Text>

            <Text className="text-gray-600" size="sm">
              {" "}
              ${priceTripleNonResidentChildGamePackage.toLocaleString()}
            </Text>
          </Flex>
        )}

        {!!priceTripleNonResidentChildFullBoard && (
          <Flex align="center" justify="space-between">
            <Text className="text-gray-600" size="sm">
              {" "}
              {room.nonResidentChild} x Non-Resident Child
            </Text>

            <Text className="text-gray-600" size="sm">
              {" "}
              ${priceTripleNonResidentChildFullBoard.toLocaleString()}
            </Text>
          </Flex>
        )}

        {!!priceTripleNonResidentChildHalfBoard && (
          <Flex align="center" justify="space-between">
            <Text className="text-gray-600" size="sm">
              {" "}
              {room.nonResidentChild} x Non-Resident Child
            </Text>

            <Text className="text-gray-600" size="sm">
              {" "}
              ${priceTripleNonResidentChildHalfBoard.toLocaleString()}
            </Text>
          </Flex>
        )}

        {!!priceTripleNonResidentChildBedAndBreakfast && (
          <Flex align="center" justify="space-between">
            <Text className="text-gray-600" size="sm">
              {" "}
              {room.nonResidentChild} x Non-Resident Child
            </Text>

            <Text className="text-gray-600" size="sm">
              {" "}
              ${priceTripleNonResidentChildBedAndBreakfast.toLocaleString()}
            </Text>
          </Flex>
        )}

        {!!priceNonResidentInfantAllInclusive && (
          <Flex align="center" justify="space-between">
            <Text className="text-gray-600" size="sm">
              {" "}
              {room.nonResidentInfant} x Non-Resident Infant
            </Text>

            <Text className="text-gray-600" size="sm">
              {" "}
              ${priceNonResidentInfantAllInclusive.toLocaleString()}
            </Text>
          </Flex>
        )}

        {!!priceNonResidentInfantGamePackage && (
          <Flex align="center" justify="space-between">
            <Text className="text-gray-600" size="sm">
              {room.nonResidentInfant} x Non-Resident Infant
            </Text>

            <Text className="text-gray-600" size="sm">
              ${priceNonResidentInfantGamePackage.toLocaleString()}
            </Text>
          </Flex>
        )}

        {!!priceNonResidentInfantFullBoard && (
          <Flex align="center" justify="space-between">
            <Text className="text-gray-600" size="sm">
              {" "}
              {room.nonResidentInfant} x Non-Resident Infant
            </Text>

            <Text className="text-gray-600" size="sm">
              {" "}
              ${priceNonResidentInfantFullBoard.toLocaleString()}
            </Text>
          </Flex>
        )}

        {!!priceNonResidentInfantHalfBoard && (
          <Flex align="center" justify="space-between">
            <Text className="text-gray-600" size="sm">
              {" "}
              {room.nonResidentInfant} x Non-Resident Infant
            </Text>

            <Text className="text-gray-600" size="sm">
              {" "}
              ${priceNonResidentInfantHalfBoard.toLocaleString()}
            </Text>
          </Flex>
        )}

        {!!priceNonResidentInfantBedAndBreakfast && (
          <Flex align="center" justify="space-between">
            <Text className="text-gray-600" size="sm">
              {" "}
              {room.nonResidentInfant} x Non-Resident Infant
            </Text>

            <Text className="text-gray-600" size="sm">
              {" "}
              ${priceNonResidentInfantBedAndBreakfast.toLocaleString()}
            </Text>
          </Flex>
        )}
      </div>
    </div>
  );
}
