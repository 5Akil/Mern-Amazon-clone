import {createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from './rtkInterceptor/insctence';
import { getRtkHook } from './customHook/rtkHook';


export const orderService = createApi({
    reducerPath : 'order',
    baseQuery: baseQueryWithReauth,
    endpoints:(builder)=>({
        placeOrder : builder.mutation({
            query :(body)=>getRtkHook('placeOrder' , 'POST' , body)
        }),
        makePayment : builder.mutation({
            query : (body)=>getRtkHook('makePayment','POST' , body)
        }),
        makePaymentIntent : builder.mutation({
            query:(body)=>getRtkHook('create-payment-intent' , 'POST' , body)
        }),
        verifyPromotionalCode : builder.mutation({
            query :(body)=>getRtkHook('verifyPromotionalCode','POST' , body)
        }),
      
    }),
});

export const {usePlaceOrderMutation , useMakePaymentMutation , useMakePaymentIntentMutation ,useVerifyPromotionalCodeMutation }  = orderService;