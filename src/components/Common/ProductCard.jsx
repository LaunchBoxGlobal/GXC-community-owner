import { Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const ProductCard = ({ product }) => {
  return (
    <>
      {/* {product?.status === "active" && ( */}
      <Link to={`/products/${product?.title}?productId=${product?.id}`}>
        <div className="w-full bg-white rounded-[20px] p-3 custom-shadow">
          <div className="w-full h-[266px] bg-white rounded-[15px] overflow-hidden relative [&>*]:h-full [&>*]:w-full">
            <LazyLoadImage
              src={product?.images[0]?.imageUrl}
              effect="blur"
              alt="product"
              className="w-full min-h-full object-cover"
            />
          </div>

          <div className="w-full mt-4">
            <h3 className="text-[19px] font-semibold leading-none tracking-tight text-start">
              {product?.title?.length > 21
                ? `${product?.title?.slice(0, 20)}..`
                : product?.title}
            </h3>

            <div className="w-full flex items-center justify-between flex-wrap gap-4 my-2">
              <p className="text-[#9D9D9DDD] text-[14px] font-normal text-start">
                {product?.deliveryMethod === "both"
                  ? "Pickup / Community Pickup"
                  : product?.deliveryMethod === "pickup"
                  ? "Pickup"
                  : product?.deliveryMethod === "delivery"
                  ? "Community Pickup"
                  : null}
              </p>
              <p className="text-[16px] font-medium leading-none tracking-tight">
                ${product?.price}
              </p>
            </div>

            {product?.seller && (
              <div className="flex items-center justify-start gap-2">
                <div className="w-[38px] h-[38px] border-2 p-0.5 border-[var(--button-bg)] rounded-full">
                  {product?.seller?.profilePictureUrl ? (
                    <LazyLoadImage
                      src={product?.seller?.profilePictureUrl}
                      effect="blur"
                      alt="profile"
                      className="w-[38px] h-[31px] rounded-full object-cover"
                    />
                  ) : (
                    <img
                      src="/profile-icon.png"
                      alt="profile"
                      className="w-full h-full rounded-full object-cover"
                    />
                  )}
                </div>
                <p className="text-sm font-medium">{product?.seller?.name}</p>
              </div>
            )}
          </div>
        </div>
      </Link>
      {/* )} */}
    </>
  );
};

export default ProductCard;
