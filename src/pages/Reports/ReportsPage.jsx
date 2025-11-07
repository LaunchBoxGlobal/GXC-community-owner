import axios from "axios";
import { getToken } from "../../utils/getToken";
import { handleApiError } from "../../utils/handleApiError";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { BASE_URL } from "../../data/baseUrl";
import ReportList from "./ReportList";
import Loader from "../../components/Loader/Loader";

const ReportsPage = () => {
  const navigate = useNavigate();
  const [pagination, setPagination] = useState(null);
  const [reports, setReports] = useState(null);
  const [searchParams] = useSearchParams();
  const LIMIT = 10;
  const page = Number(searchParams.get("page")) || 1;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${BASE_URL}/reports/communities/user-reports?limit=${LIMIT}&page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      console.log("user reports >>> ", res?.data);
      setReports(res?.data?.data?.reports);
      setPagination(res?.data?.data?.pagination);
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

  useEffect(() => {
    fetchReports();
  }, [page]);

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
            }`}
          >
            {i}
          </button>
        </li>
      );
    }
    return pages;
  };

  if (loading) {
    return (
      <div className="w-full min-h-[70vh] relative flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-[80vh] relative flex items-center justify-center bg-white rounded-[12px] lg:rounded-[24px] custom-shadow">
        <p className="text-gray-500 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full relative bg-white p-5 lg:p-7 rounded-[12px] lg:rounded-[24px] custom-shadow">
      <h2 className="page-heading">Reports</h2>

      <ReportList reports={reports} />

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <nav
          aria-label="Page navigation"
          className="flex justify-end w-full mt-10"
        >
          <ul className="inline-flex items-center gap-2 px-2 -space-x-px text-base h-[58px] bg-[#E6E6E6BD] rounded-[12px]">
            {/* Previous Button */}
            <li>
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page <= 1}
                className={`flex items-center justify-center px-4 h-10 ms-0 leading-tight font-medium rounded-[12px] ${
                  page <= 1
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-600 hover:bg-[var(--button-bg)] hover:text-white"
                }`}
              >
                Previous
              </button>
            </li>

            {/* Page Numbers */}
            {renderPageNumbers()}

            {/* Next Button */}
            <li>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= pagination.totalPages}
                className={`flex items-center justify-center px-4 h-10 leading-tight font-medium rounded-[12px] ${
                  page >= pagination.totalPages
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-600 hover:bg-[var(--button-bg)] hover:text-white"
                }`}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default ReportsPage;
