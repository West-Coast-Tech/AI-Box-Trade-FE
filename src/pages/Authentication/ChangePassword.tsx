import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { setPageTitle, toggleRTL } from '../../redux/features/themeConfigSlice';
import Dropdown from '../../components/Dropdown2';
import { IRootState } from '../../redux/store';
import i18next from 'i18next';
import IconCaretDown from '../../components/Icon/IconCaretDown';
import IconMail from '../../components/Icon/IconMail';
import VerifyOtp from './VerifyOtp';
import { AppState } from '../../redux/types';
import { sendOtpForPasswordReset, verifyPasswordResetOtp } from '../../redux/actions/authActions';
import logo from '/assets/images/logo/logo-white-200x.png';
import { resetState, setError } from '../../redux/features/auth/authSlice';
import { hashPassword } from '../../services/auth';
import { resetPassword } from '../../redux/actions/authActions';
import IconLock from '../../components/Icon/IconLock';

const ChangePassword = () => {
    const [email, setEmail] = useState('');

    const { resetToken, error, id, loading } = useSelector((state: AppState) => state.auth);
    const dispatch = useDispatch<any>();
    useEffect(() => {
        dispatch(setPageTitle('Recover Id Box'));
    });
    const navigate = useNavigate();
    const [resetSuccess, setResetSuccess] = useState(false);
    useEffect(() => {
        if (!resetToken) {
            navigate('/auth/cover-login');
        }
    }, [resetToken, navigate]);

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            dispatch(setError('The passwords do not match'));
            return;
        }

        if (resetToken === null || id === null) {
            return;
        }
        const hashedPassword = await hashPassword(newPassword);
        const payload = {
            id,
            newPassword: hashedPassword,
            resetToken,
        };

        try {
            await dispatch(resetPassword(payload)); // Dispatch the resetPassword action
            setResetSuccess(true); // Set success state to true
            setTimeout(() => {
                dispatch(resetState());
                navigate('/auth/cover-login');
            }, 3000);
        } catch (error) {
            console.error('Password reset failed:', error);
            // Handle any additional error handling if needed
        }
    };
    return (
        <div>
            <div className="relative flex min-h-screen items-center justify-center bg-[url(/assets/images/auth/map.png)] bg-cover bg-center bg-no-repeat px-6 py-10 dark:bg-[#060818] sm:px-16">
                <img src="/assets/images/auth/coming-soon-object1.png" alt="image" className="absolute left-0 top-1/2 h-full max-h-[893px] -translate-y-1/2" />
                <img src="/assets/images/auth/coming-soon-object2.png" alt="image" className="absolute left-24 top-0 h-40 md:left-[30%]" />
                <img src="/assets/images/auth/coming-soon-object3.png" alt="image" className="absolute right-0 top-0 h-[300px]" />
                <img src="/assets/images/auth/polygon-object.svg" alt="image" className="absolute bottom-0 end-[28%]" />
                <div className="relative flex w-full max-w-[1502px] flex-col justify-between overflow-hidden rounded-md bg-white/60 backdrop-blur-lg dark:bg-black/50 lg:min-h-[758px] lg:flex-row lg:gap-10 xl:gap-0">
                    <div className="relative hidden w-full items-center justify-center bg-[linear-gradient(225deg,rgba(239,18,98,1)_0%,rgba(67,97,238,1)_100%)] p-5 lg:inline-flex lg:max-w-[835px] xl:-ms-28 ltr:xl:skew-x-[14deg] rtl:xl:skew-x-[-14deg]">
                        <div className="absolute inset-y-0 w-8 from-primary/10 via-transparent to-transparent ltr:-right-10 ltr:bg-gradient-to-r rtl:-left-10 rtl:bg-gradient-to-l xl:w-16 ltr:xl:-right-20 rtl:xl:-left-20"></div>
                        <div className="ltr:xl:-skew-x-[14deg] rtl:xl:skew-x-[14deg]">
                            <Link to="/" className="w-48 block lg:w-72 ms-10">
                                <img src={logo} alt="Logo" className="w-full" />
                            </Link>
                            <div className="mt-24 hidden w-full max-w-[430px] lg:block">
                                <img src="/assets/images/auth/reset-password.svg" alt="Cover Image" className="w-full" />
                            </div>
                        </div>
                    </div>
                    <div className="relative flex w-full flex-col items-center justify-center gap-6 px-4 pb-16 pt-6 sm:px-6 lg:max-w-[667px]">
                        <div className="flex w-full max-w-[440px] items-center gap-2 lg:absolute lg:end-6 lg:top-6 lg:max-w-full">
                            <Link to="/" className="w-8 block lg:hidden">
                                <img src="/assets/images/logo.svg" alt="Logo" className="mx-auto w-10" />
                            </Link>
                        </div>
                        <div className="w-full max-w-[440px] lg:mt-16">
                            <div className="mb-7">
                                <h1 className="mb-3 text-2xl font-bold !leading-snug dark:text-white">Password Reset</h1>
                                {/* <p>Enter your email to recover your ID</p> */}
                            </div>
                            {!resetSuccess ? (
                                <form className="space-y-5" onSubmit={handleSubmit}>
                                    <div>
                                        <label htmlFor="newPassword">New Password</label>
                                        <div className="relative text-white-dark">
                                            <input
                                                id="newPassword"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                type="password"
                                                required
                                                placeholder="Enter New Password"
                                                className="form-input pl-10 placeholder:text-white-dark"
                                            />
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2">
                                                <IconLock fill={true} />
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="confirmPassword">Confirm Password</label>
                                        <div className="relative text-white-dark">
                                            <input
                                                id="confirmPassword"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                type="password"
                                                required
                                                placeholder="Enter Password Again"
                                                className="form-input pl-10 placeholder:text-white-dark"
                                            />
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2">
                                                <IconLock fill={true} />
                                            </span>
                                        </div>
                                    </div>
                                    <button type="submit" className="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]">
                                        Submit
                                    </button>
                                </form>
                            ) : (
                                <div className="border-[1px] border-solid p-4 w-fit rounded-lg  border-green-800/70">
                                    <p>Password has been reset successfully</p>
                                </div>
                            )}
                        </div>
                        <p className="absolute bottom-6 w-full text-center dark:text-white">© {new Date().getFullYear()}.AI Box Trade All Rights Reserved.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;
