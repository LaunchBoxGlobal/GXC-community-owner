import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";

export const communityApi = createApi({
  reducerPath: "communityApi",
  baseQuery: baseQuery,
  tagTypes: ["Communities"],
  endpoints: (builder) => ({
    // check slug availability mutation
    checkSlugAvailability: builder.query({
      query: (slug) => `/communities/check-slug/${slug}`,
    }),

    // add community
    addCommunity: builder.mutation({
      query: (data) => ({
        url: "/communities/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Communities"],
    }),

    // add community
    editCommunity: builder.mutation({
      query: ({ id, data }) => ({
        url: `/communities/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Communities", id }],
    }),

    // Get communities (pagination + search)
    getMyCommunities: builder.query({
      query: ({ page, limit, search }) => ({
        url: "/communities/my-communities",
        params: {
          page,
          limit,
          ...(search && { search }),
        },
      }),
      providesTags: ["Communities"],
    }),

    getCommunity: builder.query({
      query: (slug) => ({
        url: `/communities/${slug}/details`,
      }),
      providesTags: (result) => [
        { type: "Community", id: result?.data?.community?.id },
      ],
    }),

    toggleCommunityInvitationLink: builder.mutation({
      query: ({ communityId, inviteLinkActive }) => ({
        url: `/communities/${communityId}/toggle-invite`,
        method: "PUT",
        body: { inviteLinkActive },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Community", id: arg.communityId },
      ],
    }),

    getCommunityProducts: builder.query({
      query: ({ page, limit, search, communityId }) => ({
        url: `/communities/${communityId}/products`,
        params: {
          page,
          limit,
          ...(search && { search }),
        },
      }),
    }),

    getCommunityMembers: builder.query({
      query: ({ communityId, page, limit, search }) => ({
        url: `/communities/${communityId}/members`,
        params: {
          page,
          limit,
          ...(search && { search }),
        },
      }),
      providesTags: (result, error, arg) => [
        { type: "CommunityMembers", id: arg.communityId },
      ],
    }),

    getCommunityBannedMembers: builder.query({
      query: ({ communityId, page, limit, search }) => ({
        url: `/communities/${communityId}/banned-members`,
        params: {
          page,
          limit,
          ...(search && { search }),
        },
      }),
      providesTags: (result, error, arg) => [
        { type: "CommunityMembers", id: arg.communityId },
      ],
    }),

    removeUserFromCommunity: builder.mutation({
      query: ({ communityId, userId }) => ({
        url: `/communities/${communityId}/members/${userId}`,
        method: "DELETE",
        body: {},
      }),
      providesTags: (result, error, arg) => [
        { type: "CommunityMembers", id: arg.communityId },
      ],
    }),
  }),
});

export const {
  useLazyCheckSlugAvailabilityQuery,
  useGetMyCommunitiesQuery,
  useAddCommunityMutation,
  useEditCommunityMutation,
  useGetCommunityQuery,
  useToggleCommunityInvitationLinkMutation,
  useGetCommunityProductsQuery,
  useGetCommunityMembersQuery,
  useGetCommunityBannedMembersQuery,
  useRemoveUserFromCommunityMutation,
} = communityApi;
