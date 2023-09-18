import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from '../services/rtkInterceptor/insctence';
import { getRtkHook } from './customHook/rtkHook';

export const cartService = createApi({
    reducerPath: 'cart',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['cart', 'count'],
    endpoints: (builder) => ({
        addProduct: builder.mutation({
            query: (body) =>getRtkHook('add' , 'POST' , body),
            invalidatesTags: ['cart'],
        }),
        getCount: builder.query({
            query:()=>({
                url: 'count',
                method:'get'
            }),
            providesTags: ['cart']
        }),
        getCartItems: builder.query({
            query:()=>getRtkHook('cartItems', 'get'),
            providesTags: ['cart']
        }),
        incrementQuentity: builder.mutation({
            query:(id)=>getRtkHook('incrementquentity' , 'POST' , {id}), 
            invalidatesTags: ['cart'],
        }),
        decrementQuentity: builder.mutation({
            query: (id) => getRtkHook("decrementquentity" ,'POST' , {id}),
            invalidatesTags: ['cart'],
        }),
        removeItem: builder.mutation({
            query: (id) => getRtkHook('remove', 'DELETE' , {id}), 
            invalidatesTags: ['cart'],
        }),
        clearCart : builder.mutation({
            query :()=>getRtkHook('clearCart' , 'DELETE' ),
            invalidatesTags: ['cart' ],
        }),

    }),
});

export const { useAddProductMutation, useGetCountQuery, useGetCartItemsQuery, useIncrementQuentityMutation,useClearCartMutation, useDecrementQuentityMutation ,useRemoveItemMutation} = cartService;