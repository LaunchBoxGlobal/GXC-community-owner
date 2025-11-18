import React from "react";
import { LuSearch } from "react-icons/lu";
import { Link } from "react-router-dom";

const TransactionHistory = () => {
  return (
    <div className="w-full bg-white relative mt-8">
      <div className="w-full flex items-center justify-between gap-5">
        <h3 className="text-[32px] font-semibold leading-none">
          Transaction History
        </h3>
        <div className="w-full md:max-w-[252px]">
          <div className="h-[49px] pl-[15px] pr-[10px] rounded-[8px] bg-white custom-shadow flex items-center justify-start gap-2">
            <LuSearch className="text-xl text-[var(--secondary-color)]" />
            <input
              type="text"
              placeholder="Search"
              // value={searchTerm}
              // onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full outline-none border-none"
            />
            {/* {searchTerm && (
                        <button
                          type="button"
                          onClick={() => setSearchTerm("")}
                          className="bg-gray-100 w-4 h-4 rounded-full"
                        >
                          <IoClose className="text-gray-500 text-sm" />
                        </button>
                      )} */}
          </div>
        </div>
      </div>

      <div class="relative overflow-x-auto mt-5 bg-white custom-shadow rounded-[12px] p-3">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 border-separate border-spacing-0 rounded-[8px] overflow-hidden">
          <thead className="text-xs text-gray-700 light-green-bg">
            <tr>
              <th
                scope="col"
                className="px-6 py-4 text-sm font-medium rounded-l-[8px]"
              >
                #
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
              <th
                scope="col"
                className="px-6 py-4 text-sm font-medium rounded-r-[8px]"
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((_, i) => {
              return (
                <tr key={i} className="bg-white border-b border-gray-400">
                  <td className="px-6 py-4 border-b text-sm">id</td>
                  <td className="px-6 py-4 border-b text-sm">4985349893</td>
                  <td className="px-6 py-4 border-b text-sm">
                    <div className="flex items-center gap-2">
                      <img
                        src="/profile-icon.png"
                        alt="user profile picture"
                        className="w-[43px] h-[43px] object-cover"
                      />
                      <span className="text-sm font-normal">fullName</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 border-b text-sm">
                    <div className="flex items-center gap-2">
                      <img
                        src="/profile-icon.png"
                        alt="user profile picture"
                        className="w-[43px] h-[43px] object-cover"
                      />
                      <span className="text-sm font-normal">fullName</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 border-b text-sm">
                    <div className="flex items-center gap-2">
                      <img
                        src="/profile-icon.png"
                        alt="user profile picture"
                        className="w-[43px] h-[43px] object-cover"
                      />
                      <span className="text-sm font-normal">fullName</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 border-b text-sm">address</td>
                  <td className="px-6 py-4 border-b text-sm">status</td>
                  <td className="px-6 py-4 border-b text-sm">
                    <Link
                      to={`/transaction-history`}
                      className="text-xs underline font-medium leading-none tracking-tight text-black"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionHistory;
