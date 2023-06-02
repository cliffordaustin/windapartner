import {
  ActivityFee,
  ExtraFee,
  NonResidentGuests,
  ResidentGuests,
  Room,
} from "@/context/CalculatePage";
import { RoomType } from "./types";

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

//For Single Resident Adults

function singleResidentAdultAllInclusivePrice(
  numberOfResidentAdult: number,
  roomPackage: string,
  availabilities: RoomType[] | undefined
): number | null {
  if (roomPackage !== "ALL INCLUSIVE" || numberOfResidentAdult !== 1) {
    return null; // Invalid input, return null
  }

  if (!availabilities) {
    return null; // Invalid input, return null
  }

  let totalPrice = 0;

  for (const availability of availabilities) {
    if (availability.package === "ALL INCLUSIVE") {
      for (const roomAvailability of availability.room_resident_availabilities) {
        for (const guestAvailability of roomAvailability.room_resident_guest_availabilities) {
          if (guestAvailability.name === "ADULT SINGLE") {
            totalPrice += guestAvailability.price;
          }
        }
      }
    }
  }

  return totalPrice;
}

function singleResidentAdultGamePackagePrice(
  numberOfResidentAdult: number,
  roomPackage: string,
  availabilities: RoomType[] | undefined
): number | null {
  if (roomPackage !== "GAME PACKAGE" || numberOfResidentAdult !== 1) {
    return null; // Invalid input, return null
  }

  if (!availabilities) {
    return null; // Invalid input, return null
  }

  let totalPrice = 0;

  for (const availability of availabilities) {
    if (availability.package === "GAME PACKAGE") {
      for (const roomAvailability of availability.room_resident_availabilities) {
        for (const guestAvailability of roomAvailability.room_resident_guest_availabilities) {
          if (guestAvailability.name === "ADULT SINGLE") {
            totalPrice += guestAvailability.price;
          }
        }
      }
    }
  }

  return totalPrice;
}

function singleResidentAdultFullBoardPrice(
  numberOfResidentAdult: number,
  roomPackage: string,
  availabilities: RoomType[] | undefined
): number | null {
  if (roomPackage !== "FULL BOARD" || numberOfResidentAdult !== 1) {
    return null; // Invalid input, return null
  }

  if (!availabilities) {
    return null; // Invalid input, return null
  }

  let totalPrice = 0;

  for (const availability of availabilities) {
    if (availability.package === "FULL BOARD") {
      for (const roomAvailability of availability.room_resident_availabilities) {
        for (const guestAvailability of roomAvailability.room_resident_guest_availabilities) {
          if (guestAvailability.name === "ADULT SINGLE") {
            totalPrice += guestAvailability.price;
          }
        }
      }
    }
  }

  return totalPrice;
}

function singleResidentAdultHalfBoardPrice(
  numberOfResidentAdult: number,
  roomPackage: string,
  availabilities: RoomType[] | undefined
): number | null {
  if (roomPackage !== "HALF BOARD" || numberOfResidentAdult !== 1) {
    return null; // Invalid input, return null
  }

  if (!availabilities) {
    return null; // Invalid input, return null
  }

  let totalPrice = 0;

  for (const availability of availabilities) {
    if (availability.package === "HALF BOARD") {
      for (const roomAvailability of availability.room_resident_availabilities) {
        for (const guestAvailability of roomAvailability.room_resident_guest_availabilities) {
          if (guestAvailability.name === "ADULT SINGLE") {
            totalPrice += guestAvailability.price;
          }
        }
      }
    }
  }

  return totalPrice;
}

function singleResidentAdultBedAndBreakfastPrice(
  numberOfResidentAdult: number,
  roomPackage: string,
  availabilities: RoomType[] | undefined
): number | null {
  if (roomPackage !== "BED AND BREAKFAST" || numberOfResidentAdult !== 1) {
    return null; // Invalid input, return null
  }

  if (!availabilities) {
    return null; // Invalid input, return null
  }

  let totalPrice = 0;

  for (const availability of availabilities) {
    if (availability.package === "BED AND BREAKFAST") {
      for (const roomAvailability of availability.room_resident_availabilities) {
        for (const guestAvailability of roomAvailability.room_resident_guest_availabilities) {
          if (guestAvailability.name === "ADULT SINGLE") {
            totalPrice += guestAvailability.price;
          }
        }
      }
    }
  }

  return totalPrice;
}

// For Double Resident Adults
function doubleResidentAdultGamePackagePrice(
  numberOfResidentAdult: number,
  roomPackage: string,
  availabilities: RoomType[] | undefined
) {
  if (roomPackage !== "GAME PACKAGE" || numberOfResidentAdult !== 2) {
    return null; // Invalid input, return null
  }

  if (!availabilities) {
    return null; // Invalid input, return null
  }

  let totalPrice = 0;

  for (const availability of availabilities) {
    if (availability.package === "GAME PACKAGE") {
      let hasAdultDouble = false;
      for (const roomAvailability of availability.room_resident_availabilities) {
        for (const guestAvailability of roomAvailability.room_resident_guest_availabilities) {
          if (guestAvailability.name === "ADULT DOUBLE") {
            totalPrice += guestAvailability.price;
            hasAdultDouble = true;
          }
        }
        // If the current room availability doesn't have ADULT DOUBLE,
        // use ADULT SINGLE price if it exists
        if (!hasAdultDouble) {
          for (const guestAvailability of roomAvailability.room_resident_guest_availabilities) {
            if (guestAvailability.name === "ADULT SINGLE") {
              totalPrice += guestAvailability.price;
              break;
            }
          }
        }
      }
    }
  }

  return totalPrice * numberOfResidentAdult;
}

function doubleResidentAdultAllInclusivePrice(
  numberOfResidentAdult: number,
  roomPackage: string,
  availabilities: RoomType[] | undefined
) {
  if (roomPackage !== "ALL INCLUSIVE" || numberOfResidentAdult !== 2) {
    return null; // Invalid input, return null
  }

  if (!availabilities) {
    return null; // Invalid input, return null
  }

  let totalPrice = 0;

  for (const availability of availabilities) {
    if (availability.package === "ALL INCLUSIVE") {
      let hasAdultDouble = false;
      for (const roomAvailability of availability.room_resident_availabilities) {
        for (const guestAvailability of roomAvailability.room_resident_guest_availabilities) {
          if (guestAvailability.name === "ADULT DOUBLE") {
            totalPrice += guestAvailability.price;
            hasAdultDouble = true;
          }
        }
        // If the current room availability doesn't have ADULT DOUBLE,
        // use ADULT SINGLE price if it exists
        if (!hasAdultDouble) {
          for (const guestAvailability of roomAvailability.room_resident_guest_availabilities) {
            if (guestAvailability.name === "ADULT SINGLE") {
              totalPrice += guestAvailability.price;
              break;
            }
          }
        }
      }
    }
  }

  return totalPrice * numberOfResidentAdult;
}

function doubleResidentAdultFullBoardPrice(
  numberOfResidentAdult: number,
  roomPackage: string,
  availabilities: RoomType[] | undefined
) {
  if (roomPackage !== "FULL BOARD" || numberOfResidentAdult !== 2) {
    return null; // Invalid input, return null
  }

  if (!availabilities) {
    return null; // Invalid input, return null
  }

  let totalPrice = 0;

  for (const availability of availabilities) {
    if (availability.package === "FULL BOARD") {
      let hasAdultDouble = false;
      for (const roomAvailability of availability.room_resident_availabilities) {
        for (const guestAvailability of roomAvailability.room_resident_guest_availabilities) {
          if (guestAvailability.name === "ADULT DOUBLE") {
            totalPrice += guestAvailability.price;
            hasAdultDouble = true;
          }
        }
        // If the current room availability doesn't have ADULT DOUBLE,
        // use ADULT SINGLE price if it exists
        if (!hasAdultDouble) {
          for (const guestAvailability of roomAvailability.room_resident_guest_availabilities) {
            if (guestAvailability.name === "ADULT SINGLE") {
              totalPrice += guestAvailability.price;
              break;
            }
          }
        }
      }
    }
  }

  return totalPrice * numberOfResidentAdult;
}

function doubleResidentAdultHalfBoardPrice(
  numberOfResidentAdult: number,
  roomPackage: string,
  availabilities: RoomType[] | undefined
) {
  if (roomPackage !== "HALF BOARD" || numberOfResidentAdult !== 2) {
    return null; // Invalid input, return null
  }

  if (!availabilities) {
    return null; // Invalid input, return null
  }

  let totalPrice = 0;

  for (const availability of availabilities) {
    if (availability.package === "HALF BOARD") {
      let hasAdultDouble = false;
      for (const roomAvailability of availability.room_resident_availabilities) {
        for (const guestAvailability of roomAvailability.room_resident_guest_availabilities) {
          if (guestAvailability.name === "ADULT DOUBLE") {
            totalPrice += guestAvailability.price;
            hasAdultDouble = true;
          }
        }
        // If the current room availability doesn't have ADULT DOUBLE,
        // use ADULT SINGLE price if it exists
        if (!hasAdultDouble) {
          for (const guestAvailability of roomAvailability.room_resident_guest_availabilities) {
            if (guestAvailability.name === "ADULT SINGLE") {
              totalPrice += guestAvailability.price;
              break;
            }
          }
        }
      }
    }
  }

  return totalPrice * numberOfResidentAdult;
}

function doubleResidentAdultBedAndBreakfastPrice(
  numberOfResidentAdult: number,
  roomPackage: string,
  availabilities: RoomType[] | undefined
) {
  if (roomPackage !== "BED AND BREAKFAST" || numberOfResidentAdult !== 2) {
    return null; // Invalid input, return null
  }

  if (!availabilities) {
    return null; // Invalid input, return null
  }

  let totalPrice = 0;

  for (const availability of availabilities) {
    if (availability.package === "BED AND BREAKFAST") {
      let hasAdultDouble = false;
      for (const roomAvailability of availability.room_resident_availabilities) {
        for (const guestAvailability of roomAvailability.room_resident_guest_availabilities) {
          if (guestAvailability.name === "ADULT DOUBLE") {
            totalPrice += guestAvailability.price;
            hasAdultDouble = true;
          }
        }
        // If the current room availability doesn't have ADULT DOUBLE,
        // use ADULT SINGLE price if it exists
        if (!hasAdultDouble) {
          for (const guestAvailability of roomAvailability.room_resident_guest_availabilities) {
            if (guestAvailability.name === "ADULT SINGLE") {
              totalPrice += guestAvailability.price;
              break;
            }
          }
        }
      }
    }
  }

  return totalPrice * numberOfResidentAdult;
}

// For Triple Resident Adults
function tripleResidentAdultAllInclusivePrice(
  numberOfResidentAdult: number,
  roomPackage: string,
  availabilities: RoomType[] | undefined
) {
  if (roomPackage !== "ALL INCLUSIVE" || numberOfResidentAdult !== 3) {
    return null; // Invalid input, return null
  }

  if (!availabilities) {
    return null; // Invalid input, return null
  }

  let totalPrice = 0;

  for (const availability of availabilities) {
    if (availability.package === "ALL INCLUSIVE") {
      let hasAdultTriple = false;
      let hasAdultDouble = false;
      for (const roomAvailability of availability.room_resident_availabilities) {
        for (const guestAvailability of roomAvailability.room_resident_guest_availabilities) {
          if (guestAvailability.name === "ADULT TRIPLE") {
            totalPrice += guestAvailability.price;
            hasAdultTriple = true;
            hasAdultDouble = true;
          }
        }
        // If the current room availability doesn't have ADULT TRIPLE,
        // use ADULT DOUBLE price if it exists
        if (!hasAdultTriple) {
          for (const guestAvailability of roomAvailability.room_resident_guest_availabilities) {
            if (guestAvailability.name === "ADULT DOUBLE") {
              totalPrice += guestAvailability.price;
              hasAdultDouble = true;
              break;
            }
          }
        }
        if (!hasAdultDouble) {
          for (const guestAvailability of roomAvailability.room_resident_guest_availabilities) {
            if (guestAvailability.name === "ADULT SINGLE") {
              totalPrice += guestAvailability.price;
              break;
            }
          }
        }
      }
    }
  }

  return totalPrice * numberOfResidentAdult;
}

function tripleResidentAdultGamePackagePrice(
  numberOfResidentAdult: number,
  roomPackage: string,
  availabilities: RoomType[] | undefined
) {
  if (roomPackage !== "GAME PACKAGE" || numberOfResidentAdult !== 3) {
    return null; // Invalid input, return null
  }

  if (!availabilities) {
    return null; // Invalid input, return null
  }

  let totalPrice = 0;

  for (const availability of availabilities) {
    if (availability.package === "GAME PACKAGE") {
      let hasAdultTriple = false;
      let hasAdultDouble = false;
      for (const roomAvailability of availability.room_resident_availabilities) {
        for (const guestAvailability of roomAvailability.room_resident_guest_availabilities) {
          if (guestAvailability.name === "ADULT TRIPLE") {
            totalPrice += guestAvailability.price;
            hasAdultTriple = true;
            hasAdultDouble = true;
          }
        }
        // If the current room availability doesn't have ADULT TRIPLE,
        // use ADULT DOUBLE price if it exists
        if (!hasAdultTriple) {
          for (const guestAvailability of roomAvailability.room_resident_guest_availabilities) {
            if (guestAvailability.name === "ADULT DOUBLE") {
              totalPrice += guestAvailability.price;
              hasAdultDouble = true;
              break;
            }
          }
        }
        if (!hasAdultDouble) {
          for (const guestAvailability of roomAvailability.room_resident_guest_availabilities) {
            if (guestAvailability.name === "ADULT SINGLE") {
              totalPrice += guestAvailability.price;
              break;
            }
          }
        }
      }
    }
  }

  return totalPrice * numberOfResidentAdult;
}

function tripleResidentAdultFullBoardPrice(
  numberOfResidentAdult: number,
  roomPackage: string,
  availabilities: RoomType[] | undefined
) {
  if (roomPackage !== "FULL BOARD" || numberOfResidentAdult !== 3) {
    return null; // Invalid input, return null
  }

  if (!availabilities) {
    return null; // Invalid input, return null
  }

  let totalPrice = 0;

  for (const availability of availabilities) {
    if (availability.package === "FULL BOARD") {
      let hasAdultTriple = false;
      let hasAdultDouble = false;
      for (const roomAvailability of availability.room_resident_availabilities) {
        for (const guestAvailability of roomAvailability.room_resident_guest_availabilities) {
          if (guestAvailability.name === "ADULT TRIPLE") {
            totalPrice += guestAvailability.price;
            hasAdultTriple = true;
            hasAdultDouble = true;
          }
        }
        // If the current room availability doesn't have ADULT TRIPLE,
        // use ADULT DOUBLE price if it exists
        if (!hasAdultTriple) {
          for (const guestAvailability of roomAvailability.room_resident_guest_availabilities) {
            if (guestAvailability.name === "ADULT DOUBLE") {
              totalPrice += guestAvailability.price;
              hasAdultDouble = true;
              break;
            }
          }
        }
        if (!hasAdultDouble) {
          for (const guestAvailability of roomAvailability.room_resident_guest_availabilities) {
            if (guestAvailability.name === "ADULT SINGLE") {
              totalPrice += guestAvailability.price;
              break;
            }
          }
        }
      }
    }
  }

  return totalPrice * numberOfResidentAdult;
}

function tripleResidentAdultHalfBoardPrice(
  numberOfResidentAdult: number,
  roomPackage: string,
  availabilities: RoomType[] | undefined
) {
  if (roomPackage !== "HALF BOARD" || numberOfResidentAdult !== 3) {
    return null; // Invalid input, return null
  }

  if (!availabilities) {
    return null; // Invalid input, return null
  }

  let totalPrice = 0;

  for (const availability of availabilities) {
    if (availability.package === "HALF BOARD") {
      let hasAdultTriple = false;
      let hasAdultDouble = false;
      for (const roomAvailability of availability.room_resident_availabilities) {
        for (const guestAvailability of roomAvailability.room_resident_guest_availabilities) {
          if (guestAvailability.name === "ADULT TRIPLE") {
            totalPrice += guestAvailability.price;
            hasAdultTriple = true;
            hasAdultDouble = true;
          }
        }
        // If the current room availability doesn't have ADULT TRIPLE,
        // use ADULT DOUBLE price if it exists
        if (!hasAdultTriple) {
          for (const guestAvailability of roomAvailability.room_resident_guest_availabilities) {
            if (guestAvailability.name === "ADULT DOUBLE") {
              totalPrice += guestAvailability.price;
              hasAdultDouble = true;
              break;
            }
          }
        }
        if (!hasAdultDouble) {
          for (const guestAvailability of roomAvailability.room_resident_guest_availabilities) {
            if (guestAvailability.name === "ADULT SINGLE") {
              totalPrice += guestAvailability.price;
              break;
            }
          }
        }
      }
    }
  }

  return totalPrice * numberOfResidentAdult;
}

function tripleResidentAdultBedAndBreakfastPrice(
  numberOfResidentAdult: number,
  roomPackage: string,
  availabilities: RoomType[] | undefined
) {
  if (roomPackage !== "BED AND BREAKFAST" || numberOfResidentAdult !== 3) {
    return null; // Invalid input, return null
  }

  if (!availabilities) {
    return null; // Invalid input, return null
  }

  let totalPrice = 0;

  for (const availability of availabilities) {
    if (availability.package === "BED AND BREAKFAST") {
      let hasAdultTriple = false;
      let hasAdultDouble = false;
      for (const roomAvailability of availability.room_resident_availabilities) {
        for (const guestAvailability of roomAvailability.room_resident_guest_availabilities) {
          if (guestAvailability.name === "ADULT TRIPLE") {
            totalPrice += guestAvailability.price;
            hasAdultTriple = true;
            hasAdultDouble = true;
          }
        }
        // If the current room availability doesn't have ADULT TRIPLE,
        // use ADULT DOUBLE price if it exists
        if (!hasAdultTriple) {
          for (const guestAvailability of roomAvailability.room_resident_guest_availabilities) {
            if (guestAvailability.name === "ADULT DOUBLE") {
              totalPrice += guestAvailability.price;
              hasAdultDouble = true;
              break;
            }
          }
        }
        if (!hasAdultDouble) {
          for (const guestAvailability of roomAvailability.room_resident_guest_availabilities) {
            if (guestAvailability.name === "ADULT SINGLE") {
              totalPrice += guestAvailability.price;
              break;
            }
          }
        }
      }
    }
  }

  return totalPrice * numberOfResidentAdult;
}

// For single resident child
function singleResidentChildAllInclusivePrice(
  numberOfResidentChild: number,
  roomPackage: string,
  availabilities: RoomType[] | undefined
) {
  if (roomPackage !== "ALL INCLUSIVE" || numberOfResidentChild !== 1) {
    return null; // Invalid input, return null
  }

  if (!availabilities) {
    return null; // Invalid input, return null
  }

  let totalPrice = 0;

  for (const availability of availabilities) {
    if (availability.package === "ALL INCLUSIVE") {
      for (const roomAvailability of availability.room_resident_availabilities) {
        for (const guestAvailability of roomAvailability.room_resident_guest_availabilities) {
          if (guestAvailability.name === "CHILD SINGLE") {
            totalPrice += guestAvailability.price;
          }
        }
      }
    }
  }

  return totalPrice;
}

function singleResidentChildGamePackagePrice(
  numberOfResidentChild: number,
  roomPackage: string,
  availabilities: RoomType[] | undefined
) {
  if (roomPackage !== "GAME PACKAGE" || numberOfResidentChild !== 1) {
    return null; // Invalid input, return null
  }

  if (!availabilities) {
    return null; // Invalid input, return null
  }

  let totalPrice = 0;

  for (const availability of availabilities) {
    if (availability.package === "GAME PACKAGE") {
      for (const roomAvailability of availability.room_resident_availabilities) {
        for (const guestAvailability of roomAvailability.room_resident_guest_availabilities) {
          if (guestAvailability.name === "CHILD SINGLE") {
            totalPrice += guestAvailability.price;
          }
        }
      }
    }
  }

  return totalPrice;
}

function singleResidentChildFullBoardPrice(
  numberOfResidentChild: number,
  roomPackage: string,
  availabilities: RoomType[] | undefined
) {
  if (roomPackage !== "FULL BOARD" || numberOfResidentChild !== 1) {
    return null; // Invalid input, return null
  }

  if (!availabilities) {
    return null; // Invalid input, return null
  }

  let totalPrice = 0;

  for (const availability of availabilities) {
    if (availability.package === "FULL BOARD") {
      for (const roomAvailability of availability.room_resident_availabilities) {
        for (const guestAvailability of roomAvailability.room_resident_guest_availabilities) {
          if (guestAvailability.name === "CHILD SINGLE") {
            totalPrice += guestAvailability.price;
          }
        }
      }
    }
  }

  return totalPrice;
}

function singleResidentChildHalfBoardPrice(
  numberOfResidentChild: number,
  roomPackage: string,
  availabilities: RoomType[] | undefined
) {
  if (roomPackage !== "HALF BOARD" || numberOfResidentChild !== 1) {
    return null; // Invalid input, return null
  }

  if (!availabilities) {
    return null; // Invalid input, return null
  }

  let totalPrice = 0;

  for (const availability of availabilities) {
    if (availability.package === "HALF BOARD") {
      for (const roomAvailability of availability.room_resident_availabilities) {
        for (const guestAvailability of roomAvailability.room_resident_guest_availabilities) {
          if (guestAvailability.name === "CHILD SINGLE") {
            totalPrice += guestAvailability.price;
          }
        }
      }
    }
  }

  return totalPrice;
}

function singleResidentChildBedAndBreakfastPrice(
  numberOfResidentChild: number,
  roomPackage: string,
  availabilities: RoomType[] | undefined
) {
  if (roomPackage !== "BED AND BREAKFAST" || numberOfResidentChild !== 1) {
    return null; // Invalid input, return null
  }

  if (!availabilities) {
    return null; // Invalid input, return null
  }

  let totalPrice = 0;

  for (const availability of availabilities) {
    if (availability.package === "BED AND BREAKFAST") {
      for (const roomAvailability of availability.room_resident_availabilities) {
        for (const guestAvailability of roomAvailability.room_resident_guest_availabilities) {
          if (guestAvailability.name === "CHILD SINGLE") {
            totalPrice += guestAvailability.price;
          }
        }
      }
    }
  }

  return totalPrice;
}

// For double resident child
function doubleResidentChildAllInclusivePrice(
  numberOfResidentChild: number,
  roomPackage: string,
  availabilities: RoomType[] | undefined
) {
  if (roomPackage !== "ALL INCLUSIVE" || numberOfResidentChild !== 2) {
    return null; // Invalid input, return null
  }

  if (!availabilities) {
    return null; // Invalid input, return null
  }

  let totalPrice = 0;

  for (const availability of availabilities) {
    if (availability.package === "ALL INCLUSIVE") {
      let hasChildDouble = false;
      for (const roomAvailability of availability.room_resident_availabilities) {
        for (const guestAvailability of roomAvailability.room_resident_guest_availabilities) {
          if (guestAvailability.name === "CHILD DOUBLE") {
            totalPrice += guestAvailability.price;
            hasChildDouble = true;
          }
        }
        // If the current room availability doesn't have CHILD DOUBLE,
        // use CHILD SINGLE price if it exists
        if (!hasChildDouble) {
          for (const guestAvailability of roomAvailability.room_resident_guest_availabilities) {
            if (guestAvailability.name === "CHILD SINGLE") {
              totalPrice += guestAvailability.price;
              break;
            }
          }
        }
      }
    }
  }

  return totalPrice * numberOfResidentChild;
}

function doubleResidentChildGamePackagePrice(
  numberOfResidentChild: number,
  roomPackage: string,
  availabilities: RoomType[] | undefined
) {
  if (roomPackage !== "GAME PACKAGE" || numberOfResidentChild !== 2) {
    return null; // Invalid input, return null
  }

  if (!availabilities) {
    return null; // Invalid input, return null
  }

  let totalPrice = 0;

  for (const availability of availabilities) {
    if (availability.package === "GAME PACKAGE") {
      let hasChildDouble = false;
      for (const roomAvailability of availability.room_resident_availabilities) {
        for (const guestAvailability of roomAvailability.room_resident_guest_availabilities) {
          if (guestAvailability.name === "CHILD DOUBLE") {
            totalPrice += guestAvailability.price;
            hasChildDouble = true;
          }
        }
        // If the current room availability doesn't have CHILD DOUBLE,
        // use CHILD SINGLE price if it exists
        if (!hasChildDouble) {
          for (const guestAvailability of roomAvailability.room_resident_guest_availabilities) {
            if (guestAvailability.name === "CHILD SINGLE") {
              totalPrice += guestAvailability.price;
              break;
            }
          }
        }
      }
    }
  }

  return totalPrice * numberOfResidentChild;
}

function doubleResidentChildFullBoardPrice(
  numberOfResidentChild: number,
  roomPackage: string,
  availabilities: RoomType[] | undefined
) {
  if (roomPackage !== "FULL BOARD" || numberOfResidentChild !== 2) {
    return null; // Invalid input, return null
  }

  if (!availabilities) {
    return null; // Invalid input, return null
  }

  let totalPrice = 0;

  for (const availability of availabilities) {
    if (availability.package === "FULL BOARD") {
      let hasChildDouble = false;
      for (const roomAvailability of availability.room_resident_availabilities) {
        for (const guestAvailability of roomAvailability.room_resident_guest_availabilities) {
          if (guestAvailability.name === "CHILD DOUBLE") {
            totalPrice += guestAvailability.price;
            hasChildDouble = true;
          }
        }
        // If the current room availability doesn't have CHILD DOUBLE,
        // use CHILD SINGLE price if it exists
        if (!hasChildDouble) {
          for (const guestAvailability of roomAvailability.room_resident_guest_availabilities) {
            if (guestAvailability.name === "CHILD SINGLE") {
              totalPrice += guestAvailability.price;
              break;
            }
          }
        }
      }
    }
  }

  return totalPrice * numberOfResidentChild;
}

function doubleResidentChildHalfBoardPrice(
  numberOfResidentChild: number,
  roomPackage: string,
  availabilities: RoomType[] | undefined
) {
  if (roomPackage !== "HALF BOARD" || numberOfResidentChild !== 2) {
    return null; // Invalid input, return null
  }

  if (!availabilities) {
    return null; // Invalid input, return null
  }

  let totalPrice = 0;

  for (const availability of availabilities) {
    if (availability.package === "HALF BOARD") {
      let hasChildDouble = false;
      for (const roomAvailability of availability.room_resident_availabilities) {
        for (const guestAvailability of roomAvailability.room_resident_guest_availabilities) {
          if (guestAvailability.name === "CHILD DOUBLE") {
            totalPrice += guestAvailability.price;
            hasChildDouble = true;
          }
        }
        // If the current room availability doesn't have CHILD DOUBLE,
        // use CHILD SINGLE price if it exists
        if (!hasChildDouble) {
          for (const guestAvailability of roomAvailability.room_resident_guest_availabilities) {
            if (guestAvailability.name === "CHILD SINGLE") {
              totalPrice += guestAvailability.price;
              break;
            }
          }
        }
      }
    }
  }

  return totalPrice * numberOfResidentChild;
}

function doubleResidentChildBedAndBreakfastPrice(
  numberOfResidentChild: number,
  roomPackage: string,
  availabilities: RoomType[] | undefined
) {
  if (roomPackage !== "BED AND BREAKFAST" || numberOfResidentChild !== 2) {
    return null; // Invalid input, return null
  }

  if (!availabilities) {
    return null; // Invalid input, return null
  }

  let totalPrice = 0;

  for (const availability of availabilities) {
    if (availability.package === "BED AND BREAKFAST") {
      let hasChildDouble = false;
      for (const roomAvailability of availability.room_resident_availabilities) {
        for (const guestAvailability of roomAvailability.room_resident_guest_availabilities) {
          if (guestAvailability.name === "CHILD DOUBLE") {
            totalPrice += guestAvailability.price;
            hasChildDouble = true;
          }
        }
        // If the current room availability doesn't have CHILD DOUBLE,
        // use CHILD SINGLE price if it exists
        if (!hasChildDouble) {
          for (const guestAvailability of roomAvailability.room_resident_guest_availabilities) {
            if (guestAvailability.name === "CHILD SINGLE") {
              totalPrice += guestAvailability.price;
              break;
            }
          }
        }
      }
    }
  }

  return totalPrice * numberOfResidentChild;
}

// For Triple Resident Child
function tripleResidentChildAllInclusivePrice(
  numberOfResidentChild: number,
  roomPackage: string,
  availabilities: RoomType[] | undefined
) {
  if (roomPackage !== "ALL INCLUSIVE" || numberOfResidentChild !== 3) {
    return null; // Invalid input, return null
  }

  if (!availabilities) {
    return null; // Invalid input, return null
  }

  let totalPrice = 0;

  for (const availability of availabilities) {
    if (availability.package === "ALL INCLUSIVE") {
      let hasChildTriple = false;
      let hasChildDouble = false;
      for (const roomAvailability of availability.room_resident_availabilities) {
        for (const guestAvailability of roomAvailability.room_resident_guest_availabilities) {
          if (guestAvailability.name === "CHILD TRIPLE") {
            totalPrice += guestAvailability.price;
            hasChildTriple = true;
            hasChildDouble = true;
          }
        }
        // If the current room availability doesn't have CHILD TRIPLE,
        // use CHILD DOUBLE price if it exists
        if (!hasChildTriple) {
          for (const guestAvailability of roomAvailability.room_resident_guest_availabilities) {
            if (guestAvailability.name === "CHILD DOUBLE") {
              totalPrice += guestAvailability.price;
              hasChildDouble = true;
              break;
            }
          }
        }

        if (!hasChildDouble) {
          for (const guestAvailability of roomAvailability.room_resident_guest_availabilities) {
            if (guestAvailability.name === "CHILD SINGLE") {
              totalPrice += guestAvailability.price;
              break;
            }
          }
        }
      }
    }
  }

  return totalPrice * numberOfResidentChild;
}

function tripleResidentChildGamePackagePrice(
  numberOfResidentChild: number,
  roomPackage: string,
  availabilities: RoomType[] | undefined
) {
  if (roomPackage !== "GAME PACKAGE" || numberOfResidentChild !== 3) {
    return null; // Invalid input, return null
  }

  if (!availabilities) {
    return null; // Invalid input, return null
  }

  let totalPrice = 0;

  for (const availability of availabilities) {
    if (availability.package === "GAME PACKAGE") {
      let hasChildTriple = false;
      let hasChildDouble = false;
      for (const roomAvailability of availability.room_resident_availabilities) {
        for (const guestAvailability of roomAvailability.room_resident_guest_availabilities) {
          if (guestAvailability.name === "CHILD TRIPLE") {
            totalPrice += guestAvailability.price;
            hasChildTriple = true;
            hasChildDouble = true;
          }
        }
        // If the current room availability doesn't have CHILD TRIPLE,
        // use CHILD DOUBLE price if it exists
        if (!hasChildTriple) {
          for (const guestAvailability of roomAvailability.room_resident_guest_availabilities) {
            if (guestAvailability.name === "CHILD DOUBLE") {
              totalPrice += guestAvailability.price;
              hasChildDouble = true;
              break;
            }
          }
        }

        if (!hasChildDouble) {
          for (const guestAvailability of roomAvailability.room_resident_guest_availabilities) {
            if (guestAvailability.name === "CHILD SINGLE") {
              totalPrice += guestAvailability.price;
              break;
            }
          }
        }
      }
    }
  }

  return totalPrice * numberOfResidentChild;
}

function tripleResidentChildFullBoardPrice(
  numberOfResidentChild: number,
  roomPackage: string,
  availabilities: RoomType[] | undefined
) {
  if (roomPackage !== "FULL BOARD" || numberOfResidentChild !== 3) {
    return null; // Invalid input, return null
  }

  if (!availabilities) {
    return null; // Invalid input, return null
  }

  let totalPrice = 0;

  for (const availability of availabilities) {
    if (availability.package === "FULL BOARD") {
      let hasChildTriple = false;
      let hasChildDouble = false;
      for (const roomAvailability of availability.room_resident_availabilities) {
        for (const guestAvailability of roomAvailability.room_resident_guest_availabilities) {
          if (guestAvailability.name === "CHILD TRIPLE") {
            totalPrice += guestAvailability.price;
            hasChildTriple = true;
            hasChildDouble = true;
          }
        }
        // If the current room availability doesn't have CHILD TRIPLE,
        // use CHILD DOUBLE price if it exists
        if (!hasChildTriple) {
          for (const guestAvailability of roomAvailability.room_resident_guest_availabilities) {
            if (guestAvailability.name === "CHILD DOUBLE") {
              totalPrice += guestAvailability.price;
              hasChildDouble = true;
              break;
            }
          }
        }

        if (!hasChildDouble) {
          for (const guestAvailability of roomAvailability.room_resident_guest_availabilities) {
            if (guestAvailability.name === "CHILD SINGLE") {
              totalPrice += guestAvailability.price;
              break;
            }
          }
        }
      }
    }
  }

  return totalPrice * numberOfResidentChild;
}

function tripleResidentChildHalfBoardPrice(
  numberOfResidentChild: number,
  roomPackage: string,
  availabilities: RoomType[] | undefined
) {
  if (roomPackage !== "HALF BOARD" || numberOfResidentChild !== 3) {
    return null; // Invalid input, return null
  }

  if (!availabilities) {
    return null; // Invalid input, return null
  }

  let totalPrice = 0;

  for (const availability of availabilities) {
    if (availability.package === "HALF BOARD") {
      let hasChildTriple = false;
      let hasChildDouble = false;
      for (const roomAvailability of availability.room_resident_availabilities) {
        for (const guestAvailability of roomAvailability.room_resident_guest_availabilities) {
          if (guestAvailability.name === "CHILD TRIPLE") {
            totalPrice += guestAvailability.price;
            hasChildTriple = true;
            hasChildDouble = true;
          }
        }
        // If the current room availability doesn't have CHILD TRIPLE,
        // use CHILD DOUBLE price if it exists
        if (!hasChildTriple) {
          for (const guestAvailability of roomAvailability.room_resident_guest_availabilities) {
            if (guestAvailability.name === "CHILD DOUBLE") {
              totalPrice += guestAvailability.price;
              hasChildDouble = true;
              break;
            }
          }
        }

        if (!hasChildDouble) {
          for (const guestAvailability of roomAvailability.room_resident_guest_availabilities) {
            if (guestAvailability.name === "CHILD SINGLE") {
              totalPrice += guestAvailability.price;
              break;
            }
          }
        }
      }
    }
  }

  return totalPrice * numberOfResidentChild;
}

function tripleResidentChildBedAndBreakfastPrice(
  numberOfResidentChild: number,
  roomPackage: string,
  availabilities: RoomType[] | undefined
) {
  if (roomPackage !== "BED AND BREAKFAST" || numberOfResidentChild !== 3) {
    return null; // Invalid input, return null
  }

  if (!availabilities) {
    return null; // Invalid input, return null
  }

  let totalPrice = 0;

  for (const availability of availabilities) {
    if (availability.package === "BED AND BREAKFAST") {
      let hasChildTriple = false;
      let hasChildDouble = false;
      for (const roomAvailability of availability.room_resident_availabilities) {
        for (const guestAvailability of roomAvailability.room_resident_guest_availabilities) {
          if (guestAvailability.name === "CHILD TRIPLE") {
            totalPrice += guestAvailability.price;
            hasChildTriple = true;
            hasChildDouble = true;
          }
        }
        // If the current room availability doesn't have CHILD TRIPLE,
        // use CHILD DOUBLE price if it exists
        if (!hasChildTriple) {
          for (const guestAvailability of roomAvailability.room_resident_guest_availabilities) {
            if (guestAvailability.name === "CHILD DOUBLE") {
              totalPrice += guestAvailability.price;
              hasChildDouble = true;
              break;
            }
          }
        }

        if (!hasChildDouble) {
          for (const guestAvailability of roomAvailability.room_resident_guest_availabilities) {
            if (guestAvailability.name === "CHILD SINGLE") {
              totalPrice += guestAvailability.price;
              break;
            }
          }
        }
      }
    }
  }

  return totalPrice * numberOfResidentChild;
}

// For Infant Resident
function residentInfantAllInclusivePrice(
  numberOfResidentInfant: number,
  roomPackage: string,
  availabilities: RoomType[] | undefined
) {
  if (roomPackage !== "ALL INCLUSIVE") {
    return null; // Invalid input, return null
  }

  if (!availabilities) {
    return null; // Invalid input, return null
  }

  let totalPrice = 0;

  for (const availability of availabilities) {
    if (availability.package === "ALL INCLUSIVE") {
      for (const roomAvailability of availability.room_resident_availabilities) {
        for (const guestAvailability of roomAvailability.room_resident_guest_availabilities) {
          if (guestAvailability.name === "INFANT") {
            totalPrice += guestAvailability.price;
          }
        }
      }
    }
  }

  return totalPrice * numberOfResidentInfant;
}

function residentInfantGamePackagePrice(
  numberOfResidentInfant: number,
  roomPackage: string,
  availabilities: RoomType[] | undefined
) {
  if (roomPackage !== "GAME PACKAGE") {
    return null; // Invalid input, return null
  }

  if (!availabilities) {
    return null; // Invalid input, return null
  }

  let totalPrice = 0;

  for (const availability of availabilities) {
    if (availability.package === "GAME PACKAGE") {
      for (const roomAvailability of availability.room_resident_availabilities) {
        for (const guestAvailability of roomAvailability.room_resident_guest_availabilities) {
          if (guestAvailability.name === "INFANT") {
            totalPrice += guestAvailability.price;
          }
        }
      }
    }
  }

  return totalPrice * numberOfResidentInfant;
}

function residentInfantFullBoardPrice(
  numberOfResidentInfant: number,
  roomPackage: string,
  availabilities: RoomType[] | undefined
) {
  if (roomPackage !== "FULL BOARD") {
    return null; // Invalid input, return null
  }

  if (!availabilities) {
    return null; // Invalid input, return null
  }

  let totalPrice = 0;

  for (const availability of availabilities) {
    if (availability.package === "FULL BOARD") {
      for (const roomAvailability of availability.room_resident_availabilities) {
        for (const guestAvailability of roomAvailability.room_resident_guest_availabilities) {
          if (guestAvailability.name === "INFANT") {
            totalPrice += guestAvailability.price;
          }
        }
      }
    }
  }

  return totalPrice * numberOfResidentInfant;
}

function residentInfantHalfBoardPrice(
  numberOfResidentInfant: number,
  roomPackage: string,
  availabilities: RoomType[] | undefined
) {
  if (roomPackage !== "HALF BOARD") {
    return null; // Invalid input, return null
  }

  if (!availabilities) {
    return null; // Invalid input, return null
  }

  let totalPrice = 0;

  for (const availability of availabilities) {
    if (availability.package === "HALF BOARD") {
      for (const roomAvailability of availability.room_resident_availabilities) {
        for (const guestAvailability of roomAvailability.room_resident_guest_availabilities) {
          if (guestAvailability.name === "INFANT") {
            totalPrice += guestAvailability.price;
          }
        }
      }
    }
  }

  return totalPrice * numberOfResidentInfant;
}

function residentInfantBedAndBreakfastPrice(
  numberOfResidentInfant: number,
  roomPackage: string,
  availabilities: RoomType[] | undefined
) {
  if (roomPackage !== "BED AND BREAKFAST") {
    return null; // Invalid input, return null
  }

  if (!availabilities) {
    return null; // Invalid input, return null
  }

  let totalPrice = 0;

  for (const availability of availabilities) {
    if (availability.package === "BED AND BREAKFAST") {
      for (const roomAvailability of availability.room_resident_availabilities) {
        for (const guestAvailability of roomAvailability.room_resident_guest_availabilities) {
          if (guestAvailability.name === "INFANT") {
            totalPrice += guestAvailability.price;
          }
        }
      }
    }
  }

  return totalPrice * numberOfResidentInfant;
}

//For Single Non-Resident Adults
function singleNonResidentAdultAllInclusivePrice(
  numberOfNonResidentAdults: number,
  roomPackage: string,
  availabilities: RoomType[] | undefined
) {
  if (roomPackage !== "ALL INCLUSIVE" || numberOfNonResidentAdults !== 1) {
    return null; // Invalid input, return null
  }

  if (!availabilities) {
    return null; // Invalid input, return null
  }

  let totalPrice = 0;

  for (const availability of availabilities) {
    if (availability.package === "ALL INCLUSIVE") {
      for (const roomAvailability of availability.room_non_resident_availabilities) {
        for (const guestAvailability of roomAvailability.room_non_resident_guest_availabilities) {
          if (guestAvailability.name === "ADULT SINGLE") {
            totalPrice += guestAvailability.price;
          }
        }
      }
    }
  }

  return totalPrice;
}

function singleNonResidentAdultGamePackagePrice(
  numberOfNonResidentAdults: number,
  roomPackage: string,
  availabilities: RoomType[] | undefined
) {
  if (roomPackage !== "GAME PACKAGE" || numberOfNonResidentAdults !== 1) {
    return null; // Invalid input, return null
  }

  if (!availabilities) {
    return null; // Invalid input, return null
  }

  let totalPrice = 0;

  for (const availability of availabilities) {
    if (availability.package === "GAME PACKAGE") {
      for (const roomAvailability of availability.room_non_resident_availabilities) {
        for (const guestAvailability of roomAvailability.room_non_resident_guest_availabilities) {
          if (guestAvailability.name === "ADULT SINGLE") {
            totalPrice += guestAvailability.price;
          }
        }
      }
    }
  }

  return totalPrice;
}

function singleNonResidentAdultFullBoardPrice(
  numberOfNonResidentAdults: number,
  roomPackage: string,
  availabilities: RoomType[] | undefined
) {
  if (roomPackage !== "FULL BOARD" || numberOfNonResidentAdults !== 1) {
    return null; // Invalid input, return null
  }

  if (!availabilities) {
    return null; // Invalid input, return null
  }

  let totalPrice = 0;

  for (const availability of availabilities) {
    if (availability.package === "FULL BOARD") {
      for (const roomAvailability of availability.room_non_resident_availabilities) {
        for (const guestAvailability of roomAvailability.room_non_resident_guest_availabilities) {
          if (guestAvailability.name === "ADULT SINGLE") {
            totalPrice += guestAvailability.price;
          }
        }
      }
    }
  }

  return totalPrice;
}

function singleNonResidentAdultHalfBoardPrice(
  numberOfNonResidentAdults: number,
  roomPackage: string,
  availabilities: RoomType[] | undefined
) {
  if (roomPackage !== "HALF BOARD" || numberOfNonResidentAdults !== 1) {
    return null; // Invalid input, return null
  }

  if (!availabilities) {
    return null; // Invalid input, return null
  }

  let totalPrice = 0;

  for (const availability of availabilities) {
    if (availability.package === "HALF BOARD") {
      for (const roomAvailability of availability.room_non_resident_availabilities) {
        for (const guestAvailability of roomAvailability.room_non_resident_guest_availabilities) {
          if (guestAvailability.name === "ADULT SINGLE") {
            totalPrice += guestAvailability.price;
          }
        }
      }
    }
  }

  return totalPrice;
}

function singleNonResidentAdultBedAndBreakfastPrice(
  numberOfNonResidentAdults: number,
  roomPackage: string,
  availabilities: RoomType[] | undefined
) {
  if (roomPackage !== "BED AND BREAKFAST" || numberOfNonResidentAdults !== 1) {
    return null; // Invalid input, return null
  }

  if (!availabilities) {
    return null; // Invalid input, return null
  }

  let totalPrice = 0;

  for (const availability of availabilities) {
    if (availability.package === "BED AND BREAKFAST") {
      for (const roomAvailability of availability.room_non_resident_availabilities) {
        for (const guestAvailability of roomAvailability.room_non_resident_guest_availabilities) {
          if (guestAvailability.name === "ADULT SINGLE") {
            totalPrice += guestAvailability.price;
          }
        }
      }
    }
  }

  return totalPrice;
}

//For Double Non-Resident Adults
function doubleNonResidentAdultAllInclusivePrice(
  numberOfNonResidentAdults: number,
  roomPackage: string,
  availabilities: RoomType[] | undefined
) {
  if (roomPackage !== "ALL INCLUSIVE" || numberOfNonResidentAdults !== 2) {
    return null; // Invalid input, return null
  }

  if (!availabilities) {
    return null; // Invalid input, return null
  }

  let totalPrice = 0;

  for (const availability of availabilities) {
    if (availability.package === "ALL INCLUSIVE") {
      let hasAdultDouble = false;
      for (const roomAvailability of availability.room_non_resident_availabilities) {
        for (const guestAvailability of roomAvailability.room_non_resident_guest_availabilities) {
          if (guestAvailability.name === "ADULT DOUBLE") {
            totalPrice += guestAvailability.price;
            hasAdultDouble = true;
          }
        }

        if (!hasAdultDouble) {
          for (const guestAvailability of roomAvailability.room_non_resident_guest_availabilities) {
            if (guestAvailability.name === "ADULT SINGLE") {
              totalPrice += guestAvailability.price;
              break;
            }
          }
        }
      }
    }
  }

  return totalPrice * numberOfNonResidentAdults;
}

function doubleNonResidentAdultGamePackagePrice(
  numberOfNonResidentAdults: number,
  roomPackage: string,
  availabilities: RoomType[] | undefined
) {
  if (roomPackage !== "GAME PACKAGE" || numberOfNonResidentAdults !== 2) {
    return null; // Invalid input, return null
  }

  if (!availabilities) {
    return null; // Invalid input, return null
  }

  let totalPrice = 0;

  for (const availability of availabilities) {
    if (availability.package === "GAME PACKAGE") {
      let hasAdultDouble = false;
      for (const roomAvailability of availability.room_non_resident_availabilities) {
        for (const guestAvailability of roomAvailability.room_non_resident_guest_availabilities) {
          if (guestAvailability.name === "ADULT DOUBLE") {
            totalPrice += guestAvailability.price;
            hasAdultDouble = true;
          }
        }

        if (!hasAdultDouble) {
          for (const guestAvailability of roomAvailability.room_non_resident_guest_availabilities) {
            if (guestAvailability.name === "ADULT SINGLE") {
              totalPrice += guestAvailability.price;
              break;
            }
          }
        }
      }
    }
  }

  return totalPrice * numberOfNonResidentAdults;
}

function doubleNonResidentAdultFullBoardPrice(
  numberOfNonResidentAdults: number,
  roomPackage: string,
  availabilities: RoomType[] | undefined
) {
  if (roomPackage !== "FULL BOARD" || numberOfNonResidentAdults !== 2) {
    return null; // Invalid input, return null
  }

  if (!availabilities) {
    return null; // Invalid input, return null
  }

  let totalPrice = 0;

  for (const availability of availabilities) {
    if (availability.package === "FULL BOARD") {
      let hasAdultDouble = false;
      for (const roomAvailability of availability.room_non_resident_availabilities) {
        for (const guestAvailability of roomAvailability.room_non_resident_guest_availabilities) {
          if (guestAvailability.name === "ADULT DOUBLE") {
            totalPrice += guestAvailability.price;
            hasAdultDouble = true;
          }
        }

        if (!hasAdultDouble) {
          for (const guestAvailability of roomAvailability.room_non_resident_guest_availabilities) {
            if (guestAvailability.name === "ADULT SINGLE") {
              totalPrice += guestAvailability.price;
              break;
            }
          }
        }
      }
    }
  }

  return totalPrice * numberOfNonResidentAdults;
}

function doubleNonResidentAdultHalfBoardPrice(
  numberOfNonResidentAdults: number,
  roomPackage: string,
  availabilities: RoomType[] | undefined
) {
  if (roomPackage !== "HALF BOARD" || numberOfNonResidentAdults !== 2) {
    return null; // Invalid input, return null
  }

  if (!availabilities) {
    return null; // Invalid input, return null
  }

  let totalPrice = 0;

  for (const availability of availabilities) {
    if (availability.package === "HALF BOARD") {
      let hasAdultDouble = false;
      for (const roomAvailability of availability.room_non_resident_availabilities) {
        for (const guestAvailability of roomAvailability.room_non_resident_guest_availabilities) {
          if (guestAvailability.name === "ADULT DOUBLE") {
            totalPrice += guestAvailability.price;
            hasAdultDouble = true;
          }
        }

        if (!hasAdultDouble) {
          for (const guestAvailability of roomAvailability.room_non_resident_guest_availabilities) {
            if (guestAvailability.name === "ADULT SINGLE") {
              totalPrice += guestAvailability.price;
              break;
            }
          }
        }
      }
    }
  }

  return totalPrice * numberOfNonResidentAdults;
}

function doubleNonResidentAdultBedAndBreakfastPrice(
  numberOfNonResidentAdults: number,
  roomPackage: string,
  availabilities: RoomType[] | undefined
) {
  if (roomPackage !== "BED AND BREAKFAST" || numberOfNonResidentAdults !== 2) {
    return null; // Invalid input, return null
  }

  if (!availabilities) {
    return null; // Invalid input, return null
  }

  let totalPrice = 0;

  for (const availability of availabilities) {
    if (availability.package === "BED AND BREAKFAST") {
      let hasAdultDouble = false;
      for (const roomAvailability of availability.room_non_resident_availabilities) {
        for (const guestAvailability of roomAvailability.room_non_resident_guest_availabilities) {
          if (guestAvailability.name === "ADULT DOUBLE") {
            totalPrice += guestAvailability.price;
            hasAdultDouble = true;
          }
        }

        if (!hasAdultDouble) {
          for (const guestAvailability of roomAvailability.room_non_resident_guest_availabilities) {
            if (guestAvailability.name === "ADULT SINGLE") {
              totalPrice += guestAvailability.price;
              break;
            }
          }
        }
      }
    }
  }

  return totalPrice * numberOfNonResidentAdults;
}

// Triple Non Resident Adult
function tripleNonResidentAdultAllInclusivePrice(
  numberOfNonResidentAdults: number,
  roomPackage: string,
  availabilities: RoomType[] | undefined
) {
  if (roomPackage !== "ALL INCLUSIVE" || numberOfNonResidentAdults !== 3) {
    return null; // Invalid input, return null
  }

  if (!availabilities) {
    return null; // Invalid input, return null
  }

  let totalPrice = 0;

  for (const availability of availabilities) {
    if (availability.package === "ALL INCLUSIVE") {
      let hasAdultTriple = false;
      let hasAdultDouble = false;
      for (const roomAvailability of availability.room_non_resident_availabilities) {
        for (const guestAvailability of roomAvailability.room_non_resident_guest_availabilities) {
          if (guestAvailability.name === "ADULT TRIPLE") {
            totalPrice += guestAvailability.price;
            hasAdultTriple = true;
            hasAdultDouble = true;
          }
        }

        if (!hasAdultTriple) {
          for (const guestAvailability of roomAvailability.room_non_resident_guest_availabilities) {
            if (guestAvailability.name === "ADULT DOUBLE") {
              totalPrice += guestAvailability.price;
              hasAdultDouble = true;
              break;
            }
          }
        }

        if (!hasAdultDouble) {
          for (const guestAvailability of roomAvailability.room_non_resident_guest_availabilities) {
            if (guestAvailability.name === "ADULT SINGLE") {
              totalPrice += guestAvailability.price;
              break;
            }
          }
        }
      }
    }
  }

  return totalPrice * numberOfNonResidentAdults;
}

function tripleNonResidentAdultGamePackagePrice(
  numberOfNonResidentAdults: number,
  roomPackage: string,
  availabilities: RoomType[] | undefined
) {
  if (roomPackage !== "GAME PACKAGE" || numberOfNonResidentAdults !== 3) {
    return null; // Invalid input, return null
  }

  if (!availabilities) {
    return null; // Invalid input, return null
  }

  let totalPrice = 0;

  for (const availability of availabilities) {
    if (availability.package === "GAME PACKAGE") {
      let hasAdultTriple = false;
      let hasAdultDouble = false;
      for (const roomAvailability of availability.room_non_resident_availabilities) {
        for (const guestAvailability of roomAvailability.room_non_resident_guest_availabilities) {
          if (guestAvailability.name === "ADULT TRIPLE") {
            totalPrice += guestAvailability.price;
            hasAdultTriple = true;
            hasAdultDouble = true;
          }
        }

        if (!hasAdultTriple) {
          for (const guestAvailability of roomAvailability.room_non_resident_guest_availabilities) {
            if (guestAvailability.name === "ADULT DOUBLE") {
              totalPrice += guestAvailability.price;
              hasAdultDouble = true;
              break;
            }
          }
        }

        if (!hasAdultDouble) {
          for (const guestAvailability of roomAvailability.room_non_resident_guest_availabilities) {
            if (guestAvailability.name === "ADULT SINGLE") {
              totalPrice += guestAvailability.price;
              break;
            }
          }
        }
      }
    }
  }

  return totalPrice * numberOfNonResidentAdults;
}

function tripleNonResidentAdultFullBoardPrice(
  numberOfNonResidentAdults: number,
  roomPackage: string,
  availabilities: RoomType[] | undefined
) {
  if (roomPackage !== "FULL BOARD" || numberOfNonResidentAdults !== 3) {
    return null; // Invalid input, return null
  }

  if (!availabilities) {
    return null; // Invalid input, return null
  }

  let totalPrice = 0;

  for (const availability of availabilities) {
    if (availability.package === "FULL BOARD") {
      let hasAdultTriple = false;
      let hasAdultDouble = false;
      for (const roomAvailability of availability.room_non_resident_availabilities) {
        for (const guestAvailability of roomAvailability.room_non_resident_guest_availabilities) {
          if (guestAvailability.name === "ADULT TRIPLE") {
            totalPrice += guestAvailability.price;
            hasAdultTriple = true;
            hasAdultDouble = true;
          }
        }

        if (!hasAdultTriple) {
          for (const guestAvailability of roomAvailability.room_non_resident_guest_availabilities) {
            if (guestAvailability.name === "ADULT DOUBLE") {
              totalPrice += guestAvailability.price;
              hasAdultDouble = true;
              break;
            }
          }
        }

        if (!hasAdultDouble) {
          for (const guestAvailability of roomAvailability.room_non_resident_guest_availabilities) {
            if (guestAvailability.name === "ADULT SINGLE") {
              totalPrice += guestAvailability.price;
              break;
            }
          }
        }
      }
    }
  }

  return totalPrice * numberOfNonResidentAdults;
}

function tripleNonResidentAdultHalfBoardPrice(
  numberOfNonResidentAdults: number,
  roomPackage: string,
  availabilities: RoomType[] | undefined
) {
  if (roomPackage !== "HALF BOARD" || numberOfNonResidentAdults !== 3) {
    return null; // Invalid input, return null
  }

  if (!availabilities) {
    return null; // Invalid input, return null
  }

  let totalPrice = 0;

  for (const availability of availabilities) {
    if (availability.package === "HALF BOARD") {
      let hasAdultTriple = false;
      let hasAdultDouble = false;
      for (const roomAvailability of availability.room_non_resident_availabilities) {
        for (const guestAvailability of roomAvailability.room_non_resident_guest_availabilities) {
          if (guestAvailability.name === "ADULT TRIPLE") {
            totalPrice += guestAvailability.price;
            hasAdultTriple = true;
            hasAdultDouble = true;
          }
        }

        if (!hasAdultTriple) {
          for (const guestAvailability of roomAvailability.room_non_resident_guest_availabilities) {
            if (guestAvailability.name === "ADULT DOUBLE") {
              totalPrice += guestAvailability.price;
              hasAdultDouble = true;
              break;
            }
          }
        }

        if (!hasAdultDouble) {
          for (const guestAvailability of roomAvailability.room_non_resident_guest_availabilities) {
            if (guestAvailability.name === "ADULT SINGLE") {
              totalPrice += guestAvailability.price;
              break;
            }
          }
        }
      }
    }
  }

  return totalPrice * numberOfNonResidentAdults;
}

function tripleNonResidentAdultBedAndBreakfastPrice(
  numberOfNonResidentAdults: number,
  roomPackage: string,
  availabilities: RoomType[] | undefined
) {
  if (roomPackage !== "BED AND BREAKFAST" || numberOfNonResidentAdults !== 3) {
    return null; // Invalid input, return null
  }

  if (!availabilities) {
    return null; // Invalid input, return null
  }

  let totalPrice = 0;

  for (const availability of availabilities) {
    if (availability.package === "BED AND BREAKFAST") {
      let hasAdultTriple = false;
      let hasAdultDouble = false;
      for (const roomAvailability of availability.room_non_resident_availabilities) {
        for (const guestAvailability of roomAvailability.room_non_resident_guest_availabilities) {
          if (guestAvailability.name === "ADULT TRIPLE") {
            totalPrice += guestAvailability.price;
            hasAdultTriple = true;
            hasAdultDouble = true;
          }
        }

        if (!hasAdultTriple) {
          for (const guestAvailability of roomAvailability.room_non_resident_guest_availabilities) {
            if (guestAvailability.name === "ADULT DOUBLE") {
              totalPrice += guestAvailability.price;
              hasAdultDouble = true;
              break;
            }
          }
        }

        if (!hasAdultDouble) {
          for (const guestAvailability of roomAvailability.room_non_resident_guest_availabilities) {
            if (guestAvailability.name === "ADULT SINGLE") {
              totalPrice += guestAvailability.price;
              break;
            }
          }
        }
      }
    }
  }

  return totalPrice * numberOfNonResidentAdults;
}

// Single Non-Resident Child
function singleNonResidentChildAllInclusivePrice(
  numberOfNonResidentChildren: number,
  roomPackage: string,
  availabilities: RoomType[] | undefined
) {
  if (roomPackage !== "ALL INCLUSIVE" || numberOfNonResidentChildren !== 1) {
    return null; // Invalid input, return null
  }

  if (!availabilities) {
    return null; // Invalid input, return null
  }

  let totalPrice = 0;

  for (const availability of availabilities) {
    if (availability.package === "ALL INCLUSIVE") {
      for (const roomAvailability of availability.room_non_resident_availabilities) {
        for (const guestAvailability of roomAvailability.room_non_resident_guest_availabilities) {
          if (guestAvailability.name === "CHILD SINGLE") {
            totalPrice += guestAvailability.price;
          }
        }
      }
    }
  }

  return totalPrice;
}

function singleNonResidentChildGamePackagePrice(
  numberOfNonResidentChildren: number,
  roomPackage: string,
  availabilities: RoomType[] | undefined
) {
  if (roomPackage !== "GAME PACKAGE" || numberOfNonResidentChildren !== 1) {
    return null; // Invalid input, return null
  }

  if (!availabilities) {
    return null; // Invalid input, return null
  }

  let totalPrice = 0;

  for (const availability of availabilities) {
    if (availability.package === "GAME PACKAGE") {
      for (const roomAvailability of availability.room_non_resident_availabilities) {
        for (const guestAvailability of roomAvailability.room_non_resident_guest_availabilities) {
          if (guestAvailability.name === "CHILD SINGLE") {
            totalPrice += guestAvailability.price;
          }
        }
      }
    }
  }

  return totalPrice;
}

function singleNonResidentChildFullBoardPrice(
  numberOfNonResidentChildren: number,
  roomPackage: string,
  availabilities: RoomType[] | undefined
) {
  if (roomPackage !== "FULL BOARD" || numberOfNonResidentChildren !== 1) {
    return null; // Invalid input, return null
  }

  if (!availabilities) {
    return null; // Invalid input, return null
  }

  let totalPrice = 0;

  for (const availability of availabilities) {
    if (availability.package === "FULL BOARD") {
      for (const roomAvailability of availability.room_non_resident_availabilities) {
        for (const guestAvailability of roomAvailability.room_non_resident_guest_availabilities) {
          if (guestAvailability.name === "CHILD SINGLE") {
            totalPrice += guestAvailability.price;
          }
        }
      }
    }
  }

  return totalPrice;
}

function singleNonResidentChildHalfBoardPrice(
  numberOfNonResidentChildren: number,
  roomPackage: string,
  availabilities: RoomType[] | undefined
) {
  if (roomPackage !== "HALF BOARD" || numberOfNonResidentChildren !== 1) {
    return null; // Invalid input, return null
  }

  if (!availabilities) {
    return null; // Invalid input, return null
  }

  let totalPrice = 0;

  for (const availability of availabilities) {
    if (availability.package === "HALF BOARD") {
      for (const roomAvailability of availability.room_non_resident_availabilities) {
        for (const guestAvailability of roomAvailability.room_non_resident_guest_availabilities) {
          if (guestAvailability.name === "CHILD SINGLE") {
            totalPrice += guestAvailability.price;
          }
        }
      }
    }
  }

  return totalPrice;
}

function singleNonResidentChildBedAndBreakfastPrice(
  numberOfNonResidentChildren: number,
  roomPackage: string,
  availabilities: RoomType[] | undefined
) {
  if (
    roomPackage !== "BED AND BREAKFAST" ||
    numberOfNonResidentChildren !== 1
  ) {
    return null; // Invalid input, return null
  }

  if (!availabilities) {
    return null; // Invalid input, return null
  }

  let totalPrice = 0;

  for (const availability of availabilities) {
    if (availability.package === "BED AND BREAKFAST") {
      for (const roomAvailability of availability.room_non_resident_availabilities) {
        for (const guestAvailability of roomAvailability.room_non_resident_guest_availabilities) {
          if (guestAvailability.name === "CHILD SINGLE") {
            totalPrice += guestAvailability.price;
          }
        }
      }
    }
  }

  return totalPrice;
}

// Double Non-Resident Child
function doubleNonResidentChildAllInclusivePrice(
  numberOfNonResidentChildren: number,
  roomPackage: string,
  availabilities: RoomType[] | undefined
) {
  if (roomPackage !== "ALL INCLUSIVE" || numberOfNonResidentChildren !== 2) {
    return null; // Invalid input, return null
  }

  if (!availabilities) {
    return null; // Invalid input, return null
  }

  let totalPrice = 0;

  for (const availability of availabilities) {
    if (availability.package === "ALL INCLUSIVE") {
      let hasAdultDouble = false;
      for (const roomAvailability of availability.room_non_resident_availabilities) {
        for (const guestAvailability of roomAvailability.room_non_resident_guest_availabilities) {
          if (guestAvailability.name === "CHILD DOUBLE") {
            totalPrice += guestAvailability.price;
            hasAdultDouble = true;
          }
        }

        if (!hasAdultDouble) {
          for (const guestAvailability of roomAvailability.room_non_resident_guest_availabilities) {
            if (guestAvailability.name === "CHILD SINGLE") {
              totalPrice += guestAvailability.price;
              break;
            }
          }
        }
      }
    }
  }

  return totalPrice * numberOfNonResidentChildren;
}

function doubleNonResidentChildGamePackagePrice(
  numberOfNonResidentChildren: number,
  roomPackage: string,
  availabilities: RoomType[] | undefined
) {
  if (roomPackage !== "GAME PACKAGE" || numberOfNonResidentChildren !== 2) {
    return null; // Invalid input, return null
  }

  if (!availabilities) {
    return null; // Invalid input, return null
  }

  let totalPrice = 0;

  for (const availability of availabilities) {
    if (availability.package === "GAME PACKAGE") {
      let hasAdultDouble = false;
      for (const roomAvailability of availability.room_non_resident_availabilities) {
        for (const guestAvailability of roomAvailability.room_non_resident_guest_availabilities) {
          if (guestAvailability.name === "CHILD DOUBLE") {
            totalPrice += guestAvailability.price;
            hasAdultDouble = true;
          }
        }

        if (!hasAdultDouble) {
          for (const guestAvailability of roomAvailability.room_non_resident_guest_availabilities) {
            if (guestAvailability.name === "CHILD SINGLE") {
              totalPrice += guestAvailability.price;
              break;
            }
          }
        }
      }
    }
  }

  return totalPrice * numberOfNonResidentChildren;
}

function doubleNonResidentChildFullBoardPrice(
  numberOfNonResidentChildren: number,
  roomPackage: string,
  availabilities: RoomType[] | undefined
) {
  if (roomPackage !== "FULL BOARD" || numberOfNonResidentChildren !== 2) {
    return null; // Invalid input, return null
  }

  if (!availabilities) {
    return null; // Invalid input, return null
  }

  let totalPrice = 0;

  for (const availability of availabilities) {
    if (availability.package === "FULL BOARD") {
      let hasAdultDouble = false;
      for (const roomAvailability of availability.room_non_resident_availabilities) {
        for (const guestAvailability of roomAvailability.room_non_resident_guest_availabilities) {
          if (guestAvailability.name === "CHILD DOUBLE") {
            totalPrice += guestAvailability.price;
            hasAdultDouble = true;
          }
        }

        if (!hasAdultDouble) {
          for (const guestAvailability of roomAvailability.room_non_resident_guest_availabilities) {
            if (guestAvailability.name === "CHILD SINGLE") {
              totalPrice += guestAvailability.price;
              break;
            }
          }
        }
      }
    }
  }

  return totalPrice * numberOfNonResidentChildren;
}

function doubleNonResidentChildHalfBoardPrice(
  numberOfNonResidentChildren: number,
  roomPackage: string,
  availabilities: RoomType[] | undefined
) {
  if (roomPackage !== "HALF BOARD" || numberOfNonResidentChildren !== 2) {
    return null; // Invalid input, return null
  }

  if (!availabilities) {
    return null; // Invalid input, return null
  }

  let totalPrice = 0;

  for (const availability of availabilities) {
    if (availability.package === "HALF BOARD") {
      let hasAdultDouble = false;
      for (const roomAvailability of availability.room_non_resident_availabilities) {
        for (const guestAvailability of roomAvailability.room_non_resident_guest_availabilities) {
          if (guestAvailability.name === "CHILD DOUBLE") {
            totalPrice += guestAvailability.price;
            hasAdultDouble = true;
          }
        }

        if (!hasAdultDouble) {
          for (const guestAvailability of roomAvailability.room_non_resident_guest_availabilities) {
            if (guestAvailability.name === "CHILD SINGLE") {
              totalPrice += guestAvailability.price;
              break;
            }
          }
        }
      }
    }
  }

  return totalPrice * numberOfNonResidentChildren;
}

function doubleNonResidentChildBedAndBreakfastPrice(
  numberOfNonResidentChildren: number,
  roomPackage: string,
  availabilities: RoomType[] | undefined
) {
  if (
    roomPackage !== "BED AND BREAKFAST" ||
    numberOfNonResidentChildren !== 2
  ) {
    return null; // Invalid input, return null
  }

  if (!availabilities) {
    return null; // Invalid input, return null
  }

  let totalPrice = 0;

  for (const availability of availabilities) {
    if (availability.package === "BED AND BREAKFAST") {
      let hasAdultDouble = false;
      for (const roomAvailability of availability.room_non_resident_availabilities) {
        for (const guestAvailability of roomAvailability.room_non_resident_guest_availabilities) {
          if (guestAvailability.name === "CHILD DOUBLE") {
            totalPrice += guestAvailability.price;
            hasAdultDouble = true;
          }
        }

        if (!hasAdultDouble) {
          for (const guestAvailability of roomAvailability.room_non_resident_guest_availabilities) {
            if (guestAvailability.name === "CHILD SINGLE") {
              totalPrice += guestAvailability.price;
              break;
            }
          }
        }
      }
    }
  }

  return totalPrice * numberOfNonResidentChildren;
}

// Triple Non Resident Child
function tripleNonResidentChildAllInclusivePrice(
  numberOfNonResidentChildren: number,
  roomPackage: string,
  availabilities: RoomType[] | undefined
) {
  if (roomPackage !== "ALL INCLUSIVE" || numberOfNonResidentChildren !== 3) {
    return null; // Invalid input, return null
  }

  if (!availabilities) {
    return null; // Invalid input, return null
  }

  let totalPrice = 0;

  for (const availability of availabilities) {
    if (availability.package === "ALL INCLUSIVE") {
      let hasChildTriple = false;
      let hasChildDouble = false;
      for (const roomAvailability of availability.room_non_resident_availabilities) {
        for (const guestAvailability of roomAvailability.room_non_resident_guest_availabilities) {
          if (guestAvailability.name === "CHILD TRIPLE") {
            totalPrice += guestAvailability.price;
            hasChildTriple = true;
            hasChildDouble = true;
          }
        }

        if (!hasChildTriple) {
          for (const guestAvailability of roomAvailability.room_non_resident_guest_availabilities) {
            if (guestAvailability.name === "CHILD DOUBLE") {
              totalPrice += guestAvailability.price;
              hasChildDouble = true;
              break;
            }
          }
        }

        if (!hasChildDouble) {
          for (const guestAvailability of roomAvailability.room_non_resident_guest_availabilities) {
            if (guestAvailability.name === "CHILD SINGLE") {
              totalPrice += guestAvailability.price;
              break;
            }
          }
        }
      }
    }
  }

  return totalPrice * numberOfNonResidentChildren;
}

function tripleNonResidentChildGamePackagePrice(
  numberOfNonResidentChildren: number,
  roomPackage: string,
  availabilities: RoomType[] | undefined
) {
  if (roomPackage !== "GAME PACKAGE" || numberOfNonResidentChildren !== 3) {
    return null; // Invalid input, return null
  }

  if (!availabilities) {
    return null; // Invalid input, return null
  }

  let totalPrice = 0;

  for (const availability of availabilities) {
    if (availability.package === "GAME PACKAGE") {
      let hasChildTriple = false;
      let hasChildDouble = false;
      for (const roomAvailability of availability.room_non_resident_availabilities) {
        for (const guestAvailability of roomAvailability.room_non_resident_guest_availabilities) {
          if (guestAvailability.name === "CHILD TRIPLE") {
            totalPrice += guestAvailability.price;
            hasChildTriple = true;
            hasChildDouble = true;
          }
        }

        if (!hasChildTriple) {
          for (const guestAvailability of roomAvailability.room_non_resident_guest_availabilities) {
            if (guestAvailability.name === "CHILD DOUBLE") {
              totalPrice += guestAvailability.price;
              hasChildDouble = true;
              break;
            }
          }
        }

        if (!hasChildDouble) {
          for (const guestAvailability of roomAvailability.room_non_resident_guest_availabilities) {
            if (guestAvailability.name === "CHILD SINGLE") {
              totalPrice += guestAvailability.price;
              break;
            }
          }
        }
      }
    }
  }

  return totalPrice * numberOfNonResidentChildren;
}

function tripleNonResidentChildFullBoardPrice(
  numberOfNonResidentChildren: number,
  roomPackage: string,
  availabilities: RoomType[] | undefined
) {
  if (roomPackage !== "FULL BOARD" || numberOfNonResidentChildren !== 3) {
    return null; // Invalid input, return null
  }

  if (!availabilities) {
    return null; // Invalid input, return null
  }

  let totalPrice = 0;

  for (const availability of availabilities) {
    if (availability.package === "FULL BOARD") {
      let hasChildTriple = false;
      let hasChildDouble = false;
      for (const roomAvailability of availability.room_non_resident_availabilities) {
        for (const guestAvailability of roomAvailability.room_non_resident_guest_availabilities) {
          if (guestAvailability.name === "CHILD TRIPLE") {
            totalPrice += guestAvailability.price;
            hasChildTriple = true;
            hasChildDouble = true;
          }
        }

        if (!hasChildTriple) {
          for (const guestAvailability of roomAvailability.room_non_resident_guest_availabilities) {
            if (guestAvailability.name === "CHILD DOUBLE") {
              totalPrice += guestAvailability.price;
              hasChildDouble = true;
              break;
            }
          }
        }

        if (!hasChildDouble) {
          for (const guestAvailability of roomAvailability.room_non_resident_guest_availabilities) {
            if (guestAvailability.name === "CHILD SINGLE") {
              totalPrice += guestAvailability.price;
              break;
            }
          }
        }
      }
    }
  }

  return totalPrice * numberOfNonResidentChildren;
}

function tripleNonResidentChildHalfBoardPrice(
  numberOfNonResidentChildren: number,
  roomPackage: string,
  availabilities: RoomType[] | undefined
) {
  if (roomPackage !== "HALF BOARD" || numberOfNonResidentChildren !== 3) {
    return null; // Invalid input, return null
  }

  if (!availabilities) {
    return null; // Invalid input, return null
  }

  let totalPrice = 0;

  for (const availability of availabilities) {
    if (availability.package === "HALF BOARD") {
      let hasChildTriple = false;
      let hasChildDouble = false;
      for (const roomAvailability of availability.room_non_resident_availabilities) {
        for (const guestAvailability of roomAvailability.room_non_resident_guest_availabilities) {
          if (guestAvailability.name === "CHILD TRIPLE") {
            totalPrice += guestAvailability.price;
            hasChildTriple = true;
            hasChildDouble = true;
          }
        }

        if (!hasChildTriple) {
          for (const guestAvailability of roomAvailability.room_non_resident_guest_availabilities) {
            if (guestAvailability.name === "CHILD DOUBLE") {
              totalPrice += guestAvailability.price;
              hasChildDouble = true;
              break;
            }
          }
        }

        if (!hasChildDouble) {
          for (const guestAvailability of roomAvailability.room_non_resident_guest_availabilities) {
            if (guestAvailability.name === "CHILD SINGLE") {
              totalPrice += guestAvailability.price;
              break;
            }
          }
        }
      }
    }
  }

  return totalPrice * numberOfNonResidentChildren;
}

function tripleNonResidentChildBedAndBreakfastPrice(
  numberOfNonResidentChildren: number,
  roomPackage: string,
  availabilities: RoomType[] | undefined
) {
  if (
    roomPackage !== "BED AND BREAKFAST" ||
    numberOfNonResidentChildren !== 3
  ) {
    return null; // Invalid input, return null
  }

  if (!availabilities) {
    return null; // Invalid input, return null
  }

  let totalPrice = 0;

  for (const availability of availabilities) {
    if (availability.package === "BED AND BREAKFAST") {
      let hasChildTriple = false;
      let hasChildDouble = false;
      for (const roomAvailability of availability.room_non_resident_availabilities) {
        for (const guestAvailability of roomAvailability.room_non_resident_guest_availabilities) {
          if (guestAvailability.name === "CHILD TRIPLE") {
            totalPrice += guestAvailability.price;
            hasChildTriple = true;
            hasChildDouble = true;
          }
        }

        if (!hasChildTriple) {
          for (const guestAvailability of roomAvailability.room_non_resident_guest_availabilities) {
            if (guestAvailability.name === "CHILD DOUBLE") {
              totalPrice += guestAvailability.price;
              hasChildDouble = true;
              break;
            }
          }
        }

        if (!hasChildDouble) {
          for (const guestAvailability of roomAvailability.room_non_resident_guest_availabilities) {
            if (guestAvailability.name === "CHILD SINGLE") {
              totalPrice += guestAvailability.price;
              break;
            }
          }
        }
      }
    }
  }

  return totalPrice * numberOfNonResidentChildren;
}

// Non Resident Infant
function nonResidentInfantAllInclusivePrice(
  numberOfNonResidentInfants: number,
  roomPackage: string,
  availabilities: RoomType[] | undefined
) {
  if (roomPackage !== "ALL INCLUSIVE") {
    return null; // Invalid input, return null
  }

  if (!availabilities) {
    return null; // Invalid input, return null
  }

  let totalPrice = 0;

  for (const availability of availabilities) {
    if (availability.package === "ALL INCLUSIVE") {
      for (const roomAvailability of availability.room_non_resident_availabilities) {
        for (const guestAvailability of roomAvailability.room_non_resident_guest_availabilities) {
          if (guestAvailability.name === "INFANT") {
            totalPrice += guestAvailability.price;
            break;
          }
        }
      }
    }
  }

  return totalPrice * numberOfNonResidentInfants;
}

function nonResidentInfantGamePackagePrice(
  numberOfNonResidentInfants: number,
  roomPackage: string,
  availabilities: RoomType[] | undefined
) {
  if (roomPackage !== "GAME PACKAGE") {
    return null; // Invalid input, return null
  }

  if (!availabilities) {
    return null; // Invalid input, return null
  }

  let totalPrice = 0;

  for (const availability of availabilities) {
    if (availability.package === "GAME PACKAGE") {
      for (const roomAvailability of availability.room_non_resident_availabilities) {
        for (const guestAvailability of roomAvailability.room_non_resident_guest_availabilities) {
          if (guestAvailability.name === "INFANT") {
            totalPrice += guestAvailability.price;
            break;
          }
        }
      }
    }
  }

  return totalPrice * numberOfNonResidentInfants;
}

function nonResidentInfantFullBoardPrice(
  numberOfNonResidentInfants: number,
  roomPackage: string,
  availabilities: RoomType[] | undefined
) {
  if (roomPackage !== "FULL BOARD") {
    return null; // Invalid input, return null
  }

  if (!availabilities) {
    return null; // Invalid input, return null
  }

  let totalPrice = 0;

  for (const availability of availabilities) {
    if (availability.package === "FULL BOARD") {
      for (const roomAvailability of availability.room_non_resident_availabilities) {
        for (const guestAvailability of roomAvailability.room_non_resident_guest_availabilities) {
          if (guestAvailability.name === "INFANT") {
            totalPrice += guestAvailability.price;
            break;
          }
        }
      }
    }
  }

  return totalPrice * numberOfNonResidentInfants;
}

function nonResidentInfantHalfBoardPrice(
  numberOfNonResidentInfants: number,
  roomPackage: string,
  availabilities: RoomType[] | undefined
) {
  if (roomPackage !== "HALF BOARD") {
    return null; // Invalid input, return null
  }

  if (!availabilities) {
    return null; // Invalid input, return null
  }

  let totalPrice = 0;

  for (const availability of availabilities) {
    if (availability.package === "HALF BOARD") {
      for (const roomAvailability of availability.room_non_resident_availabilities) {
        for (const guestAvailability of roomAvailability.room_non_resident_guest_availabilities) {
          if (guestAvailability.name === "INFANT") {
            totalPrice += guestAvailability.price;
            break;
          }
        }
      }
    }
  }

  return totalPrice * numberOfNonResidentInfants;
}

function nonResidentInfantBedAndBreakfastPrice(
  numberOfNonResidentInfants: number,
  roomPackage: string,
  availabilities: RoomType[] | undefined
) {
  if (roomPackage !== "BED AND BREAKFAST") {
    return null; // Invalid input, return null
  }

  if (!availabilities) {
    return null; // Invalid input, return null
  }

  let totalPrice = 0;

  for (const availability of availabilities) {
    if (availability.package === "BED AND BREAKFAST") {
      for (const roomAvailability of availability.room_non_resident_availabilities) {
        for (const guestAvailability of roomAvailability.room_non_resident_guest_availabilities) {
          if (guestAvailability.name === "INFANT") {
            totalPrice += guestAvailability.price;
            break;
          }
        }
      }
    }
  }

  return totalPrice * numberOfNonResidentInfants;
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

function residentPrice(
  roomName: string,
  guestName: string | undefined,
  packageName: string | undefined,
  numberOfGuests: number,
  availabilities: RoomType[] | undefined
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
            totalPrice += guestAvailability.price;
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
  availabilities: RoomType[] | undefined
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
            totalPrice += guestAvailability.price;
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
  packages: RoomType[] | undefined
): ({ name?: string; description?: string } | undefined)[] => {
  if (packages && name && packageName) {
    const filteredPackage = packages.find(
      (pkg) => pkg.name === name && pkg.package === packageName
    );
    if (!filteredPackage) {
      return [];
    }

    const { room_resident_availabilities } = filteredPackage;
    const nameSets = room_resident_availabilities.map((room) =>
      room.room_resident_guest_availabilities.map((guest) => ({
        name: guest.name?.toLowerCase(),
        description: guest.description,
      }))
    );

    const nameSet = new Set();
    const commonNames = [];

    for (const nameArr of nameSets) {
      for (const nameObj of nameArr) {
        if (!nameSet.has(nameObj.name)) {
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
  packages: RoomType[] | undefined
): ({ name?: string; description?: string } | undefined)[] => {
  if (packages && name && packageName) {
    const filteredPackage = packages.find(
      (pkg) => pkg.name === name && pkg.package === packageName
    );
    if (!filteredPackage) {
      return [];
    }

    const { room_non_resident_availabilities } = filteredPackage;
    const nameSets = room_non_resident_availabilities.map((room) =>
      room.room_non_resident_guest_availabilities.map((guest) => ({
        name: guest.name?.toLowerCase(),
        description: guest.description,
      }))
    );

    const nameSet = new Set();
    const commonNames = [];

    for (const nameArr of nameSets) {
      for (const nameObj of nameArr) {
        if (!nameSet.has(nameObj.name)) {
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
  roomTypes: RoomType[] | undefined
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
      ? residentPrice(room.name, guestType, room.package, count, roomTypes)
      : 0;

    return { name: `${count} ${name}`, price };
  });
}

function countNonResidentGuestTypesWithPrice(
  nonResidentGuests: NonResidentGuests[],
  room: Room,
  roomTypes: RoomType[] | undefined
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
      ? nonResidentPrice(room.name, guestType, room.package, count, roomTypes)
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
    if (room.residentParkFee.length > 0) {
      room.residentGuests.forEach((guest) => {
        switch (guest.resident) {
          case "Adult":
            residentAdults += 1;
            break;
          case "Child":
            residentChildren += 1;
            break;
          case "Infant":
            residentInfants += 1;
            break;
          case "Teen":
            residentTeens += 1;
            break;
          default:
            break;
        }
      });
    }
    if (room.nonResidentParkFee.length > 0) {
      room.nonResidentGuests.forEach((guest) => {
        switch (guest.nonResident) {
          case "Adult":
            nonResidentAdults += 1;
            break;
          case "Child":
            nonResidentChildren += 1;
            break;
          case "Infant":
            nonResidentInfants += 1;
            break;
          case "Teen":
            nonResidentTeens += 1;
            break;
          default:
            break;
        }
      });
    }
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

const pricing = {
  singleResidentAdultAllInclusivePrice,
  singleResidentAdultGamePackagePrice,
  singleResidentAdultFullBoardPrice,
  singleResidentAdultHalfBoardPrice,
  singleResidentAdultBedAndBreakfastPrice,
  doubleResidentAdultGamePackagePrice,
  doubleResidentAdultAllInclusivePrice,
  doubleResidentAdultFullBoardPrice,
  doubleResidentAdultHalfBoardPrice,
  doubleResidentAdultBedAndBreakfastPrice,
  tripleResidentAdultAllInclusivePrice,
  tripleResidentAdultGamePackagePrice,
  tripleResidentAdultFullBoardPrice,
  tripleResidentAdultHalfBoardPrice,
  tripleResidentAdultBedAndBreakfastPrice,
  singleResidentChildAllInclusivePrice,
  singleResidentChildGamePackagePrice,
  singleResidentChildFullBoardPrice,
  singleResidentChildHalfBoardPrice,
  singleResidentChildBedAndBreakfastPrice,
  doubleResidentChildAllInclusivePrice,
  doubleResidentChildGamePackagePrice,
  doubleResidentChildFullBoardPrice,
  doubleResidentChildHalfBoardPrice,
  doubleResidentChildBedAndBreakfastPrice,
  tripleResidentChildAllInclusivePrice,
  tripleResidentChildGamePackagePrice,
  tripleResidentChildFullBoardPrice,
  tripleResidentChildHalfBoardPrice,
  tripleResidentChildBedAndBreakfastPrice,

  singleNonResidentAdultAllInclusivePrice,
  singleNonResidentAdultGamePackagePrice,
  singleNonResidentAdultFullBoardPrice,
  singleNonResidentAdultHalfBoardPrice,
  singleNonResidentAdultBedAndBreakfastPrice,
  doubleNonResidentAdultAllInclusivePrice,
  doubleNonResidentAdultGamePackagePrice,
  doubleNonResidentAdultFullBoardPrice,
  doubleNonResidentAdultHalfBoardPrice,
  doubleNonResidentAdultBedAndBreakfastPrice,
  tripleNonResidentAdultAllInclusivePrice,
  tripleNonResidentAdultGamePackagePrice,
  tripleNonResidentAdultFullBoardPrice,
  tripleNonResidentAdultHalfBoardPrice,
  tripleNonResidentAdultBedAndBreakfastPrice,
  singleNonResidentChildAllInclusivePrice,
  singleNonResidentChildGamePackagePrice,
  singleNonResidentChildFullBoardPrice,
  singleNonResidentChildHalfBoardPrice,
  singleNonResidentChildBedAndBreakfastPrice,
  doubleNonResidentChildAllInclusivePrice,
  doubleNonResidentChildGamePackagePrice,
  doubleNonResidentChildFullBoardPrice,
  doubleNonResidentChildHalfBoardPrice,
  doubleNonResidentChildBedAndBreakfastPrice,
  tripleNonResidentChildAllInclusivePrice,
  tripleNonResidentChildGamePackagePrice,
  tripleNonResidentChildFullBoardPrice,
  tripleNonResidentChildHalfBoardPrice,
  tripleNonResidentChildBedAndBreakfastPrice,
  residentInfantAllInclusivePrice,
  residentInfantGamePackagePrice,
  residentInfantFullBoardPrice,
  residentInfantHalfBoardPrice,
  residentInfantBedAndBreakfastPrice,
  nonResidentInfantAllInclusivePrice,
  nonResidentInfantGamePackagePrice,
  nonResidentInfantFullBoardPrice,
  nonResidentInfantHalfBoardPrice,
  nonResidentInfantBedAndBreakfastPrice,
  calculateActivityFees,
  calculateExtraFees,

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
