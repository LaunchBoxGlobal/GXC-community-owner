import ProductList from "./ProductList";
import MemberList from "./MemberList";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import CommunityLinkCopy from "./CommunityLinkCopy";
import PageLoader from "../../components/Loader/PageLoader";
import EditCommunity from "./EditCommunity";
import CommunityHeader from "./CommunityHeader";
import CommunityTabs from "./CommunityTabs";
import { useGetCommunityQuery } from "../../services/communityApi/communityApi";

const CommunityPage = () => {
  const [searchParams] = useSearchParams();
  const [copyLinkPopup, setCopyLinkPopup] = useState(false);
  const [showCopyLinkPopup, setShowCopyLinkPopup] = useState(false);
  const { slug } = useParams();
  const [showEditCommunityPopup, setShowEditCommunityPopup] = useState(false);

  const allowedTabs = ["products", "members"];
  const activeTab = allowedTabs.includes(searchParams.get("activeTab"))
    ? searchParams.get("activeTab")
    : "products";

  // get community details by slug
  const { data, error, isError, isLoading, refetch } = useGetCommunityQuery(
    slug,
    {
      skip: !slug,
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
    }
  );

  const community = data?.data || null;
  const isCommunitySuspended = data?.data?.community?.isDeactivatedByAdmin;

  useEffect(() => {
    document.title = "Community Details - giveXchange";
  }, []);

  if (isLoading) {
    return <PageLoader />;
  }

  if (error || isError) {
    return (
      <div className="w-full min-h-[80vh] relative flex items-center justify-center bg-white rounded-[12px] custom-shadow">
        <p className="text-gray-500 text-sm">
          {error?.data?.message || "Something went wrong."}
        </p>
      </div>
    );
  }

  return (
    <main className="w-full p-5 rounded-[10px] min-h-[80vh] bg-white custom-shadow">
      <CommunityHeader
        community={community}
        loading={isLoading}
        setShowEditCommunityPopup={setShowEditCommunityPopup}
        setShowCopyLinkPopup={setShowCopyLinkPopup}
        isCommunitySuspended={isCommunitySuspended}
        refetch={refetch}
      />

      {isCommunitySuspended ? (
        <div className=" min-h-[80vh] bg-white custom-shadow rounded-[12px] flex items-center justify-center mt-6">
          <p className="text-sm">This community has been suspended by admin.</p>
        </div>
      ) : (
        <>
          {/* tabs Products / Members */}
          <CommunityTabs activeTab={activeTab} />

          <div className="w-full mt-6 min-h-[40vh]">
            {activeTab === "products" && (
              <ProductList community={community?.community} />
            )}

            {activeTab === "members" && (
              <MemberList communityId={community?.community?.id} />
            )}
          </div>
        </>
      )}

      {/* Copy invitation link modal */}
      <CommunityLinkCopy
        copyLinkPopup={copyLinkPopup}
        setCopyLinkPopup={setCopyLinkPopup}
        setShowCopyLinkPopup={setShowCopyLinkPopup}
        showCopyLinkPopup={showCopyLinkPopup}
        slug={slug}
      />

      {/* edit community modal */}
      <EditCommunity
        setShowEditCommunityPopup={setShowEditCommunityPopup}
        showEditCommunityPopup={showEditCommunityPopup}
        community={community?.community}
        fetchCommunityDetails={refetch}
      />
    </main>
  );
};

export default CommunityPage;
