import { useSearchParams } from "react-router-dom";
import ReportList from "./ReportList";
import PageLoader from "../../components/Loader/PageLoader";
import Pagination from "../../components/Common/Pagination";
import SearchField from "../../components/Common/SearchField";
import { useGetReportsQuery } from "../../services/reportsApi/reportsApi";

const ReportsPage = () => {
  const [searchParams] = useSearchParams();
  const LIMIT = 10;
  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";

  const {
    data: reportsRes,
    error,
    isError,
    isLoading,
  } = useGetReportsQuery(
    {
      page,
      limit: search ? 1 : LIMIT,
      search,
    },
    {
      refetchOnFocus: true,
      refetchOnReconnect: true,
    }
  );

  const reports = reportsRes?.data?.reports || [];
  const pagination = reportsRes?.data?.pagination || null;

  if (error || isError) {
    return (
      <div className="w-full min-h-[80vh] relative flex items-center justify-center bg-white rounded-[12px] custom-shadow">
        <p className="text-gray-500 text-sm">
          {error?.data?.message || "Something went wrong."}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full relative bg-white p-5 lg:p-7 rounded-[12px] min-h-[80vh] lg:rounded-[24px] custom-shadow">
      <div className="w-full relative flex items-center justify-between gap-5 flex-wrap">
        <h2 className="page-heading">Reports</h2>

        <div className="w-full md:max-w-[252px]">
          <SearchField />
        </div>
      </div>

      {isLoading ? (
        <PageLoader />
      ) : (
        <ReportList reports={reports} searchTerm={search} />
      )}

      <Pagination pagination={pagination} page={page} />
    </div>
  );
};

export default ReportsPage;
