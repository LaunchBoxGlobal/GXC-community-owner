// ImageSlider.jsx
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

import "./styles.css";

export default function ImageSlider({ images, initialSlide }) {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <Swiper
        navigation
        modules={[Navigation]}
        initialSlide={initialSlide}
        className="w-full h-full flex justify-center items-center"
      >
        {images?.map((image, index) => (
          <SwiperSlide
            key={index}
            className="flex justify-center items-center bg-transparent"
          >
            <img
              src={image}
              alt={`report-image-${index}`}
              className="rounded-2xl object-contain"
              style={{
                maxHeight: "90vh",
                maxWidth: "100%",
                height: "auto",
                width: "auto",
              }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
