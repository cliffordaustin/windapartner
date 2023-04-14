import React, { createContext, useState } from "react";

type ContextProviderProps = {
  children: React.ReactNode;
};

type StateTypes = {};

type ContextTypes = {
  state: StateTypes;
  setState: React.Dispatch<React.SetStateAction<StateTypes>>;
};

export const Context = createContext<ContextTypes>({} as ContextTypes);

export const ContextProvider = ({ children }: ContextProviderProps) => {
  const [state, setState] = useState<StateTypes>({});

  return (
    <Context.Provider value={{ state, setState }}>{children}</Context.Provider>
  );
};
