import { createContext, useState } from "react";

export type Guest = {
  guestType: string;
  description: string;
  residentPrice: number | "";
  nonResidentPrice: number | "";
};

export type Season = {
  date: [Date | null, Date | null][];
  name: string;
  guests: Guest[];
};

export type Package = {
  name: string | null;
  description: string;
  seasons: Season[];
  isInput?: Boolean;
};

export type RoomType = {
  name: string;
  adult_capacity: number | "";
  child_capacity: number | "";
  infant_capacity: number | "";
  packages: Package[];
};

export type StateType = {
  rooms: RoomType[];
  guests: Guest[];
  seasons: Season[];
};

type ContextProviderProps = {
  children: React.ReactNode;
};

type ContextType = {
  state: StateType;
  setState: React.Dispatch<React.SetStateAction<StateType>>;
};

export const Context = createContext<ContextType>({} as ContextType);

export const ContextProvider = ({ children }: ContextProviderProps) => {
  const [state, setState] = useState<StateType>({
    rooms: [
      {
        name: "",
        adult_capacity: "",
        child_capacity: "",
        infant_capacity: "",

        packages: [
          {
            name: "",
            description: "",
            isInput: true,
            seasons: [
              {
                date: [[null, null]],
                name: "High Season",
                guests: [
                  {
                    guestType: "",
                    description: "",
                    residentPrice: "",
                    nonResidentPrice: "",
                  },
                ],
              },

              {
                date: [[null, null]],
                name: "Low Season",
                guests: [
                  {
                    guestType: "",
                    description: "",
                    residentPrice: "",
                    nonResidentPrice: "",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    seasons: [
      {
        date: [[null, null]],
        name: "High Season",
        guests: [
          {
            guestType: "",
            description: "",
            residentPrice: "",
            nonResidentPrice: "",
          },
        ],
      },

      {
        date: [[null, null]],
        name: "Low Season",
        guests: [
          {
            guestType: "",
            description: "",
            residentPrice: "",
            nonResidentPrice: "",
          },
        ],
      },
    ],
    guests: [
      {
        guestType: "",
        description: "",
        residentPrice: "",
        nonResidentPrice: "",
      },
    ],
  });

  return (
    <Context.Provider value={{ state, setState }}>{children}</Context.Provider>
  );
};
