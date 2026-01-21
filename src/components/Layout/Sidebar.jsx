import { useLocation, useNavigate } from "react-router-dom";
import { PAGE_LINKS } from "../../data/pageLinks";
import { handleLogout } from "../../utils/handleLogout";
import { useLogoutUserMutation } from "../../services/authApi/authApi";
import Loader from "../Loader/Loader";
import { useDispatch } from "react-redux";
import { removeUser } from "../../features/userSlice/userSlice";
import { authApi } from "../../services/authApi/authApi";
import { communityApi } from "../../services/communityApi/communityApi";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [logoutUser, { isLoading }] = useLogoutUserMutation();

  const handleLogoutUser = async () => {
    const deviceInfo = localStorage.getItem("ownerBrowserDeviceId");
    try {
      await logoutUser({ deviceInfo }).unwrap();
    } catch (error) {
      console.log("Logout error >>>", error?.response?.data || error.message);
    } finally {
      dispatch(removeUser());
      dispatch(authApi.util.resetApiState());
      dispatch(communityApi.util.resetApiState());
      handleLogout();
      navigate("/login");
    }
  };

  const navigateToLink = (page, title) => {
    if (page === "/settings") {
      navigate("/settings/notifications");
    } else {
      navigate(page);
    }
  };

  return (
    <div className="w-full h-full rounded-[10px] py-6 px-2 lg:px-5 flex flex-col items-start gap-y-6 bg-[#fff] custom-shadow relative overflow-hidden">
      <div>
        <img
          src="/logo.svg"
          alt="logo"
          className="w-full max-w-[144px] object-contain"
        />
      </div>
      <ul className="w-full flex flex-col gap-y-2">
        {PAGE_LINKS?.map((link, index) => {
          const isSettings = link.page === "/settings";
          const isActive = isSettings
            ? location.pathname.startsWith("/settings")
            : location.pathname === link.page ||
              location.pathname.startsWith(link.page + "/");

          return (
            <li className={`w-full text-black h-[49px]`} key={index}>
              <button
                type="button"
                // to={link?.page}
                onClick={() => navigateToLink(link.page, link.title)}
                className={`text-sm flex items-center gap-x-2.5 font-medium w-full h-[49px] px-4 rounded-[12px] outline-none ${
                  isActive
                    ? "bg-[var(--button-bg)] text-white"
                    : "bg-transparent text-black hover:bg-[var(--button-bg)] hover:text-white transition-all duration-300 group"
                }`}
              >
                <img
                  src={link?.icon}
                  alt={link?.iconAltTag}
                  width={link?.iconWidth}
                  height={link?.iconHeight}
                  className={`transition duration-300 group-hover:invert group-hover:brightness-0 ${
                    isActive ? "invert brightness-0" : "brightness-0 opacity-70"
                  }`}
                />
                <span>{link?.title}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <button
        type="button"
        onClick={handleLogoutUser}
        className={`absolute bottom-6 group text-sm font-medium w-full h-[49px] max-w-[145px] px-4 rounded-[12px] outline-none bg-[var(--button-bg)] text-white text-center`}
      >
        {isLoading ? <Loader /> : "Logout"}
      </button>
    </div>
  );
};

export default Sidebar;
