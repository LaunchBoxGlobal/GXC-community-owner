import { Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const ProductCard = ({ product }) => {
  return (
    <>
      {product?.status === "active" && (
        <Link to={`/products/${product?.title}?productId=${product?.id}`}>
          <div className="w-full bg-white rounded-[20px] p-3 custom-shadow">
            <div className="w-full h-[276px] bg-[#EAEAEA] rounded-[15px] overflow-hidden relative">
              {/* <img
                src={product?.images[0]?.imageUrl}
                effect="blur"
                alt="product"
                className="absolute inset-0 w-full h-full object-cover"
              /> */}

              <LazyLoadImage
                src={product?.images[0]?.imageUrl}
                effect="blur"
                alt="product"
                className="w-full min-h-full object-cover"
              />
            </div>

            <div className="w-full mt-4">
              <h3 className="text-[20px] font-semibold leading-none tracking-tight text-start">
                {product?.title?.length > 31
                  ? `${product?.title?.slice(0, 30)}`
                  : product?.title}
              </h3>

              <div className="w-full flex items-center justify-between gap-4 my-2">
                <p className="text-[#9D9D9DDD] text-[15px] font-normal text-start">
                  {product?.deliveryMethod === "both"
                    ? "Pickup/Delivery"
                    : product?.deliveryMethod === "pickup"
                    ? "Pickup"
                    : product?.deliveryMethod === "delivery"
                    ? "Delivery"
                    : null}
                </p>
                <p className="text-[18px] font-medium leading-none tracking-tight">
                  ${product?.price}
                </p>
              </div>

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
            </div>
          </div>
        </Link>
      )}
    </>
  );
};

export default ProductCard;
