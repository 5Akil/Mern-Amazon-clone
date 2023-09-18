import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useVerifyEmailQuery } from "../services/userService";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelopeCircleCheck } from '@fortawesome/free-solid-svg-icons';



function EmailVerificationPage() {
    const navigate = useNavigate();
    const { userId } = useParams();
    const [alreadyVerified, setAlreadyVerified] = useState(false)
    const response = useVerifyEmailQuery(userId)

    const handleClick = () => {
        navigate("/login")
    }

    useEffect(() => {
        if (response.status === "fulfilled") {
            setAlreadyVerified(false)
        } else if (response.status === "rejected") {
            setAlreadyVerified(true);
        }
    }, [response])

    return (
        <div className="login" style={{ textAlign: "center" }}>
            <Link to="/">
                <img
                    className="login_logo"
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1024px-Amazon_logo.svg.png"
                    alt=""
                />
            </Link>
            <div className="login_container " style={{ marginTop: "100px" }}>
                {
                    alreadyVerified ?
                        <>
                            <FontAwesomeIcon icon={faEnvelopeCircleCheck} fade style={{ color: "green", fontSize: "80px" }} />
                            <h5 >Your Email was verified . You can Continue using the application</h5>
                        </>
                        :
                        <>
                            <FontAwesomeIcon icon={faEnvelopeCircleCheck} fade style={{ color: "green", fontSize: "80px" }} />
                            <h5>Email varification Done</h5>
                        </>
                }
                <button className="login_signInButton" type='button' onClick={handleClick}>
                    Sign in
                </button>
            </div>
        </div>
    );
}

export default EmailVerificationPage;
