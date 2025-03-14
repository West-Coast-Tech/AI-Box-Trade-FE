import React, { useEffect } from 'react';
import API from '../../utils/API';
import { loadStripe } from '@stripe/stripe-js';
import { useSelector } from 'react-redux';
import { AppState } from '../../redux/types';
const PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_TEST_PUBLISHABLE_KEY;

const stripePromise = loadStripe(PUBLISHABLE_KEY);
interface TrialCheckoutAfterRegistrationProps {
    userId: string;
}
export const TrialCheckoutAfterRegistration: React.FC<TrialCheckoutAfterRegistrationProps> = ({ userId }) => {
    useEffect(() => {
        const handleStartTrial = async () => {
            const id = userId;
            if (!id) {
                alert('No id found');
                return;
            }
            try {
                const res = await API.getTrialSetupSession(id, 'full');
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
        // Start trial after 1 second delay
        const timeout = setTimeout(() => {
            handleStartTrial();
        }, 1000);
    }, [userId]);
    return (
        <div className="absolute top-0 left-0  w-full h-full gap-10   text-white flex items-center justify-center text-2xl font-bold bg-black/95 z-20">
            <p>Starting Trial</p>
            <span className="animate-spin border-4 border-transparent border-l-primary rounded-full  inline-block w-12 h-12 "></span>
        </div>
    );
};
