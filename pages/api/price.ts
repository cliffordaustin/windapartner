import axios from "axios";

export const getCountryCode = async (): Promise<string> => {
  const res = await axios.get(
    `https://api.ipgeolocation.io/ipgeo?apiKey=${process.env.NEXT_PUBLIC_IPGEOLOCATION_API_KEY}`
  );

  return res.data.currency.code;
};

export const getKesPriceRate = async (): Promise<number> => {
  const res = await axios.get(`https://api.exchangerate-api.com/v4/latest/usd`);

  return res.data.rates.KES;
};
