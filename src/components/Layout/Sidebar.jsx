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
    <div className="w-full h-full rounded-[10px] py-6 px-2 lg:px-5 flex flex-col items-start gap-y-6 bg-[#EAEAEA]">
      <div>
        <h1 className="text-[35px] font-semibold tracking-tight">Logo</h1>
      </div>
      <ul className="w-full flex flex-col gap-y-2">
        {PAGE_LINKS?.map((link, index) => {
          const Icon = link?.icon;
          return (
            <li className={`w-full text-black h-[49px]`} key={index}>
              <Link
                to={link?.page}
                // onClick={() => navigateToLink(link?.page, link?.title)}
                className={`text-sm flex items-center gap-x-2.5 font-medium w-full h-[49px] px-4 rounded-[12px] outline-none ${
                  location?.pathname === link?.page
                    ? "bg-black text-white"
                    : "bg-transparent text-black hover:bg-black hover:text-white transition-all duration-300 group"
                }`}
              >
                <Icon className="text-xl leading-none" />

                <span className="">{link?.title}</span>
              </Link>
            </li>
          );
        })}

        <button
          type="button"
          onClick={() => handleLogout()}
          className={`text-sm flex items-center gap-x-2.5 font-medium w-full h-[49px] px-4 rounded-[12px] outline-none 
                    bg-transparent text-black hover:bg-black hover:text-white transition-all duration-300 group"
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
