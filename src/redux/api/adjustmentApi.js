import { baseApi } from "./baseApi";

const adjustmentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createAdjustment: builder.mutation({
      query: (incomeInfo) => ({
        url: "/adjustment",
        method: "POST",
        body: incomeInfo,
      }),
      invalidatesTags: ["adjustment"],
    }),

    getAllIAdjustment: builder.query({
      query: (args) => {
        const params = new URLSearchParams();

        if (args) {
          args.forEach((item) => {
            params.append(item.name, item.value);
          });
        }

        return {
          url: "/adjustment",
          method: "GET",
          params: params,
        };
      },
      transformResponse: (response) => {
        return {
          data: response.data,
        };
      },
      providesTags: ["adjustment"],
    }),

    getSingleAdjustment: builder.query({
      query: (id) => ({
        url: `/adjustment/${id}`,
        method: "GET",
      }),
      providesTags: ["adjustment"],
    }),
    updateAdjustment: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/adjustment/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["adjustment"],
    }),

    deleteAdjustment: builder.mutation({
      query: (id) => ({
        url: `/adjustment/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["adjustment"],
    }),
  }),
});

export const {
  useCreateAdjustmentMutation,
  useGetAllIAdjustmentQuery,
  useGetSingleAdjustmentQuery,
  useUpdateAdjustmentMutation,
  useDeleteAdjustmentMutation,
} = adjustmentApi;
