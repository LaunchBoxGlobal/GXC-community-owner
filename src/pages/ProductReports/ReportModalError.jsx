const ReportModalError = ({ handleToggleReportDetailsModal }) => {
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
      <div className="w-full flex items-center justify-center min-h-[400px]">
        <p className="text-sm font-medium text-gray-500">
          Something went wrong.
        </p>
      </div>
    </div>
  );
};

export default ReportModalError;
