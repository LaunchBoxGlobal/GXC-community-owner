import { useEffect, useState } from "react";
import ProductCard from "../../components/Common/ProductCard";
import { BASE_URL } from "../../data/baseUrl";
import { enqueueSnackbar } from "notistack";
import { handleApiError } from "../../utils/handleApiError";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDebounce } from "use-debounce";
import axios from "axios";
import { getToken } from "../../utils/getToken";

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
      const baseUrl =
        listType === "blocked"
          ? `${BASE_URL}/communities/${community?.id}/products`
          : `${BASE_URL}/communities/${community?.id}/products`;

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
      // setMemberCount(data.pagination?.total || 0);
    } catch (error) {
      handleApiError(error, navigate);
    } finally {
      setLoading(false);
      // setOpenActions(null);
    }
  };

  // Fetch when dependencies change
  useEffect(() => {
    if (!community) return;
    fetchProducts();
  }, [listType, page, debouncedSearch, community]);

  // Keep URL in sync with listType & page
  useEffect(() => {
    setSearchParams({
      type: listType,
      page,
      limit,
      ...(debouncedSearch && { search: debouncedSearch }),
    });
  }, [listType, page, limit, debouncedSearch]);
  return (
    <div className="w-full">
      <div className="w-full">
        <h3 className="page-heading">
          Products <span>(0)</span>
        </h3>
      </div>

      {/* <div className="w-full mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
      </div> */}
    </div>
  );
};

export default ProductList;
