import {
  ActivityFee,
  ExtraFee,
  NonResidentGuests,
  ResidentGuests,
  Room,
} from "@/context/CalculatePage";
import {
  RoomAvailabilityNonResident,
  RoomAvailabilityResident,
  RoomAvailabilityResidentGuest,
  RoomType,
  Stay,
} from "./types";
import { AgentDiscountRateType } from "@/pages/api/stays";

export function countRoomTypes(roomArray: Room[]): string[] {
  const roomCount: { [name: string]: number } = {};
  for (let room of roomArray) {
    const roomName = room.name.trim().toLowerCase();
    if (roomName === "") {
      continue;
    }
    if (roomCount[roomName]) {
      roomCount[roomName]++;
    } else {
      roomCount[roomName] = 1;
    }
  }
  const result: string[] = [];
  for (let roomName in roomCount) {
    result.push(`${roomCount[roomName]} ${roomName}`);
  }
  return result;
}

function calculateActivityFees(
  activityFee: ActivityFee[],
  totalNumberOfGuests: number,
  numberOfNights: number
) {
  let totalActivityFees = 0;
  activityFee.forEach((activity) => {
    switch (activity.priceType) {
      case "PER PERSON":
        totalActivityFees += Number(activity.price) * totalNumberOfGuests;
        break;
      case "WHOLE GROUP":
        totalActivityFees += Number(activity.price);
        break;
      case "PER PERSON PER NIGHT":
        totalActivityFees +=
          Number(activity.price) * totalNumberOfGuests * numberOfNights;
        break;
      default:
        break;
    }
  });
  return totalActivityFees;
}

function calculateResidentActivityFees(
  activityFee: ActivityFee[],
  totalNumberOfGuests: number,
  numberOfNights: number
) {
  let totalActivityFees = 0;
  activityFee.forEach((activity) => {
    switch (activity.priceType) {
      case "PER PERSON":
        totalActivityFees +=
          Number(activity.resident_price) * totalNumberOfGuests;
        break;
      case "WHOLE GROUP":
        totalActivityFees += Number(activity.resident_price);
        break;
      case "PER PERSON PER NIGHT":
        totalActivityFees +=
          Number(activity.resident_price) *
          totalNumberOfGuests *
          numberOfNights;
        break;
      default:
        break;
    }
  });
  return totalActivityFees;
}

function calculateExtraFees(
  extraFee: ExtraFee[],
  totalNumberOfGuests: number,
  numberOfNights: number
) {
  let totalExtraFees = 0;
  extraFee.forEach((extra) => {
    switch (extra.pricingType) {
      case "PER PERSON":
        totalExtraFees += Number(extra.price) * totalNumberOfGuests;
        break;
      case "WHOLE GROUP":
        totalExtraFees += Number(extra.price);
        break;
      case "PER PERSON PER NIGHT":
        totalExtraFees +=
          Number(extra.price) * totalNumberOfGuests * numberOfNights;
        break;
      default:
        break;
    }
  });
  return totalExtraFees;
}

function findPercentage(
  data: AgentDiscountRateType[],
  date: string
): {
  rate: number;
  resident_rate: number;
} {
  const targetDate = new Date(date);

  let percentage = {
    rate: 0,
    resident_rate: 0,
  };

  for (const item of data) {
    const startDate = item.start_date ? new Date(item.start_date) : null;
    const endDate = item.end_date ? new Date(item.end_date) : null;

    if (startDate && endDate) {
      if (targetDate >= startDate && targetDate <= endDate) {
        percentage = {
          rate: item.percentage,
          resident_rate: item.resident_percentage,
        };
      }
    } else if (!startDate && !endDate) {
      percentage = {
        rate: item.percentage,
        resident_rate: item.resident_percentage,
      };
    }
  }

  return percentage;
}

function findPercentageWithState(
  data: AgentDiscountRateType[],
  date: string
): {
  standard: boolean;
  rate: number;
  resident_rate: number;
  start_date: string;
  end_date: string;
} {
  const targetDate = new Date(date);

  let percentage = {
    standard: false,
    rate: 0,
    resident_rate: 0,
    start_date: "",
    end_date: "",
  };

  for (const item of data) {
    const startDate = item.start_date ? new Date(item.start_date) : null;
    const endDate = item.end_date ? new Date(item.end_date) : null;

    if (startDate && endDate) {
      if (targetDate >= startDate && targetDate <= endDate) {
        percentage = {
          standard: false,
          rate: item.percentage,
          resident_rate: item.resident_percentage,
          start_date: item.start_date || "",
          end_date: item.end_date || "",
        };
      }
    } else if (!startDate && !endDate) {
      percentage = {
        standard: true,
        rate: item.percentage,
        resident_rate: item.resident_percentage,
        start_date: "",
        end_date: "",
      };
    }
  }

  return percentage;
}

function residentPrice(
  roomName: string,
  guestName: string | undefined,
  packageName: string | undefined,
  numberOfGuests: number,
  availabilities: RoomType[] | undefined,
  agentRates: AgentDiscountRateType[] | undefined
) {
  if (!availabilities) {
    return null; // Invalid input, return null
  }

  let totalPrice = 0;

  for (const availability of availabilities) {
    if (
      availability.name?.toLowerCase() === roomName.toLowerCase() &&
      availability.package.toLowerCase() === packageName?.toLowerCase()
    ) {
      for (const roomAvailability of availability.room_resident_availabilities) {
        for (const guestAvailability of roomAvailability.room_resident_guest_availabilities) {
          if (
            guestAvailability.name?.toLowerCase() === guestName?.toLowerCase()
          ) {
            let percentage = findPercentage(
              agentRates || [],
              roomAvailability.date
            );
            // convert to decimal
            const residentPercentage = percentage.resident_rate / 100;
            totalPrice +=
              guestAvailability.price -
              guestAvailability.price * residentPercentage;
          }
        }
      }
    }
  }

  return totalPrice * numberOfGuests;
}

const nonResidentPrice = (
  roomName: string,
  guestName: string | undefined,
  packageName: string | undefined,
  numberOfGuests: number,
  availabilities: RoomType[] | undefined,
  agentRates: AgentDiscountRateType[] | undefined
) => {
  if (!availabilities) {
    return null; // Invalid input, return null
  }

  let totalPrice = 0;

  for (const availability of availabilities) {
    if (
      availability.name?.toLowerCase() === roomName.toLowerCase() &&
      availability.package.toLowerCase() === packageName?.toLowerCase()
    ) {
      for (const roomAvailability of availability.room_non_resident_availabilities) {
        for (const guestAvailability of roomAvailability.room_non_resident_guest_availabilities) {
          if (
            guestAvailability.name?.toLowerCase() === guestName?.toLowerCase()
          ) {
            let percentage = findPercentage(
              agentRates || [],
              roomAvailability.date
            );
            // convert to decimal
            const nonResidentPercentage = percentage.rate / 100;
            totalPrice +=
              guestAvailability.price -
              guestAvailability.price * nonResidentPercentage;
            break;
          }
        }
      }
    }
  }

  return totalPrice * numberOfGuests;
};

const findCommonRoomResidentNamesWithDescription = (
  name: string | undefined,
  packageName: string | undefined,
  packages: RoomType[] | undefined,
  allNames: boolean = false
): ({ name?: string; description?: string } | undefined)[] => {
  if (packages && name && packageName) {
    const filteredPackage = packages.find(
      (pkg) => pkg.name === name && pkg.package === packageName
    );
    if (!filteredPackage) {
      return [];
    }

    const { room_resident_availabilities } = filteredPackage;
    const nameSets = room_resident_availabilities.map(
      (room: RoomAvailabilityResident) =>
        room.room_resident_guest_availabilities.map(
          (guest: RoomAvailabilityResidentGuest) => ({
            name: guest.name?.toLowerCase(),
            description: guest.description,
            price: guest.price,
          })
        )
    );

    const nameSet = new Set();
    const commonNames = [];

    for (const nameArr of nameSets) {
      for (const nameObj of nameArr) {
        if (
          !nameSet.has(nameObj.name) &&
          (nameObj.price ||
            nameObj.name?.toLowerCase().trim() === "infant" ||
            nameObj.name?.toLowerCase().trim() === "infants" ||
            allNames)
        ) {
          nameSet.add(nameObj.name);
          commonNames.push(nameObj);
        }
      }
    }

    return commonNames;
  }
  return [];
};

const findCommonRoomNonResidentNamesWithDescription = (
  name: string | undefined,
  packageName: string | undefined,
  packages: RoomType[] | undefined,
  allNames: boolean = false
): ({ name?: string; description?: string } | undefined)[] => {
  if (packages && name && packageName) {
    const filteredPackage = packages.find(
      (pkg) => pkg.name === name && pkg.package === packageName
    );
    if (!filteredPackage) {
      return [];
    }

    const { room_non_resident_availabilities } = filteredPackage;
    const nameSets = room_non_resident_availabilities.map(
      (room: RoomAvailabilityNonResident) =>
        room.room_non_resident_guest_availabilities.map(
          (guest: RoomAvailabilityResidentGuest) => ({
            name: guest.name?.toLowerCase(),
            description: guest.description,
            price: guest.price,
          })
        )
    );

    const nameSet = new Set();
    const commonNames = [];

    for (const nameArr of nameSets) {
      for (const nameObj of nameArr) {
        if (
          !nameSet.has(nameObj.name) &&
          (nameObj.price ||
            nameObj.name?.toLowerCase().trim() === "infant" ||
            nameObj.name?.toLowerCase().trim() === "infants" ||
            allNames)
        ) {
          nameSet.add(nameObj.name);
          commonNames.push(nameObj);
        }
      }
    }
    // console.log("Common names ", commonNames);
    // console.log("Name sets ", nameSets);
    return commonNames;
  }
  return [];
};

function countResidentGuestTypesWithPrice(
  residentGuests: ResidentGuests[],
  room: Room,
  roomTypes: RoomType[] | undefined,
  agentRates: AgentDiscountRateType[] | undefined
): { name: string; price: number | null }[] {
  const counts: { [key: string]: number } = {};

  for (const guest of residentGuests) {
    if (guest.resident === "") continue;

    const guestType = guest.guestType ? `(${guest.guestType})` : "";
    const numberOfGuests = guest.numberOfGuests;
    const name = `${guest.resident}${guestType}`;

    counts[name] = (counts[name] || 0) + numberOfGuests;
  }

  return Object.keys(counts).map((name) => {
    const count = counts[name];
    const guestType =
      name.includes("(") && name.includes(")")
        ? name.split("(")[1].split(")")[0]
        : undefined;
    const price = guestType
      ? residentPrice(
          room.name,
          guestType,
          room.package,
          count,
          roomTypes,
          agentRates
        )
      : 0;

    return { name: `${count} ${name}`, price };
  });
}

function countNonResidentGuestTypesWithPrice(
  nonResidentGuests: NonResidentGuests[],
  room: Room,
  roomTypes: RoomType[] | undefined,
  agentRates: AgentDiscountRateType[] | undefined
): { name: string; price: number | null }[] {
  const counts: { [key: string]: number } = {};

  for (const guest of nonResidentGuests) {
    if (guest.nonResident === "") continue;

    const guestType = guest.guestType ? `(${guest.guestType})` : "";
    const numberOfGuests = guest.numberOfGuests;
    const name = `${guest.nonResident}${guestType}`;

    counts[name] = (counts[name] || 0) + numberOfGuests;
  }

  return Object.keys(counts).map((name) => {
    const count = counts[name];

    const guestType = name.slice(name.indexOf("(") + 1, name.lastIndexOf(")"));

    const price = guestType
      ? nonResidentPrice(
          room.name,
          guestType,
          room.package,
          count,
          roomTypes,
          agentRates
        )
      : 0;

    return { name: `${count} ${name}`, price };
  });
}

function getTotalGuestsByCategory(rooms: Room[]): {
  residentAdults: number;
  residentChildren: number;
  residentInfants: number;
  residentTeens: number;
  nonResidentAdults: number;
  nonResidentChildren: number;
  nonResidentInfants: number;
  nonResidentTeens: number;
} {
  let residentAdults = 0;
  let residentChildren = 0;
  let residentInfants = 0;
  let residentTeens = 0;
  let nonResidentAdults = 0;
  let nonResidentChildren = 0;
  let nonResidentInfants = 0;
  let nonResidentTeens = 0;

  rooms.forEach((room) => {
    room.residentGuests.forEach((guest) => {
      switch (guest.resident) {
        case "Adult":
          residentAdults += guest.numberOfGuests;
          break;
        case "Child":
          residentChildren += guest.numberOfGuests;
          break;
        case "Infant":
          residentInfants += guest.numberOfGuests;
          break;
        case "Teen":
          residentTeens += guest.numberOfGuests;
          break;
        default:
          break;
      }
    });

    room.nonResidentGuests.forEach((guest) => {
      switch (guest.nonResident) {
        case "Adult":
          nonResidentAdults += guest.numberOfGuests;
          break;
        case "Child":
          nonResidentChildren += guest.numberOfGuests;
          break;
        case "Infant":
          nonResidentInfants += guest.numberOfGuests;
          break;
        case "Teen":
          nonResidentTeens += guest.numberOfGuests;
          break;
        default:
          break;
      }
    });
  });

  return {
    residentAdults,
    residentChildren,
    residentInfants,
    residentTeens,
    nonResidentAdults,
    nonResidentChildren,
    nonResidentInfants,
    nonResidentTeens,
  };
}

function getTotalResidentParkFees(rooms: Room[]): number {
  let total = 0;
  rooms.forEach((room) => {
    room.otherFees.forEach((fee) => {
      room.residentGuests.forEach((guest) => {
        if (guest.resident === "Adult") {
          total += fee.residentAdultPrice * guest.numberOfGuests;
        }
        if (guest.resident === "Child") {
          total += fee.residentChildPrice * guest.numberOfGuests;
        }
        if (guest.resident === "Teen") {
          total += fee.residentTeenPrice * guest.numberOfGuests;
        }
      });
    });
  });

  return total;
}

function getTotalNonResidentParkFees(rooms: Room[]): number {
  let total = 0;
  rooms.forEach((room) => {
    room.otherFees.forEach((fee) => {
      room.nonResidentGuests.forEach((guest) => {
        if (guest.nonResident === "Adult") {
          total += fee.nonResidentAdultPrice * guest.numberOfGuests;
        }
        if (guest.nonResident === "Child") {
          total += fee.nonResidentChildPrice * guest.numberOfGuests;
        }
        if (guest.nonResident === "Teen") {
          total += fee.nonResidentTeenPrice * guest.numberOfGuests;
        }
      });
    });
  });

  return total;
}

function findUniqueFees(rooms: Room[]): OtherFees[] {
  const uniqueFees: OtherFees[] = [];
  const uniqueNames: Set<string | undefined> = new Set();

  rooms.forEach((room) => {
    room.otherFees.forEach((fee) => {
      if (!uniqueNames.has(fee.name)) {
        uniqueFees.push(fee);
        uniqueNames.add(fee.name);
      }
    });
  });

  return uniqueFees;
}

function getResidentTotalPriceOtherFee(rooms: Room[], fee: OtherFees): number {
  let total = 0;
  rooms.forEach((room) => {
    room.otherFees.forEach((roomFee) => {
      if (roomFee.name === fee.name) {
        room.residentGuests.forEach((guest) => {
          if (guest.resident === "Adult") {
            total += roomFee.residentAdultPrice * guest.numberOfGuests;
          }
          if (guest.resident === "Child") {
            total += roomFee.residentChildPrice * guest.numberOfGuests;
          }
          if (guest.resident === "Teen") {
            total += roomFee.residentTeenPrice * guest.numberOfGuests;
          }
        });
      }
    });
  });

  return total;
}

function getNonResidentTotalPriceOtherFee(
  rooms: Room[],
  fee: OtherFees
): number {
  let total = 0;
  rooms.forEach((room) => {
    room.otherFees.forEach((roomFee) => {
      if (roomFee.name === fee.name) {
        room.nonResidentGuests.forEach((guest) => {
          if (guest.nonResident === "Adult") {
            total += roomFee.nonResidentAdultPrice * guest.numberOfGuests;
          }
          if (guest.nonResident === "Child") {
            total += roomFee.nonResidentChildPrice * guest.numberOfGuests;
          }
          if (guest.nonResident === "Teen") {
            total += roomFee.nonResidentTeenPrice * guest.numberOfGuests;
          }
        });
      }
    });
  });

  return total;
}

export function getTotalParkFeesByCategory(rooms: Room[]): {
  residentParkFee: {
    adult: number;
    child: number;
    infant: number;
    teen: number;
  };
  nonResidentParkFee: {
    adult: number;
    child: number;
    infant: number;
    teen: number;
  };
} {
  const totalFeesByCategory = {
    residentParkFee: { adult: 0, child: 0, infant: 0, teen: 0 },
    nonResidentParkFee: { adult: 0, child: 0, infant: 0, teen: 0 },
  };

  rooms.forEach((room) => {
    // Calculate resident park fees
    room.residentParkFee.forEach((parkFee) => {
      if (parkFee.guestType === "ADULT") {
        totalFeesByCategory.residentParkFee.adult += parkFee.price;
      } else if (parkFee.guestType === "CHILD") {
        totalFeesByCategory.residentParkFee.child += parkFee.price;
      } else if (parkFee.guestType === "INFANT") {
        totalFeesByCategory.residentParkFee.infant += parkFee.price;
      } else if (parkFee.guestType === "TEEN") {
        totalFeesByCategory.residentParkFee.teen += parkFee.price;
      }
    });

    // Calculate non-resident park fees
    room.nonResidentParkFee.forEach((parkFee) => {
      if (parkFee.guestType === "ADULT") {
        totalFeesByCategory.nonResidentParkFee.adult += parkFee.price;
      } else if (parkFee.guestType === "CHILD") {
        totalFeesByCategory.nonResidentParkFee.child += parkFee.price;
      } else if (parkFee.guestType === "INFANT") {
        totalFeesByCategory.nonResidentParkFee.infant += parkFee.price;
      } else if (parkFee.guestType === "TEEN") {
        totalFeesByCategory.nonResidentParkFee.teen += parkFee.price;
      }
    });
  });

  return totalFeesByCategory;
}

function calculateRoomFees(
  rooms: Room[],
  nights: number
): {
  residentTotalFeePrice: number;
  nonResidentTotalFeePrice: number;
} {
  let residentTotalFeePrice = 0;
  let nonResidentTotalFeePrice = 0;

  for (const room of rooms) {
    for (const residentGuest of room.residentGuests) {
      const residentGuestType = residentGuest.resident.toLowerCase() || "";
      const residentGuestCount = countGuestsOfType(
        room.residentGuests,
        residentGuest.resident
      );

      const residentParkFees = room.residentParkFee.filter(
        (fee) => fee.guestType?.toLowerCase() === residentGuestType
      );

      for (const residentParkFee of residentParkFees) {
        residentTotalFeePrice += residentParkFee.price;
      }
    }

    for (const nonResidentGuest of room.nonResidentGuests) {
      const nonResidentGuestType =
        nonResidentGuest.nonResident.toLowerCase() || "";
      const nonResidentGuestCount = countGuestsOfType(
        room.nonResidentGuests,
        nonResidentGuest.nonResident
      );

      const nonResidentParkFees = room.nonResidentParkFee.filter((fee) => {
        return fee.guestType?.toLowerCase() === nonResidentGuestType;
      });

      for (const nonResidentParkFee of nonResidentParkFees) {
        nonResidentTotalFeePrice += nonResidentParkFee.price;
      }
    }
  }

  residentTotalFeePrice *= nights;
  nonResidentTotalFeePrice *= nights;

  return { residentTotalFeePrice, nonResidentTotalFeePrice };
}

function countGuestsOfType(
  guests: { resident?: string; nonResident?: string }[],
  type: string
): number {
  return guests.filter(
    (guest) =>
      guest.resident?.toLowerCase() === type.toLowerCase() ||
      guest.nonResident?.toLowerCase() === type.toLowerCase()
  ).length;
}

function clientIncludedInPrice(
  price: number,
  includeClient: boolean,
  commission: number
): number {
  return includeClient ? price + price * (commission / 100) : price;
}

export type OtherFees = {
  id: number;
  name?: string;
  residentAdultPrice: number;
  residentChildPrice: number;
  residentTeenPrice: number;
  nonResidentAdultPrice: number;
  nonResidentChildPrice: number;
  nonResidentTeenPrice: number;
};

function findMatchingFees(stay: Stay): OtherFees[] {
  const matchingFees: OtherFees[] = [];

  stay.other_fees_non_resident.forEach((nonResidentFee) => {
    stay.other_fees_resident.forEach((residentFee) => {
      if (
        nonResidentFee.name &&
        residentFee.name &&
        nonResidentFee.name.toLowerCase() === residentFee.name.toLowerCase() &&
        (nonResidentFee.adult_price ||
          nonResidentFee.child_price ||
          nonResidentFee.teen_price ||
          residentFee.adult_price ||
          residentFee.child_price ||
          residentFee.teen_price)
      ) {
        const matchingFee: OtherFees = {
          id: nonResidentFee.id,
          name: nonResidentFee.name,
          residentAdultPrice: residentFee.adult_price,
          residentChildPrice: residentFee.child_price,
          residentTeenPrice: residentFee.teen_price,
          nonResidentAdultPrice: nonResidentFee.adult_price,
          nonResidentChildPrice: nonResidentFee.child_price,
          nonResidentTeenPrice: nonResidentFee.teen_price,
        };
        matchingFees.push(matchingFee);
      }
    });
  });

  return matchingFees;
}

const pricing = {
  calculateActivityFees,
  calculateExtraFees,
  findMatchingFees,
  getTotalResidentParkFees,
  getTotalNonResidentParkFees,
  findUniqueFees,
  getResidentTotalPriceOtherFee,
  getNonResidentTotalPriceOtherFee,
  calculateResidentActivityFees,
  findPercentage,
  findPercentageWithState,

  findCommonRoomResidentNamesWithDescription,
  findCommonRoomNonResidentNamesWithDescription,
  countResidentGuestTypesWithPrice,
  countNonResidentGuestTypesWithPrice,
  getTotalGuestsByCategory,
  getTotalParkFeesByCategory,
  calculateRoomFees,
  clientIncludedInPrice,
};

export default pricing;
