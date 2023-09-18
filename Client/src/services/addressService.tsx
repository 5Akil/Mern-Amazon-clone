import {createApi } from '@reduxjs/toolkit/query/react'
import { getRtkHook } from './customHook/rtkHook';
import { baseQueryWithReauth } from './rtkInterceptor/insctence';


export const addressService = createApi({
    reducerPath : 'region',
    tagTypes:['address'],
    baseQuery: baseQueryWithReauth,
    endpoints:(builder)=>({
        addAddress : builder.mutation({
            query:(body)=> getRtkHook( 'address' , 'POST' , body),
            invalidatesTags:['address']
        }),
        getAllAddress: builder.query({
            query:()=>getRtkHook('getAllAddress', 'get'),
            providesTags:['address']
        }),
        getAddress:builder.query({
            query:(id)=>getRtkHook(`getAddress/${id}` ,'GET' ),
            providesTags:['address'],
        }),
        editAddress:builder.mutation({
            query:({id , ...body})=> getRtkHook( `editAddress/${id}` , 'POST' , body),
            invalidatesTags:['address']
        }),

    }),
});

export const { useAddAddressMutation ,useGetAllAddressQuery , useGetAddressQuery ,useEditAddressMutation} = addressService;