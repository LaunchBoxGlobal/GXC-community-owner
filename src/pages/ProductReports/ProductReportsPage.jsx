import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import ReportList from "./ReportList";
import PageLoader from "../../components/Loader/PageLoader";
import Pagination from "../../components/Common/Pagination";
import SearchField from "../../components/Common/SearchField";
import { useGetReportedProductsQuery } from "../../services/reportedProductsApi/reportedProductsApi";
import { useTranslation } from "react-i18next";
import { useLangQuery } from "../../hooks/useLangQuery";

const ProductReportsPage = () => {
  const [searchParams] = useSearchParams();
  const LIMIT = 10;
  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";
  const { t } = useTranslation("reportedProducts");

  const { data, error, isError, isLoading } = useLangQuery(
    useGetReportedProductsQuery,
    {
      page,
      limit: LIMIT,
      search,
    },
    {
      refetchOnFocus: true,
      refetchOnReconnect: true,
      refetchOnMountOrArgChange: true,
    },
  );

  const reports = data?.data || [];
  const pagination = data?.pagination || null;

  useEffect(() => {
    document.title = `${t(`Reports`)} - giveXchange`;
  }, []);

  if (error || isError) {
    return (
      <div className="w-full min-h-[80vh] relative flex items-center justify-center bg-white rounded-[12px] custom-shadow">
        <p className="text-gray-500 text-sm">
          {error?.data?.message || t("Something went wrong.")}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full relative bg-white p-5 lg:p-7 rounded-[12px] min-h-[80vh] lg:rounded-[24px] custom-shadow">
      <div className="w-full relative flex items-center justify-between flex-wrap gap-5">
        <h2 className="page-heading">{t(`Reported Products`)}</h2>

        <div className="w-full md:max-w-[252px]">
          <SearchField />
        </div>
      </div>

      {isLoading ? (
        <PageLoader />
      ) : (
        <>
          {reports?.length <= 0 ? (
            <div className="w-full min-h-[70vh] flex items-center justify-center px-4">
              {search ? (
                <p className="mt-5 text-sm font-medium text-gray-500">
                  {t(`No reports found for the search term`)} "{search}".
                </p>
              ) : (
                <p className="mt-5 text-sm font-medium text-gray-500">
                  {t(`No reports found.`)}
                </p>
              )}
            </div>
          ) : (
            <ReportList reports={reports} />
          )}
        </>
      )}

      <Pagination pagination={pagination} page={page} />
    </div>
  );
};

export default ProductReportsPage;
