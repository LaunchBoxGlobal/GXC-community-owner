import Gallery from "./Gallery";
import { useNavigate, useSearchParams } from "react-router-dom";
import PageLoader from "../../components/Loader/PageLoader";
import { useGetProductByIdQuery } from "../../services/productsApi/productsApi";

const ProductPage = () => {
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("productId");
  const navigate = useNavigate();

  const { data, error, isError, isLoading } = useGetProductByIdQuery(
    productId,
    {
      skip: !productId,
      refetchOnReConnect: true,
    }
  );

  const productDetails = data?.data?.product || null;

  if (isLoading) {
    return (
      <div className="w-full bg-white custom-shadow rounded-[10px] p-7 mt-5 min-h-[70vh] flex items-center justify-center">
        <PageLoader />
      </div>
    );
  }

  if (error || isError) {
    return (
      <div className="w-full bg-white custom-shadow rounded-[10px] p-7 mt-5 min-h-[70vh] flex flex-col items-center justify-center text-center">
        <p className="text-red-500 font-medium text-lg mb-4">
          {error?.data?.message || "Something went wrong."}
        </p>
      </div>
    );
  }

  if (!productDetails) {
    return (
      <div className="w-full bg-white custom-shadow rounded-[10px] p-7 mt-5 min-h-[70vh] flex flex-col items-center justify-center text-center">
        <p className="text-red-500 font-medium text-lg mb-4">
          Something went wrong.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-[var(--button-bg)] text-white rounded-md hover:opacity-90"
        >
          Go Back
        </button>
      </div>
    );
  }

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
                  ? "Community Pickup"
                  : "Pickup / Community Pickup"}
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
