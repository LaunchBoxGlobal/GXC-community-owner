import { enqueueSnackbar } from "notistack";
import {
  useRemoveSellerFromCommunityMutation,
  useToggleSellerStatusMutation,
} from "../../services/reportedProductsApi/reportedProductsApi";

const SellerDetails = ({ report, refetch }) => {
  const [toggleSellerStatus] = useToggleSellerStatusMutation();
  const [removeSeller] = useRemoveSellerFromCommunityMutation();

  const toggleBanStatus = async () => {
    try {
      const action = report?.seller?.status === "active" ? "ban" : "unban";

      const res = await toggleSellerStatus({
        communityId: report?.communityId,
        sellerId: report?.seller?.id,
        action,
      }).unwrap();

      if (res?.success) {
        enqueueSnackbar(res?.message, { variant: "success" });

        refetch();
      }
    } catch (error) {}
  };

  const handleBlockUser = async () => {
    if (!report?.communityId || !report?.seller?.id) {
      enqueueSnackbar("Invalid seller or community", { variant: "error" });
      return;
    }

    try {
      const res = await removeSeller({
        communityId: report.communityId,
        sellerId: report.seller.id,
      }).unwrap();

      if (res?.success) {
        enqueueSnackbar(res?.message, { variant: "success" });
        refetch();
      }
    } catch (error) {}
  };

  return (
    <div className="w-full">
      <h4 className="font-medium">Seller</h4>
      <div className="flex items-center justify-between gap-5">
        <div className="inline-flex items-center gap-2 mt-1.5 w-full">
          <img
            src={report?.seller?.profilePictureUrl || "/profile-icon.png"}
            alt=""
            width={35}
            height={35}
            className="rounded-full object-cover min-w-[35px] max-h-[35px]"
          />
          <p className="text-[14px] leading-none font-medium">
            {report?.seller?.name}
          </p>
        </div>
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            disabled={report?.seller?.status === "removed"}
            onClick={() => handleBlockUser()}
            className="bg-gray-200 font-medium text-sm px-4 py-2 rounded-lg disabled:cursor-not-allowed disabled:opacity-50"
          >
            Remove
          </button>
          <button
            type="button"
            disabled={report?.seller?.status === "removed"}
            onClick={() => toggleBanStatus()}
            className="bg-[var(--primary-color)] font-medium text-white text-sm px-4 py-2 rounded-lg disabled:cursor-not-allowed disabled:opacity-50"
          >
            {report?.seller?.status === "active" ? "Block" : "Unblock"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellerDetails;
