import { formatDate } from "../../utils/formatDate";

const ReportHeader = ({ report, handleToggleReportDetailsModal }) => {
  return (
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
        >
          <img src="/close-icon.png" alt="close icon" width={19} height={19} />
        </button>
      </div>
      <div className="w-full grid grid-cols-2">
        <div className="w-full mt-3 flex items-center gap-1.5">
          <h4 className="font-medium leading-none text-sm">Reported Date:</h4>
          <p className="text-[14px] font-medium">
            {formatDate(report?.createdAt)}
          </p>
        </div>

        <div className="w-full mt-3 flex items-center justify-end gap-1.5">
          <h4 className="font-medium leading-none text-sm">Report Status:</h4>
          <p
            className={`text-[14px] font-medium ${
              report?.status === "pending"
                ? "text-[#FF7700]"
                : report?.status === "resolved"
                ? "text-green-500"
                : report?.status === "rejected"
                ? "text-red-500"
                : "text-gray-500"
            }`}
          >
            {report?.status.charAt(0).toUpperCase() + report?.status.slice(1)}
          </p>
        </div>
      </div>

      <div className="w-full mt-3 flex items-center gap-1.5">
        <h4 className="font-medium leading-none text-sm">Community:</h4>
        <p className="text-[14px] font-medium">{report?.community?.name}</p>
      </div>
    </div>
  );
};

export default ReportHeader;
