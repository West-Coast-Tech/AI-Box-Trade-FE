import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { setPageTitle } from '../../redux/features/themeConfigSlice';
import { useDispatch, useSelector } from 'react-redux';
import IconHome from '../../components/Icon/IconHome';
import IconDollarSignCircle from '../../components/Icon/IconDollarSignCircle';
import IconUser from '../../components/Icon/IconUser';
import IconPhone from '../../components/Icon/IconPhone';
import IconLinkedin from '../../components/Icon/IconLinkedin';
import IconTwitter from '../../components/Icon/IconTwitter';
import IconFacebook from '../../components/Icon/IconFacebook';
import IconGithub from '../../components/Icon/IconGithub';
import { AppState } from '../../redux/types';
import IconLockDots from '../../components/Icon/IconLockDots';
import { Preferences } from '../../components/AccountSettingsTabs/Preferences';
import { DangerZone } from '../../components/AccountSettingsTabs/DangerZone';
import { updateUser } from '../../redux/actions/userActions';
import { hashPassword } from '../../services/auth';
import { changePassword } from '../../redux/actions/authActions';
import { countries } from '../Authentication/countrylist';
import ContactUsBoxed from '../Pages/ContactUsBoxed';
import Profile from './Profile';
import Payment from '../../components/AccountSettingsTabs/Payment';
const selectUser = (state: AppState) => state.user.currentUser;

const AccountSetting = () => {
    const user = useSelector(selectUser);
    const dispatch = useDispatch<any>();

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [retypePassword, setRetypePassword] = useState('');

    const [fullName, setFullName] = useState(user?.fullName || '');
    const [country, setCountry] = useState(user?.country || '');

    const [userInfoMessage, setUserInfoMessage] = useState('');
    const [userInfoError, setUserInfoError] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');
    const [passwordError, setPasswordError] = useState('');

    useEffect(() => {
        dispatch(setPageTitle('Account Setting'));
    }, [dispatch]);

    const [tabs, setTabs] = useState<string>('home');
    const toggleTabs = (name: string) => {
        setTabs(name);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setUserInfoMessage('');
        setUserInfoError('');
        if (!fullName || !country) {
            setUserInfoError('Full Name and Country are required.');
            return;
        }
        try {
            await dispatch(updateUser(fullName, country));
            setUserInfoMessage('User information updated successfully.');
        } catch (error) {
            setUserInfoError('Failed to update user information.');
        }
    };

    const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setPasswordMessage('');
        setPasswordError('');

        if (!oldPassword || !newPassword || !retypePassword) {
            setPasswordError('All password fields are required.');
            return;
        }
        if (newPassword !== retypePassword) {
            setPasswordError('Passwords do not match.');
            return;
        }
        try {
            const hashedOldPassword = await hashPassword(oldPassword);
            const hashedNewPassword = await hashPassword(newPassword);
            await dispatch(changePassword(hashedOldPassword, hashedNewPassword));
            setPasswordMessage('Password changed successfully.');
            // Clear the password fields
            setOldPassword('');
            setNewPassword('');
            setRetypePassword('');
        } catch (error) {
            setPasswordError('Error changing password.');
            console.error('Error changing password', error);
        }
    };

    return (
        <div>
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link to="#" className="text-primary hover:underline">
                        Users
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Account Settings</span>
                </li>
            </ul>
            <div className="pt-5">
                <div className="flex items-center justify-between mb-5">
                    <h5 className="font-semibold text-lg dark:text-white-light">Settings</h5>
                </div>
                <div>
                    <ul className="sm:flex font-semibold border-b border-[#ebedf2] dark:border-[#191e3a] mb-5 whitespace-nowrap overflow-y-auto">
                        <li className="inline-block">
                            <button
                                onClick={() => toggleTabs('home')}
                                className={`flex gap-2 p-4 border-b border-transparent hover:border-primary hover:text-primary ${tabs === 'home' ? '!border-primary text-primary' : ''}`}
                            >
                                <IconHome />
                                Account Settings
                            </button>
                        </li>
                        <li className="inline-block">
                            <button
                                onClick={() => toggleTabs('payment-details')}
                                className={`flex gap-2 p-4 border-b border-transparent hover:border-primary hover:text-primary ${tabs === 'payment-details' ? '!border-primary text-primary' : ''}`}
                            >
                                <IconDollarSignCircle />
                                Payment
                            </button>
                        </li>
                        <li className="inline-block">
                            <button
                                onClick={() => toggleTabs('contact-us')}
                                className={`flex gap-2 p-4 border-b border-transparent hover:border-primary hover:text-primary ${tabs === 'contact-us' ? '!border-primary text-primary' : ''}`}
                            >
                                <IconPhone />
                                Support
                            </button>
                        </li>
                        {/* <li className="inline-block">
                            <button
                                onClick={() => toggleTabs('preferences')}
                                className={`flex gap-2 p-4 border-b border-transparent hover:border-primary hover:text-primary ${tabs === 'preferences' ? '!border-primary text-primary' : ''}`}
                            >
                                <IconUser className="w-5 h-5" />
                                Preferences
                            </button>
                        </li> */}
                        {/* <li className="inline-block">
                            <button
                                onClick={() => toggleTabs('danger-zone')}
                                className={`flex gap-2 p-4 border-b border-transparent hover:border-primary hover:text-primary ${tabs === 'danger-zone' ? '!border-primary text-primary' : ''}`}
                            >
                                <IconPhone />
                                Danger Zone
                            </button>
                        </li> */}
                    </ul>
                </div>
                {tabs === 'home' && (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        <form className="border col-span-1 relative border-[#ebedf2] dark:border-[#191e3a] rounded-md p-4 bg-white dark:bg-black" onSubmit={handleSubmit}>
                            <h6 className="text-lg font-bold mb-5">General Information</h6>

                            <div className="flex flex-col sm:flex-row">
                                <div className="ltr:sm:mr-4 rtl:sm:ml-4 w-full sm:w-2/12 mb-5">
                                    <img src="/assets/images/avatar.png" alt="img" className="w-20 h-20 md:w-32 md:h-32 rounded-full object-cover mx-auto" />
                                </div>
                                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label htmlFor="name">Full Name</label>
                                        <input id="name" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="form-input" />
                                    </div>
                                    <div>
                                        <label htmlFor="email">Email</label>
                                        <input id="email" type="text" value={user?.email || ''} className="form-input" disabled />
                                    </div>
                                    <div>
                                        <label htmlFor="country">Country</label>
                                        <select id="country" className="form-select text-white-dark overflow-auto" value={country} onChange={(e) => setCountry(e.target.value)}>
                                            <option value="" disabled>
                                                Select Country
                                            </option>

                                            {countries.map((country) => (
                                                <option value={country} key={country}>
                                                    {country}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="sm:col-span-2 mt-3">
                                        {userInfoMessage && <div className="text-green-500 mb-4">{userInfoMessage}</div>}
                                        {userInfoError && <div className="text-red-500 mb-4">{userInfoError}</div>}
                                        <button type="submit" className="btn btn-primary">
                                            Save
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                        <form className="border relative col-span-1 border-[#ebedf2] dark:border-[#191e3a] rounded-md p-4 bg-white dark:bg-black" onSubmit={handleChangePassword}>
                            <h6 className="text-lg font-bold mb-5">Update Password</h6>

                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="OldPassword">Old Password</label>
                                    <div className="relative text-white-dark">
                                        <input
                                            id="OldPassword"
                                            type="password"
                                            value={oldPassword}
                                            onChange={(e) => setOldPassword(e.target.value)}
                                            placeholder="Enter Old Password"
                                            className="form-input ps-10 placeholder:text-white-dark"
                                        />
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <IconLockDots fill={true} />
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="NewPassword">New Password</label>
                                    <div className="relative text-white-dark">
                                        <input
                                            id="NewPassword"
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="Enter New Password"
                                            className="form-input ps-10 placeholder:text-white-dark"
                                        />
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <IconLockDots fill={true} />
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="RetypePassword">Confirm Password</label>
                                    <div className="relative text-white-dark">
                                        <input
                                            id="RetypePassword"
                                            type="password"
                                            value={retypePassword}
                                            onChange={(e) => setRetypePassword(e.target.value)}
                                            placeholder="Retype New Password"
                                            className="form-input ps-10 placeholder:text-white-dark"
                                        />
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <IconLockDots fill={true} />
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex mt-8 pr-20 items-end  ">
                                <button type="submit" className="btn btn-primary">
                                    Save
                                </button>
                                {passwordMessage && <div className="text-green-500 ml-4">{passwordMessage}</div>}
                                {passwordError && <div className="text-red-500 ml-4">{passwordError}</div>}
                            </div>
                        </form>
                    </div>
                )}
                {tabs === 'contact-us' && <ContactUsBoxed />}
                {tabs === 'payment-details' && <Payment />}
                {tabs === 'preferences' && <Preferences />}
                {tabs === 'danger-zone' && <DangerZone />}
            </div>
        </div>
    );
};

export default AccountSetting;
