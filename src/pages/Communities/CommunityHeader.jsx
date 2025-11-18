const CommunityHeader = ({
  community,
  enableDisableLoading,
  enableDisableCommunity,
  loading,
  setShowEditCommunityPopup,
  setShowCopyLinkPopup,
  createStripe,
  handleCreateStripeAccount,
  showInvitationButton,
}) => {
  return (
    <div className="w-full relative">
      <div className="w-full flex items-center justify-between flex-col md:flex-row gap-5">
        <h2 className="page-heading whitespace-nowrap">Community</h2>
        {showInvitationButton ? (
          <div className="flex items-center justify-center md:justify-end gap-3 w-full lg:w-[80%]">
            <button
              type="button"
              disabled={loading || enableDisableLoading}
              onClick={() => setShowEditCommunityPopup(true)}
              className="button px-3 md:px-5 max-w-[190px] disabled:cursor-not-allowed"
            >
              Edit Community
            </button>

            <button
              type="button"
              disabled={!community?.community?.inviteLinkActive || loading}
              onClick={() => setShowCopyLinkPopup(true)}
              className="button px-3 md:px-5 max-w-[160px] disabled:cursor-not-allowed"
            >
              Invite Members
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center md:justify-end gap-3 w-full lg:w-[80%]">
            <button
              type="button"
              disabled={createStripe}
              onClick={() => handleCreateStripeAccount()}
              className="button px-3 md:px-5 max-w-[220px] disabled:cursor-not-allowed"
            >
              {createStripe ? <Loader /> : "Create Stripe Account"}
            </button>
          </div>
        )}
      </div>

      <div className="w-full bg-white custom-shadow rounded-lg md:rounded-xl lg:rounded-[24px] p-7 mt-5 flex flex-wrap overflow-hidden items-center justify-between gap-y-5">
        <div className="w-full lg:max-w-[70%]">
          <h2 className="page-heading">{community?.community?.name}</h2>
          {community?.community?.slug && (
            <p className="text-base text-[var(--secondary-color)] leading-[1.3] mt-2 break-words">
              <span className="font-semibold">Slug: </span>
              {community?.community?.slug}
            </p>
          )}
          {community?.community?.description && (
            <p className="text-base text-[var(--secondary-color)] leading-[1.3] mt-2 break-words">
              <span className="font-semibold">Description: </span>
              {community?.community?.description}
            </p>
          )}
        </div>

        <div className="w-full lg:w-[30%] flex items-center justify-between md:justify-end flex-wrap md:gap-10">
          <div className="text-center space-y-1">
            <h4>Members</h4>
            <p className="font-semibold text-[var(--primary-color)] text-[24px] leading-none">
              {community?.community?.memberCount &&
              community?.community?.memberCount > 0
                ? community?.community?.memberCount
                : "0"}
            </p>
          </div>

          <div className="text-center space-y-1">
            <h4>Products</h4>
            <p className="font-semibold text-[var(--primary-color)] text-[24px] leading-none">
              {community?.community?.productCount &&
              community?.community?.productCount > 0
                ? community?.community?.productCount
                : "0"}
            </p>
          </div>
          <div className="space-y-1.5 pt-1">
            <h4>
              {community?.community?.inviteLinkActive ? "Disable" : "Enable"}
            </h4>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={community?.community?.inviteLinkActive}
                disabled={enableDisableLoading}
                onChange={enableDisableCommunity}
                className="sr-only peer"
              />
              <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--button-bg)]"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityHeader;
