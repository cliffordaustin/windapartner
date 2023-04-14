import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import axios from "axios";
import { getCountryCode, getKesPriceRate } from "@/pages/api/price";

type PriceProps = {
  price: number;
  className?: string;
};

export default function Price({ price, className = "" }: PriceProps) {
  const { data: countryCode } = useQuery("countryCode", getCountryCode, {
    cacheTime: 1000 * 60 * 60 * 24,
  });

  const { data: kesPriceRate } = useQuery("kesPriceRate", getKesPriceRate, {
    cacheTime: 1000 * 60 * 60 * 24,
  });

  return (
    <div>
      {countryCode === "KES" && kesPriceRate ? (
        <h1 className={"font-bold " + className}>
          KES{Math.round(price * kesPriceRate).toLocaleString()}
        </h1>
      ) : (
        <h1 className={"font-bold " + className}>
          ${Math.round(price).toLocaleString()}
        </h1>
      )}
    </div>
  );
}
