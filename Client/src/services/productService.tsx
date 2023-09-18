import {createApi , fetchBaseQuery} from '@reduxjs/toolkit/query/react'


export const productService = createApi({
    reducerPath : 'allProducts',
    baseQuery: fetchBaseQuery({baseUrl:`${import.meta.env.VITE_SERVER_BASE_URL}`}),
    endpoints:(builder)=>({
        getAllProducts : builder.query({
            query:() =>({
                url:'products',
                method: 'GET',
            })
            })
    }),
});

export const {useGetAllProductsQuery} = productService;