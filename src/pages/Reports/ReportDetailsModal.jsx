import React, { useState } from "react";
import { formatDate } from "../../utils/formatDate";
import axios from "axios";
import { BASE_URL } from "../../data/baseUrl";
import { getToken } from "../../utils/getToken";
import { enqueueSnackbar } from "notistack";
import ImageSlider from "./ImageSlider";
import { IoClose } from "react-icons/io5";

const ReportDetailsModal = ({
  reportDetails,
  handleToggleReportDetailsModal,
  showReportDetailsModal,
}) => {
  const [isBanned, setIsBanned] = useState(
    reportDetails?.reportedUser?.isBanned || false
  );
  const [loading, setLoading] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [initialSlide, setInitialSlide] = useState(0);

  const toggleBanStatus = async () => {
    setLoading(true);
    try {
      const action = isBanned ? "unban" : "ban"; // decide API endpoint
      const res = await axios.post(
        `${BASE_URL}/communities/${reportDetails?.communityId}/members/${reportDetails?.reportedUser?.id}/${action}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      if (res?.data?.success) {
        setIsBanned(!isBanned); // update UI instantly
        enqueueSnackbar(
          isBanned
            ? "User has been unbanned successfully."
            : "User has been banned successfully.",
          {
            variant: isBanned ? "info" : "success",
          }
        );
      }
    } catch (error) {
      enqueueSnackbar(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong. Try again.",
        { variant: "error" }
      );
    } finally {
      setLoading(false);
    }
  };

  if (!showReportDetailsModal) return null;

  return (
    <div className="w-full h-screen fixed inset-0 z-50 bg-[rgba(0,0,0,0.5)] flex items-center justify-center py-5 px-5">
      <div className="bg-white w-full max-w-[461px] p-5 rounded-[16px] relative">
        <div className="w-full flex items-center justify-between">
          <h2 className="text-[24px] font-semibold leading-none">
            User Report
          </h2>
          <button
            type="button"
            onClick={handleToggleReportDetailsModal}
            disabled={loading}
          >
            <img
              src="/close-icon.png"
              alt="close icon"
              width={19}
              height={19}
            />
          </button>
        </div>

        <div className="w-full mt-4 grid grid-cols-2">
          <div className="border-r-2">
            <h4 className="font-medium">Reporter</h4>
            <div className="inline-flex items-center gap-2 mt-1.5">
              <img
                src={
                  reportDetails?.reporter?.profilePictureUrl ||
                  "/profile-icon.png"
                }
                alt=""
                width={35}
                height={35}
                className="rounded-full object-cover"
              />
              <p className="text-[17px] font-medium">
                {reportDetails?.reporter?.name}
              </p>
            </div>
          </div>
          <div className="pl-4">
            <h4 className="font-medium">Reported Date</h4>
            <p className="text-[17px] font-medium mt-1.5">
              {formatDate(reportDetails?.createdAt)}
            </p>
          </div>
        </div>

        <div className="w-full border mt-3" />

        <div className="w-full mt-4">
          <h4 className="font-medium">Description</h4>
          <p className="leading-[1.2]">{reportDetails?.description}</p>
        </div>

        {reportDetails?.images?.length > 0 && (
          <>
            <div className="w-full border mt-3" />
            <div className="w-full mt-4">
              <h4 className="font-medium">Images</h4>
              <div className="w-full mt-1.5 flex items-center gap-1.5">
                {reportDetails?.images?.map((image, i) => {
                  return (
                    <img
                      src={image}
                      key={i}
                      onClick={() => {
                        setShowImageModal(true);
                        setInitialSlide(i); // ✅ New: store which image was clicked
                      }}
                      className="w-[56px] h-[56px] object-cover rounded-2xl cursor-pointer"
                    />
                  );
                })}
              </div>
            </div>
          </>
        )}

        <div className="w-full border mt-3" />

        <div className="w-full mt-4 flex items-center justify-between">
          <div>
            <h4 className="font-medium">Reported User</h4>
            <div className="inline-flex items-center gap-2 mt-1.5">
              <img
                src={
                  reportDetails?.reportedUser?.profilePictureUrl ||
                  "/profile-icon.png"
                }
                alt=""
                width={35}
                height={35}
                className="rounded-full object-cover"
              />
              <p className="text-[17px] font-medium">
                {reportDetails?.reportedUser?.name}
              </p>
            </div>
          </div>

          {/* ✅ Toggle Button */}
          <div className="flex flex-col items-end gap-1.5">
            <label htmlFor="disable" className="font-medium text-sm">
              {isBanned ? "Banned" : "Disable"}
            </label>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isBanned}
                disabled={loading}
                onChange={toggleBanStatus}
                className="sr-only peer"
              />
              <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--button-bg)]"></div>
            </label>
          </div>
        </div>
      </div>
      <ImageViewModal
        reportDetails={reportDetails}
        showImageModal={showImageModal}
        setShowImageModal={setShowImageModal}
        initialSlide={initialSlide}
      />
    </div>
  );
};

export default ReportDetailsModal;

export const ImageViewModal = ({
  reportDetails,
  showImageModal,
  setShowImageModal,
  initialSlide,
}) => {
  return (
    showImageModal && (
      <div className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.5)] flex items-center justify-center px-4">
        <button
          type="button"
          onClick={() => setShowImageModal(false)}
          className="absolute top-5 right-5 text-white text-3xl font-bold z-50"
        >
          <IoClose />
        </button>

        <div className="max-w-[1200px] w-full h-[90vh] flex items-center justify-center">
          <ImageSlider
            images={reportDetails?.images}
            initialSlide={initialSlide}
          />
        </div>
      </div>
    )
  );
};
