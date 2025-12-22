import axios from "axios";
import { getToken } from "../../utils/getToken";
import { handleApiError } from "../../utils/handleApiError";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { BASE_URL } from "../../data/baseUrl";
import ReportList from "./ReportList";
import PageLoader from "../../components/Loader/PageLoader";
import Pagination from "../Reports/Pagination";
import { LuSearch } from "react-icons/lu";
import { IoClose } from "react-icons/io5";

const ProductReportsPage = () => {
  const navigate = useNavigate();
  const [pagination, setPagination] = useState(null);
  const [reports, setReports] = useState(null);
  const [searchParams] = useSearchParams();
  const LIMIT = 10;
  const page = Number(searchParams.get("page")) || 1;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [total, setTotal] = useState(0);

  // 🔹 Debounce effect for searchTerm
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500); // wait 500ms after user stops typing

    return () => clearTimeout(handler);
  }, [searchTerm]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${BASE_URL}/products/reports/list?limit=${LIMIT}&page=${page}${
          debouncedSearch ? `&search=${debouncedSearch}` : ""
        }`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      //   console.log("res >> ", res);
      setReports(res?.data?.data);
      setPagination(res?.data?.pagination);
      setTotal(res?.data?.pagination?.total || 0);
    } catch (error) {
      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong."
      );
      handleApiError(error, navigate);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Fetch reports when page changes or searchTerm (debounced) updates
  useEffect(() => {
    document.title = "Reports - giveXchange";
    fetchReports();
  }, [page, debouncedSearch]);

  // Handle pagination click
  const handlePageChange = (newPage) => {
    if (!pagination || newPage < 1 || newPage > pagination.totalPages) return;
    const params = new URLSearchParams(searchParams);
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

  if (error) {
    return (
      <div className="w-full min-h-[80vh] relative flex items-center justify-center bg-white rounded-[12px] lg:rounded-[24px] custom-shadow">
        <p className="text-gray-500 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full relative bg-white p-5 lg:p-7 rounded-[12px] min-h-[80vh] lg:rounded-[24px] custom-shadow">
      <div className="w-full relative flex items-center justify-between flex-wrap gap-5">
        <h2 className="page-heading">Reported Products</h2>

        <div className="w-full md:max-w-[252px]">
          <div className="h-[49px] pl-[15px] pr-[10px] rounded-[8px] bg-white custom-shadow flex items-center gap-2">
            <LuSearch className="text-xl text-[var(--secondary-color)]" />
            <input
              type="text"
              placeholder="Search reports..."
              disabled={loading}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full outline-none border-none bg-transparent disabled:cursor-not-allowed"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="bg-gray-100 w-4 h-4 rounded-full flex items-center justify-center"
              >
                <IoClose className="text-gray-900 text-sm" />
              </button>
            )}
          </div>
        </div>
      </div>

      {loading ? (
        <PageLoader />
      ) : (
        <>
          {total <= 0 ? (
            <div className="w-full min-h-[50vh] relative flex items-center justify-center">
              <p className="text-sm font-medium text-gray-500">
                No reported products found!
              </p>
            </div>
          ) : (
            <ReportList reports={reports} fetchReports={fetchReports} />
          )}
        </>
      )}

      <Pagination
        pagination={pagination}
        renderPageNumbers={renderPageNumbers}
        handlePageChange={handlePageChange}
        page={page}
      />
    </div>
  );
};

export default ProductReportsPage;
