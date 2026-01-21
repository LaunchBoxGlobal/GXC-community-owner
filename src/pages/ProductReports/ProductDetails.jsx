import { Link } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import { useDelistProductMutation } from "../../services/reportedProductsApi/reportedProductsApi";

const ProductDetails = ({ report, refetch }) => {
  const [delistProduct] = useDelistProductMutation();

  const handleDeleteProduct = async (productId) => {
    if (!productId) {
      enqueueSnackbar("Product ID not found!", { variant: "error" });
      return;
    }

    try {
      const res = await delistProduct(productId).unwrap();

      if (res?.success) {
        enqueueSnackbar("Product deleted successfully!", {
          variant: "success",
        });

        refetch();
      }
    } catch (error) {
      //   enqueueSnackbar(
      //     error?.data?.message ||
      //       error?.message ||
      //       "Product delisted successfully!",
      //     { variant: "success" }
      //   );
      console.log("delete product error >> ", error);
    }
  };

  return (
    <div className="w-full mt-4 flex items-center justify-between">
      <div>
        <h4 className="font-medium">Product</h4>
        <div className="inline-flex items-center gap-2 mt-1.5">
          <img
            src={report?.product?.image || "/profile-icon.png"}
            alt=""
            width={35}
            height={35}
            className="rounded-lg object-cover w-[35px] h-[35px]"
          />
          <Link
            to={`/products/${report?.product?.title}?productId=${report?.product?.id}`}
            className="text-[17px] font-medium"
          >
            {report?.product?.title}
          </Link>
        </div>
      </div>

      {/* Toggle Button */}
      <div className="flex flex-col items-end gap-1.5">
        <label htmlFor="disable" className="font-medium text-sm">
          {report?.product?.status === "delisted" ? "Delisted" : "Delist"}
        </label>
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={report?.product?.status === "delisted"}
            disabled={report?.product?.status === "delisted"}
            onChange={() => handleDeleteProduct(report?.product?.id)}
            className="sr-only peer disabled:cursor-not-allowed disabled:opacity-50"
          />
          <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--button-bg)]"></div>
        </label>
      </div>
    </div>
  );
};

export default ProductDetails;
