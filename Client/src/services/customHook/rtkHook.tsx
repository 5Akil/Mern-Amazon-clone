
const getToken = ()=>{
    const userJson = localStorage.getItem('user')
        const user = userJson ? JSON.parse(userJson) : null;
        const token = user ? user.accessToken : null;

    return token;
}


export const getRtkHook = (url: string, method: string, body?: any) => {
    
    const token = getToken()

    const headers: Record<string, string> = {
        'Content-Type': 'application/json', // You can adjust this as needed
    };

    // If a token exists, add it to the headers
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    return {
        url,
        method,
        body,
        headers
    };
};

