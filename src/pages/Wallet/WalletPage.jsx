import { useEffect, useState } from "react";
import TransactionHistory from "./TransactionHistory";
import { useGetRevenueQuery } from "../../services/transactionHistoryApi/transactionHistoryApi";
import Loader from "../../components/Loader/Loader";
import { useTranslation } from "react-i18next";
import formatAmount from "../../utils/formatAmount";

const WalletPage = () => {
  const [userBalance, setUserBalance] = useState({ balanceAmount: 0 });
  const { t } = useTranslation("transactionHistory");

  const { data, error, isLoading } = useGetRevenueQuery();
  console.log(data);

  useEffect(() => {
    document.title = `${t(`Transaction History`)} - giveXchange`;
  }, []);

  return (
    <div className="w-full rounded-[12px] bg-white custom-shadow p-5">
      <h2 className="page-heading">{t(`Transaction History`)}</h2>

      {isLoading ? (
        <div className="relative overflow-x-auto mt-5 bg-white min-h-screen custom-shadow rounded-[12px] p-3 flex items-center justify-center">
          <Loader />
        </div>
      ) : (
        <div className="w-full rounded-[24px] p-7 bg-white custom-shadow mt-8">
          <h3 className="text-lg lg:text-[20px] font-medium">
            {t(`Total Revenue`)}
          </h3>
          <p className="text-[var(--button-bg)] text-[28px] lg:text-[40px] font-bold">
            {data && data?.data?.balanceAmount > 0
              ? `$${formatAmount(data?.data?.balanceAmount.toFixed(2))}`
              : `$0`}
          </p>
        </div>
      )}

      <TransactionHistory setUserBalance={setUserBalance} />
    </div>
  );
};

export default WalletPage;
