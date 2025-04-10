import { api } from "./api.config";


export const extendedApi = api.injectEndpoints({
    endpoints: (builder) => ({
      createComment: builder.mutation({
        query: ({ forumId, content }) => ({
          url: `/comments/${forumId}`, // 👈 matches your API
          method: "POST",
          body: { content },
        }),
        invalidatesTags: ['forum'],
      }),

      deleteComment: builder.mutation<{ success: boolean; message: string }, number>({
        query: (commentId) => ({
          url: `/comments/${commentId}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['forum'],
      }),
 
      
    }),
  });
  

export const { useCreateCommentMutation, useDeleteCommentMutation } = extendedApi;