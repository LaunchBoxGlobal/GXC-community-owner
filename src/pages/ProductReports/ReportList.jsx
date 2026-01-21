import { useState } from "react";
import { formatDate } from "../../utils/formatDate";
import ReportDetailsModal from "./ReportDetailsModal";

const ReportList = ({ reports, fetchReports }) => {
  const [showReportDetailsModal, setShowReportDetailsModal] = useState(false);
  const [reportDetails, setReportDetails] = useState(null);

  const handleToggleReportDetailsModal = (report) => {
    setReportDetails(report);
    setShowReportDetailsModal((prev) => !prev);
  };
  return (
    <div className="relative overflow-x-auto bg-white mt-7 min-h-[70vh]">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500">
        <thead className="text-gray-700 light-green-bg rounded-[12px] whitespace-nowrap">
          <tr className="rounded-[12px]">
            <th
              scope="col"
              className="px-6 py-4 text-sm font-medium rounded-l-[12px]"
            >
              Report Product
            </th>
            <th scope="col" className="px-6 py-4 text-sm font-medium">
              Reporter
            </th>
            <th scope="col" className="px-6 py-4 text-sm font-medium">
              Seller
            </th>
            <th scope="col" className="px-6 py-4 text-sm font-medium">
              Reason
            </th>
            <th scope="col" className="px-6 py-4 text-sm font-medium">
              Status
            </th>
            <th scope="col" className="px-6 py-4 text-sm font-medium">
              Date
            </th>
            <th
              scope="col"
              className="px-6 py-4 text-sm font-medium rounded-r-[12px]"
            >
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {reports &&
            reports?.map((report) => {
              return (
                <tr
                  key={report?.id}
                  className="bg-white border-b border-gray-200 text-sm whitespace-nowrap"
                >
                  <td className="px-6 py-3">
                    <div className="inline-flex items-center gap-2">
                      <img
                        src={
                          report?.product?.image
                            ? report?.product?.image
                            : "/profile-icon.png"
                        }
                        alt=""
                        width={43}
                        height={43}
                        className="rounded-full object-cover w-[43px] h-[43px] max-h-[43px] max-w-[43px]"
                      />
                      <p className="">{report?.product?.title}</p>
                    </div>
                  </td>

                  <td className="px-6 py-3">
                    <div className="inline-flex items-center gap-2">
                      <img
                        src={
                          report?.reporter?.profilePictureUrl
                            ? report?.reporter?.profilePictureUrl
                            : "/profile-icon.png"
                        }
                        alt=""
                        width={43}
                        height={43}
                        className="rounded-full object-cover w-[43px] h-[43px] max-h-[43px] max-w-[43px]"
                      />
                      <p className="">{report?.reporter?.name}</p>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <div className="inline-flex items-center gap-2">
                      <img
                        src={
                          report?.seller?.profilePictureUrl
                            ? report?.seller?.profilePictureUrl
                            : "/profile-icon.png"
                        }
                        alt=""
                        width={43}
                        height={43}
                        className="rounded-full object-cover h-[43px] max-h-[43px] w-[43px] max-w-[43px]"
                      />
                      <p className="">{report?.seller?.name}</p>
                    </div>
                  </td>
                  <td className="px-6 py-3">{report?.title}</td>
                  <td class={`px-6 py-3`}>
                    <span
                      class={`px-2 py-1 rounded-full text-xs font-medium ${
                        report?.status === "pending"
                          ? "text-[#FF7700] bg-orange-100"
                          : report?.status === "resolved"
                          ? "text-green-500 bg-green-100"
                          : report?.status === "rejected"
                          ? "text-red-500 bg-red-100"
                          : "text-gray-500"
                      }`}
                    >
                      {report?.status.charAt(0).toUpperCase() +
                        report?.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-3">{formatDate(report?.createdAt)}</td>
                  <td className="px-6 py-3">
                    <button
                      type="button"
                      onClick={() => handleToggleReportDetailsModal(report)}
                      className="underline text-[var(--button-bg)] font-medium text-sm"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>

      {showReportDetailsModal && (
        <ReportDetailsModal
          showReportDetailsModal={showReportDetailsModal}
          reportDetails={reportDetails}
          handleToggleReportDetailsModal={handleToggleReportDetailsModal}
          fetchReports={fetchReports}
        />
      )}
    </div>
  );
};

export default ReportList;
