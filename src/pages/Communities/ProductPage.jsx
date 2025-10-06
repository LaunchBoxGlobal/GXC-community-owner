import React from "react";
import Gallery from "./Gallery";

const ProductPage = () => {
  return (
    <div className="w-full bg-white custom-shadow rounded-[10px] p-7 mt-5 min-h-[70vh]">
      <h2 className="page-heading">Product Details</h2>
      <div className="w-full mt-6 grid grid-cols-1 lg:grid-cols-2 gap-5 bg-white custom-shadow rounded-[10px] p-5">
        <div className="w-full">
          <Gallery />
        </div>
        <div className="w-full">
          <div className="w-full flex items-start justify-between gap-4">
            <div className="space-y-2">
              <p className="font-semibold text-[20px] leading-none tracking-tight">
                Denim Jacket
              </p>
              <p className="font-medium text-xs">Pickup/Delivery</p>
            </div>
            <p className="text-[24px] font-semibold leading-none text-[var(--button-bg)]">
              $199.00
            </p>
          </div>
          <div className="w-full border my-5" />

          <div className="w-full space-y-3">
            <p className="text-sm font-semibold">Description</p>
            <p className="text-sm font-normal leading-[1.3]">
              Xbox Series X is Microsoft's flagship gaming console, offering
              unparalleled performance and speed. With its powerful AMD Zen 2
              processor and RDNA 2 graphics architecture, it delivers stunning
              4K visuals and supports up to 120 frames per second. The Series X
              features a 1TB SSD for rapid load times and seamless gameplay,
              while its backward compatibility allows access.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
