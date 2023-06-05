import { createContext, useState } from "react";

type ContextProviderProps = {
  children: React.ReactNode;
};

// interface Item {
//   id: number;
//   timestamp: number;
// }

type StateTypes = {
  stayIds: number[];
};

type ContextTypes = {
  state: StateTypes;
  setState: React.Dispatch<React.SetStateAction<StateTypes>>;
};

export const Context = createContext<ContextTypes>({} as ContextTypes);

export function ContextProvider({ children }: ContextProviderProps) {
  const [state, setState] = useState<StateTypes>({
    stayIds: [],
  });
  return (
    <Context.Provider value={{ state, setState }}>{children}</Context.Provider>
  );
}
