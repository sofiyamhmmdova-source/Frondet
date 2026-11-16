import { apiSlice } from '../../app/apiSlice'

export const coursesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCourses: builder.query({
      query: () => '/courses',
    }),
    login: builder.mutation({
      query: (credentials: { email: string; password: string }) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation({
      query: (payload: { name: string; email: string; password: string }) => ({
        url: '/auth/register',
        method: 'POST',
        body: payload,
      }),
    }),
    getDashboard: builder.query({
      query: () => '/dashboard',
    }),
  }),
})

export const { useGetCoursesQuery, useLoginMutation, useRegisterMutation, useGetDashboardQuery } = coursesApi
