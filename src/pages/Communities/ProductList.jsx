import ProductCard from "../../components/Common/ProductCard";
import { useSearchParams } from "react-router-dom";
import Loader from "../../components/Loader/Loader";
import SearchField from "../../components/Common/SearchField";
import { useGetCommunityProductsQuery } from "../../services/communityApi/communityApi";

const ProductList = ({ community }) => {
  const limit = 10;
  const [searchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";

  const communityId = community?.id;

  const { data, isError, error, isLoading } = useGetCommunityProductsQuery(
    {
      page,
      limit,
      search,
      communityId,
    },
    {
      skip: !communityId,
    }
  );

  const products = data?.data?.products;

  if (isLoading) {
    return (
      <div className="w-full pt-20 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error || isError) {
    return (
      <div className="w-full min-h-[80vh] relative flex items-center justify-center bg-white rounded-[12px] custom-shadow">
        <p className="text-gray-500 text-sm">
          {error?.data?.message || "Something went wrong."}
        </p>
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
          <SearchField />
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
          <div className="w-full min-h-[50vh] pt-28 text-center px-4">
            {search ? (
              <p className="mt-5 text-sm font-medium text-gray-500">
                No products found for the search term "{search}".
              </p>
            ) : (
              <p className="mt-5 text-sm font-medium text-gray-500">
                No products have been added in this community.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
