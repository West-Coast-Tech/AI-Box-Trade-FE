import React from 'react';

const SubscriptionSuccess: React.FC = () => (
    <div className="flex flex-col items-center justify-center py-12 rounded-md border-2 border-solid border-green-500 bg-gray-50 dark:bg-green-500/10">
        <h1 className="text-3xl font-bold mb-4">Subscription Successful!</h1>
        <p className="text-gray-700 dark:text-white">Your subscription is now active. Thank you for your payment.</p>
    </div>
);

export default SubscriptionSuccess;
