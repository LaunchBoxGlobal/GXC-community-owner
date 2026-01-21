const ReporterDetails = ({ report }) => {
  return (
    <div className="w-full">
      <h4 className="font-medium">Reporter</h4>
      <div className="w-full mt-1 5 flex items-center justify-between">
        <div className="inline-flex items-center gap-2 w-full">
          <img
            src={report?.reporter?.profilePictureUrl || "/profile-icon.png"}
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
  );
};

export default ReporterDetails;
