import * as Yup from "yup";


const getCharacterValidationError = (str : string) => {
    return `Your password must have at least 1 ${str} character`;
  };

export const loginValidation = () => {
    return (
        Yup.object({
            email: Yup.string().email().trim().required("Please enter your email"),
            password: Yup.string().trim()                                                     //new password
            .required("Please enter a password")
            // check minimum characters
            .min(8, "Password must have at least 8 characters")
            // different error messages for different requirements
            .matches(/[0-9]/, getCharacterValidationError("digit"))
            .matches(/[a-z]/, getCharacterValidationError("lowercase"))
            .matches(/[A-Z]/, getCharacterValidationError("uppercase"))
            .matches(/[^\w]/, 'Password requires a symbol'),
        })
    )
} 