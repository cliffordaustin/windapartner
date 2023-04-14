import Image from "next/image";
import SwiperCore, { Navigation, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

type CarouselProps = {
  images: string[];
  alt: string;
  className?: string;
};

export default function Carousel({
  images,
  alt,
  className = "",
}: CarouselProps) {
  const settings = {
    spaceBetween: 10,
    slidesPerView: 1,
    pagination: {
      dynamicBullets: true,
    },
  };

  return (
    <div className="h-full">
      <Swiper
        {...settings}
        modules={[Navigation, Pagination]}
        navigation
        className="!h-full !relative "
      >
        {images.map((image, index) => (
          <SwiperSlide key={index} className="!h-full">
            <Image
              className={"w-full object-cover " + className}
              src={image}
              alt={alt}
              unoptimized={true}
              fill
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
