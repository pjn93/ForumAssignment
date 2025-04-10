/* eslint-disable @typescript-eslint/no-unused-vars */
import { getCookie } from '../../utils/cookie.utils'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const api = createApi({
  reducerPath: 'apis',
  tagTypes: ['forum'],
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8001/api',
    prepareHeaders: (headers) => {
      if (getCookie('token')) headers.set('Authorization', `Bearer ${getCookie('token')}`)
      return headers
    }
  }),
  endpoints: (builder) => ({}),
})
