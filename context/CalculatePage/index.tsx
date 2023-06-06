import { createContext, useState, useEffect } from "react";
import { number } from "yup";

export type ParkFee = {
  id: number;
  name?: string;
  price: number;
  feeType?: string;
  guestType?: "ADULT" | "CHILD" | "INFANT" | "TEEN" | "";
};

export type ExtraFee = {
  id: string;
  name: string;
  price: number | "";
  pricingType: "PER PERSON" | "WHOLE GROUP" | "PER PERSON PER NIGHT" | string;
  guestType: "Resident" | "Non-resident" | string;
};

export type ResidentGuests = {
  id: string;
  resident: "Adult" | "Child" | "Infant" | "Teen" | "";
  numberOfGuests: number;
  guestType?: string;
  description: string;
};

export type NonResidentGuests = {
  id: string;
  nonResident: "Adult" | "Child" | "Infant" | "Teen" | "";
  numberOfGuests: number;
  guestType?: string;
  description: string;
};

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

export type Room = {
  id: string;
  name: string;
  residentAdult: number;
  residentChild: number;
  residentInfant: number;
  nonResidentAdult: number;
  nonResidentChild: number;
  nonResidentInfant: number;
  residentGuests: ResidentGuests[];
  nonResidentGuests: NonResidentGuests[];
  package: string;
  otherFees: OtherFees[];
  residentParkFee: ParkFee[];
  nonResidentParkFee: ParkFee[];
};

export type ActivityFee = {
  id: number;
  name: string;
  price: number | "";
  priceType: "PER PERSON" | "WHOLE GROUP" | "PER PERSON PER NIGHT" | string;
};

export type GuestTotal = {
  id: string;
  resident: number;
  nonResident: number;
};

export type StateType = {
  id: number;
  slug: string;
  name?: string;
  date: [Date | null, Date | null];
  rooms: Room[];
  extraFee: ExtraFee[];
  activityFee: ActivityFee[];
  residentCommission: number | "";
  nonResidentCommission: number | "";
};

type ContextProviderProps = {
  children: React.ReactNode;
};

export type PriceTotal = {
  guestTotal: GuestTotal[];
};

type ContextType = {
  state: StateType[];
  setState: React.Dispatch<React.SetStateAction<StateType[]>>;
  priceTotal: PriceTotal;
  setPriceTotal: React.Dispatch<React.SetStateAction<PriceTotal>>;
};

export const Context = createContext<ContextType>({} as ContextType);

export const ContextProvider = ({ children }: ContextProviderProps) => {
  const [state, setState] = useState<StateType[]>([]);
  const [priceTotal, setPriceTotal] = useState<PriceTotal>({
    guestTotal: [],
  });

  return (
    <Context.Provider value={{ state, setState, priceTotal, setPriceTotal }}>
      {children}
    </Context.Provider>
  );
};
