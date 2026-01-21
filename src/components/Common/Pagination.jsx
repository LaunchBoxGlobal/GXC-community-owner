import { useNavigate } from "react-router-dom";

const Pagination = ({ pagination, page }) => {
  const navigate = useNavigate();
  const MAX_VISIBLE_PAGES = 5;

  const handlePageChange = (newPage) => {
    if (!pagination || newPage < 1 || newPage > pagination.totalPages) return;

    const params = new URLSearchParams(window.location.search);
    params.set("page", newPage);
    navigate(`?${params.toString()}`);
  };

  const getVisiblePages = () => {
    if (!pagination) return [];

    const totalPages = pagination.totalPages;
    const half = Math.floor(MAX_VISIBLE_PAGES / 2);

    let start = Math.max(1, page - half);
    let end = Math.min(totalPages, start + MAX_VISIBLE_PAGES - 1);

    if (end - start + 1 < MAX_VISIBLE_PAGES) {
      start = Math.max(1, end - MAX_VISIBLE_PAGES + 1);
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="w-full relative overflow-hidden">
      {pagination && pagination.totalPages > 1 && (
        <nav
          aria-label="Page navigation"
          className="flex justify-end w-full mt-10"
        >
          <ul className="inline-flex items-center gap-2 px-2 text-base h-[58px] bg-[#E6E6E6BD] rounded-[12px]">
            {/* Previous */}
            <li>
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page <= 1}
                className={`flex items-center justify-center px-4 h-10 rounded-[12px] font-medium text-sm ${
                  page <= 1
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-600 hover:bg-[var(--button-bg)] hover:text-white"
                }`}
              >
                Previous
              </button>
            </li>

            {/* Page Numbers */}
            {visiblePages.map((p) => (
              <li key={p}>
                <button
                  onClick={() => handlePageChange(p)}
                  aria-current={p === page ? "page" : undefined}
                  className={`flex items-center justify-center px-4 h-10 rounded-[12px] font-medium ${
                    p === page
                      ? "text-white bg-[var(--button-bg)]"
                      : "text-gray-600 hover:bg-[var(--button-bg)] hover:text-white"
                  }`}
                >
                  {p}
                </button>
              </li>
            ))}

            {/* Next */}
            <li>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= pagination.totalPages}
                className={`flex items-center justify-center px-4 h-10 rounded-[12px] font-medium text-sm ${
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

export default Pagination;
