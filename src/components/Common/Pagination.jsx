const Pagination = ({
  pagination,
  renderPageNumbers,
  handlePageChange,
  page,
}) => {
  return (
    <div className="w-full relative overflow-hidden">
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
                } text-sm`}
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
                } text-sm`}
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

export default Pagination;
