import { useRouter } from "next/router";
import Button from "../ui/Button";
import Carousel from "../ui/Carousel";
import Price from "../ui/Price";

type PackageProps = {
  images: string[];
  price: number;
  stayName: string;
  title?: string;
  about?: string;
  numberOfNights: number;
  onClick: () => void;
};

export default function Package({
  images,
  price,
  stayName,
  title,
  about,
  numberOfNights,
  onClick,
}: PackageProps) {
  return (
    <div className="w-full sm:w-[280px] h-fit pb-2 border rounded-2xl shadow-lg">
      <div className="w-full relative h-[170px] ">
        <Carousel
          images={images}
          alt={"Carousel images of " + stayName}
          className="rounded-tl-2xl rounded-tr-2xl"
        ></Carousel>
      </div>

      <div className="px-2 mt-2">
        <h1 className="font-bold">{title}</h1>

        <div className="w-full h-[1px] bg-gray-200 mt-2"></div>

        <div className="flex justify-between mt-2">
          <div className="flex flex-col w-full gap-0.5">
            <h1 className="text-gray-600">{about}</h1>
          </div>
        </div>
        <div className="w-full h-[1px] bg-gray-200 mt-2"></div>

        <div className="mt-2">
          <Button
            onClick={onClick}
            className="gradient-red flex items-center justify-center gap-1 !rounded-full font-bold w-full"
          >
            Book now -{"   "}
            <Price price={price * numberOfNights}></Price>
            <div className="text-sm ">
              ({numberOfNights} {numberOfNights > 1 ? "nights" : "night"} )
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}
