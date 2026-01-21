import React from "react";

const ReportDescriptionImages = ({
  report,
  setShowImageModal,
  setInitialSlide,
}) => {
  return (
    <div className="w-full">
      <div className="w-full mt-4">
        <h4 className="font-medium">Title</h4>
        <p className="leading-[1.2] mt-1">{report?.title}</p>
      </div>

      <div className="w-full border mt-3" />

      <div className="w-full mt-4">
        <h4 className="font-medium">Description</h4>
        <div className="w-full max-h-[220px] overflow-y-auto mt-1">
          <p className="leading-[1.2] text-sm text-gray-800">
            {report?.description}
          </p>
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
    </div>
  );
};

export default ReportDescriptionImages;
