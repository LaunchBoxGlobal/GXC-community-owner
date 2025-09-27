import { useEffect, useRef, useState } from "react";
import Sidebar from "./Sidebar";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../data/baseUrl";
import { getToken } from "../../utils/getToken";
import { useAppContext } from "../../context/AppContext";
import Cookies from "js-cookie";

const DashboardLayout = ({ pages }) => {
  const sidebarRef = useRef(null);
  const navigate = useNavigate();
  // const [user, setUser] = useState(null);
  const [isOpen, setisOpen] = useState(false);
  const { user, setUser } = useAppContext();

  const toggleModal = () => {
    setisOpen(!isOpen);
  };

  const handleLogout = () => {
    navigate("/profile");
  };

  const fetchUserProfile = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      // console.log("profile >>>", res?.data?.data?.user);
      setUser(res?.data?.data?.user);
      if (!res?.data?.data?.user?.emailVerified) {
        Cookies.remove(`token`);
        Cookies.remove(`user`);
        navigate("/login");
      }
    } catch (error) {
      console.error("Unauthorized: Token expired or invalid.");
      localStorage.removeItem("token");
      Cookies.remove("token");
      navigate("/login");
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return (
    <div className="w-screen h-screen flex justify-start items-start">
      <div
        onClick={toggleModal}
        className={`w-screen h-screen fixed top-0 left-0 transition-all duration-500  ${
          isOpen ? " lg:translate-x-0" : "-translate-x-full lg:translate-x-0"
        } lg:static  z-[2000] lg:z-auto lg:w-60 xl:w-72 flex flex-col gap-3 items-center justify-start py-0 lg:h-full `}
      >
        <div
          ref={sidebarRef}
          className={`fixed top-0 left-0 transition-all duration-200  ${
            isOpen ? " lg:translate-x-0" : "-translate-x-full lg:translate-x-0"
          } lg:static w-[60%] z-[2000] lg:z-auto py-5 pl-5 lg:w-60 xl:w-72 flex flex-col gap-3 items-center justify-start h-full bg-white`}
        >
          <Sidebar />
        </div>
      </div>

      <div className="w-full relative lg:w-[calc(100%-15rem)] xl:w-[calc(100%-18rem)] h-full  overflow-y-auto overflow-x-hidden p-5 bg-white">
        <div className="sticky top-0 left-0 w-full h-[94px] bg-[#EAEAEA] flex items-center justify-between lg:justify-end px-4 z-20 rounded-[10px]">
          <button
            onClick={() => setisOpen((prev) => !prev)}
            className="lg:hidden block"
          >
            <HiOutlineMenuAlt2 className="text-2xl" />
          </button>
          {/* <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-[#5C5C5C] text-sm flex items-center gap-1"
          >
            <HiOutlineArrowLeft className="text-black text-base" /> Back
          </button> */}
          <button
            type="button"
            onClick={handleLogout}
            className="flex gap-3 items-center py-4 font-normal text-gray-900"
          >
            <p className="font-semibold text-gray-700 leading-tight">
              {user?.fullName}
            </p>
            <div>
              {user?.profilePicture ? (
                <img
                  class="h-[54px] min-w-[54px] max-w-[54px] rounded-full object-cover object-center"
                  src={user?.profilePictureUrl}
                  alt=""
                />
              ) : (
                <img
                  class="h-[54px] min-w-[54px] max-w-[54px] rounded-full object-cover object-center"
                  src={"/profile-icon.png"}
                  alt=""
                />
              )}
            </div>
          </button>
        </div>
        <div className="w-full pt-6 text-black">{pages}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
