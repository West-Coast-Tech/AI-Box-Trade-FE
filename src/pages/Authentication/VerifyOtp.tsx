import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { setPageTitle, toggleRTL } from '../../redux/features/themeConfigSlice';
import Dropdown from '../../components/Dropdown2';
import { IRootState } from '../../redux/store';
import i18next from 'i18next';
import IconCaretDown from '../../components/Icon/IconCaretDown';
import IconMail from '../../components/Icon/IconMail';
import { AppState } from '../../redux/types';
import IconInfoCircle from '../../components/Icon/IconInfoCircle';
import { loadUser } from '../../redux/features/users/usersSlice';
import { getUserData } from '../../redux/actions/userActions';
import { TrialCheckoutAfterRegistration } from './TrialCheckoutAfterRegistration';
interface VerifyOtpProps {
    verifyAction: (payload: { otp: string; otpToken: string }) => any;
    resendAction: (payload: any) => any;
    message: string;
    resendPayload: any;
    verifyType?: 'login' | 'register' | 'password-reset';
}

const VerifyOtp: React.FC<VerifyOtpProps> = ({ verifyAction, resendAction, message, resendPayload, verifyType }) => {
    const dispatch = useDispatch<any>();
    const { otpToken, loading, error } = useSelector((state: AppState) => state.auth);
    const [trialUserId, setTrialUserId] = useState();
    const [otp, setOtp] = useState('');
    const [isCooldown, setIsCooldown] = useState(false);
    const [timeLeft, setTimeLeft] = useState(60);

    useEffect(() => {
        dispatch(setPageTitle('Verify Otp'));
    });

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isCooldown) {
            timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        setIsCooldown(false);
                        return 60;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [isCooldown]);

    const navigate = useNavigate();
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const setLocale = (flag: string) => {
        setFlag(flag);
        if (flag.toLowerCase() === 'ae') {
            dispatch(toggleRTL('rtl'));
        } else {
            dispatch(toggleRTL('ltr'));
        }
    };
    const [flag, setFlag] = useState(themeConfig.locale);

    const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const token = otpToken as string;
        const payload = {
            otp,
            otpToken: token,
        };
        // Send OTP to server
        try {
            const id = await dispatch(verifyAction(payload));

            // await dispatch(getUserData());
            if (verifyType === 'login' || !verifyType) {
                navigate('/dashboard');
            } else if (verifyType === 'register') {
                setTrialUserId(id);
            } else if (verifyType === 'password-reset') {
                navigate('/auth/cover-change-password');
            }
        } catch (error) {
            console.error('Error verifying OTP', error);
        }
    };
    const handleResendOtp = async () => {
        // Resend OTP to server
        try {
            await dispatch(resendAction(resendPayload));
            setIsCooldown(true);
            setTimeLeft(60);
        } catch (error) {
            console.error('Error resending OTP', error);
        }
    };
    return (
        <div className="w-full max-w-[440px] lg:mt-16">
            <div className="mb-7">
                <h1 className="mb-3 text-2xl font-bold !leading-snug dark:text-white">Verify OTP</h1>
                <p>{message}</p>
            </div>
            <form className="space-y-5" onSubmit={submitForm}>
                <div>
                    <label htmlFor="otp">Enter your OTP</label>
                    <div className="relative text-white-dark">
                        <input id="otp" type="text" placeholder="Enter your OTP" className="form-input pl-10 placeholder:text-white-dark" value={otp} onChange={(e) => setOtp(e.target.value)} />
                        <span className="absolute left-4 top-1/2 -translate-y-1/2">
                            <IconMail fill={true} />
                        </span>
                    </div>
                    {error && (
                        <div className="text-red-700 space-x-2 flex text-center pt-2">
                            <IconInfoCircle /> <p>{error}</p>
                        </div>
                    )}
                </div>
                <button
                    type="submit"
                    className={`btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)] ${loading ? 'cursor-not-allowed' : ''}`}
                    disabled={loading}
                >
                    {loading ? (
                        <div className="flex justify-center items-center">
                            <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.961 7.961 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                            Verifying...
                        </div>
                    ) : (
                        'Verify OTP'
                    )}
                </button>
            </form>
            <button type="button" className={`btn btn-secondary w-full mt-4 ${isCooldown ? 'cursor-not-allowed' : ''}`} onClick={handleResendOtp} disabled={isCooldown || loading}>
                {isCooldown ? `Resend in ${timeLeft}s` : 'Resend OTP'}
            </button>
        </div>
    );
};

export default VerifyOtp;
