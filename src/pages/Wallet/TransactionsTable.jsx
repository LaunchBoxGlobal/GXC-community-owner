import React from "react";
import { Link } from "react-router-dom";

const TransactionsTable = ({ transactions }) => {
  return (
    <div className="relative overflow-x-auto mt-5 bg-white min-h-screen custom-shadow rounded-[12px] p-3">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 border-separate border-spacing-0 rounded-[8px] overflow-hidden">
        <thead className="text-xs text-gray-700 light-green-bg whitespace-nowrap">
          <tr>
            <th
              scope="col"
              className="px-6 py-4 text-sm font-medium rounded-l-[8px]"
            >
              Order ID
            </th>
            <th scope="col" className="px-6 py-4 text-sm font-medium">
              Transaction ID
            </th>
            <th scope="col" className="px-6 py-4 text-sm font-medium">
              Product
            </th>
            <th scope="col" className="px-6 py-4 text-sm font-medium">
              Seller
            </th>
            <th scope="col" className="px-6 py-4 text-sm font-medium">
              Buyer
            </th>
            <th scope="col" className="px-6 py-4 text-sm font-medium">
              Price
            </th>
            <th scope="col" className="px-6 py-4 text-sm font-medium">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {transactions &&
            transactions?.map((transaction, i) => {
              return (
                <tr
                  key={i}
                  className="bg-white border-b border-gray-400 whitespace-nowrap"
                >
                  <td className="px-6 py-4 border-b text-sm">
                    {transaction?.orderId}
                  </td>
                  <td className="px-6 py-4 border-b text-sm">
                    {transaction?.transaction?.id}
                  </td>
                  <td className="px-6 py-4 border-b text-sm">
                    <div className="flex items-center gap-2">
                      <img
                        src={transaction?.product?.image}
                        alt="user profile picture"
                        className="min-w-[43px] max-w-[43px] h-[43px] object-cover rounded-full"
                      />
                      <Link
                        to={`/products/${transaction?.product?.title}?productId=${transaction?.product?.id}`}
                        className="text-sm font-normal"
                      >
                        {transaction?.product?.title}
                      </Link>
                    </div>
                  </td>
                  <td className="px-6 py-4 border-b text-sm">
                    <div className="flex items-center gap-2">
                      <img
                        src={
                          transaction?.seller?.profilePictureUrl
                            ? transaction?.seller?.profilePictureUrl
                            : "/profile-icon.png"
                        }
                        alt="user profile picture"
                        className="min-w-[43px] max-w-[43px] h-[43px] object-cover rounded-full"
                      />
                      <Link
                        to={`/transaction-history/member/${transaction?.seller?.id}`}
                        className="text-sm font-normal"
                      >
                        {transaction?.seller?.name}
                      </Link>
                    </div>
                  </td>
                  <td className="px-6 py-4 border-b text-sm">
                    <div className="flex items-center gap-2">
                      <img
                        src={
                          transaction?.buyer?.profilePictureUrl
                            ? transaction?.buyer?.profilePictureUrl
                            : "/profile-icon.png"
                        }
                        alt="user profile picture"
                        className="min-w-[43px] max-w-[43px] h-[43px] object-cover rounded-full"
                      />
                      <Link
                        to={`/transaction-history/member/${transaction?.buyer?.id}`}
                        className="text-sm font-normal"
                      >
                        {transaction?.buyer?.name}
                      </Link>
                    </div>
                  </td>
                  <td className="px-6 py-4 border-b text-sm">
                    ${transaction?.transaction?.communityOwner?.amount}
                  </td>
                  <td className="px-6 py-4 border-b text-sm">
                    <span className="bg-green-100 text-green-500 px-2 py-1 rounded-full text-xs font-medium">
                      {transaction?.order?.paymentStatus
                        .charAt(0)
                        .toUpperCase() +
                        transaction?.order?.paymentStatus.slice(1)}
                    </span>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionsTable;
