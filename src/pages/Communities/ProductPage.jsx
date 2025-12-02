import React, { useEffect, useState } from "react";
import Gallery from "./Gallery";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../data/baseUrl";
import { getToken } from "../../utils/getToken";
import { handleApiError } from "../../utils/handleApiError";
import PageLoader from "../../components/Loader/PageLoader";

const ProductPage = () => {
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("productId");
  const [productDetails, setProductDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const fetchProductDetails = async () => {
    if (!productId) {
      setErrorMsg("Invalid product ID");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await axios.get(`${BASE_URL}/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const product = res?.data?.data?.product;
      if (!product) {
        setErrorMsg("Product not found.");
      } else {
        setProductDetails(product);
      }
    } catch (error) {
      // handle known API errors gracefully
      if (error.response?.status === 404) {
        setErrorMsg("Product not found.");
      } else {
        setErrorMsg("Failed to load product details. Please try again.");
      }
      handleApiError(error, navigate);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  if (loading) {
    return (
      <div className="w-full bg-white custom-shadow rounded-[10px] p-7 mt-5 min-h-[70vh] flex items-center justify-center">
        <PageLoader />
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="w-full bg-white custom-shadow rounded-[10px] p-7 mt-5 min-h-[70vh] flex flex-col items-center justify-center text-center">
        <p className="text-red-500 font-medium text-lg mb-4">{errorMsg}</p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-[var(--button-bg)] text-white rounded-md hover:opacity-90"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!productDetails) {
    return null;
  }

  // if (productDetails?.status !== "active") {
  //   navigate(-1);
  //   return;
  // }

  return (
    <div className="w-full bg-white custom-shadow rounded-[10px] p-7 mt-5">
      <h2 className="page-heading">Product Details</h2>

      <div className="w-full mt-6 grid grid-cols-1 lg:grid-cols-2 gap-5 bg-white custom-shadow rounded-[10px] p-5 min-h-[65vh]">
        {/* Gallery Section */}
        <div className="w-full">
          <Gallery product={productDetails} />
        </div>

        {/* Product Details */}
        <div className="w-full">
          <div className="w-full flex items-start justify-between gap-4">
            <div className="space-y-2">
              <p className="font-semibold text-[20px] leading-none tracking-tight">
                {productDetails?.title}
              </p>
              <p className="font-medium text-xs text-gray-600">
                {productDetails?.deliveryMethod === "pickup"
                  ? "Pickup"
                  : productDetails?.deliveryMethod === "delivery"
                  ? "Delivery"
                  : "Pickup / Delivery"}
              </p>
            </div>
            <p className="text-[24px] font-semibold leading-none text-[var(--button-bg)]">
              ${productDetails?.price}
            </p>
          </div>

          <div className="w-full border my-5" />

          <div className="w-full space-y-3">
            <p className="text-sm font-semibold">Description</p>
            <p className="text-sm font-normal leading-[1.3] text-gray-700">
              {productDetails?.description || "No description provided."}
            </p>
          </div>

          {productDetails?.pickupAddress?.address && (
            <>
              <div className="w-full border my-5" />
              <div className="w-full space-y-3">
                <p className="text-sm font-semibold">Pickup Address</p>
                <p className="text-sm font-normal leading-[1.3]">
                  <span className="font-medium">Address: </span>
                  {productDetails?.pickupAddress?.address}
                </p>
                <p className="text-sm font-normal leading-[1.3]">
                  <span className="font-medium">City: </span>
                  {productDetails?.pickupAddress?.city}
                </p>
                <p className="text-sm font-normal leading-[1.3]">
                  <span className="font-medium">State: </span>
                  {productDetails?.pickupAddress?.state}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
