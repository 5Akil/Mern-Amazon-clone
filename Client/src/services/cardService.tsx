import {createApi } from '@reduxjs/toolkit/query/react'
import { getRtkHook } from './customHook/rtkHook';
import { baseQueryWithReauth } from './rtkInterceptor/insctence';


export const cardService = createApi({
    reducerPath : 'cards',
    baseQuery: baseQueryWithReauth,
    tagTypes:['cards'],
    endpoints:(builder)=>({
        addCard : builder.mutation({
            query :(body)=>getRtkHook('addCard' , "POST" , body),
            invalidatesTags:['cards']
        },
        ),
        getCards : builder.query({
            query: (customerID)=>getRtkHook(`getCards/${customerID}` , 'GET' ),
            providesTags:['cards']
        })
    }),
});

export const {useAddCardMutation , useGetCardsQuery} = cardService;