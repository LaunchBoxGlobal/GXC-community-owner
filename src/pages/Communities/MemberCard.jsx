import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { BASE_URL } from "../../data/baseUrl";
import { getToken } from "../../utils/getToken";
import { enqueueSnackbar } from "notistack";
import { handleApiError } from "../../utils/handleApiError";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../../components/Loader/Loader";

const MemberCard = ({
  member,
  index,
  setShowRemoveUserPopup,
  toggleActionsDropdown,
  openActions,
  total,
  setShowBlockUserPopup,
  isBlocked,
  communityId,
  userId,
  getMembers,
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  const handleUnblockUser = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/communities/${communityId}/members/${member?.userId}/unban`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      if (res?.data?.success) {
        enqueueSnackbar(res?.data?.message || "Member unbanned successfully!", {
          variant: "success",
        });
        getMembers();
      }
    } catch (error) {
      handleApiError(error, navigate);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        toggleActionsDropdown(null);
      }
    };

    if (openActions === index) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openActions, index, toggleActionsDropdown]);

  return (
    <div
      key={index}
      className="w-full flex justify-between items-center border-b py-4"
      ref={dropdownRef}
    >
      <div className="flex items-center justify-start gap-2">
        <div className="w-[40px] h-[40px] border-2 p-0.5 border-[var(--button-bg)] rounded-full">
          <img
            src={
              member?.profilePicture
                ? member?.profilePictureUrl
                : "/profile-icon.png"
            }
            alt="profile"
            className="w-full h-full rounded-full object-cover"
          />
        </div>
        <div className="flex flex-col items-start justify-center">
          <p className="text-sm font-medium">
            <Link
              to={`/communities/details/${communityId}/member/${member?.userId}`}
            >
              {member?.fullName}
            </Link>
          </p>
          <p className="text-xs md:text-sm font-normal text-[var(--secondary-color)]">
            {member?.email}
          </p>
        </div>
      </div>

      <div className="relative">
        {isBlocked ? (
          <button
            type="button"
            onClick={() => handleUnblockUser()}
            className="w-[97px] h-[37px] bg-[#E6E6E6] rounded-[12px] text-sm"
          >
            {loading ? <Loader /> : "Unblock"}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => toggleActionsDropdown(index, member?.userId)}
          >
            <HiOutlineDotsVertical className="text-xl" />
          </button>
        )}

        {openActions === index && (
          <div
            className={`absolute right-0 w-[230px] h-[128px] bg-white custom-shadow rounded-[18px] z-50 flex flex-col items-start justify-center gap-3 ${
              index >= total - 2 ? "bottom-full mb-2" : "top-full mt-2"
            }`}
          >
            <button
              type="button"
              onClick={() => {
                setShowRemoveUserPopup(true);
                toggleActionsDropdown(index, member?.userId);
              }}
              className="flex items-center justify-start gap-2 px-6"
            >
              <img
                src="/remove-member-button-icon.svg"
                alt="remove-member-button-icon"
                className="w-[24px] h-[24px]"
              />
              <span className="text-lg font-medium">Remove Member</span>
            </button>

            <div className="w-full border" />

            <button
              type="button"
              onClick={() => {
                setShowBlockUserPopup(true);
                toggleActionsDropdown(index, member?.userId);
              }}
              className="flex items-center justify-start gap-2 px-6"
            >
              <img
                src="/block-member-icon.svg"
                alt="block-member-icon"
                className="w-[24px] h-[24px]"
              />
              <span className="text-lg font-medium">Block Member</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberCard;
