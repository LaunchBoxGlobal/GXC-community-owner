import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../../data/baseUrl";
import { getToken } from "../../utils/getToken";
import { handleApiError } from "../../utils/handleApiError";
import PageLoader from "../../components/Loader/PageLoader";
import ProductCard from "../../components/Common/ProductCard";

const MemberDetails = () => {
  const params = useParams();
  const navigate = useNavigate();

  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchMemberDetails = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await axios.get(
        `${BASE_URL}/communities/${params?.communityId}/members/${params?.userId}/details`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      setMember(res?.data?.data);
    } catch (error) {
      setErrorMsg(
        error?.response?.data?.message || "Failed to load member details."
      );
      handleApiError(error, navigate);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemberDetails();
  }, []);

  // ----- UI States -----
  if (loading) {
    return (
      <div className="w-full bg-white custom-shadow rounded-[10px] p-7 mt-5 min-h-[70vh] flex items-center justify-center">
        <PageLoader />
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="w-full bg-white custom-shadow rounded-[10px] p-7 mt-5 min-h-[70vh] flex items-center justify-center">
        <p className="text-red-500 font-medium">{errorMsg}</p>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="w-full bg-white custom-shadow rounded-[10px] p-7 mt-5 min-h-[70vh] flex items-center justify-center">
        <p className="text-gray-500">No member details found.</p>
      </div>
    );
  }

  // ----- Main Render -----
  return (
    <div className="w-full">
      <div className="w-full bg-white custom-shadow rounded-lg md:rounded-xl lg:rounded-[24px] p-7 mt-5 flex items-center justify-between flex-wrap gap-6 lg:gap-0">
        <div className="w-full lg:w-[70%] flex items-center gap-2">
          <div>
            <img
              className="min-h-[84px] min-w-[84px] lg:w-[116px] lg:h-[116px] rounded-full object-cover object-center"
              src={member?.member?.profilePictureUrl || "/profile-icon.png"}
              alt="Profile"
            />
          </div>

          <div>
            <h2 className="text-[27px] lg:text-[32px] font-semibold leading-none">
              {member?.member?.firstName} {member?.member?.lastName}
            </h2>

            <div className="flex items-center gap-x-4 flex-wrap justify-start mt-2">
              {member?.member?.email && (
                <p className="text-sm lg:text-base text-[var(--secondary-color)]">
                  {member?.member?.email}
                </p>
              )}
              {member?.member?.phone && (
                <p className="text-sm lg:text-base text-[var(--secondary-color)]">
                  +{member?.member?.phone}
                </p>
              )}

              <div className="w-full flex items-center gap-2 gap-y-3 flex-wrap">
                {member?.member?.address && (
                  <p className="text-sm lg:text-base text-[var(--secondary-color)]">
                    {member?.member?.address}
                  </p>
                )}
                {member?.member?.city && (
                  <p className="text-sm lg:text-base text-[var(--secondary-color)]">
                    {member?.member?.city}
                  </p>
                )}
                {member?.member?.state && (
                  <p className="text-sm lg:text-base text-[var(--secondary-color)]">
                    {member?.member?.state}
                  </p>
                )}
                {member?.member?.country && (
                  <p className="text-sm lg:text-base text-[var(--secondary-color)]">
                    {member?.member?.country}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-[30%] flex items-center justify-end gap-10">
          {/* Add future actions here */}
        </div>
      </div>

      {member &&
        member?.productsListed &&
        member?.productsListed?.length > 0 && (
          <div className="w-full mt-10">
            <div className="w-full">
              <h2 className="page-heading">Products</h2>

              <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-6">
                {member?.productsListed?.map((product, index) => {
                  return <ProductCard product={product} key={index} />;
                })}
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default MemberDetails;
