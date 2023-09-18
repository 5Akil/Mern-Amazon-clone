import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getRtkHook } from './customHook/rtkHook';
// import { baseQueryWithReauth } from './rtkInterceptor/insctence';


export const userService = createApi({
    reducerPath: 'userService',
    baseQuery: fetchBaseQuery({baseUrl:`${import.meta.env.VITE_SERVER_BASE_URL}`  }),
    tagTypes: ['user'],
    endpoints: (builder) => ({
        getUser: builder.mutation({
            query: () => getRtkHook('getUser', 'POST' ),
            invalidatesTags:['user']
        }),
        registration: builder.mutation({
            query: (body) => getRtkHook('registration', 'POST', body),
        }),
        verifyEmail: builder.query({
            query: (id) => getRtkHook(`verify/${id}`, 'GET'),
        }),
        loginUser: builder.mutation({
            query: (body) => getRtkHook('loginuser', 'POST', body),
            invalidatesTags:['user']
        }),
       

    }),
});

export const { useRegistrationMutation, useVerifyEmailQuery, useLoginUserMutation, useGetUserMutation  , useVerifyPromotionalCodeMutation } = userService;



