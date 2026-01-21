import { useEffect, useState } from "react";
import TransactionHistory from "./TransactionHistory";
import { useGetRevenueQuery } from "../../services/transactionHistoryApi/transactionHistoryApi";
import Loader from "../../components/Loader/Loader";

const WalletPage = () => {
  const [userBalance, setUserBalance] = useState({ balanceAmount: 0 });

  const { data, error, isLoading } = useGetRevenueQuery();
  console.log(data);

  useEffect(() => {
    document.title = "Transaction History - giveXchange";
  }, []);

  return (
    <div className="w-full rounded-[12px] bg-white custom-shadow p-5">
      <h2 className="page-heading">Transaction History</h2>

      {isLoading ? (
        <div className="relative overflow-x-auto mt-5 bg-white min-h-screen custom-shadow rounded-[12px] p-3 flex items-center justify-center">
          <Loader />
        </div>
      ) : (
        <div className="w-full rounded-[24px] p-7 bg-white custom-shadow mt-8">
          <h3 className="text-lg lg:text-[20px] font-medium">Total Revenue</h3>
          <p className="text-[var(--button-bg)] text-[28px] lg:text-[40px] font-bold">
            {data
              ? data?.data?.balanceAmount > 0
                ? `$${data?.data?.balanceAmount.toFixed(2)}`
                : `$${data?.data?.balanceAmount}`
              : `$0`}
          </p>
        </div>
      )}

      <TransactionHistory setUserBalance={setUserBalance} />
    </div>
  );
};

export default WalletPage;
