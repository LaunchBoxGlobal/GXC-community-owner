import { HiOutlineDotsVertical } from "react-icons/hi";
import { Link } from "react-router-dom";

const CommunityCard = ({ community }) => {
  return (
    <Link
      to={`/communities/details/${community?.slug}/${community?.id}?activeTab=products`}
    >
      <div className="w-full bg-white p-5 rounded-[20px] custom-shadow overflow-hidden">
        <div className="w-full flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="space-y-3">
              <p className="text-lg font-semibold leading-none">
                {community?.name}
              </p>
            </div>
          </div>
        </div>

        <div className="w-full my-4 min-h-[100px]">
          <p className="text-sm leading-[1.2] text-[var(--secondary-color)] break-words">
            {community?.description?.length > 100
              ? community.description.slice(0, 100) + "..."
              : community?.description}
          </p>
        </div>

        <div className="w-full flex items-center justify-between">
          <p className="text-sm font-normal text-[#202020]">Members</p>
          <p className="text-sm font-semibold text-[#202020]">
            {community?.memberCount}
          </p>
        </div>

        <div className="w-full border my-3" />

        <div className="w-full flex items-center justify-between">
          <p className="text-sm font-normal text-[#202020]">Total Products</p>
          <p className="text-sm font-semibold text-[#202020]">
            {community?.productCount > 0 ? community?.productCount : 0}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default CommunityCard;
