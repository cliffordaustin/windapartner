import Image from "next/image";

type ImageGalleryProps = {
  images: string[] | undefined;
  name?: string;
};

export const ImageGallery = ({ images, name }: ImageGalleryProps) => {
  const allImages = images?.slice(1, 3);
  let mainImage = images && images[0];

  return (
    <div
      className={
        "mt-2 relative flex w-full h-[350px] sm:h-[400px] md:h-[450px] overflow-hidden stepWebkitSetting mx-auto "
      }
    >
      <div
        className={
          "absolute w-full sm:w-[60%] md:w-[70%] left-0 h-full " +
          (allImages?.length === 1 ? " sm:!w-[50%] md:!w-[50%]" : "") +
          (allImages?.length === 0 ? " sm:!w-full md:!w-full" : "")
        }
      >
        {mainImage && (
          <Image
            className="object-cover"
            alt={"Main image of " + (name ? name : "stay")}
            src={mainImage}
            unoptimized={true}
            fill
          ></Image>
        )}
        {!mainImage && allImages && (
          <Image
            className="object-cover"
            alt={"Main image of " + (name ? name : "stay")}
            src={allImages[0]}
            unoptimized={true}
            fill
          ></Image>
        )}
      </div>
      <div
        className={
          "sm:w-[40%] md:w-[30%] hidden h-full absolute right-0 sm:flex flex-col rounded-tr-3xl rounded-br-3xl justify-between " +
          (allImages?.length === 1 ? " !h-full sm:!w-[50%] md:!w-[50%]" : "")
        }
      >
        {allImages?.map((image, index) => (
          <div
            key={index}
            className={
              "relative w-[100%] h-[50%] transition-all duration-200 ease-linear " +
              (allImages.length === 1 ? " !h-full" : "")
            }
          >
            <Image
              className="object-cover"
              alt={"Image of " + (name ? name : "stay")}
              src={image}
              unoptimized={true}
              fill
            ></Image>
          </div>
        ))}
      </div>
    </div>
  );
};
