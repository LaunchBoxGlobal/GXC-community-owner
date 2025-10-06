import { Link, useLocation, useNavigate } from "react-router-dom";
import { PAGE_LINKS } from "../../data/pageLinks";
import Cookies from "js-cookie";
import axios from "axios";
import { BASE_URL } from "../../data/baseUrl";
import { FiLogOut } from "react-icons/fi";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      const res = await axios.post(
        `${BASE_URL}/auth/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );

      if (res?.data?.success) {
        console.log("Logout successful");
      }
    } catch (error) {
      console.log("Logout error >>>", error?.response?.data || error.message);
    } finally {
      Cookies.remove("user");
      Cookies.remove("token");
      navigate("/login");
    }
  };

  return (
    <div className="w-full h-full rounded-[10px] py-6 px-2 lg:px-5 flex flex-col items-start gap-y-6 bg-[#fff] custom-shadow">
      <div>
        <img
          src="/logo.svg"
          alt="logo"
          className="max-w-[144px] object-contain"
        />
      </div>
      <ul className="w-full flex flex-col gap-y-2">
        {PAGE_LINKS?.map((link, index) => {
          // const Icon = link?.icon;
          return (
            <li className={`w-full text-black h-[49px]`} key={index}>
              <Link
                to={link?.page}
                className={`text-sm flex items-center gap-x-2.5 font-medium w-full h-[49px] px-4 rounded-[12px] outline-none ${
                  location?.pathname === link?.page ||
                  location?.pathname.startsWith(link?.page + "/")
                    ? "bg-[var(--button-bg)] text-white"
                    : "bg-transparent text-black hover:bg-[var(--button-bg)] hover:text-white transition-all duration-300 group"
                }`}
              >
                {/* <Icon className="text-xl leading-none" /> */}
                <img
                  src={link?.icon}
                  alt={link?.iconAltTag}
                  width={link?.iconWidth}
                  height={link?.iconHeight}
                  className={`transition duration-300 group-hover:invert group-hover:brightness-0 ${
                    location?.pathname === link?.page && "invert brightness-0"
                  }`}
                />

                <span className="">{link?.title}</span>
              </Link>
            </li>
          );
        })}

        <button
          type="button"
          onClick={() => handleLogout()}
          className={`text-sm flex items-center gap-x-2.5 font-medium w-full h-[49px] px-4 rounded-[12px] outline-none 
                    bg-transparent text-black hover:bg-[var(--button-bg)] hover:text-white transition-all duration-300 group"
                }`}
        >
          <FiLogOut className="text-xl leading-none" />
          Logout
        </button>
      </ul>
    </div>
  );
};

export default Sidebar;
