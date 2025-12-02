import axios from "axios";
import React, { useEffect, useState } from "react";
import { LuSearch } from "react-icons/lu";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { BASE_URL } from "../../data/baseUrl";
import { handleApiError } from "../../utils/handleApiError";
import { getToken } from "../../utils/getToken";
import { IoClose } from "react-icons/io5";
import Pagination from "../../components/Common/Pagination";
import Loader from "../../components/Loader/Loader";

const debounce = (fn, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
};

const TransactionHistory = ({ setUserBalance }) => {
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const LIMIT = 10;
  const page = searchParams.get("page") || 1;
  const [searchTerm, setSearchTerm] = useState("");

  const getRevenue = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/user/financial-summary`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      console.log("revenue response >>> ", response?.data);
      setUserBalance(response?.data?.data);
    } catch (error) {
      handleApiError(error, navigate);
    }
  };

  const getTransactions = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.get(`${BASE_URL}/user/transactions`, {
        params: {
          // type: sellerType,
          page,
          limit: LIMIT,
          search: searchTerm || undefined,
        },
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      setTransactions(res.data?.data || []);
      setPagination(res.data?.pagination);
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError(err?.response?.data?.message || "Failed to load transactions.");
      handleApiError(err, navigate);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debouncedFetch = debounce(() => {
      getRevenue();
      getTransactions();
    }, 500);
    debouncedFetch();
  }, [page, searchTerm]);

  const handlePageChange = (newPage) => {
    if (!pagination || newPage < 1 || newPage > pagination.totalPages) return;
    const params = new URLSearchParams();
    params.set("page", newPage);
    navigate(`?${params.toString()}`);
  };

  const renderPageNumbers = () => {
    if (!pagination) return null;
    const { totalPages } = pagination;
    const pages = [];

    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <li key={i}>
          <button
            onClick={() => handlePageChange(i)}
            aria-current={i === page ? "page" : undefined}
            className={`flex items-center justify-center px-4 h-10 leading-tight font-medium rounded-[12px] ${
              i === page
                ? "text-white bg-[var(--button-bg)] font-medium"
                : "text-gray-600 hover:bg-[var(--button-bg)] hover:text-white"
            } text-sm`}
          >
            {i}
          </button>
        </li>
      );
    }
    return pages;
  };

  return (
    <div className="w-full bg-white min-h-screen relative mt-8">
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full outline-none border-none"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="bg-gray-100 w-4 h-4 rounded-full"
              >
                <IoClose className="text-gray-500 text-sm" />
              </button>
            )}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="relative overflow-x-auto mt-5 bg-white min-h-screen custom-shadow rounded-[12px] p-3 flex items-center justify-center">
          <Loader />
        </div>
      ) : (
        <div className="relative overflow-x-auto mt-5 bg-white min-h-screen custom-shadow rounded-[12px] p-3">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 border-separate border-spacing-0 rounded-[8px] overflow-hidden">
            <thead className="text-xs text-gray-700 light-green-bg">
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
                {/* <th
                scope="col"
                className="px-6 py-4 text-sm font-medium rounded-r-[8px]"
              >
                Action
              </th> */}
              </tr>
            </thead>
            <tbody>
              {transactions &&
                transactions?.map((transaction, i) => {
                  return (
                    <tr key={i} className="bg-white border-b border-gray-400">
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
                            className="w-[43px] h-[43px] object-cover rounded-full"
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
                            className="w-[43px] h-[43px] object-cover rounded-full"
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
                            className="w-[43px] h-[43px] object-cover rounded-full"
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
                        {transaction?.order?.paymentStatus
                          .charAt(0)
                          .toUpperCase() +
                          transaction?.order?.paymentStatus.slice(1)}
                      </td>
                      {/* <td className="px-6 py-4 border-b text-sm">
                      <Link
                        to={`/transaction-history/details/${transaction?.id}`}
                        className="text-xs underline font-medium leading-none tracking-tight text-black"
                      >
                        View Details
                      </Link>
                    </td> */}
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      )}

      <Pagination
        page={page}
        pagination={pagination}
        handlePageChange={handlePageChange}
        renderPageNumbers={renderPageNumbers}
      />
    </div>
  );
};

export default TransactionHistory;
