import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../../data/baseUrl";
import { getToken } from "../../utils/getToken";
import { handleApiError } from "../../utils/handleApiError";

const MemberDetails = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);

  const fetchMemberDetails = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/communities/${params?.communityId}/members/${params?.userId}/details`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      console.log(res?.data);
      setMember(res?.data?.data);
    } catch (error) {
      console.log(error);
      handleApiError(error, navigate);
    }
  };

  useEffect(() => {
    fetchMemberDetails();
  }, []);
  return (
    <div>
      <div className="w-full bg-white custom-shadow rounded-lg md:rounded-xl lg:rounded-[24px] p-7 mt-5 flex items-center justify-between flex-wrap gap-6 lg:gap-0">
        <div className="w-full lg:w-[70%] flex items-center gap-2">
          <div className="">
            {member?.member?.profilePicture ? (
              <img
                className="min-h-[84px] min-w-[84px] lg:w-[116px] lg:h-[116px] rounded-full object-cover object-center"
                src={member?.member?.profilePictureUrl}
                alt=""
              />
            ) : (
              <img
                className="min-h-[84px] min-w-[84px] lg:w-[116px] lg:h-[116px] rounded-full object-cover object-center"
                src={"/profile-icon.png"}
                alt=""
              />
            )}
          </div>
          <div className="">
            <h2 className="text-[27] lg:text-[32px] font-semibold leading-none">
              {member?.member?.firstName} {member?.member?.lastName}
            </h2>
            <div className="flex items-center gap-x-4 flex-wrap justify-start">
              {member?.member?.email && (
                <p className="text-sm lg:text-base text-[var(--secondary-color)] leading-[1.3] mt-2">
                  {member?.member?.email}
                </p>
              )}
              {member?.member?.phone && (
                <p className="text-sm lg:text-base text-[var(--secondary-color)] leading-[1.3] mt-2">
                  +{member?.member?.phone}
                </p>
              )}
              {member?.member?.address && (
                <p className="text-sm lg:text-base text-[var(--secondary-color)] leading-[1.3] mt-2">
                  {member?.member?.address}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="w-full lg:w-[30%] flex items-center justify-end gap-10">
          {/* <button type="button" className="button max-w-[150px]">
            Disable
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default MemberDetails;
