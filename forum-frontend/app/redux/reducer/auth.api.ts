import { SignUpRequest, SignUpResponse } from "@/app/types/user.type";
import { api } from "./api.config";

export const extendedApi = api.injectEndpoints({
    endpoints: (builder) => ({
      signUp: builder.mutation<SignUpResponse, SignUpRequest>({
        query: (body) => ({
          url: '/auth/signup',
          method: 'POST',
          body,
        }),
       
      }),

      login: builder.mutation<SignUpResponse, SignUpRequest>({
        query: (body) => ({
          url: '/auth/login',
          method: 'POST',
          body,
        }),
      }),
    }),
  });
  

export const { useSignUpMutation, useLoginMutation } = extendedApi;