import { baseApi } from "./baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    tenantLogin: builder.mutation({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["tenant"],
    }),

  }),
});

export const { useTenantLoginMutation, useGetUserInfoQuery } = authApi;
