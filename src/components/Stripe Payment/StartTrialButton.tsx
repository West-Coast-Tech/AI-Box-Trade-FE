import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import API from '../../utils/API';
const PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_TEST_PUBLISHABLE_KEY;
const stripePromise = loadStripe(PUBLISHABLE_KEY);

interface StartTrialButtonProps {
    userId: string;
    plan: 'basic' | 'full';
}

const StartTrialButton: React.FC<StartTrialButtonProps> = ({ userId, plan }) => {
    const handleStartTrial = async () => {
        try {
            const res = await API.getTrialSetupSession(userId, plan);
            console.log(res);
            const sessionId = await res.data.sessionId;
            if (!sessionId) {
                console.error('No session ID received');
                return;
            }
            const stripe = await stripePromise;
            const error = await stripe?.redirectToCheckout({ sessionId });
            if (error) console.error('Stripe redirect error:', error);
        } catch (err) {
            console.error('Error starting trial:', err);
        }
    };

    return (
        <button onClick={handleStartTrial} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            Start 7-Day Trial ({plan})
        </button>
    );
};

export default StartTrialButton;
