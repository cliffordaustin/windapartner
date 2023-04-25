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

export default function GuestsSummary({
  room,
  roomTypes,
  index,
}: GuestsSummaryProps) {
  const priceSingleResidentAdultAllInclusive =
    pricing.singleResidentAdultAllInclusivePrice(
      room.residentAdult,
      room.package,
      roomTypes
    );

  const priceSingleResidentAdultGamePackage =
    pricing.singleResidentAdultGamePackagePrice(
      room.residentAdult,
      room.package,
      roomTypes
    );

  const priceSingleResidentAdultHalfBoard =
    pricing.singleResidentAdultHalfBoardPrice(
      room.residentAdult,
      room.package,
      roomTypes
    );

  const priceSingleResidentAdultFullBoard =
    pricing.singleResidentAdultFullBoardPrice(
      room.residentAdult,
      room.package,
      roomTypes
    );

  const priceSingleResidentAdultBedAndBreakfast =
    pricing.singleResidentAdultBedAndBreakfastPrice(
      room.residentAdult,
      room.package,
      roomTypes
    );

  const priceDoubleResidentAdultGamePackage =
    pricing.doubleResidentAdultGamePackagePrice(
      room.residentAdult,
      room.package,
      roomTypes
    );

  const priceDoubleResidentAdultHalfBoard =
    pricing.doubleResidentAdultHalfBoardPrice(
      room.residentAdult,
      room.package,
      roomTypes
    );

  const priceDoubleResidentAdultFullBoard =
    pricing.doubleResidentAdultFullBoardPrice(
      room.residentAdult,
      room.package,
      roomTypes
    );

  const priceDoubleResidentAdultBedAndBreakfast =
    pricing.doubleResidentAdultBedAndBreakfastPrice(
      room.residentAdult,
      room.package,
      roomTypes
    );

  const priceSingleResidentChildAllInclusive =
    pricing.singleResidentChildAllInclusivePrice(
      room.residentChild,
      room.package,
      roomTypes
    );

  const priceSingleResidentChildGamePackage =
    pricing.singleResidentChildGamePackagePrice(
      room.residentChild,
      room.package,
      roomTypes
    );

  const priceSingleResidentChildHalfBoard =
    pricing.singleResidentChildHalfBoardPrice(
      room.residentChild,
      room.package,
      roomTypes
    );

  const priceSingleResidentChildFullBoard =
    pricing.singleResidentChildFullBoardPrice(
      room.residentChild,
      room.package,
      roomTypes
    );

  const priceSingleResidentChildBedAndBreakfast =
    pricing.singleResidentChildBedAndBreakfastPrice(
      room.residentChild,
      room.package,
      roomTypes
    );

  const priceDoubleResidentAdultAllInclusive =
    pricing.doubleResidentAdultAllInclusivePrice(
      room.residentAdult,
      room.package,
      roomTypes
    );

  const priceDoubleResidentChildGamePackage =
    pricing.doubleResidentChildGamePackagePrice(
      room.residentChild,
      room.package,
      roomTypes
    );

  const priceDoubleResidentChildHalfBoard =
    pricing.doubleResidentChildHalfBoardPrice(
      room.residentChild,
      room.package,
      roomTypes
    );

  const priceDoubleResidentChildAllInclusive =
    pricing.doubleResidentChildAllInclusivePrice(
      room.residentChild,
      room.package,
      roomTypes
    );

  const priceDoubleResidentChildFullBoard =
    pricing.doubleResidentChildFullBoardPrice(
      room.residentChild,
      room.package,
      roomTypes
    );

  const priceDoubleResidentChildBedAndBreakfast =
    pricing.doubleResidentChildBedAndBreakfastPrice(
      room.residentChild,
      room.package,
      roomTypes
    );

  const priceTripleResidentAdultAllInclusive =
    pricing.tripleResidentAdultAllInclusivePrice(
      room.residentAdult,
      room.package,
      roomTypes
    );

  const priceTripleResidentChildGamePackage =
    pricing.tripleResidentChildGamePackagePrice(
      room.residentChild,
      room.package,
      roomTypes
    );

  const priceTripleResidentChildHalfBoard =
    pricing.tripleResidentChildHalfBoardPrice(
      room.residentChild,
      room.package,
      roomTypes
    );

  const priceTripleResidentChildFullBoard =
    pricing.tripleResidentChildFullBoardPrice(
      room.residentChild,
      room.package,
      roomTypes
    );

  const priceTripleResidentChildBedAndBreakfast =
    pricing.tripleResidentChildBedAndBreakfastPrice(
      room.residentChild,
      room.package,
      roomTypes
    );

  const priceTripleResidentAdultGamePackage =
    pricing.tripleResidentAdultGamePackagePrice(
      room.residentAdult,
      room.package,
      roomTypes
    );

  const priceTripleResidentAdultHalfBoard =
    pricing.tripleResidentAdultHalfBoardPrice(
      room.residentAdult,
      room.package,
      roomTypes
    );

  const priceTripleResidentAdultFullBoard =
    pricing.tripleResidentAdultFullBoardPrice(
      room.residentAdult,
      room.package,
      roomTypes
    );

  const priceTripleResidentAdultBedAndBreakfast =
    pricing.tripleResidentAdultBedAndBreakfastPrice(
      room.residentAdult,
      room.package,
      roomTypes
    );

  const priceResidentInfantAllInclusive =
    pricing.residentInfantAllInclusivePrice(
      room.residentInfant,
      room.package,
      roomTypes
    );

  const priceResidentInfantGamePackage = pricing.residentInfantGamePackagePrice(
    room.residentInfant,
    room.package,
    roomTypes
  );

  const priceResidentInfantHalfBoard = pricing.residentInfantHalfBoardPrice(
    room.residentInfant,
    room.package,
    roomTypes
  );

  const priceResidentInfantFullBoard = pricing.residentInfantFullBoardPrice(
    room.residentInfant,
    room.package,
    roomTypes
  );

  const priceResidentInfantBedAndBreakfast =
    pricing.residentInfantBedAndBreakfastPrice(
      room.residentInfant,
      room.package,
      roomTypes
    );

  const priceTripleResidentChildAllInclusive =
    pricing.tripleResidentChildAllInclusivePrice(
      room.residentChild,
      room.package,
      roomTypes
    );

  const residentPriceTotal =
    (priceSingleResidentAdultAllInclusive || 0) +
    (priceSingleResidentAdultGamePackage || 0) +
    (priceSingleResidentAdultHalfBoard || 0) +
    (priceSingleResidentAdultFullBoard || 0) +
    (priceSingleResidentAdultBedAndBreakfast || 0) +
    (priceSingleResidentChildAllInclusive || 0) +
    (priceSingleResidentChildGamePackage || 0) +
    (priceSingleResidentChildHalfBoard || 0) +
    (priceSingleResidentChildFullBoard || 0) +
    (priceSingleResidentChildBedAndBreakfast || 0) +
    (priceDoubleResidentAdultAllInclusive || 0) +
    (priceDoubleResidentAdultGamePackage || 0) +
    (priceDoubleResidentAdultHalfBoard || 0) +
    (priceDoubleResidentAdultFullBoard || 0) +
    (priceDoubleResidentAdultBedAndBreakfast || 0) +
    (priceDoubleResidentChildAllInclusive || 0) +
    (priceDoubleResidentChildGamePackage || 0) +
    (priceDoubleResidentChildHalfBoard || 0) +
    (priceDoubleResidentChildFullBoard || 0) +
    (priceDoubleResidentChildBedAndBreakfast || 0) +
    (priceTripleResidentAdultAllInclusive || 0) +
    (priceTripleResidentAdultGamePackage || 0) +
    (priceTripleResidentAdultHalfBoard || 0) +
    (priceTripleResidentAdultFullBoard || 0) +
    (priceTripleResidentAdultBedAndBreakfast || 0) +
    (priceTripleResidentChildAllInclusive || 0) +
    (priceTripleResidentChildGamePackage || 0) +
    (priceTripleResidentChildHalfBoard || 0) +
    (priceTripleResidentChildFullBoard || 0) +
    (priceTripleResidentChildBedAndBreakfast || 0) +
    (priceResidentInfantAllInclusive || 0) +
    (priceResidentInfantGamePackage || 0) +
    (priceResidentInfantHalfBoard || 0) +
    (priceResidentInfantFullBoard || 0) +
    (priceResidentInfantBedAndBreakfast || 0);

  // const { setPriceTotal } = useContext(Context);

  // useEffect(() => {
  //   const newGuestTotal: GuestTotal = {
  //     id: room.id,
  //     resident: residentPriceTotal,
  //     nonResident: 0,
  //   };

  //   setPriceTotal((prevState) => {
  //     const existingIndex = prevState.guestTotal.findIndex(
  //       (guest) => guest.id === newGuestTotal.id
  //     );
  //     if (existingIndex !== -1) {
  //       // If the id already exists, replace the existing object with the new object
  //       return {
  //         ...prevState,
  //         guestTotal: prevState.guestTotal.map((guest, index) =>
  //           index === existingIndex ? newGuestTotal : guest
  //         ),
  //       };
  //     } else {
  //       // If the id doesn't exist, add the new object to the array
  //       return {
  //         ...prevState,
  //         guestTotal: [...prevState.guestTotal, newGuestTotal],
  //       };
  //     }
  //   });
  // }, [residentPriceTotal]);

  const countResidentGuestTypes = pricing.countResidentGuestTypesWithPrice(
    room.residentGuests,
    room,
    roomTypes
  );

  return (
    <div>
      <Text size="sm" weight={600}>
        {index + 1}. {room.name} -{" "}
        {room.package.charAt(0).toUpperCase() +
          room.package.slice(1).toLowerCase()}
      </Text>

      <div className="ml-1 mt-1 flex flex-col gap-1">
        {countResidentGuestTypes.map((guestType, index) => (
          <Flex key={index} align="center" justify="space-between">
            <Text className="text-gray-600" size="sm">
              {guestType.name}
            </Text>
            <Text className="text-gray-600" size="sm">
              KES{guestType.price?.toLocaleString()}
            </Text>
          </Flex>
        ))}
      </div>

      <div className="ml-1 mt-1 flex flex-col gap-1">
        {!!priceSingleResidentAdultAllInclusive && (
          <Flex align="center" justify="space-between">
            <Text className="text-gray-600" size="sm">
              {" "}
              {room.residentAdult} x Resident Adult
            </Text>
            <Text className="text-gray-600" size="sm">
              {" "}
              KES{priceSingleResidentAdultAllInclusive.toLocaleString()}
            </Text>
          </Flex>
        )}

        {!!priceSingleResidentAdultGamePackage && (
          <Flex align="center" justify="space-between">
            <Text className="text-gray-600" size="sm">
              {" "}
              {room.residentAdult} x Resident Adult
            </Text>
            <Text className="text-gray-600" size="sm">
              {" "}
              KES{priceSingleResidentAdultGamePackage.toLocaleString()}
            </Text>
          </Flex>
        )}

        {!!priceSingleResidentAdultHalfBoard && (
          <Flex align="center" justify="space-between">
            <Text className="text-gray-600" size="sm">
              {" "}
              {room.residentAdult} x Resident Adult
            </Text>
            <Text className="text-gray-600" size="sm">
              {" "}
              KES{priceSingleResidentAdultHalfBoard.toLocaleString()}
            </Text>
          </Flex>
        )}

        {!!priceSingleResidentAdultFullBoard && (
          <Flex align="center" justify="space-between">
            <Text className="text-gray-600" size="sm">
              {" "}
              {room.residentAdult} x Resident Adult
            </Text>
            <Text className="text-gray-600" size="sm">
              {" "}
              KES{priceSingleResidentAdultFullBoard.toLocaleString()}
            </Text>
          </Flex>
        )}

        {!!priceSingleResidentAdultBedAndBreakfast && (
          <Flex align="center" justify="space-between">
            <Text className="text-gray-600" size="sm">
              {" "}
              {room.residentAdult} x Resident Adult
            </Text>
            <Text className="text-gray-600" size="sm">
              {" "}
              KES{priceSingleResidentAdultBedAndBreakfast.toLocaleString()}
            </Text>
          </Flex>
        )}

        {!!priceDoubleResidentAdultAllInclusive && (
          <Flex align="center" justify="space-between">
            <Text className="text-gray-600" size="sm">
              {" "}
              {room.residentAdult} x Resident Adult
            </Text>

            <Text className="text-gray-600" size="sm">
              {" "}
              KES{priceDoubleResidentAdultAllInclusive.toLocaleString()}
            </Text>
          </Flex>
        )}

        {!!priceDoubleResidentAdultGamePackage && (
          <Flex align="center" justify="space-between">
            <Text className="text-gray-600" size="sm">
              {" "}
              {room.residentAdult} x Resident Adult
            </Text>

            <Text className="text-gray-600" size="sm">
              {" "}
              KES{priceDoubleResidentAdultGamePackage.toLocaleString()}
            </Text>
          </Flex>
        )}

        {!!priceDoubleResidentAdultHalfBoard && (
          <Flex align="center" justify="space-between">
            <Text className="text-gray-600" size="sm">
              {" "}
              {room.residentAdult} x Resident Adult
            </Text>

            <Text className="text-gray-600" size="sm">
              {" "}
              KES{priceDoubleResidentAdultHalfBoard.toLocaleString()}
            </Text>
          </Flex>
        )}

        {!!priceDoubleResidentAdultFullBoard && (
          <Flex align="center" justify="space-between">
            <Text className="text-gray-600" size="sm">
              {" "}
              {room.residentAdult} x Resident Adult
            </Text>

            <Text className="text-gray-600" size="sm">
              {" "}
              KES{priceDoubleResidentAdultFullBoard.toLocaleString()}
            </Text>
          </Flex>
        )}

        {!!priceDoubleResidentAdultBedAndBreakfast && (
          <Flex align="center" justify="space-between">
            <Text className="text-gray-600" size="sm">
              {" "}
              {room.residentAdult} x Resident Adult
            </Text>

            <Text className="text-gray-600" size="sm">
              {" "}
              KES{priceDoubleResidentAdultBedAndBreakfast.toLocaleString()}
            </Text>
          </Flex>
        )}

        {!!priceTripleResidentAdultAllInclusive && (
          <Flex align="center" justify="space-between">
            <Text className="text-gray-600" size="sm">
              {" "}
              {room.residentAdult} x Resident Adult
            </Text>

            <Text className="text-gray-600" size="sm">
              {" "}
              KES{priceTripleResidentAdultAllInclusive.toLocaleString()}
            </Text>
          </Flex>
        )}

        {!!priceTripleResidentAdultGamePackage && (
          <Flex align="center" justify="space-between">
            <Text className="text-gray-600" size="sm">
              {" "}
              {room.residentAdult} x Resident Adult
            </Text>

            <Text className="text-gray-600" size="sm">
              {" "}
              KES{priceTripleResidentAdultGamePackage.toLocaleString()}
            </Text>
          </Flex>
        )}

        {!!priceTripleResidentAdultFullBoard && (
          <Flex align="center" justify="space-between">
            <Text className="text-gray-600" size="sm">
              {" "}
              {room.residentAdult} x Resident Adult
            </Text>

            <Text className="text-gray-600" size="sm">
              {" "}
              KES{priceTripleResidentAdultFullBoard.toLocaleString()}
            </Text>
          </Flex>
        )}

        {!!priceTripleResidentAdultHalfBoard && (
          <Flex align="center" justify="space-between">
            <Text className="text-gray-600" size="sm">
              {" "}
              {room.residentAdult} x Resident Adult
            </Text>

            <Text className="text-gray-600" size="sm">
              {" "}
              KES{priceTripleResidentAdultHalfBoard.toLocaleString()}
            </Text>
          </Flex>
        )}

        {!!priceTripleResidentAdultBedAndBreakfast && (
          <Flex align="center" justify="space-between">
            <Text className="text-gray-600" size="sm">
              {" "}
              {room.residentAdult} x Resident Adult
            </Text>

            <Text className="text-gray-600" size="sm">
              {" "}
              KES{priceTripleResidentAdultBedAndBreakfast.toLocaleString()}
            </Text>
          </Flex>
        )}

        {!!priceSingleResidentChildAllInclusive && (
          <Flex align="center" justify="space-between">
            <Text className="text-gray-600" size="sm">
              {" "}
              {room.residentChild} x Resident Child
            </Text>

            <Text className="text-gray-600" size="sm">
              {" "}
              KES{priceSingleResidentChildAllInclusive.toLocaleString()}
            </Text>
          </Flex>
        )}

        {!!priceSingleResidentChildGamePackage && (
          <Flex align="center" justify="space-between">
            <Text className="text-gray-600" size="sm">
              {" "}
              {room.residentChild} x Resident Child
            </Text>

            <Text className="text-gray-600" size="sm">
              {" "}
              KES{priceSingleResidentChildGamePackage.toLocaleString()}
            </Text>
          </Flex>
        )}

        {!!priceSingleResidentChildFullBoard && (
          <Flex align="center" justify="space-between">
            <Text className="text-gray-600" size="sm">
              {" "}
              {room.residentChild} x Resident Child
            </Text>

            <Text className="text-gray-600" size="sm">
              {" "}
              KES{priceSingleResidentChildFullBoard.toLocaleString()}
            </Text>
          </Flex>
        )}

        {!!priceSingleResidentChildHalfBoard && (
          <Flex align="center" justify="space-between">
            <Text className="text-gray-600" size="sm">
              {" "}
              {room.residentChild} x Resident Child
            </Text>

            <Text className="text-gray-600" size="sm">
              {" "}
              KES{priceSingleResidentChildHalfBoard.toLocaleString()}
            </Text>
          </Flex>
        )}

        {!!priceSingleResidentChildBedAndBreakfast && (
          <Flex align="center" justify="space-between">
            <Text className="text-gray-600" size="sm">
              {" "}
              {room.residentChild} x Resident Child
            </Text>

            <Text className="text-gray-600" size="sm">
              {" "}
              KES{priceSingleResidentChildBedAndBreakfast.toLocaleString()}
            </Text>
          </Flex>
        )}

        {!!priceDoubleResidentChildAllInclusive && (
          <Flex align="center" justify="space-between">
            <Text className="text-gray-600" size="sm">
              {" "}
              {room.residentChild} x Resident Child
            </Text>

            <Text className="text-gray-600" size="sm">
              {" "}
              KES{priceDoubleResidentChildAllInclusive.toLocaleString()}
            </Text>
          </Flex>
        )}

        {!!priceDoubleResidentChildGamePackage && (
          <Flex align="center" justify="space-between">
            <Text className="text-gray-600" size="sm">
              {" "}
              {room.residentChild} x Resident Child
            </Text>

            <Text className="text-gray-600" size="sm">
              {" "}
              KES{priceDoubleResidentChildGamePackage.toLocaleString()}
            </Text>
          </Flex>
        )}

        {!!priceDoubleResidentChildFullBoard && (
          <Flex align="center" justify="space-between">
            <Text className="text-gray-600" size="sm">
              {" "}
              {room.residentChild} x Resident Child
            </Text>

            <Text className="text-gray-600" size="sm">
              {" "}
              KES{priceDoubleResidentChildFullBoard.toLocaleString()}
            </Text>
          </Flex>
        )}

        {!!priceDoubleResidentChildHalfBoard && (
          <Flex align="center" justify="space-between">
            <Text className="text-gray-600" size="sm">
              {" "}
              {room.residentChild} x Resident Child
            </Text>

            <Text className="text-gray-600" size="sm">
              {" "}
              KES{priceDoubleResidentChildHalfBoard.toLocaleString()}
            </Text>
          </Flex>
        )}

        {!!priceDoubleResidentChildBedAndBreakfast && (
          <Flex align="center" justify="space-between">
            <Text className="text-gray-600" size="sm">
              {" "}
              {room.residentChild} x Resident Child
            </Text>

            <Text className="text-gray-600" size="sm">
              {" "}
              KES{priceDoubleResidentChildBedAndBreakfast.toLocaleString()}
            </Text>
          </Flex>
        )}

        {!!priceTripleResidentChildAllInclusive && (
          <Flex align="center" justify="space-between">
            <Text className="text-gray-600" size="sm">
              {" "}
              {room.residentChild} x Resident Child
            </Text>

            <Text className="text-gray-600" size="sm">
              {" "}
              KES{priceTripleResidentChildAllInclusive.toLocaleString()}
            </Text>
          </Flex>
        )}

        {!!priceTripleResidentChildGamePackage && (
          <Flex align="center" justify="space-between">
            <Text className="text-gray-600" size="sm">
              {" "}
              {room.residentChild} x Resident Child
            </Text>

            <Text className="text-gray-600" size="sm">
              {" "}
              KES{priceTripleResidentChildGamePackage.toLocaleString()}
            </Text>
          </Flex>
        )}

        {!!priceTripleResidentChildFullBoard && (
          <Flex align="center" justify="space-between">
            <Text className="text-gray-600" size="sm">
              {" "}
              {room.residentChild} x Resident Child
            </Text>

            <Text className="text-gray-600" size="sm">
              {" "}
              KES{priceTripleResidentChildFullBoard.toLocaleString()}
            </Text>
          </Flex>
        )}

        {!!priceTripleResidentChildHalfBoard && (
          <Flex align="center" justify="space-between">
            <Text className="text-gray-600" size="sm">
              {" "}
              {room.residentChild} x Resident Child
            </Text>

            <Text className="text-gray-600" size="sm">
              {" "}
              KES{priceTripleResidentChildHalfBoard.toLocaleString()}
            </Text>
          </Flex>
        )}

        {!!priceTripleResidentChildBedAndBreakfast && (
          <Flex align="center" justify="space-between">
            <Text className="text-gray-600" size="sm">
              {" "}
              {room.residentChild} x Resident Child
            </Text>

            <Text className="text-gray-600" size="sm">
              {" "}
              KES{priceTripleResidentChildBedAndBreakfast.toLocaleString()}
            </Text>
          </Flex>
        )}

        {!!priceResidentInfantAllInclusive && (
          <Flex align="center" justify="space-between">
            <Text className="text-gray-600" size="sm">
              {" "}
              {room.residentInfant} x Resident Infant
            </Text>

            <Text className="text-gray-600" size="sm">
              {" "}
              KES{priceResidentInfantAllInclusive.toLocaleString()}
            </Text>
          </Flex>
        )}

        {!!priceResidentInfantGamePackage && (
          <Flex align="center" justify="space-between">
            <Text className="text-gray-600" size="sm">
              {" "}
              {room.residentInfant} x Resident Infant
            </Text>

            <Text className="text-gray-600" size="sm">
              {" "}
              KES{priceResidentInfantGamePackage.toLocaleString()}
            </Text>
          </Flex>
        )}

        {!!priceResidentInfantFullBoard && (
          <Flex align="center" justify="space-between">
            <Text className="text-gray-600" size="sm">
              {" "}
              {room.residentInfant} x Resident Infant
            </Text>

            <Text className="text-gray-600" size="sm">
              {" "}
              KES{priceResidentInfantFullBoard.toLocaleString()}
            </Text>
          </Flex>
        )}

        {!!priceResidentInfantHalfBoard && (
          <Flex align="center" justify="space-between">
            <Text className="text-gray-600" size="sm">
              {" "}
              {room.residentInfant} x Resident Infant
            </Text>

            <Text className="text-gray-600" size="sm">
              {" "}
              KES{priceResidentInfantHalfBoard.toLocaleString()}
            </Text>
          </Flex>
        )}

        {!!priceResidentInfantBedAndBreakfast && (
          <Flex align="center" justify="space-between">
            <Text className="text-gray-600" size="sm">
              {" "}
              {room.residentInfant} x Resident Infant
            </Text>

            <Text className="text-gray-600" size="sm">
              {" "}
              KES{priceResidentInfantBedAndBreakfast.toLocaleString()}
            </Text>
          </Flex>
        )}
      </div>
    </div>
  );
}
