import { useEffect, useState } from "react";
import ProductCard from "../../components/Common/ProductCard";
import { BASE_URL } from "../../data/baseUrl";
import { enqueueSnackbar } from "notistack";
import { handleApiError } from "../../utils/handleApiError";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDebounce } from "use-debounce";
import axios from "axios";
import { getToken } from "../../utils/getToken";
import Loader from "../../components/Loader/Loader";
import { LuSearch } from "react-icons/lu";
import { IoClose } from "react-icons/io5";

const ProductList = ({ community }) => {
  // Query params
  const [searchParams, setSearchParams] = useSearchParams();
  const typeFromUrl = searchParams.get("type") || "active";
  const pageFromUrl = parseInt(searchParams.get("page")) || 1;
  const limitFromUrl = parseInt(searchParams.get("limit")) || 10;
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState(null);
  const [page, setPage] = useState(pageFromUrl);
  const [limit, setLimit] = useState(limitFromUrl);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch] = useDebounce(searchTerm, 500);
  const navigate = useNavigate();

  // States
  const [listType, setListType] = useState(typeFromUrl);

  const fetchProducts = async () => {
    if (!community?.id) {
      enqueueSnackbar("Community ID is not defined", { variant: "error" });
      return;
    }

    setLoading(true);
    try {
      // const baseUrl =
      //   listType === "blocked"
      //     ? `${BASE_URL}/communities/${community?.id}/products`
      //     : `${BASE_URL}/communities/${community?.id}/products`;

      const baseUrl = `${BASE_URL}/communities/${community?.id}/products`;

      const query = new URLSearchParams({
        page,
        limit,
        ...(debouncedSearch && { search: debouncedSearch }),
      }).toString();

      const res = await axios.get(`${baseUrl}?${query}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      const data = res?.data?.data || {};
      setProducts(data.products || []);
      setTotal(data.pagination?.total || 0);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (error) {
      handleApiError(error, navigate);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!community) return;
    fetchProducts();
  }, [listType, page, debouncedSearch, community]);

  useEffect(() => {
    const currentParams = Object.fromEntries(searchParams.entries());

    const newParams = {
      ...currentParams,
      type: listType,
      page,
      limit,
      ...(debouncedSearch && { search: debouncedSearch }),
    };

    setSearchParams(newParams);
  }, [listType, page, limit, debouncedSearch, searchParams, setSearchParams]);

  if (loading) {
    return (
      <div className="w-full pt-20 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="w-full mt-6">
      <div className="w-full flex items-center justify-between flex-wrap gap-5">
        <h3 className="page-heading">
          Products{" "}
          {products?.length > 0 ? (
            <span>{`(${products?.length})`}</span>
          ) : (
            `(0)`
          )}
        </h3>
        <div className="w-full md:max-w-[252px]">
          <div className="h-[49px] pl-[15px] pr-[10px] rounded-[8px] bg-white custom-shadow flex items-center gap-2">
            <LuSearch className="text-xl text-[var(--secondary-color)]" />
            <input
              type="text"
              placeholder="Search products..."
              disabled={total <= 0}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full outline-none border-none bg-transparent disabled:cursor-not-allowed"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="bg-gray-100 w-4 h-4 rounded-full"
              >
                <IoClose className="text-gray-900 text-sm" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="w-full mt-6">
        {products && products?.length > 0 ? (
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {products?.map((product, index) => {
              return <ProductCard product={product} key={index} />;
            })}
          </div>
        ) : (
          <div className="w-full text-center text-sm">No products found!</div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
