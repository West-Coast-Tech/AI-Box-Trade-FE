import React from 'react';

const SubscriptionCancel: React.FC = () => (
    <div className="flex flex-col items-center justify-center py-12 rounded-md border-2 border-solid border-red-500 bg-gray-50 dark:bg-red-500/10">
        <h1 className="text-3xl font-bold mb-4">Subscription Canceled!</h1>
        <p className="text-gray-700 dark:text-white">Your subscription has been canceled.</p>
    </div>
);

export default SubscriptionCancel;
