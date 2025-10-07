import { baseApi } from "./baseApi";
const permissionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createPermission: builder.mutation({
      query: ({ userId, tenantDomain, data }) => ({
        url: `/permission/${userId}`,
        method: "POST",
        body: data,
        params: { tenantDomain },
      }),
      invalidatesTags: ["permission"],
    }),

    getAllPermissions: builder.query({
      query: ({ tenantDomain, limit, page, searchTerm }) => ({
        url: "/permission/my-permissions",
        method: "GET",
        params: { tenantDomain, limit, page, searchTerm },
      }),
      providesTags: ["permission"],
    }),

    getSinglePermission: builder.query({
      query: ({ tenantDomain, id }) => ({
        url: `/permission/single/${id}`,
        method: "GET",
        params: { tenantDomain },
      }),
      providesTags: ["permission"],
    }),

    updatePermission: builder.mutation({
      query: ({ userId, tenantDomain, id, data }) => ({
        url: `/permission/${userId}/${id}`,
        method: "PUT",
        body: data,
        params: { tenantDomain },
      }),
      invalidatesTags: ["permission"],
    }),

    deletePermission: builder.mutation({
      query: ({ tenantDomain, id }) => ({
        url: `/permission/${id}`,
        method: "DELETE",
        params: { tenantDomain },
      }),
      invalidatesTags: ["permission"],
    }),
  }),
});

export const {
  useCreatePermissionMutation,
  useGetAllPermissionsQuery,
  useGetSinglePermissionQuery,
  useUpdatePermissionMutation,
  useDeletePermissionMutation,
} = permissionApi;
