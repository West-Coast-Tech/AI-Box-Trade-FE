import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import API from '../../utils/API';
const PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_TEST_PUBLISHABLE_KEY;

const stripePromise = loadStripe(PUBLISHABLE_KEY);

interface DirectSubscriptionButtonProps {
    userId: string;
    plan: 'basic' | 'full';
}

const DirectSubscriptionButton: React.FC<DirectSubscriptionButtonProps> = ({ userId, plan }) => {
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

    return (
        <button onClick={handleDirectSubscription} className="btn btn-primary w-full">
            Subscribe Now ({plan})
        </button>
    );
};

export default DirectSubscriptionButton;
