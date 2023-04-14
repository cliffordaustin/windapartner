import { ActivityFee, ExtraFee, Room } from "@/context/CalculatePage";
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
};

export default pricing;
