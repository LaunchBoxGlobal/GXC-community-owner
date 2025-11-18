import React, { useEffect } from "react";
import TransactionHistory from "./TransactionHistory";

const WalletPage = () => {
  useEffect(() => {
    document.title = "Transaction History - giveXchange";
  }, []);
  return (
    <div className="w-full rounded-[12px] bg-white custom-shadow p-5">
      <h2 className="page-heading">Transaction History</h2>

      <div className="w-full rounded-[24px] p-7 bg-white custom-shadow mt-8">
        <h3 className="text-[20px] font-medium">Total Revenue</h3>
        <p className="text-[var(--button-bg)] text-[40px] font-bold">$3,5362</p>
      </div>

      <TransactionHistory />
    </div>
  );
};

export default WalletPage;
