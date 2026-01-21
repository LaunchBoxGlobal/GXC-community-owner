import { Link, useSearchParams } from "react-router-dom";
import Pagination from "../../components/Common/Pagination";
import Loader from "../../components/Loader/Loader";
import SearchField from "../../components/Common/SearchField";
import { useGetTransactionHistoryQuery } from "../../services/transactionHistoryApi/transactionHistoryApi";
import TransactionsTable from "./TransactionsTable";

const TransactionHistory = () => {
  const [searchParams] = useSearchParams();
  const LIMIT = 10;
  const page = Number(searchParams.get("page") || 1);
  const searchTerm = searchParams.get("search") || "";

  const { data, error, isError, isLoading } = useGetTransactionHistoryQuery({
    page: searchTerm ? 1 : page,
    limit: LIMIT,
    search: searchTerm,
  });

  const transactions = data?.data || [];
  const pagination = data?.pagination || null;

  if (error || isError) {
    return (
      <div className="w-full min-h-[80vh] relative flex items-center justify-center bg-white rounded-[12px] custom-shadow">
        <p className="text-gray-500 text-sm font-medium text-center">
          {error?.data?.message || "Something went wrong."}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white min-h-screen relative mt-8">
      <div className="w-full flex items-center justify-between flex-wrap gap-5">
        <h3 className="text-[24px] lg:text-[32px] font-semibold leading-none">
          Transaction History
        </h3>
        <div className="w-full md:max-w-[252px]">
          <SearchField />
        </div>
      </div>

      {isLoading ? (
        <div className="relative overflow-x-auto mt-5 bg-white min-h-screen custom-shadow rounded-[12px] p-3 flex items-center justify-center">
          <Loader />
        </div>
      ) : (
        <>
          {transactions?.length <= 0 ? (
            <div className="w-full min-h-[70vh] flex items-center justify-center px-4">
              {searchTerm ? (
                <p className="mt-5 text-sm font-medium text-gray-500">
                  No transactions found for the search term "{searchTerm}".
                </p>
              ) : (
                <p className="mt-5 text-sm font-medium text-gray-500">
                  No transactions found.
                </p>
              )}
            </div>
          ) : (
            <TransactionsTable transactions={transactions} />
          )}
        </>
      )}

      <Pagination page={page} pagination={pagination} />
    </div>
  );
};

export default TransactionHistory;
