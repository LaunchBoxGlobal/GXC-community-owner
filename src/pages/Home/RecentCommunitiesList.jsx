import { useEffect, useState } from "react";
import CommunityCard from "../../components/Common/CommunityCard";
import AddCommunity from "../Communities/AddCommunity";
import CommunitySuccessPopup from "../Communities/CommunitySuccessPopup";
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
  const [loading, setLoading] = useState(false);
  const [communities, setCommunities] = useState(null);

  const fetchCommunities = async () => {
    setLoading(true);
    try {
      const endpoint = `${BASE_URL}/communities/my-communities`;

      const res = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      // console.log(res?.data?.data);

      setCommunities(res?.data?.data?.communities || []);
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

      {loading ? (
        <PageLoader />
      ) : (
        <>
          {communities && communities.length > 0 ? (
            <div className="w-full mt-5 lg:mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {communities.map((community, index) => (
                <CommunityCard community={community} key={index} />
              ))}
            </div>
          ) : (
            <div className="w-full mt-5">
              <p>You have not created any community yet.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RecentCommunitiesList;
