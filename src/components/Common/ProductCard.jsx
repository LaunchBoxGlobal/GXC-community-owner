import { IoIosStar } from "react-icons/io";
import { Link } from "react-router-dom";
import { IoStar } from "react-icons/io5";

const ProductCard = () => {
  return (
    <Link to={`/products/4589848457874`}>
      <div className="w-full md:max-w-[290px] h-[420px] bg-white rounded-[20px] p-3 custom-shadow">
        <div className="w-full relative">
          <div className="w-full h-[276px] bg-[#EAEAEA] rounded-[15px] flex items-center justify-center">
            <img
              src="/image-placeholder.png"
              alt="image placeholder"
              className="w-[92px] h-[94px]"
            />
          </div>
        </div>

        <div className="w-full mt-4">
          <h3 className="text-[20px] font-semibold leading-none tracking-tight text-start">
            Denim Jacket
          </h3>

          <div className="w-full flex items-center justify-between gap-4 my-2">
            <p className="text-[#9D9D9DDD] text-[15px] font-normal text-start">
              pick/delivery
            </p>
            <p className="text-[18px] font-medium leading-none tracking-tight">
              $203.00
            </p>
          </div>

          <div className="flex items-center justify-start gap-2">
            <div className="w-[38px] h-[38px] border-2 p-0.5 border-[var(--button-bg)] rounded-full">
              <img
                src="/profile.jpg"
                alt="profile"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <p className="text-sm font-medium">John Doe</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
