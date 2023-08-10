import React from "react";

type ClientOnlyType = {
  children: React.ReactNode;
};

const ClientOnly = ({ children, ...delegated }: ClientOnlyType) => {
  const [hasMounted, setHasMounted] = React.useState(false);

  React.useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;

  return <React.Fragment {...delegated}>{children}</React.Fragment>;
};

export default ClientOnly;
