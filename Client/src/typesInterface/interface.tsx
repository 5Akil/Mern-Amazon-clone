export interface item {
    cartItemID: number;
    quantity: number;
    productID: {
        productID: number;
        title: string;
        price: number;
        description: string;
        category: string;
        image: string;
        rating_rate: string;
        rating_count: number;
    };
}


export interface basket {
    id: number;
    description: string;
    image: string;
    price: number,
    title: string,
    quantity: number,
}

export interface address{
    address:string;
    city:string;
    state:string;
    postalCode:number,
    id:number,
    country:string;
    isDefault:Boolean;
    userID:{
        email:string;
        id:number;
        isVerified: boolean;
        userName:string
    }
}

export interface states {
    name:string;
}