import { useEffect, useState } from "react";
import { formatDate } from "../../utils/formatDate";
import axios from "axios";
import { BASE_URL } from "../../data/baseUrl";
import { getToken } from "../../utils/getToken";
import { enqueueSnackbar } from "notistack";
import { IoClose } from "react-icons/io5";
import ImageSlider from "../Reports/ImageSlider";
import { Link, useNavigate } from "react-router-dom";
import { handleApiError } from "../../utils/handleApiError";
import Loader from "../../components/Loader/Loader";

const ReportDetailsModal = ({
  reportDetails,
  handleToggleReportDetailsModal,
  showReportDetailsModal,
  fetchReports,
}) => {
  const [isBanned, setIsBanned] = useState(
    reportDetails?.seller?.isBanned || false
  );
  const [loading, setLoading] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [initialSlide, setInitialSlide] = useState(0);

  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);
  const [actionType, setActionType] = useState(null);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${BASE_URL}/products/reports/${reportDetails?.id}`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      setReport(res?.data?.data);
    } catch (error) {
      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong."
      );
      // handleApiError(error, navigate);
    } finally {
      setLoading(false);
    }
  };

  const toggleBanStatus = async () => {
    setLoading(true);
    try {
      const action = report?.seller?.status === "active" ? "ban" : "unban";
      const res = await axios.post(
        `${BASE_URL}/communities/${report?.communityId}/members/${reportDetails?.seller?.id}/${action}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      if (res?.data?.success) {
        enqueueSnackbar(res?.data?.message, {
          variant: "success",
        });
        const response = await axios.get(
          `${BASE_URL}/products/reports/${reportDetails?.id}`,
          {
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          }
        );

        setReport(response?.data?.data);
        fetchReports();
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

  useEffect(() => {
    fetchReport();
  }, []);

  const markReportResolvedRejected = async (status) => {
    setActionType(status);
    setIsPending(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/products/reports/status`,
        {
          id: report?.id,
          status: status,
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      enqueueSnackbar(res?.data?.message || "Report resolved successfully.", {
        variant: "success",
      });

      const response = await axios.get(
        `${BASE_URL}/products/reports/${reportDetails?.id}`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      setReport(response?.data?.data);
      fetchReports();
    } catch (error) {
      enqueueSnackbar(
        error?.response?.data?.message ||
          error?.message ||
          "Report resolved successfully.",
        {
          variant: "error",
        }
      );
    } finally {
      setIsPending(false);
    }
  };

  const handleBlockUser = async () => {
    if (!report?.communityId) {
      enqueueSnackbar("Community ID is not defined", {
        variant: "error",
      });
      return;
    }
    if (!report?.seller?.id) {
      enqueueSnackbar("User ID is not defined", {
        variant: "error",
      });
      return;
    }

    try {
      const res = await axios.delete(
        `${BASE_URL}/communities/${report?.communityId}/members/${report?.seller?.id}`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      if (res?.data?.success) {
        enqueueSnackbar(
          res?.data?.message || "User removed from community successfully.",
          { variant: "success" }
        );
        const response = await axios.get(
          `${BASE_URL}/products/reports/${reportDetails?.id}`,
          {
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          }
        );

        setReport(response?.data?.data);
        fetchReports();
      }
    } catch (error) {
      enqueueSnackbar(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong.",
        {
          variant: "error",
        }
      );
    } finally {
      setIsRemoved(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!productId) {
      enqueueSnackbar("Product ID not found!", {
        variant: "error",
      });
      return;
    }
    try {
      const res = await axios.post(
        `${BASE_URL}/products/${productId}/delist`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      if (res?.data?.success) {
        enqueueSnackbar("Product delete sucessfully!", {
          variant: "success",
        });
        fetchReports();
      }
    } catch (error) {
      enqueueSnackbar(
        error?.response?.data?.message ||
          error?.message ||
          "Product delisted sucessfully!",
        {
          variant: "success",
        }
      );
      console.log("delete product error >> ", error);
      // handleApiError(error, navigate);
    }
  };

  return (
    <div className="w-full h-screen fixed inset-0 z-50 bg-[rgba(0,0,0,0.5)] flex items-center justify-center py-5 px-5">
      {loading ? (
        <Loader />
      ) : (
        <div className="bg-white w-full max-w-[491px] p-5 rounded-[16px] relative">
          {error ? (
            <div className="w-full">
              <div className="w-full flex items-center justify-between">
                <h2 className="text-[24px] font-semibold leading-none">
                  Product Report
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    handleToggleReportDetailsModal();
                  }}
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
              <div className="w-full flex items-center justify-center min-h-[400px]">
                <p className="text-sm font-medium text-gray-500">
                  Something went wrong.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="w-full flex items-center justify-between">
                <h2 className="text-[24px] font-semibold leading-none">
                  Product Report
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    handleToggleReportDetailsModal();
                  }}
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

              <div className="w-full grid grid-cols-2">
                <div className="w-full mt-3 flex items-center gap-1.5">
                  <h4 className="font-medium leading-none text-sm">
                    Reported Date:
                  </h4>
                  <p className="text-[14px] font-medium">
                    {formatDate(report?.createdAt)}
                  </p>
                </div>

                <div className="w-full mt-3 flex items-center justify-end gap-1.5">
                  <h4 className="font-medium leading-none text-sm">
                    Report Status:
                  </h4>
                  <p
                    className={`text-[14px] font-medium ${
                      report?.status === "pending"
                        ? "text-[#FF7700]"
                        : report?.status === "resolved"
                        ? "text-green-500"
                        : "text-gray-500"
                    }`}
                  >
                    {report?.status.charAt(0).toUpperCase() +
                      report?.status.slice(1)}
                  </p>
                </div>
              </div>

              <div className="w-full mt-5 flex flex-col items-start">
                <div className="w-full">
                  <h4 className="font-medium">Reporter</h4>
                  <div className="w-full mt-1 5 flex items-center justify-between">
                    <div className="inline-flex items-center gap-2 w-full">
                      <img
                        src={
                          report?.reporter?.profilePictureUrl ||
                          "/profile-icon.png"
                        }
                        alt=""
                        width={35}
                        height={35}
                        className="rounded-full object-cover min-w-[35px] max-h-[35px]"
                      />
                      <p className="text-[14px] leading-none font-medium">
                        {report?.reporter?.name}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="w-full border my-2" />

                <div className="w-full">
                  <h4 className="font-medium">Seller</h4>
                  <div className="flex items-center justify-between gap-5">
                    <div className="inline-flex items-center gap-2 mt-1.5 w-full">
                      <img
                        src={
                          report?.seller?.profilePictureUrl ||
                          "/profile-icon.png"
                        }
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
                        disabled={isRemoved}
                        onClick={() => handleBlockUser()}
                        className="bg-[#DEDEDE] font-medium text-sm px-4 py-2 rounded-lg"
                      >
                        Remove
                      </button>
                      <button
                        type="button"
                        disabled={isRemoved || isPending}
                        onClick={() => toggleBanStatus()}
                        className="bg-[var(--primary-color)] font-medium text-white text-sm px-4 py-2 rounded-lg"
                      >
                        {report?.seller?.status === "active"
                          ? "Block"
                          : "Unblock"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full border mt-3" />

              <div className="w-full mt-4">
                <h4 className="font-medium">Title</h4>
                <p className="leading-[1.2]">{report?.title}</p>
              </div>

              <div className="w-full border mt-3" />

              <div className="w-full mt-4">
                <h4 className="font-medium">Description</h4>
                <div className="w-full max-h-[220px] overflow-y-auto">
                  <p className="leading-[1.2]">{report?.description}</p>
                </div>
              </div>

              {report?.images?.length > 0 && (
                <>
                  <div className="w-full border mt-3" />
                  <div className="w-full mt-4">
                    <h4 className="font-medium">Images</h4>
                    <div className="w-full mt-1.5 flex items-center gap-1.5">
                      {report?.images?.map((image, i) => {
                        return (
                          <img
                            src={image}
                            key={i}
                            onClick={() => {
                              setShowImageModal(true);
                              setInitialSlide(i);
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
                  <h4 className="font-medium">Product</h4>
                  <div className="inline-flex items-center gap-2 mt-1.5">
                    <img
                      src={report?.product?.image || "/profile-icon.png"}
                      alt=""
                      width={35}
                      height={35}
                      className="rounded-lg object-cover w-[35px] h-[35px]"
                    />
                    <Link
                      to={`/products/${report?.product?.title}?productId=${report?.product?.id}`}
                      className="text-[17px] font-medium"
                    >
                      {report?.product?.title}
                    </Link>
                  </div>
                </div>

                {/* ✅ Toggle Button */}
                <div className="flex flex-col items-end gap-1.5">
                  <label htmlFor="disable" className="font-medium text-sm">
                    {report?.product?.status === "delisted"
                      ? "Mark Active"
                      : "Delist"}
                  </label>
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={report?.product?.status === "delisted"}
                      disabled={report?.product?.status === "delisted"}
                      onChange={() => handleDeleteProduct(report?.product?.id)}
                      className="sr-only peer disabled:cursor-not-allowed"
                    />
                    <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--button-bg)]"></div>
                  </label>
                </div>
              </div>

              {report?.status === "pending" && (
                <div className="w-full mt-3 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    className="w-full bg-gray-400 text-black h-[49px] rounded-[8px] text-sm lg:text-base text-center font-medium disabled:cursor-not-allowed"
                    onClick={() => markReportResolvedRejected("rejected")}
                  >
                    {isPending && actionType === "rejected" ? (
                      <Loader />
                    ) : (
                      "Mark As Rejected"
                    )}
                  </button>
                  <button
                    type="button"
                    className="button"
                    onClick={() => markReportResolvedRejected("resolved")}
                  >
                    {isPending && actionType === "resolved" ? (
                      <Loader />
                    ) : (
                      "Mark As Resolved"
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
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
