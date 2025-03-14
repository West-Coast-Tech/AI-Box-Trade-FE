import React from 'react';

const TrialSuccess: React.FC = () => (
    <div className="flex flex-col items-center justify-center py-12 rounded-md border-2 border-solid border-green-500 bg-gray-50 dark:bg-green-500/10">
        <h1 className="text-3xl font-bold mb-4">Trial Activated!</h1>
        <p className="text-gray-700 dark:text-white">Your 7-day trial has started and your payment details have been verified.</p>
    </div>
);

export default TrialSuccess;
