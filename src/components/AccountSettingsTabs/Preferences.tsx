export const Preferences = () => {
    return (
        <div className="switch">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
                <div className="panel space-y-5">
                    <h5 className="font-semibold text-lg mb-4">Choose Theme</h5>
                    <div className="flex justify-around">
                        <div className="flex">
                            <label className="inline-flex cursor-pointer">
                                <input className="form-radio ltr:mr-4 rtl:ml-4 cursor-pointer" type="radio" name="flexRadioDefault" defaultChecked />
                                <span>
                                    <img className="ms-3" width="100" height="68" alt="settings-dark" src="/assets/images/settings-light.svg" />
                                </span>
                            </label>
                        </div>

                        <label className="inline-flex cursor-pointer">
                            <input className="form-radio ltr:mr-4 rtl:ml-4 cursor-pointer" type="radio" name="flexRadioDefault" />
                            <span>
                                <img className="ms-3" width="100" height="68" alt="settings-light" src="/assets/images/settings-dark.svg" />
                            </span>
                        </label>
                    </div>
                </div>
                <div className="panel space-y-5">
                    <h5 className="font-semibold text-lg mb-4">Activity data</h5>
                    <p>Download your Summary, Task and Payment History Data</p>
                    <button type="button" className="btn btn-primary">
                        Download Data
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="panel space-y-5">
                    <h5 className="font-semibold text-lg mb-4">Public Profile</h5>
                    <p>
                        Your <span className="text-primary">Profile</span> will be visible to anyone on the network.
                    </p>
                    <label className="w-12 h-6 relative">
                        <input type="checkbox" className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer" id="custom_switch_checkbox1" />
                        <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
                    </label>
                </div>
                <div className="panel space-y-5">
                    <h5 className="font-semibold text-lg mb-4">Show my email</h5>
                    <p>
                        Your <span className="text-primary">Email</span> will be visible to anyone on the network.
                    </p>
                    <label className="w-12 h-6 relative">
                        <input type="checkbox" className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer" id="custom_switch_checkbox2" />
                        <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white  dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
                    </label>
                </div>
                <div className="panel space-y-5">
                    <h5 className="font-semibold text-lg mb-4">Enable keyboard shortcuts</h5>
                    <p>
                        When enabled, press <span className="text-primary">ctrl</span> for help
                    </p>
                    <label className="w-12 h-6 relative">
                        <input type="checkbox" className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer" id="custom_switch_checkbox3" />
                        <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white  dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
                    </label>
                </div>
                <div className="panel space-y-5">
                    <h5 className="font-semibold text-lg mb-4">Hide left navigation</h5>
                    <p>
                        Sidebar will be <span className="text-primary">hidden</span> by default
                    </p>
                    <label className="w-12 h-6 relative">
                        <input type="checkbox" className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer" id="custom_switch_checkbox4" />
                        <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white  dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
                    </label>
                </div>
                <div className="panel space-y-5">
                    <h5 className="font-semibold text-lg mb-4">Advertisements</h5>
                    <p>
                        Display <span className="text-primary">Ads</span> on your dashboard
                    </p>
                    <label className="w-12 h-6 relative">
                        <input type="checkbox" className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer" id="custom_switch_checkbox5" />
                        <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white  dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
                    </label>
                </div>
                <div className="panel space-y-5">
                    <h5 className="font-semibold text-lg mb-4">Social Profile</h5>
                    <p>
                        Enable your <span className="text-primary">social</span> profiles on this network
                    </p>
                    <label className="w-12 h-6 relative">
                        <input type="checkbox" className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer" id="custom_switch_checkbox6" />
                        <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white  dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
                    </label>
                </div>
            </div>
        </div>
    );
};
