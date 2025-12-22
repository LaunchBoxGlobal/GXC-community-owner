import { useEffect, useState } from "react";
import TransactionHistory from "./TransactionHistory";

const WalletPage = () => {
  const [userBalance, setUserBalance] = useState({ balanceAmount: 0 });

  useEffect(() => {
    document.title = "Transaction History - giveXchange";
  }, []);

  return (
    <div className="w-full rounded-[12px] bg-white custom-shadow p-5">
      <h2 className="page-heading">Transaction History</h2>

      <div className="w-full rounded-[24px] p-7 bg-white custom-shadow mt-8">
        <h3 className="text-lg lg:text-[20px] font-medium">Total Revenue</h3>
        <p className="text-[var(--button-bg)] text-[28px] lg:text-[40px] font-bold">
          {userBalance && userBalance?.balanceAmount > 0
            ? `$${userBalance?.balanceAmount.toFixed(2)}`
            : `$${userBalance?.balanceAmount}`}
        </p>
      </div>

      <TransactionHistory setUserBalance={setUserBalance} />
    </div>
  );
};

export default WalletPage;
