import { useRef } from "react";
import { Link } from "react-scroll";
import { Swiper, SwiperSlide } from "swiper/react";
import { Stay } from "@/utils/types";
import { FreeMode, Navigation, type Swiper as SwiperRef } from "swiper";

import "swiper/css";
import "swiper/css/free-mode";

type ScrollToProps = {
  stay: Stay | undefined;
};

export const ScrollTo = ({ stay }: ScrollToProps) => {
  const settings = {
    spaceBetween: 10,
  };

  const swiperRef = useRef<SwiperRef>();

  const slideto = (index: number) => {
    if (swiperRef.current) {
      swiperRef?.current?.slideTo(index, 300);
    }
  };

  return (
    <div className="w-full relative h-full mx-auto flex justify-center items-center">
      <Swiper
        {...settings}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        slidesPerView={"auto"}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation]}
        className={"!w-full !h-full relative"}
      >
        <SwiperSlide className="!w-auto flex cursor-pointer justify-center">
          <Link
            className="px-1 text-sm font-bold flex h-full items-center justify-center border-b-2 border-transparent"
            activeClass="!border-b-2 !border-slate-800"
            to="about"
            spy={true}
            smooth={true}
            offset={-600}
            duration={500}
            onSetActive={() => {
              slideto(0);
            }}
          >
            <div>About</div>
          </Link>
        </SwiperSlide>

        <SwiperSlide className="!w-auto flex cursor-pointer justify-center">
          <Link
            className="px-1 text-sm font-bold flex h-full items-center border-b-2 border-transparent"
            activeClass="!border-b-2 !border-slate-800"
            to="activities"
            spy={true}
            smooth={true}
            offset={-600}
            duration={500}
            onSetActive={() => {
              slideto(0);
            }}
          >
            <div>Activities</div>
          </Link>
        </SwiperSlide>

        <SwiperSlide className="!w-auto flex cursor-pointer justify-center">
          <Link
            className="px-1 text-sm font-bold h-full flex items-center border-b-2 border-transparent"
            activeClass="!border-b-2 !border-slate-800"
            to="amenities"
            spy={true}
            smooth={true}
            offset={-600}
            duration={500}
            onSetActive={() => {
              slideto(0);
            }}
          >
            <div>Amenities</div>
          </Link>
        </SwiperSlide>

        {stay?.has_options && (
          <SwiperSlide className="!w-auto flex cursor-pointer justify-center">
            <Link
              className="px-1 text-sm font-bold flex h-full items-center border-b-2 border-transparent"
              activeClass="!border-b-2 !border-slate-800"
              to="options"
              spy={true}
              smooth={true}
              offset={-600}
              duration={500}
              onSetActive={() => {
                slideto(0);
              }}
              onSetInactive={() => {}}
            >
              <div>Options</div>
            </Link>
          </SwiperSlide>
        )}

        <SwiperSlide className="!w-auto flex cursor-pointer justify-center">
          <Link
            className="px-1 text-sm font-bold flex h-full items-center border-b-2 border-transparent"
            activeClass="!border-b-2 !border-slate-800"
            to="policies"
            spy={true}
            smooth={true}
            offset={-600}
            duration={500}
            onSetActive={() => {
              slideto(2);
            }}
          >
            <div>Policies</div>
          </Link>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};
