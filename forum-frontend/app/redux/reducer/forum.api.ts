import { CreateForumRequest, ForumsResponse } from "@/app/types/forum.type";
import { api } from "./api.config";


export const extendedApi = api.injectEndpoints({
    endpoints: (builder) => ({
      addForum: builder.mutation<ForumsResponse, CreateForumRequest>({
        query: (body) => ({
          url: '/forum/createForum',
          method: 'POST',
          body,
        }),
        invalidatesTags: ['forum'],
      }),

      getForums: builder.query<ForumsResponse, void>({
        query: () => '/forum/getForums',
        providesTags: ['forum'], // For cache tagging
      }),

      deleteForum: builder.mutation<{ success: boolean; message: string }, number>({
        query: (id) => ({
          url: `/forum/deleteForum/${id}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['forum'], // To refetch forums after deletion
      }),
      
      updateForum: builder.mutation<ForumsResponse, { id: number, data: CreateForumRequest }>({
        query: ({ id, data }) => ({
          url: `/forum/updateForum/${id}`,
          method: 'PUT',
          body: data,
        }),
        invalidatesTags: ['forum'],
      }),
    }),
  });
  

export const { useAddForumMutation, useGetForumsQuery, useDeleteForumMutation, useUpdateForumMutation } = extendedApi;