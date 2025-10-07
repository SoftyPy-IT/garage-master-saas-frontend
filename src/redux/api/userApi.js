import { baseApi } from "./baseApi";

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createUser: builder.mutation({
      query: (data) => ({
        url: "/user",
        method: "POST",
        body: data,
      }),
    }),



    deleteUser: builder.mutation({
      query: ({ tenantDomain, id }) => ({
        url: `/user/${id}`,
        method: "DELETE",
        params: { tenantDomain },
      }),
      invalidatesTags: ["user"],
    }),
    getAllUser: builder.query({
      query: ({ tenantDomain, limit, page, searchTerm }) => ({
        url: `/user`,
        method: "GET",
        params: { tenantDomain, limit, page, searchTerm },
      }),
      providesTags: ["user"],
    }),
    updateUser: builder.mutation({
      query: ({ id, data, tenantDomain }) => ({
        url: `/user/${id}`,
        method: "PATCH",
        body: data,
        params: { tenantDomain },
      }),
      invalidatesTags: ["user"],
    }),
    getAllContactUser: builder.query({
      query: ({ limit, page, searchTerm }) => ({
        url: `/contact`,
        method: "GET",
        params: { limit, page, searchTerm },
      }),
      providesTags: ["contact"],
    }),
    deleteContactUser: builder.mutation({
      query: ({ id }) => ({
        url: `/contact/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["contact"],
    }),
  }),
});

export const {
  useCreateUserMutation,
  useGetAllUserQuery,
  useDeleteUserMutation,
  useGetAllContactUserQuery,
  useDeleteContactUserMutation,
  useUpdateUserMutation
} = userApi;
