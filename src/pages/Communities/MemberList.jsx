import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Pagination from "../../components/Common/Pagination";
import Loader from "../../components/Loader/Loader";
import MemberCard from "./MemberCard";
import RemoveUserPopup from "../../components/Popups/RemoveUserPopup";
import BanUserPopup from "../../components/Popups/BanUserPopup";
import UserBlockedSuccessPopup from "../../components/Popups/UserBlockedSuccessPopup";
import {
  useGetCommunityMembersQuery,
  useGetCommunityBannedMembersQuery,
} from "../../services/communityApi/communityApi";
import SearchField from "../../components/Common/SearchField";

const MemberList = ({ communityId }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const listType = searchParams.get("type") || "active";
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const search = searchParams.get("search") || "";

  const [openActions, setOpenActions] = useState(null);
  const [userId, setUserId] = useState(null);
  const [showRemoveUserPopup, setShowRemoveUserPopup] = useState(false);
  const [showBlockUserPopup, setShowBlockUserPopup] = useState(false);
  const [isBanned, setIsBanned] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);

  const queryArgs = {
    communityId,
    page,
    limit,
    search,
  };

  const activeMembersQuery = useGetCommunityMembersQuery(queryArgs, {
    skip: !communityId || listType !== "active",
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const blockedMembersQuery = useGetCommunityBannedMembersQuery(queryArgs, {
    skip: !communityId || listType !== "blocked",
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const membersQuery =
    listType === "blocked" ? blockedMembersQuery : activeMembersQuery;

  const { data, isLoading, refetch } = membersQuery;

  const pagination = data?.data?.pagination || null;

  const members =
    listType === "blocked"
      ? data?.data?.bannedMembers ?? []
      : data?.data?.members ?? [];

  return (
    <div className="w-full">
      {/* Header + Search */}
      <div className="w-full flex items-center justify-between flex-wrap gap-5">
        <h2 className="page-heading">Members</h2>

        <div className="w-full md:max-w-[252px]">
          <SearchField />
        </div>
      </div>

      <div className="w-full mt-5 bg-white custom-shadow rounded-[12px] p-5">
        {/* Filters */}
        <div className="w-full mb-4 space-x-3">
          {["active", "blocked"].map((type) => (
            <button
              key={type}
              onClick={() => {
                const currentParams = Object.fromEntries(
                  searchParams.entries()
                );
                setSearchParams({
                  ...currentParams,
                  type,
                  page: 1,
                  limit,
                });
              }}
              className={`px-4 py-2 rounded-lg text-sm ${
                listType === type
                  ? "bg-[var(--button-bg)] text-white"
                  : "bg-[#E6E6E6]"
              }`}
            >
              {type === "active" ? "Active Members" : "Blocked Members"}
            </button>
          ))}
        </div>
        {}

        {/* Members */}
        {isLoading ? (
          <div className="w-full flex justify-center min-h-[50vh] pt-32">
            <Loader />
          </div>
        ) : members.length > 0 ? (
          members.map((member, i) => (
            <MemberCard
              key={member.id || i}
              member={member}
              index={i}
              refetch={refetch}
              setShowRemoveUserPopup={setShowRemoveUserPopup}
              setShowBlockUserPopup={setShowBlockUserPopup}
              toggleActionsDropdown={(idx, id) => {
                setOpenActions(openActions === idx ? null : idx);
                setUserId(id);
              }}
              openActions={openActions}
              getMembers={() => {}}
              isBlocked={listType === "blocked"}
              communityId={communityId}
              userId={userId}
            />
          ))
        ) : (
          <div className="w-full min-h-[50vh] pt-28 text-center px-4">
            {search ? (
              <p className="mt-5 text-sm font-medium text-gray-500">
                No members found for the search term "{search}".
              </p>
            ) : (
              <p className="mt-5 text-sm font-medium text-gray-500">
                No members found in this community.
              </p>
            )}
          </div>
        )}

        {/* Pagination */}
        <Pagination page={page} pagination={pagination} />
      </div>

      {/* Popups */}
      <RemoveUserPopup
        showPopup={showRemoveUserPopup}
        setShowRemoveUserPopup={setShowRemoveUserPopup}
        userId={userId}
        communityId={communityId}
        setIsRemoved={setIsRemoved}
        navigate={navigate}
        setOpenActions={setOpenActions}
        refetch={refetch}
      />

      {/* ban user */}
      <BanUserPopup
        showPopup={showBlockUserPopup}
        setShowBlockUserPopup={setShowBlockUserPopup}
        userId={userId}
        communityId={communityId}
        setIsBanned={setIsBanned}
        refetch={refetch}
      />

      {/* user blocked success modal */}
      <UserBlockedSuccessPopup
        showPopup={isBanned}
        setShowPopup={setIsBanned}
        title="Member Blocked Successfully"
        description="The selected member has been blocked."
      />

      {/* user removed success modal */}
      <UserBlockedSuccessPopup
        showPopup={isRemoved}
        setShowPopup={setIsRemoved}
        title="Member Removed Successfully"
        description="The member has been removed."
      />
    </div>
  );
};

export default MemberList;
