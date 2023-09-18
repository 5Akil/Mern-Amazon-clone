

import { fetchBaseQuery } from '@reduxjs/toolkit/dist/query';
import { setUser } from '../../Store/Slices/userAuth';
import { Mutex } from 'async-mutex'

interface user {
    email: string,
    userName: string,
    accessToken: string,
    refreshToken: string
}


const userJSON = localStorage?.getItem("user");
const user: user = userJSON ? JSON.parse(userJSON) : null;

const refreshToken = user?.refreshToken
// console.log(refreshToken);

const mutex = new Mutex()
const baseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_SERVER_BASE_URL,
    prepareHeaders: (headers) => {
        const token = user?.accessToken;
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    }

})


// Error handling
export const baseQueryWithReauth = async (args: any, api?: any, extraOptions?: any) => {

    // wait until the mutex is available without locking it
    await mutex.waitForUnlock()

    let result = await baseQuery(args, api, extraOptions)

    if (result.error && result.error.status === 401) {

        if (user && refreshToken) {

            // checking whether the mutex is locked
            if (!mutex.isLocked()) {
                const release = await mutex.acquire()
                try {
                    const refreshResult: any = await baseQuery(`/getnewaccesstoken/${refreshToken}`, api, extraOptions);

                    if (refreshResult.error && refreshResult.error?.status === 403) {
                        localStorage.clear()
                        api.dispatch(setUser(null))
                    }
                    user.accessToken = refreshResult?.data?.newAccessToken

                    localStorage.setItem('user', JSON.stringify(user));
                    const retryResult = await baseQuery(args, api, extraOptions)
                    return retryResult;
                } finally {
                    release()
                }
            }
            else {
                // wait until the mutex is available without locking it
                await mutex.waitForUnlock()
                result = await baseQuery(args, api, extraOptions)
            }
        }

    }
    return result
}

