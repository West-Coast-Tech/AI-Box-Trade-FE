import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import API from '../../utils/API';
import { useSelector } from 'react-redux';
import { AppState } from '../../redux/types';
import { useNavigate } from 'react-router-dom';
const PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_TEST_PUBLISHABLE_KEY;

const stripePromise = loadStripe(PUBLISHABLE_KEY);

interface DirectSubscriptionButtonProps {
    userId: string;
    plan: 'basic' | 'full';
}

const DirectSubscriptionButton: React.FC<DirectSubscriptionButtonProps> = ({ userId, plan }) => {
    const navigate = useNavigate();
    const isAuthenticated = useSelector((state: AppState) => state.auth.isAuthenticated);
    const handleDirectSubscription = async () => {
        try {
            const res = await API.getDirectSubscriptionSession(userId, plan);
            const sessionId = await res.data.sessionId;
            if (!sessionId) {
                console.error('No session ID received');
                return;
            }
            const stripe = await stripePromise;
            const error = await stripe?.redirectToCheckout({ sessionId });
            if (error) console.error('Stripe redirect error:', error);
        } catch (err) {
            console.error('Error with direct subscription:', err);
        }
    };
    const handleOnClick = () => {
        if (isAuthenticated) {
            handleDirectSubscription();
            return;
        } else if (!isAuthenticated) {
            navigate('/auth/cover-register');
            return;
        }
    };
    return (
        <button onClick={handleOnClick} className="btn btn-primary w-full">
            Subscribe Now
        </button>
    );
};

export default DirectSubscriptionButton;
