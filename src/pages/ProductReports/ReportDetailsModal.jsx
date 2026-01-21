import { useState } from "react";
import Loader from "../../components/Loader/Loader";
import { useGetReportByIdQuery } from "../../services/reportedProductsApi/reportedProductsApi";
import SellerDetails from "./SellerDetails";
import ProductDetails from "./ProductDetails";
import ImageViewModal from "../../components/Common/ImageViewModal";
import ReportDescriptionImages from "./ReportDescriptionImages";
import ReportHeader from "./ReportHeader";
import ReporterDetails from "./ReporterDetails";
import ReportModalActions from "./ReportModalActions";

const ReportDetailsModal = ({
  reportDetails,
  handleToggleReportDetailsModal,
}) => {
  const [showImageModal, setShowImageModal] = useState(false);
  const [initialSlide, setInitialSlide] = useState(0);

  const { data, isLoading, isError, refetch } = useGetReportByIdQuery(
    reportDetails?.id
  );

  const report = data?.data || null;

  return (
    <div className="w-full h-screen fixed inset-0 z-50 bg-[rgba(0,0,0,0.5)] flex items-center justify-center py-5 px-5">
      {isLoading ? (
        <Loader />
      ) : (
        <div className="bg-white w-full max-w-[491px] p-5 rounded-[16px] relative custom-shadow">
          {isError ? (
            <ReportModalError
              handleToggleReportDetailsModal={handleToggleReportDetailsModal}
            />
          ) : (
            <>
              <ReportHeader
                report={report}
                handleToggleReportDetailsModal={handleToggleReportDetailsModal}
              />

              <div className="w-full mt-5 flex flex-col items-start">
                <ReporterDetails report={report} />

                <div className="w-full border my-2" />

                <SellerDetails report={report} refetch={refetch} />
              </div>

              <div className="w-full border mt-3" />

              <ReportDescriptionImages
                report={report}
                setShowImageModal={setShowImageModal}
                setInitialSlide={setInitialSlide}
              />

              <div className="w-full border mt-3" />
              <ProductDetails report={report} refetch={refetch} />

              <ReportModalActions report={report} refetch={refetch} />
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
