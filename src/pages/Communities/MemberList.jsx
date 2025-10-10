import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../data/baseUrl";
import { getToken } from "../../utils/getToken";
import { handleApiError } from "../../utils/handleApiError";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LuSearch } from "react-icons/lu";
import { IoClose } from "react-icons/io5";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { useDebounce } from "use-debounce";
import { enqueueSnackbar } from "notistack";

import RemoveUserPopup from "../../components/Popups/RemoveUserPopup";
import BanUserPopup from "../../components/Popups/BanUserPopup";
import MemberCard from "./MemberCard";
import Loader from "../../components/Loader/Loader";
import UserBlockedSuccessPopup from "../../components/Popups/UserBlockedSuccessPopup";

const MemberList = ({ communityId, setMemberCount, community }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Query params
  const typeFromUrl = searchParams.get("type") || "active";
  const pageFromUrl = parseInt(searchParams.get("page")) || 1;
  const limitFromUrl = parseInt(searchParams.get("limit")) || 10;

  // States
  const [listType, setListType] = useState(typeFromUrl);
  const [page, setPage] = useState(pageFromUrl);
  const [limit, setLimit] = useState(limitFromUrl);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [members, setMembers] = useState([]);
  const [bannedMembers, setBannedMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch] = useDebounce(searchTerm, 500);

  // Popups
  const [openActions, setOpenActions] = useState(null);
  const [userId, setUserId] = useState(null);
  const [showRemoveUserPopup, setShowRemoveUserPopup] = useState(false);
  const [showBlockUserPopup, setShowBlockUserPopup] = useState(false);
  const [isBanned, setIsBanned] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);

  const toggleActionsDropdown = (index, id) => {
    setOpenActions((prev) => (prev === index ? null : index));
    setUserId(id);
  };

  // Fetch Members
  const getMembers = async () => {
    if (!communityId) {
      enqueueSnackbar("Community ID is not defined", { variant: "error" });
      return;
    }

    setLoading(true);
    try {
      const baseUrl =
        listType === "blocked"
          ? `${BASE_URL}/communities/${communityId}/banned-members`
          : `${BASE_URL}/communities/${communityId}/members`;

      const query = new URLSearchParams({
        page,
        limit,
        ...(debouncedSearch && { search: debouncedSearch }),
      }).toString();

      const res = await axios.get(`${baseUrl}?${query}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      const data = res?.data?.data || {};
      setMembers(data.members || []);
      setBannedMembers(data.bannedMembers || []);
      setTotal(data.pagination?.total || 0);
      setTotalPages(data.pagination?.totalPages || 1);
      setMemberCount(data.pagination?.total || 0);
    } catch (error) {
      handleApiError(error, navigate);
    } finally {
      setLoading(false);
      setOpenActions(null);
    }
  };

  // Fetch when dependencies change
  useEffect(() => {
    if (!communityId) return;
    getMembers();
  }, [listType, page, debouncedSearch, communityId]);

  // Keep URL in sync with listType & page
  useEffect(() => {
    setSearchParams({
      type: listType,
      page,
      limit,
      ...(debouncedSearch && { search: debouncedSearch }),
    });
  }, [listType, page, limit, debouncedSearch]);

  // Pagination Handlers
  const handleNext = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const handlePageClick = (num) => {
    setPage(num);
  };

  return (
    <div className="w-full">
      {/* Header + Search */}
      <div className="w-full flex items-center justify-between flex-wrap gap-5">
        <h2 className="page-heading whitespace-nowrap">Members</h2>
        <div className="w-full md:max-w-[252px]">
          <div className="border h-[49px] pl-[15px] pr-[10px] rounded-[8px] bg-white border-[#D9D9D9] flex items-center gap-2">
            <LuSearch className="text-xl text-[var(--secondary-color)]" />
            <input
              type="text"
              placeholder="Search members..."
              disabled={total <= 0}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full outline-none border-none bg-transparent disabled:cursor-not-allowed"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="bg-gray-100 w-4 h-4 rounded-full"
              >
                <IoClose className="text-gray-900 text-sm" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="w-full my-4 space-x-3">
        <button
          type="button"
          onClick={() => {
            setListType("active");
            setPage(1);
          }}
          className={`px-5 py-3 rounded-lg text-xs lg:text-sm font-medium ${
            listType === "active"
              ? "bg-[var(--button-bg)] text-white"
              : "bg-[#E6E6E6] text-black"
          }`}
        >
          Active Members
        </button>
        <button
          type="button"
          onClick={() => {
            setListType("blocked");
            setPage(1);
          }}
          className={`px-5 py-3 rounded-lg text-xs lg:text-sm font-medium ${
            listType === "blocked"
              ? "bg-[var(--button-bg)] text-white"
              : "bg-[#E6E6E6] text-black"
          }`}
        >
          Blocked Members
        </button>
      </div>

      {/* Members List */}
      {loading ? (
        <div className="w-full flex justify-center">
          <Loader />
        </div>
      ) : (
        <>
          {(listType === "active" ? members : bannedMembers)?.length > 0 ? (
            <div className="w-full bg-white mt-6 px-5 pb-5 pt-2 rounded-[8px] lg:rounded-[24px] custom-shadow">
              {(listType === "active" ? members : bannedMembers).map(
                (member, i) => (
                  <MemberCard
                    key={i}
                    member={member}
                    index={i}
                    setShowRemoveUserPopup={setShowRemoveUserPopup}
                    setShowBlockUserPopup={setShowBlockUserPopup}
                    toggleActionsDropdown={toggleActionsDropdown}
                    openActions={openActions}
                    total={total}
                    getMembers={getMembers}
                    isBlocked={listType === "blocked"}
                    communityId={communityId}
                    userId={userId}
                  />
                )
              )}
            </div>
          ) : (
            <div className="w-full text-center">
              <p className="text-sm">No members found!</p>
            </div>
          )}
        </>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="w-full mt-5 flex justify-end">
          <nav aria-label="Page navigation example">
            <ul className="inline-flex items-center space-x-1 text-base h-[50px] bg-[#E6E6E6] rounded-[12px] px-2">
              <li>
                <button
                  onClick={handlePrev}
                  disabled={page === 1}
                  className={`flex items-center px-4 h-10 font-medium rounded-s-[12px] ${
                    page === 1
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:text-[var(--button-bg)]"
                  }`}
                >
                  <MdKeyboardArrowLeft className="text-2xl" />
                  Previous
                </button>
              </li>

              {[...Array(totalPages)].map((_, i) => (
                <li key={i}>
                  <button
                    onClick={() => handlePageClick(i + 1)}
                    className={`flex items-center justify-center px-4 h-10 rounded-[12px] ${
                      page === i + 1
                        ? "bg-[var(--button-bg)] text-white"
                        : "text-gray-900 hover:text-[var(--button-bg)]"
                    }`}
                  >
                    {i + 1}
                  </button>
                </li>
              ))}

              <li>
                <button
                  onClick={handleNext}
                  disabled={page === totalPages}
                  className={`flex items-center px-4 h-10 font-medium rounded-e-[12px] ${
                    page === totalPages
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:text-[var(--button-bg)]"
                  }`}
                >
                  Next <MdKeyboardArrowRight className="text-2xl" />
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}

      {/* Popups */}
      <RemoveUserPopup
        showPopup={showRemoveUserPopup}
        setShowRemoveUserPopup={setShowRemoveUserPopup}
        setOpenActions={setOpenActions}
        openActions={openActions}
        userId={userId}
        communityId={communityId}
        getMembers={getMembers}
        navigate={navigate}
        setIsRemoved={setIsRemoved}
      />

      <BanUserPopup
        showPopup={showBlockUserPopup}
        setShowBlockUserPopup={setShowBlockUserPopup}
        setOpenActions={setOpenActions}
        userId={userId}
        communityId={communityId}
        getMembers={getMembers}
        setIsBanned={setIsBanned}
      />

      <UserBlockedSuccessPopup
        showPopup={isBanned}
        setShowPopup={setIsBanned}
        title="Member Blocked Successfully"
        description="The selected member has been blocked and can no longer access or interact within this community."
      />

      <UserBlockedSuccessPopup
        showPopup={isRemoved}
        setShowPopup={setIsRemoved}
        title="Member Removed Successfully"
        description="The member has been removed and no longer has access to this community."
      />
    </div>
  );
};

export default MemberList;
