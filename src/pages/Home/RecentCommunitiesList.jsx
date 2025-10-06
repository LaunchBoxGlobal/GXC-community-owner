import { useEffect, useState } from "react";
import CommunityCard from "../../components/Common/CommunityCard";
import AddCommunity from "../Communities/AddCommunity";
import CommunitySuccessPopup from "../Communities/CommunitySuccessPopup";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../data/baseUrl";
import { getToken } from "../../utils/getToken";
import { handleApiError } from "../../utils/handleApiError";
import PageLoader from "../../components/Loader/PageLoader";

const RecentCommunitiesList = ({
  showAddCommunityPopup,
  setShowAddCommunityPopup,
  setCommunityUrl,
  showSuccessPopup,
  setShowSuccessPopup,
  toggleCommunityPopup,
  handleCloseSuccessPopup,
}) => {
  const navigate = useNavigate();
  const [communities, setCommunities] = useState(null);
  const [total, setTotal] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCommunities = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/communities/my-communities`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      setCommunities(res?.data?.data?.communities);
      setTotal(res?.data?.data?.total);
    } catch (error) {
      handleApiError(error, navigate);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunities();
  }, []);

  

  return (
    <div className="w-full">
      <AddCommunity
        showPopup={showAddCommunityPopup}
        setCommunityUrl={setCommunityUrl}
        togglePopup={toggleCommunityPopup}
        setShowAddCommunityPopup={setShowAddCommunityPopup}
        setShowSuccessPopup={setShowSuccessPopup}
      />
      <CommunitySuccessPopup
        showPopup={showSuccessPopup}
        togglePopup={handleCloseSuccessPopup}
      />
      {/* search & add new community */}

      {loading ? (
        <PageLoader />
      ) : (
        <>
          {total && total > 0 ? (
            <div className="w-full mt-5 lg:mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {communities?.map((community, index) => {
                return <CommunityCard community={community} key={index} />;
              })}
            </div>
          ) : (
            <div className="w-full mt-5">
              <p className="">You have not created any community yet.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RecentCommunitiesList;
