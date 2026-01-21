import { IoClose } from "react-icons/io5";

const CommunityLinkCopy = ({
  copyLinkPopup,
  setCopyLinkPopup,
  showCopyLinkPopup,
  setShowCopyLinkPopup,
  slug,
}) => {
  return (
    showCopyLinkPopup && (
      <div className="w-full h-screen bg-[rgba(0,0,0,0.4)] p-5 flex items-center justify-center fixed inset-0 z-50">
        <div className="bg-white w-full max-w-[471px] p-5 rounded-[18px]">
          <div className="w-full flex items-center justify-between">
            <h3 className="text-xl lg:text-[24px] font-semibold">
              Invite Members
            </h3>
            <button
              type="button"
              onClick={() => setShowCopyLinkPopup(false)}
              className="w-[22px] h-[22px] border border-[#989898] rounded"
            >
              <IoClose className="w-full h-full" />
            </button>
          </div>

          <div className="w-full bg-[#F5F5F5] rounded-[12px] min-h-[49px] py-2.5 flex items-center px-5 my-8 overflow-hidden break-words">
            <p className="break-words text-wrap text-xs md:text-sm lg:text-base">
              invite.app.thegiveXchange.com/{slug}
            </p>
          </div>

          <button
            type="button"
            className="button"
            onClick={() => {
              navigator.clipboard.writeText(
                `invite.app.thegiveXchange.com/${slug}`
              );

              setCopyLinkPopup(true);

              setTimeout(() => {
                setCopyLinkPopup(false);
                setShowCopyLinkPopup(false);
              }, 2000);
            }}
          >
            {copyLinkPopup ? "Link Copied" : "Copy Link"}
          </button>
        </div>
      </div>
    )
  );
};

export default CommunityLinkCopy;
