import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../data/baseUrl";
import { getToken } from "../../utils/getToken";
import { handleApiError } from "../../utils/handleApiError";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LuSearch } from "react-icons/lu";

import RemoveUserPopup from "../../components/Popups/RemoveUserPopup";
import BanUserPopup from "../../components/Popups/BanUserPopup";
import MemberCard from "./MemberCard";

const MemberList = ({ communityId }) => {
  const [openActions, setOpenActions] = useState(null);
  const navigate = useNavigate();
  const [total, setTotal] = useState(null);
  const [members, setMembers] = useState(null);
  const [showRemoveUserPopup, setShowRemoveUserPopup] = useState(false);
  const [showBlockUserPopup, setShowBlockUserPopup] = useState(false);
  const [userId, setUserId] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [bannedMembers, setBannedMembers] = useState(null);

  const typeFromUrl = searchParams.get("type") || "active";
  const [listType, setListType] = useState(typeFromUrl);

  const toggleActionsDropdown = (index, id) => {
    setOpenActions((prev) => (prev === index ? null : index));
    setUserId(id);
  };

  const getMembers = async () => {
    if (!communityId) {
      enqueueSnackbar("Community ID is not defined", {
        variant: "error",
      });
      return;
    }
    setLoading(true);
    try {
      const endpoint =
        listType === "blocked"
          ? `${BASE_URL}/communities/${communityId}/banned-members?type=${listType}`
          : `${BASE_URL}/communities/${communityId}/members?type=${listType}`;

      const res = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      setTotal(res?.data?.data?.pagination?.total);
      setMembers(res?.data?.data?.members);
      setBannedMembers(res?.data?.data?.bannedMembers);
    } catch (error) {
      console.log("Error while fetching members >>> ", error);
      handleApiError(error, navigate);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!communityId) return;
    getMembers();
  }, [listType, communityId]);

  useEffect(() => {
    // only update URL when listType changes
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("type", listType);
      return newParams;
    });
  }, [listType]);

  return (
    <div className="w-full">
      <div className="w-full flex items-center justify-between">
        <h2 className="page-heading whitespace-nowrap">Members</h2>
        <div className="w-full max-w-[252px]">
          <div className="border h-[49px] px-[15px] rounded-[8px] bg-white border-[#D9D9D9] flex items-center justify-start gap-2">
            <LuSearch className="text-xl text-[var(--secondary-color)]" />
            <input
              type="text"
              placeholder="Search"
              className={`w-full outline-none disabled:cursor-not-allowed border-none`}
            />
          </div>
        </div>
      </div>

      <div className="w-full my-4 space-x-3">
        <button
          type="button"
          onClick={() => setListType("active")}
          className={`px-5 py-3 rounded-lg text-sm font-medium ${
            listType === "active"
              ? "bg-[var(--button-bg)] text-white"
              : "bg-[#E6E6E6] text-black"
          }`}
        >
          Active Members
        </button>
        <button
          type="button"
          onClick={() => setListType("blocked")}
          className={`px-5 py-3 rounded-lg text-sm font-medium ${
            listType === "blocked"
              ? "bg-[var(--button-bg)] text-white"
              : "bg-[#E6E6E6] text-black"
          }`}
        >
          Blocked Members
        </button>
      </div>

      {listType === "active" ? (
        <>
          {members && members?.length > 0 ? (
            <div className="w-full bg-white mt-6 px-5 pb-5 pt-2 rounded-[8px] lg:rounded-[24px] custom-shadow">
              {members &&
                members?.map((member, i) => {
                  return (
                    <MemberCard
                      member={member}
                      key={i}
                      index={i}
                      setShowRemoveUserPopup={setShowRemoveUserPopup}
                      setShowBlockUserPopup={setShowBlockUserPopup}
                      toggleActionsDropdown={toggleActionsDropdown}
                      openActions={openActions}
                      total={total}
                      getMembers={getMembers}
                    />
                  );
                })}
            </div>
          ) : (
            <div className="w-full text-center">
              <p className="text-sm">No members found!</p>
            </div>
          )}
        </>
      ) : (
        <>
          {bannedMembers && bannedMembers?.length > 0 ? (
            <div className="w-full bg-white mt-6 px-5 pb-5 pt-2 rounded-[8px] lg:rounded-[24px] custom-shadow">
              {bannedMembers &&
                bannedMembers?.map((member, i) => {
                  return (
                    <MemberCard
                      member={member}
                      key={i}
                      index={i}
                      setShowRemoveUserPopup={setShowRemoveUserPopup}
                      setShowBlockUserPopup={setShowBlockUserPopup}
                      toggleActionsDropdown={toggleActionsDropdown}
                      openActions={openActions}
                      total={total}
                      isBlocked={true}
                      communityId={communityId}
                      userId={userId}
                      getMembers={getMembers}
                    />
                  );
                })}
            </div>
          ) : (
            <div className="w-full text-center">
              <p className="text-sm">No members found!</p>
            </div>
          )}
        </>
      )}

      <RemoveUserPopup
        showPopup={showRemoveUserPopup}
        setShowRemoveUserPopup={setShowRemoveUserPopup}
        setOpenActions={setOpenActions}
        openActions={openActions}
        userId={userId}
        communityId={communityId}
        getMembers={getMembers}
      />

      <BanUserPopup
        showPopup={showBlockUserPopup}
        setShowBlockUserPopup={setShowBlockUserPopup}
        setOpenActions={setOpenActions}
        userId={userId}
        communityId={communityId}
        getMembers={getMembers}
      />
    </div>
  );
};

export default MemberList;
