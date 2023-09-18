import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '../Store/Slices/hooks';
import { useEffect } from 'react';

interface ProtectedProps {
    Component: React.FC;
}
const Protected = (props: ProtectedProps) => {
    const { Component } = props
    const { email } = useAppSelector((state) => state.user)
    const navigate = useNavigate()

    useEffect(() => {
        if (!email) {
            navigate('/login')
        }
    }, [email])
    return (
        <Component />
    )
}

export default Protected