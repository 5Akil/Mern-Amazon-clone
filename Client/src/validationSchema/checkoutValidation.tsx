import * as Yup from "yup";


export const checkOutSchema = (states, cities) => {

    return (
        Yup.object({
            userName: Yup.string().trim().min(2).max(25).required("Please enter your name"),
            mobile_number: Yup.string().matches(/^[6-9]\d{9}$/, 'Invalid phone number').required("please enter your Phone number"),
            address: Yup.string().trim().required("Please Enter your address"),
            country: Yup.string().required("Please Select Country "),
            state: states?.length > 0 ? Yup.string().required("Please Select state ") : Yup.string(),
            city: cities?.length > 0 ? Yup.string().required("Please Select City ") : Yup.string(),
            pincode: Yup.string().trim().matches(/^[1-9]\d{5}$/ , 'Invalid pincode').required("please enter your area pincode"),
            default:Yup.boolean()
        })
    )
} 