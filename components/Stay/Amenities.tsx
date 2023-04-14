import { Stay } from "@/utils/types";
import { Icon } from "@iconify/react";

type AmenitiesProps = {
  stay: Stay | undefined;
};

export default function Amenities({ stay }: AmenitiesProps) {
  return (
    <div className="flex flex-wrap gap-4">
      {stay?.swimming_pool && (
        <div className="w-full md:w-[48%] flex gap-2 items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            role="img"
            className="w-5 h-5"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 24 24"
          >
            <circle cx="19.003" cy="6.002" r="2.002" fill="currentColor" />
            <path
              fill="currentColor"
              d="M18.875 13.219c-.567.453-.978.781-1.878.781c-.899 0-1.288-.311-1.876-.781c-.68-.543-1.525-1.219-3.127-1.219c-1.601 0-2.445.676-3.124 1.219c-.588.47-.975.781-1.875.781c-.898 0-1.286-.311-1.873-.78C4.443 12.676 3.6 12 2 12v2c.897 0 1.285.311 1.872.78c.679.544 1.523 1.22 3.123 1.22s2.446-.676 3.125-1.22c.587-.47.976-.78 1.874-.78c.9 0 1.311.328 1.878.781c.679.543 1.524 1.219 3.125 1.219c1.602 0 2.447-.676 3.127-1.219c.588-.47.977-.781 1.876-.781v-2c-1.601 0-2.446.676-3.125 1.219zM16.997 19c-.899 0-1.288-.311-1.876-.781c-.68-.543-1.525-1.219-3.127-1.219c-1.601 0-2.445.676-3.124 1.219c-.588.47-.975.781-1.875.781c-.898 0-1.286-.311-1.873-.78C4.443 17.676 3.6 17 2 17v2c.897 0 1.285.311 1.872.78c.679.544 1.523 1.22 3.123 1.22s2.446-.676 3.125-1.22c.587-.47.976-.78 1.874-.78c.9 0 1.311.328 1.878.781c.679.543 1.524 1.219 3.125 1.219c1.602 0 2.447-.676 3.127-1.219c.588-.47.977-.781 1.876-.781v-2c-1.601 0-2.446.676-3.125 1.219c-.567.453-.978.781-1.878.781zM11 5.419l2.104 2.104l-2.057 2.57c.286-.056.596-.093.947-.093c1.602 0 2.447.676 3.127 1.219c.588.47.977.781 1.876.781c.9 0 1.311-.328 1.878-.781c.132-.105.274-.217.423-.326l-2.096-2.09l.005-.005l-5.5-5.5a.999.999 0 0 0-1.414 0l-4 4l1.414 1.414L11 5.419z"
            />
          </svg>
          <span>Swimming pool</span>
        </div>
      )}

      {stay?.beauty_salon && (
        <div className="w-full md:w-[48%] flex gap-2 items-center">
          <Icon className="w-6 h-5 text-gray-500" icon="map:beauty-salon" />
          <span>Beauty salon</span>
        </div>
      )}

      {stay?.barber_shop && (
        <div className="w-full md:w-[48%] flex gap-2 items-center">
          <Icon
            className="w-6 h-5 text-gray-500"
            icon="icon-park-twotone:barber-clippers"
          />
          <span>Barber shop</span>
        </div>
      )}

      {stay?.ensuite_room && (
        <div className="w-full md:w-[48%] flex gap-2 items-center">
          <Icon className="w-6 h-5 text-gray-500" icon="ic:baseline-bed" />
          <span>Ensuite room</span>
        </div>
      )}

      {stay?.purified_drinking_water && (
        <div className="w-full md:w-[48%] flex gap-2 items-center">
          <Icon className="w-6 h-5 text-gray-500" icon="akar-icons:water" />
          <span>Purified drinking water</span>
        </div>
      )}

      {stay?.firewood && (
        <div className="w-full md:w-[48%] flex gap-2 items-center">
          <Icon className="w-6 h-5 text-gray-500" icon="ps:fire" />
          <span>Firewood</span>
        </div>
      )}

      {stay?.conference_center && (
        <div className="w-full md:w-[48%] flex gap-2 items-center">
          <Icon
            className="w-6 h-5 text-gray-500"
            icon="fluent:conference-room-48-regular"
          />
          <span>Conference center</span>
        </div>
      )}

      {stay?.library && (
        <div className="w-full md:w-[48%] flex gap-2 items-center">
          <Icon className="w-6 h-5 text-gray-500" icon="bx:book-alt" />
          <span>Library</span>
        </div>
      )}

      {stay?.hot_tub && (
        <div className="w-full md:w-[48%] flex gap-2 items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            role="img"
            className="w-5 h-5"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M21 10H7V7c0-1.103.897-2 2-2s2 .897 2 2h2c0-2.206-1.794-4-4-4S5 4.794 5 7v3H3a1 1 0 0 0-1 1v2c0 2.606 1.674 4.823 4 5.65V22h2v-3h8v3h2v-3.35c2.326-.827 4-3.044 4-5.65v-2a1 1 0 0 0-1-1zm-1 3c0 2.206-1.794 4-4 4H8c-2.206 0-4-1.794-4-4v-1h16v1z"
            />
          </svg>
          <span>Hot tub</span>
        </div>
      )}

      {stay?.sauna && (
        <div className="w-full md:w-[48%] flex gap-2 items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            role="img"
            className="w-5 h-5"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M4 22q-.825 0-1.412-.587Q2 20.825 2 20V4q0-.825.588-1.413Q3.175 2 4 2h16q.825 0 1.413.587Q22 3.175 22 4v16q0 .825-.587 1.413Q20.825 22 20 22Zm0-2h16V4H4v16Zm5-2q.425 0 .713-.288Q10 17.425 10 17t-.287-.712Q9.425 16 9 16t-.712.288Q8 16.575 8 17t.288.712Q8.575 18 9 18Zm3 0q.425 0 .713-.288Q13 17.425 13 17t-.287-.712Q12.425 16 12 16t-.712.288Q11 16.575 11 17t.288.712Q11.575 18 12 18Zm3 0q.425 0 .713-.288Q16 17.425 16 17t-.287-.712Q15.425 16 15 16t-.712.288Q14 16.575 14 17t.288.712Q14.575 18 15 18Zm-6-3q.425 0 .713-.288Q10 14.425 10 14t-.287-.713Q9.425 13 9 13t-.712.287Q8 13.575 8 14t.288.712Q8.575 15 9 15Zm3 0q.425 0 .713-.288Q13 14.425 13 14t-.287-.713Q12.425 13 12 13t-.712.287Q11 13.575 11 14t.288.712Q11.575 15 12 15Zm3 0q.425 0 .713-.288Q16 14.425 16 14t-.287-.713Q15.425 13 15 13t-.712.287Q14 13.575 14 14t.288.712Q14.575 15 15 15Zm-8-3h10v-1q0-2.075-1.462-3.538Q14.075 6 12 6Q9.925 6 8.463 7.462Q7 8.925 7 11Zm1.55-1.5q.2-1.275 1.163-2.137Q10.675 7.5 12 7.5t2.288.863q.962.862 1.162 2.137ZM4 4h16Zm8 3.5Z"
            />
          </svg>
          <span>Sauna</span>
        </div>
      )}

      {stay?.gym && (
        <div className="w-full md:w-[48%] flex gap-2 items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            role="img"
            className="w-5 h-5"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 24 24"
          >
            <g
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            >
              <path d="M7.4 7H4.6a.6.6 0 0 0-.6.6v8.8a.6.6 0 0 0 .6.6h2.8a.6.6 0 0 0 .6-.6V7.6a.6.6 0 0 0-.6-.6Zm12 0h-2.8a.6.6 0 0 0-.6.6v8.8a.6.6 0 0 0 .6.6h2.8a.6.6 0 0 0 .6-.6V7.6a.6.6 0 0 0-.6-.6Z" />
              <path d="M1 14.4V9.6a.6.6 0 0 1 .6-.6h1.8a.6.6 0 0 1 .6.6v4.8a.6.6 0 0 1-.6.6H1.6a.6.6 0 0 1-.6-.6Zm22 0V9.6a.6.6 0 0 0-.6-.6h-1.8a.6.6 0 0 0-.6.6v4.8a.6.6 0 0 0 .6.6h1.8a.6.6 0 0 0 .6-.6ZM8 12h8" />
            </g>
          </svg>
          <span>Gym</span>
        </div>
      )}

      {stay?.patio && (
        <div className="w-full md:w-[48%] flex gap-2 items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            role="img"
            className="w-5 h-5"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M15 22H9v-1h6v1m4-18l-4-2H9L5 4h14M8 5l.4 1h7.2l.4-1H8m2 5h1v5c-.6 0-1 .4-1 1v4h4v-4c0-.6-.4-1-1-1v-5h1l.4-1H9.6l.4 1m-.8-2h5.6l.4-1H8.8l.4 1Z"
            />
          </svg>
          <span>Patio</span>
        </div>
      )}

      {stay?.beachfront && (
        <div className="w-full md:w-[48%] flex gap-2 items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            role="img"
            className="w-5 h-5"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 512 512"
          >
            <path
              fill="currentColor"
              d="m259.431 268.8l140-140l-27.785-27.785A208.333 208.333 0 0 0 77.019 395.646l27.781 27.785l132-132L401.372 456h45.256ZM224.333 72a175.182 175.182 0 0 1 124.686 51.646l5.157 5.158l-57.058 57.058a477.658 477.658 0 0 0-62.879-53.924c-25.216-17.838-49.439-30.329-71.994-37.131a152.909 152.909 0 0 0-17.092-4.129A175.58 175.58 0 0 1 224.333 72ZM104.8 378.176l-5.158-5.157a176.637 176.637 0 0 1-32.964-203.866a153.129 153.129 0 0 0 4.129 17.092c6.8 22.556 19.3 46.778 37.131 71.994a477.658 477.658 0 0 0 53.924 62.879Zm79.7-79.7c-11.857-11.634-32.231-32.977-50.438-58.718c-22.872-32.336-46.59-77.9-33.753-115.45c37.421-12.793 82.8 10.736 115.005 33.437c25.864 18.233 47.431 38.815 59.158 50.759Z"
            />
          </svg>
          <span>Beach front</span>
        </div>
      )}

      {stay?.terrace && (
        <div className="w-full md:w-[48%] flex gap-2 items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            role="img"
            className="w-5 h-5"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 48 48"
          >
            <g fill="none" stroke="#000" strokeLinecap="round" strokeWidth="4">
              <path
                strokeLinejoin="round"
                d="M5 24V40C5 41.1046 5.89543 42 7 42H41C42.1046 42 43 41.1046 43 40V24"
              />
              <path strokeLinejoin="round" d="M43 31L5 31" />
              <path d="M32 23C32 18.5817 28.4183 15 24 15C19.5817 15 16 18.5817 16 23" />
              <path strokeLinejoin="round" d="M24 6V8" />
              <path strokeLinejoin="round" d="M35.4141 10L33.9998 11.4142" />
              <path strokeLinejoin="round" d="M12 10L13.4142 11.4142" />
            </g>
          </svg>
          <span>Terrace</span>
        </div>
      )}

      {stay?.balcony && (
        <div className="w-full md:w-[48%] flex gap-2 items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            role="img"
            className="w-5 h-5"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M10 10v2H8v-2h2zm6 2v-2h-2v2h2zm5 2v8H3v-8h1v-4c0-4.42 3.58-8 8-8s8 3.58 8 8v4h1zM7 16H5v4h2v-4zm4 0H9v4h2v-4zm0-11.92C8.16 4.56 6 7.03 6 10v4h5V4.08zM13 14h5v-4c0-2.97-2.16-5.44-5-5.92V14zm2 2h-2v4h2v-4zm4 0h-2v4h2v-4z"
            />
          </svg>
          <span>Balcony</span>
        </div>
      )}

      {stay?.firepit && (
        <div className="w-full md:w-[48%] flex gap-2 items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            role="img"
            className="w-5 h-5"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 24 24"
          >
            <g
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            >
              <path d="M12 22c-4.97 0-9-2.582-9-7v-.088C3 12.794 4.338 11.1 6.375 10c1.949-1.052 3.101-2.99 2.813-5l-.563-3l2.086.795c3.757 1.43 6.886 3.912 8.914 7.066A8.495 8.495 0 0 1 21 14.464V15c0 1.562-.504 2.895-1.375 3.965" />
              <path d="M12 22c-1.657 0-3-1.433-3-3.2c0-1.4 1.016-2.521 1.91-3.548L12 14l1.09 1.252C13.984 16.28 15 17.4 15 18.8c0 1.767-1.343 3.2-3 3.2Z" />
            </g>
          </svg>
          <span>Fire pit</span>
        </div>
      )}

      {stay?.barbecue_grill && (
        <div className="w-full md:w-[48%] flex gap-2 items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            role="img"
            className="w-5 h-5"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 48 48"
          >
            <g fill="none" stroke="#000" strokeLinecap="round" strokeWidth="4">
              <path
                strokeLinejoin="round"
                d="M5 24V40C5 41.1046 5.89543 42 7 42H41C42.1046 42 43 41.1046 43 40V24"
              />
              <path strokeLinejoin="round" d="M43 31L5 31" />
              <path d="M32 23C32 18.5817 28.4183 15 24 15C19.5817 15 16 18.5817 16 23" />
              <path strokeLinejoin="round" d="M24 6V8" />
              <path strokeLinejoin="round" d="M35.4141 10L33.9998 11.4142" />
              <path strokeLinejoin="round" d="M12 10L13.4142 11.4142" />
            </g>
          </svg>
          <span>Barbecue grill</span>
        </div>
      )}

      {stay?.outdoor_dining_area && (
        <div className="w-full md:w-[48%] flex gap-2 items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            role="img"
            className="w-5 h-5"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 16 16"
          >
            <path
              fill="currentColor"
              d="M3.5 1a.5.5 0 0 1 .5.5v3a1.5 1.5 0 0 0 1 1.415V1.5a.5.5 0 0 1 1 0v4.415A1.5 1.5 0 0 0 7 4.5v-3a.5.5 0 0 1 1 0v3a2.5 2.5 0 0 1-2 2.45v7.55a.5.5 0 0 1-1 0V6.95A2.5 2.5 0 0 1 3 4.5v-3a.5.5 0 0 1 .5-.5Zm6.979 1.479c.159-.16.338-.283.521-.364V7h-1V3.5c0-.337.174-.717.479-1.021ZM11 8v6.5a.5.5 0 0 0 1 0v-13a.5.5 0 0 0-.5-.5c-.663 0-1.283.326-1.729.771C9.326 2.217 9 2.837 9 3.5v4a.5.5 0 0 0 .5.5H11Z"
            />
          </svg>
          <span>Outdoor dinning area</span>
        </div>
      )}

      {stay?.spa && (
        <div className="w-full md:w-[48%] flex gap-2 items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            role="img"
            className="w-5 h-5"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M20.787 9.023c-.125.027-1.803.418-3.953 1.774c-.323-1.567-1.279-4.501-4.108-7.485L12 2.546l-.726.767C8.435 6.308 7.483 9.25 7.163 10.827C5.005 9.448 3.34 9.052 3.218 9.024L2 8.752V10c0 7.29 3.925 12 10 12c5.981 0 10-4.822 10-12V8.758l-1.213.265zM8.999 12.038c.002-.033.152-3.1 3.001-6.532C14.814 8.906 14.999 12 15 12v.125a18.933 18.933 0 0 0-3.01 3.154a19.877 19.877 0 0 0-2.991-3.113v-.128zM12 20c-5.316 0-7.549-4.196-7.937-8.564c1.655.718 4.616 2.426 7.107 6.123l.841 1.249l.825-1.26c2.426-3.708 5.425-5.411 7.096-6.122C19.534 15.654 17.304 20 12 20z"
            />
          </svg>
          <span>Spa</span>
        </div>
      )}

      {stay?.wifi && (
        <div className="w-full md:w-[48%] flex gap-2 items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            role="img"
            className="w-5 h-5"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 24 24"
          >
            <g
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            >
              <path d="M2 10c6-6.667 14-6.667 20 0M6 14c3.6-4 8.4-4 12 0" />
              <circle cx="12" cy="18" r="1" />
            </g>
          </svg>
          <span>Wifi</span>
        </div>
      )}

      {stay?.parking && (
        <div className="w-full md:w-[48%] flex gap-2 items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            role="img"
            className="w-5 h-5"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M12 3c-5 0-9 4-9 9s4 9 9 9s9-4 9-9s-4-9-9-9m0 16c-3.9 0-7-3.1-7-7s3.1-7 7-7s7 3.1 7 7s-3.1 7-7 7m8.5 1.5c2.2-2.2 3.5-5.2 3.5-8.5s-1.3-6.3-3.5-8.5l-1.1 1.1c1.9 1.9 3.1 4.5 3.1 7.4c0 2.9-1.2 5.5-3.1 7.4l1.1 1.1M4.6 19.4c-1.9-1.9-3.1-4.5-3.1-7.4c0-2.9 1.2-5.5 3.1-7.4L3.5 3.5C1.3 5.7 0 8.7 0 12s1.3 6.3 3.5 8.5l1.1-1.1M9.5 7v10h2v-4h2a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-4m2 2h2v2h-2V9Z"
            />
          </svg>
          <span>Parking</span>
        </div>
      )}

      {stay?.tv && (
        <div className="w-full md:w-[48%] flex gap-2 items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            role="img"
            className="w-5 h-5"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 640 512"
          >
            <path
              fill="currentColor"
              d="M592 0H48A48 48 0 0 0 0 48v320a48 48 0 0 0 48 48h240v32H112a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16H352v-32h240a48 48 0 0 0 48-48V48a48 48 0 0 0-48-48zm-16 352H64V64h512z"
            />
          </svg>
          <span>TV</span>
        </div>
      )}

      {stay?.air_conditioning && (
        <div className="w-full md:w-[48%] flex gap-2 items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            role="img"
            className="w-5 h-5"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 48 48"
          >
            <g
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="4"
            >
              <rect width="40" height="20" x="4" y="8" rx="2" />
              <path d="M12 20h24v8H12zm20-6h4M24 34v6m-8-4v2m16-2v2" />
            </g>
          </svg>
          <span>Air conditioning</span>
        </div>
      )}

      {stay?.heating && (
        <div className="w-full md:w-[48%] flex gap-2 items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            role="img"
            className="w-5 h-5"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M19 17c1.21 0 3-.8 3-3s-1.79-3-3-3h-2V9h2c2.2 0 3-1.79 3-3c0-2.2-1.79-3-3-3h-2V2h-1v1H8V2H7v1H2v2h5v2H5c-1.21 0-3 .8-3 3s1.79 3 3 3h2v2H5c-1.21 0-3 .8-3 3s1.79 3 3 3h2v1h1v-1h8v1h1v-1h5v-2h-5v-2h2m0-4c.45 0 1 .19 1 1s-.55 1-1 1h-2v-2h2m-3-2H8V9h8v2m3-6c.45 0 1 .2 1 1c0 .45-.19 1-1 1h-2V5h2M8 5h8v2H8V5m-3 6c-.45 0-1-.19-1-1s.55-1 1-1h2v2H5m3 2h8v2H8v-2m-3 6c-.45 0-1-.19-1-1s.55-1 1-1h2v2H5m11 0H8v-2h8v2Z"
            />
          </svg>
          <span>Heating</span>
        </div>
      )}

      {stay?.fridge && (
        <div className="w-full md:w-[48%] flex gap-2 items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            role="img"
            className="w-5 h-5"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M8 5h2v3H8zm0 7h2v5H8zm10-9.99L6 2a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.11-.9-1.99-2-1.99zM18 20H6v-9.02h12V20zm0-11H6V4h12v5z"
            />
          </svg>
          <span>Fridge</span>
        </div>
      )}

      {stay?.kitchen && (
        <div className="w-full md:w-[48%] flex gap-2 items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            role="img"
            className="w-5 h-5"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 24 24"
          >
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 3h8l-1 9H5zm3 15h2v3H7zM20 3v12h-5c-.023-3.681.184-7.406 5-12zm0 12v6h-1v-3M8 12v6"
            />
          </svg>
          <span>Kitchen</span>
        </div>
      )}

      {stay?.laundry && (
        <div className="w-full md:w-[48%] flex gap-2 items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            role="img"
            className="w-5 h-5"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M6 13.975q.475-.2.975-.313q.5-.112 1.025-.162V7.575L4.875 9.3L3.85 7.55L7.7 5.325q.6 1.225 1.763 1.95Q10.625 8 12 8t2.538-.725Q15.7 6.55 16.3 5.325l3.825 2.225l-1 1.75L16 7.575V17.4q.1-.05.225-.125t.2-.125L18 15.775v-4.8L19.875 12l2.975-5.175L16.275 3H15q-.4 1.2-.95 2.1Q13.5 6 12 6q-1.5 0-2.05-.9Q9.4 4.2 9 3H7.725l-6.6 3.8l3 5.2L6 10.975Zm-1.35 5.4l-1.3-1.525L5.525 16q.575-.5 1.313-.762q.737-.263 1.537-.263q.8 0 1.525.263q.725.262 1.3.762l2.9 2.475q.3.25.712.388q.413.137.838.137q.45 0 .838-.125q.387-.125.687-.4L19.35 16.6l1.3 1.55L18.475 20q-.575.5-1.3.75q-.725.25-1.525.25q-.8 0-1.537-.25q-.738-.25-1.313-.75l-2.9-2.475q-.3-.25-.687-.388Q8.825 17 8.375 17q-.425 0-.838.137q-.412.138-.712.388ZM12 8Z"
            />
          </svg>
          <span>Laundry</span>
        </div>
      )}

      {stay?.washing_machine && (
        <div className="w-full md:w-[48%] flex gap-2 items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            role="img"
            className="w-5 h-5"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M18 2.01L6 2c-1.11 0-2 .89-2 2v16c0 1.11.89 2 2 2h12c1.11 0 2-.89 2-2V4c0-1.11-.89-1.99-2-1.99zM18 20H6L5.99 4H18v16z"
            />
            <circle cx="8" cy="6" r="1" fill="currentColor" />
            <circle cx="11" cy="6" r="1" fill="currentColor" />
            <path
              fill="currentColor"
              d="M12 19c2.76 0 5-2.24 5-5s-2.24-5-5-5s-5 2.24-5 5s2.24 5 5 5zm2.36-7.36c1.3 1.3 1.3 3.42 0 4.72c-1.3 1.3-3.42 1.3-4.72 0l4.72-4.72z"
            />
          </svg>
          <span>Washing machine</span>
        </div>
      )}

      {stay?.dedicated_working_area && (
        <div className="w-full md:w-[48%] flex gap-2 items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            role="img"
            className="w-5 h-5"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 16 16"
          >
            <path
              fill="currentColor"
              d="M3 4a1.5 1.5 0 0 1 1.5-1.5h8A1.5 1.5 0 0 1 14 4v5a1.5 1.5 0 0 1-1.5 1.5h-4v-1h4A.5.5 0 0 0 13 9V4a.5.5 0 0 0-.5-.5h-8A.5.5 0 0 0 4 4h-.5c-.173 0-.34.022-.5.063V4Zm11.5 8.5h-6v-1h6a.5.5 0 0 1 0 1Zm-10 0a.5.5 0 1 0 0-1a.5.5 0 0 0 0 1Zm-3-6A1.5 1.5 0 0 1 3 5h3a1.5 1.5 0 0 1 1.5 1.5v6A1.5 1.5 0 0 1 6 14H3a1.5 1.5 0 0 1-1.5-1.5v-6ZM3 6a.5.5 0 0 0-.5.5v6a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-6A.5.5 0 0 0 6 6H3Z"
            />
          </svg>
          <span>Dedicated working area</span>
        </div>
      )}

      {stay?.smoke_alarm && (
        <div className="w-full md:w-[48%] flex gap-2 items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            role="img"
            className="w-5 h-5"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M17 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2m0 16H3V5h14v14m-7-1c3.3 0 6-2.7 6-6s-2.7-6-6-6s-6 2.7-6 6s2.7 6 6 6m0-10c2.2 0 4 1.8 4 4s-1.8 4-4 4s-4-1.8-4-4s1.8-4 4-4m13-1h-2v6h2V8m0 7h-2v2h2v-2Z"
            />
          </svg>
          <span>Smoke alarm</span>
        </div>
      )}

      {stay?.first_aid_kit && (
        <div className="w-full md:w-[48%] flex gap-2 items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            role="img"
            className="w-5 h-5"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M20 6h-3V4c0-1.103-.897-2-2-2H9c-1.103 0-2 .897-2 2v2H4c-1.103 0-2 .897-2 2v10c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V8c0-1.103-.897-2-2-2zM9 4h6v2H9V4zM4 18V8h16l.001 10H4z"
            />
            <path fill="currentColor" d="M13 9h-2v3H8v2h3v3h2v-3h3v-2h-3z" />
          </svg>
          <span>First-aid kit</span>
        </div>
      )}

      {stay?.medical_service_on_site && (
        <div className="w-full md:w-[48%] flex gap-2 items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            role="img"
            className="w-5 h-5"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 48 48"
          >
            <g fill="currentColor" fillRule="evenodd" clipRule="evenodd">
              <path d="M32.263 8.356c.03.036.058.075.083.114l.001.002l.003.005l.009.015l.032.053a26.166 26.166 0 0 1 .531.927c.34.622.791 1.5 1.243 2.538C35.06 14.06 36 16.827 36 19.463c0 2.983-2.015 4.637-3.787 5.491a11.74 11.74 0 0 1-2.776.915A7.972 7.972 0 0 1 24 27.998a7.985 7.985 0 0 1-6.257-3.013l-.046-.004a7.997 7.997 0 0 1-.649-.086a7.897 7.897 0 0 1-1.97-.606c-.73-.34-1.506-.862-2.1-1.663c-.603-.813-.978-1.859-.978-3.164c0-2.467 1.202-5.27 2.306-7.352a36.356 36.356 0 0 1 2.206-3.619l.032-.045l.012-.019a5.486 5.486 0 0 1 .413-.548a7.368 7.368 0 0 1 1.32-1.195C19.503 5.821 21.373 5 24.055 5c2.675 0 4.712.817 6.084 1.643c.685.413 1.204.827 1.557 1.144a7.494 7.494 0 0 1 .55.55l.01.012l.005.005l.001.002ZM18.237 9.512a.996.996 0 0 1-.048.074l-.002.002l-.008.01l-.033.048a29.46 29.46 0 0 0-.611.911c-.4.62-.932 1.49-1.462 2.49C14.987 15.095 14 17.523 14 19.463c0 .899.25 1.522.584 1.973c.344.462.819.8 1.339 1.042c.247.115.497.206.735.277a24.259 24.259 0 0 1-.429-2.6c-.113-1.074-.146-2.265.056-3.318c.199-1.032.668-2.141 1.742-2.718c1.429-.767 3.847-1.793 5.979-2.5c1.063-.353 2.1-.642 2.929-.774c.407-.064.825-.1 1.193-.063c.288.03.885.139 1.215.68c2.68 3.869 2.72 7.414 2.041 10.003c-.196.748-.45 1.412-.712 1.976a8.7 8.7 0 0 0 .672-.288c1.45-.7 2.656-1.814 2.656-3.69c0-2.222-.81-4.686-1.668-6.654a30.258 30.258 0 0 0-1.546-3.051l-.094-.159l-.024-.025l-.011-.012a5.513 5.513 0 0 0-.298-.287a8.256 8.256 0 0 0-1.252-.918C27.99 7.683 26.305 7 24.055 7c-2.244 0-3.712.679-4.606 1.315a5.37 5.37 0 0 0-.961.867a3.488 3.488 0 0 0-.246.322l-.005.008ZM32.346 8.47l-.848.53l.848-.53Zm-.848.53l.765-.644l-.765.644ZM18.742 22.894a22.73 22.73 0 0 1-.524-2.947c-.105-.993-.118-1.96.03-2.733c.153-.792.43-1.175.724-1.333c1.307-.702 3.616-1.685 5.663-2.364c1.026-.34 1.942-.59 2.612-.696c.253-.04.439-.055.565-.054c2.198 3.268 2.175 6.137 1.636 8.191a9.89 9.89 0 0 1-1.053 2.517a8.252 8.252 0 0 1-.565.834l-.007.009l-.021.026l-.004.004l-.001.001a.999.999 0 0 0-.224.471a5.998 5.998 0 0 1-8.83-1.926ZM27.98 12.78a.128.128 0 0 1-.026-.006a.089.089 0 0 1 .026.006Z" />
              <path d="M17.914 28.855c-.212-.422-.473-.943-.914-.842c-5.404 1.23-11 4.782-11 8.557V42h36v-5.43c0-2.974-3.472-5.808-7.587-7.48l-.014-.027l-.005-.01l-.033.016c-1.093-.44-2.231-.8-3.361-1.056c-.503-.115-1.023.577-1.25 1.01H18a9.88 9.88 0 0 1-.086-.168Zm13.489 1.321c.437.12.872.257 1.301.407c.012.342-.014.745-.07 1.157a8.087 8.087 0 0 1-.272 1.26H31a1 1 0 0 0-.894.553l-1 2A.999.999 0 0 0 29 36v2a1 1 0 0 0 1 1h2v-2h-1v-.764L31.618 35h2.764L35 36.236V37h-1v2h2a1 1 0 0 0 1-1v-2a.999.999 0 0 0-.106-.447l-1-2A1 1 0 0 0 35 33h-.566a10.66 10.66 0 0 0 .248-1.608c.975.46 1.881.988 2.666 1.56C39.27 34.356 40 35.668 40 36.57V40H8v-3.43c0-.903.73-2.215 2.652-3.617c.966-.705 2.119-1.343 3.355-1.871a10.179 10.179 0 0 0 .381 2.354l.008.028a3 3 0 1 0 1.956-.444a8.087 8.087 0 0 1-.28-1.28a7.012 7.012 0 0 1-.069-1.171a3.99 3.99 0 0 1 .015-.224c.12-.037.24-.073.36-.107l.415.786h14.164l.446-.848ZM16 37.015c.538 0 1-.44 1-1.015c0-.574-.462-1.015-1-1.015s-1 .44-1 1.015c0 .574.462 1.015 1 1.015Z" />
            </g>
          </svg>
          <span>Medical service on-site</span>
        </div>
      )}

      {stay?.carbon_monoxide_detector && (
        <div className="w-full md:w-[48%] flex gap-2 items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            role="img"
            className="w-5 h-5"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M5 6h14V5H5v1Zm3.4 3h7.2l.3-1H8.1l.3 1ZM13 22.3l-1.9-.6l.4-1.3q.05-.2.088-.4q.037-.2.037-.4q0-.4-.087-.75q-.088-.35-.338-.75q-.425-.675-.612-1.25q-.188-.575-.213-1.375q0-.325.05-.725q.05-.4.175-.75l.4-1.3l1.9.6l-.4 1.3q-.075.225-.1.437q-.025.213-.025.438q0 .425.088.737q.087.313.337.688q.425.675.625 1.3t.2 1.4q0 .35-.05.7t-.175.7Zm-4.4 0l-1.9-.6l.4-1.3q.05-.2.088-.388q.037-.187.037-.412q0-.425-.1-.788q-.1-.362-.325-.712q-.4-.575-.612-1.238q-.213-.662-.213-1.387q0-.375.05-.75T6.2 14l.4-1.3l1.9.6l-.4 1.3q-.075.225-.1.462q-.025.238-.025.413q0 .475.113.813q.112.337.312.612q.425.6.625 1.288q.2.687.2 1.412q0 .35-.05.7T9 21Zm8.7 0l-1.9-.6l.4-1.3q.05-.2.088-.4q.037-.2.037-.4q0-.4-.1-.775T15.5 18.1q-.4-.575-.612-1.25q-.213-.675-.213-1.375q0-.375.05-.737q.05-.363.175-.738l.4-1.3l1.9.6l-.4 1.3q-.075.275-.1.462q-.025.188-.025.413q0 .425.1.75t.325.675q.425.625.625 1.3t.2 1.4q0 .35-.05.7t-.175.7ZM8.4 11q-.65 0-1.175-.387Q6.7 10.225 6.5 9.6L6 8H5q-.825 0-1.413-.588Q3 6.825 3 6V3h18v3q0 .825-.587 1.412Q19.825 8 19 8h-1l-.65 1.7q-.225.575-.725.937q-.5.363-1.125.363ZM5 6h14Z"
            />
          </svg>
          <span>Carbon monoxide detector</span>
        </div>
      )}

      {stay?.lockable_room && (
        <div className="w-full md:w-[48%] flex gap-2 items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            role="img"
            className="w-5 h-5"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 48 48"
          >
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M38.648 41.49V22.368h3.992a.858.858 0 0 0 .556-1.512L25.59 5.868a2.452 2.452 0 0 0-3.178 0L4.804 20.855a.858.858 0 0 0 .556 1.512h3.992v19.124a1.226 1.226 0 0 0 1.226 1.226h26.843a1.226 1.226 0 0 0 1.227-1.226Z"
            />
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M18.732 24.867v-3.47a5.269 5.269 0 0 1 10.537 0v3.47m-12.375 0h14.211v11.675H16.894z"
            />
          </svg>
          <span>Lockable room</span>
        </div>
      )}

      {stay?.bar && (
        <div className="w-full md:w-[48%] flex gap-2 items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            role="img"
            className="w-5 h-5"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 32 32"
          >
            <path
              fill="currentColor"
              d="M25 11H15a1 1 0 0 0-1 1v4a6.005 6.005 0 0 0 5 5.91V28h-3v2h8v-2h-3v-6.09A6.005 6.005 0 0 0 26 16v-4a1 1 0 0 0-1-1Zm-1 5a4 4 0 0 1-8 0v-3h8Z"
            />
            <path
              fill="currentColor"
              d="M15 1h-5a1 1 0 0 0-1 1v7.37A6.09 6.09 0 0 0 6 15v14a1 1 0 0 0 1 1h5v-2H8V15c0-3.188 2.231-4.02 2.316-4.051L11 10.72V3h3v5h2V2a1 1 0 0 0-1-1Z"
            />
          </svg>
          <span>Bar</span>
        </div>
      )}

      {stay?.restaurant && (
        <div className="w-full md:w-[48%] flex gap-2 items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            role="img"
            className="w-5 h-5"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M4.35 9H19.7l-.85-3H5.225Zm7.675-1.5ZM6.975 13h10.1l-.25-2H7.25ZM5.15 20q-.45 0-.738-.337q-.287-.338-.237-.788L5.25 11H3.025q-.5 0-.787-.4q-.288-.4-.163-.875l1.425-5q.1-.325.35-.525q.25-.2.6-.2H19.6q.35 0 .6.2t.35.525l1.425 5q.125.475-.163.875q-.287.4-.787.4h-2.2l1.05 7.875q.05.45-.237.788Q19.35 20 18.9 20q-.375 0-.662-.238q-.288-.237-.338-.612L17.35 15H6.7l-.55 4.15q-.05.375-.338.612Q5.525 20 5.15 20Z"
            />
          </svg>
          <span>Restaurant</span>
        </div>
      )}

      {stay?.giftshop && (
        <div className="w-full md:w-[48%] flex gap-2 items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            role="img"
            className="w-5 h-5"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 1024 1024"
          >
            <path
              fill="currentColor"
              d="M882 272.1V144c0-17.7-14.3-32-32-32H174c-17.7 0-32 14.3-32 32v128.1c-16.7 1-30 14.9-30 31.9v131.7a177 177 0 0 0 14.4 70.4c4.3 10.2 9.6 19.8 15.6 28.9v345c0 17.6 14.3 32 32 32h676c17.7 0 32-14.3 32-32V535a175 175 0 0 0 15.6-28.9c9.5-22.3 14.4-46 14.4-70.4V304c0-17-13.3-30.9-30-31.9zM214 184h596v88H214v-88zm362 656.1H448V736h128v104.1zm234 0H640V704c0-17.7-14.3-32-32-32H416c-17.7 0-32 14.3-32 32v136.1H214V597.9c2.9 1.4 5.9 2.8 9 4c22.3 9.4 46 14.1 70.4 14.1s48-4.7 70.4-14.1c13.8-5.8 26.8-13.2 38.7-22.1c.2-.1.4-.1.6 0a180.4 180.4 0 0 0 38.7 22.1c22.3 9.4 46 14.1 70.4 14.1c24.4 0 48-4.7 70.4-14.1c13.8-5.8 26.8-13.2 38.7-22.1c.2-.1.4-.1.6 0a180.4 180.4 0 0 0 38.7 22.1c22.3 9.4 46 14.1 70.4 14.1c24.4 0 48-4.7 70.4-14.1c3-1.3 6-2.6 9-4v242.2zm30-404.4c0 59.8-49 108.3-109.3 108.3c-40.8 0-76.4-22.1-95.2-54.9c-2.9-5-8.1-8.1-13.9-8.1h-.6c-5.7 0-11 3.1-13.9 8.1A109.24 109.24 0 0 1 512 544c-40.7 0-76.2-22-95-54.7c-3-5.1-8.4-8.3-14.3-8.3s-11.4 3.2-14.3 8.3a109.63 109.63 0 0 1-95.1 54.7C233 544 184 495.5 184 435.7v-91.2c0-.3.2-.5.5-.5h655c.3 0 .5.2.5.5v91.2z"
            />
          </svg>
          <span>Gift shop</span>
        </div>
      )}

      {stay?.photography_room && (
        <div className="w-full md:w-[48%] flex gap-2 items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            role="img"
            className="w-5 h-5"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 24 24"
          >
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m4 16l4.586-4.586a2 2 0 0 1 2.828 0L16 16m-2-2l1.586-1.586a2 2 0 0 1 2.828 0L20 14m-6-6h.01M6 20h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2Z"
            />
          </svg>
          <span>Photography room</span>
        </div>
      )}

      {stay?.themed_room && (
        <div className="w-full md:w-[48%] flex gap-2 items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            role="img"
            className="w-5 h-5"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2S2 6.477 2 12s4.477 10 10 10Zm0-1.5v-17a8.5 8.5 0 0 1 0 17Z"
            />
          </svg>
          <span>Themed room</span>
        </div>
      )}

      {stay?.pet_friendly && (
        <div className="w-full md:w-[48%] flex gap-2 items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            role="img"
            className="w-5 h-5"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M13.25 2h3.185c.509 0 1.007.141 1.44.408l2.768 1.703A.75.75 0 0 1 21 4.75v1.5a2.25 2.25 0 0 1-2.25 2.25h-.25v9.047c.997.134 1.695.555 2.095 1.275c.223.403.318.84.362 1.243c.043.391.043.8.043 1.16v.025a.75.75 0 0 1-.75.75H5.833a3.833 3.833 0 0 1-1.97-7.123a.75.75 0 0 1 .772 1.287A2.333 2.333 0 0 0 5.833 20.5c.319 0 .517-.083.649-.176c.139-.098.248-.238.331-.407a1.928 1.928 0 0 0 .187-.69v-.035l.004-.143a14.198 14.198 0 0 1 .26-2.187c.26-1.291.797-2.968 1.952-4.139c.848-.86 1.309-2.119 1.547-3.364C11 8.13 11 7.008 11 6.5V4.25A2.25 2.25 0 0 1 13.25 2Zm-5.5 17.25l.75.026v.006l-.001.01l-.002.028a3.42 3.42 0 0 1-.05.38c-.039.213-.112.5-.25.8h7.25c-.09-.494-.34-1.006-1.013-1.32a1.74 1.74 0 0 0-.482-.132a4.694 4.694 0 0 0-.702-.055l-.283.004l-.141.002h-.06a.75.75 0 1 1-.028-1.499l.062-.001l.143-.002l.307-.004c.235 0 .495.016.75.047v-2.287a.75.75 0 0 1 1.5 0v2.804c1.065.682 1.374 1.703 1.463 2.443h2.524a4.9 4.9 0 0 0-.021-.27c-.033-.301-.094-.52-.183-.68c-.13-.234-.433-.55-1.533-.55a.75.75 0 0 1-.75-.75V7.75a.75.75 0 0 1 .75-.75h1a.75.75 0 0 0 .75-.75V5.17l-2.411-1.485a1.247 1.247 0 0 0-.654-.185h-3.186a.75.75 0 0 0-.749.75v2.232a.922.922 0 0 0 .205.554c.101.114.26.214.545.214c.287 0 .453-.101.556-.219A.882.882 0 0 0 14 6.45a.75.75 0 0 1 1.5 0c0 .554-.177 1.125-.566 1.569c-.4.457-.984.731-1.684.731a2.34 2.34 0 0 1-.855-.154a13.93 13.93 0 0 1-.158 1.045c-.262 1.366-.801 2.968-1.953 4.136c-.845.856-1.308 2.18-1.549 3.38a12.702 12.702 0 0 0-.235 2.06v.059l-.75-.026Zm8.5 2.75v-.75Z"
            />
          </svg>
          <span>Pet friendly</span>
        </div>
      )}
    </div>
  );
}
