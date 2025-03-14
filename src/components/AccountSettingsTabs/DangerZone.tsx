export const DangerZone = () => {
    return (
        <div className="switch">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="panel space-y-5">
                    <h5 className="font-semibold text-lg mb-4">Purge Cache</h5>
                    <p>Remove the active resource from the cache without waiting for the predetermined cache expiry time.</p>
                    <button className="btn btn-secondary">Clear</button>
                </div>
                <div className="panel space-y-5">
                    <h5 className="font-semibold text-lg mb-4">Deactivate Account</h5>
                    <p>You will not be able to receive messages, notifications for up to 24 hours.</p>
                    <label className="w-12 h-6 relative">
                        <input type="checkbox" className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer" id="custom_switch_checkbox7" />
                        <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
                    </label>
                </div>
                <div className="panel space-y-5">
                    <h5 className="font-semibold text-lg mb-4">Delete Account</h5>
                    <p>Once you delete the account, there is no going back. Please be certain.</p>
                    <button className="btn btn-danger btn-delete-account">Delete my account</button>
                </div>
            </div>
        </div>
    );
};
