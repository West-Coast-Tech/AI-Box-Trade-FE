import React from 'react';

const TrialCancel: React.FC = () => (
    <div className="flex flex-col items-center justify-center py-12 rounded-md border-2 border-solid border-red-500 bg-gray-50 dark:bg-red-500/10">
        <h1 className="text-3xl font-bold mb-4">Trial Canceled!</h1>
        <p className="text-gray-700 dark:text-white">You Have canceled the trial process</p>
    </div>
);

export default TrialCancel;
