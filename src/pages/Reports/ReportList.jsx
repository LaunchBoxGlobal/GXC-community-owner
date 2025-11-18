import React, { useState } from "react";
import { formatDate } from "../../utils/formatDate";
import ReportDetailsModal from "./ReportDetailsModal";

const ReportList = ({ reports }) => {
  const [showReportDetailsModal, setShowReportDetailsModal] = useState(false);
  const [reportDetails, setReportDetails] = useState(null);

  const handleToggleReportDetailsModal = (report) => {
    setReportDetails(report);
    setShowReportDetailsModal((prev) => !prev);
  };
  return (
    <div class="relative overflow-x-auto bg-white mt-7 min-h-[70vh]">
      <table class="w-full text-sm text-left rtl:text-right text-gray-500">
        <thead class="text-gray-700 light-green-bg rounded-[12px]">
          <tr className="rounded-[12px]">
            <th
              scope="col"
              class="px-6 py-4 text-sm font-medium rounded-l-[12px]"
            >
              Report ID
            </th>
            <th scope="col" class="px-6 py-4 text-sm font-medium">
              Reporter
            </th>
            <th scope="col" class="px-6 py-4 text-sm font-medium">
              Reported User
            </th>
            <th scope="col" class="px-6 py-4 text-sm font-medium">
              Community
            </th>
            <th scope="col" class="px-6 py-4 text-sm font-medium">
              Date
            </th>
            <th
              scope="col"
              class="px-6 py-4 text-sm font-medium rounded-r-[12px]"
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
                  class="bg-white border-b border-gray-200 text-sm"
                >
                  <td class="px-6 py-3">{report?.id}</td>
                  <td class="px-6 py-3">{report?.title}</td>
                  <td class="px-6 py-3">
                    <div className="inline-flex items-center gap-2">
                      <img
                        src={
                          report?.reportedUser?.profilePicture
                            ? report?.reportedUser?.profilePicture
                            : "/profile-icon.png"
                        }
                        alt=""
                        width={43}
                        height={43}
                        className="rounded-full object-cover w-[43px] h-[43px] max-h-[43px] max-w-[43px]"
                      />
                      <p className="">{report?.reportedUser?.name}</p>
                    </div>
                  </td>
                  <td class="px-6 py-3">
                    <div className="inline-flex items-center gap-2">
                      <img
                        src={
                          report?.reporter?.profilePicture
                            ? report?.reporter?.profilePicture
                            : "/profile-icon.png"
                        }
                        alt=""
                        width={43}
                        height={43}
                        className="rounded-full object-cover h-[43px] max-h-[43px] w-[43px] max-w-[43px]"
                      />
                      <p className="">{report?.reporter?.name}</p>
                    </div>
                  </td>
                  <td class="px-6 py-3">{formatDate(report?.createdAt)}</td>
                  <td class="px-6 py-3">
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

      <ReportDetailsModal
        showReportDetailsModal={showReportDetailsModal}
        reportDetails={reportDetails}
        handleToggleReportDetailsModal={handleToggleReportDetailsModal}
      />
    </div>
  );
};

export default ReportList;
