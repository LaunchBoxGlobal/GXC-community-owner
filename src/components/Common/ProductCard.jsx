import { IoIosStar } from "react-icons/io";
import { Link } from "react-router-dom";
import { IoStar } from "react-icons/io5";

const ProductCard = ({ product }) => {
  return (
    <>
      {product?.status === "active" && (
        <Link to={`/products/${product?.title}?productId=${product?.id}`}>
          <div className="w-full md:max-w-[290px] h-[420px] bg-white rounded-[20px] p-3 custom-shadow">
            <div className="w-full relative">
              <div className="w-full h-[276px] bg-[#EAEAEA] rounded-[15px] flex items-center justify-center">
                {product?.images?.length > 0 ? (
                  <img
                    src={product?.images[0]?.imageUrl}
                    alt="image placeholder"
                    className="w-full h-full object-cover rounded-[15px]"
                  />
                ) : (
                  <img
                    src={`/image-placeholder.png`}
                    alt="image placeholder"
                    className="w-14 h-14 object-cover rounded-[15px]"
                  />
                )}
              </div>
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
                    <img
                      src={product?.seller?.profilePictureUrl}
                      alt="profile"
                      className="w-full h-full rounded-full object-cover"
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
