import axios from "axios";
import React from "react";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { BASE_URL } from "../../data/baseUrl";
import { getToken } from "../../utils/getToken";
import { enqueueSnackbar } from "notistack";
import { handleApiError } from "../../utils/handleApiError";
import { useNavigate } from "react-router-dom";

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

  const handleUnblockUser = async () => {
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
        enqueueSnackbar("Member unblocked successfully!", {
          variant: "success",
        });
        getMembers();
      }
    } catch (error) {
      console.log("unblock member error >>> ", error);
      handleApiError(error, navigate);
    }
  };
  return (
    <div
      key={index}
      className="w-full flex justify-between items-center border-b py-4"
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
          <p className="text-sm font-medium">{member?.fullName}</p>
          <p className="text-sm font-normal text-[var(--secondary-color)]">
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
            Unblock
          </button>
        ) : (
          <button
            type="button"
            onClick={() => toggleActionsDropdown(index, member?.userId)}
          >
            <HiOutlineDotsVertical className="text-xl" />
          </button>
        )}
        {openActions == index && (
          <div
            className={`absolute right-0 w-[230px] h-[128px] bg-white custom-shadow rounded-[18px] z-50 flex flex-col items-start justify-center gap-3 ${
              total <= 2 ? "bottom-full mb-2" : "top-full mt-2"
            }`}
          >
            <button
              type="button"
              onClick={() => setShowRemoveUserPopup(true)}
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
              onClick={() => setShowBlockUserPopup(true)}
              className="flex items-center justify-start gap-2 px-6"
            >
              <img
                src="/remove-member-button-icon.svg"
                alt="remove-member-button-icon"
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
