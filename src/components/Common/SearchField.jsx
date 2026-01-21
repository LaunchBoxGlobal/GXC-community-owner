import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { LuSearch } from "react-icons/lu";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

const SearchField = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = useState(searchParams.get("search") || "");

  useEffect(() => {
    setValue(searchParams.get("search") || "");
  }, [searchParams]);

  // 🧠 Debounce effect — update URL only after 500ms of no typing
  useEffect(() => {
    const handler = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      if (value.trim()) params.set("search", value.trim());
      else params.delete("search");

      navigate(`${location.pathname}?${params.toString()}`, { replace: true });
    }, 500);

    return () => clearTimeout(handler);
  }, [value]);

  return (
    <div className="w-full md:max-w-[252px]">
      <div className="h-[49px] pl-[15px] pr-[10px] rounded-[8px] bg-white flex items-center gap-2 custom-shadow">
        <LuSearch className="text-xl text-[var(--secondary-color)]" />
        <input
          type="text"
          placeholder="Search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full outline-none border-none"
        />
        {value && (
          <button
            type="button"
            onClick={() => setValue("")}
            className="bg-gray-100 w-4 h-4 rounded-full"
          >
            <IoClose className="text-gray-500 text-sm" />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchField;
