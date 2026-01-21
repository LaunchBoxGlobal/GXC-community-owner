import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "./swiper.css";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";

export default function Gallery({ product }) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  return (
    <>
      <Swiper
        style={{
          "--swiper-navigation-color": "#fff",
          "--swiper-pagination-color": "#fff",
        }}
        spaceBetween={10}
        navigation={true}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper2 max-h-[310px] rounded-[20px]"
      >
        {product && product?.images?.length > 0 ? (
          <>
            {product?.images?.map((image, index) => {
              return (
                <SwiperSlide key={index}>
                  <img src={image?.imageUrl} className="rounded-[20px]" />
                </SwiperSlide>
              );
            })}
          </>
        ) : (
          <div className="">
            <p>Something went wrong while fetching images.</p>
          </div>
        )}
      </Swiper>
      <Swiper
        onSwiper={setThumbsSwiper}
        spaceBetween={10}
        slidesPerView={5}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[Navigation, Thumbs]}
        className="mySwiper"
      >
        {product && product?.images?.length > 0 ? (
          <>
            {product?.images?.map((image, index) => {
              return (
                <SwiperSlide key={index}>
                  <img src={image?.imageUrl} className="rounded-[20px]" />
                </SwiperSlide>
              );
            })}
          </>
        ) : (
          <div className="">
            <p>Something went wrong while fetching images.</p>
          </div>
        )}
      </Swiper>
    </>
  );
}
