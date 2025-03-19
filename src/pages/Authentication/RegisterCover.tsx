import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { setPageTitle, toggleRTL } from '../../redux/features/themeConfigSlice';
import Dropdown from '../../components/Dropdown2';
import { IRootState } from '../../redux/store';
import i18next from 'i18next';
import IconCaretDown from '../../components/Icon/IconCaretDown';
import IconUser from '../../components/Icon/IconUser';
import IconMail from '../../components/Icon/IconMail';
import IconLockDots from '../../components/Icon/IconLockDots';
import IconInstagram from '../../components/Icon/IconInstagram';
import IconFacebookCircle from '../../components/Icon/IconFacebookCircle';
import IconTwitter from '../../components/Icon/IconTwitter';
import IconGoogle from '../../components/Icon/IconGoogle';
import { hashPassword } from '../../services/auth';
import { registerUser, verifyRegisterOtp } from '../../redux/actions/authActions';
import StringArrayDropdown from './StringArrayDropdown';
import { AppState } from '../../redux/types';
import VerifyOtp from './VerifyOtp';
import IconInfoCircle from '../../components/Icon/IconInfoCircle';
import { TrialCheckoutAfterRegistration } from './TrialCheckoutAfterRegistration';
import logo from '/assets/images/logo/logo-white-200x.png';
import { countries } from './countrylist';
const RegisterCover = () => {
    const [email, setEmail] = useState('');
    const { isAuthenticated, otpToken, error, id } = useSelector((state: AppState) => state.auth);

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [country, setCountry] = useState<string>('');
    const [serviceAgreement, setServiceAgreement] = useState(false);
    const [declarationAgreement, setDeclarationAgreement] = useState(false);

    const [resendPayload, setResendPayload] = useState<{ email: string; password: string; fullName: string; country: string }>({ email: '', password: '', fullName: '', country: '' });

    const [passwordError, setPasswordError] = useState('');

    const dispatch = useDispatch<any>();
    useEffect(() => {
        dispatch(setPageTitle('Register Cover'));
    });

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
        if (password !== confirmPassword) {
            setPasswordError('Passwords do not match');
            return;
        }

        const hashedPassword = await hashPassword(password);
        const payload = {
            email,
            password: hashedPassword,
            fullName,
            country,
        };

        try {
            await dispatch(registerUser(payload));
            setResendPayload(payload);
        } catch (error) {}
    };
    useEffect(() => {
        if (isAuthenticated) navigate('/');
    }, []);
    const handleCountrySelect = (country: string) => {
        setCountry(country);
    };
    return (
        <div>
            {/* <div className="absolute inset-0">
                <img src="/assets/images/auth/bg-gradient.png" alt="image" className="h-full w-full object-cover" />
            </div> */}
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
                                <img src="/assets/images/auth/register.svg" alt="Cover Image" className="w-full" />
                            </div>
                        </div>
                    </div>
                    <div className="relative flex w-full flex-col items-center justify-center gap-6 px-4 pb-16 pt-6 sm:px-6 lg:max-w-[667px]">
                        {!otpToken ? (
                            <div className="w-full max-w-[440px] lg:mt-16">
                                <div className="mb-10">
                                    <h1 className="text-3xl font-extrabold uppercase !leading-snug text-primary md:text-4xl">Sign Up</h1>
                                    <p className="text-base font-bold leading-normal text-white-dark">Enter your email and password to register</p>
                                </div>
                                <form className="space-y-5 dark:text-white" onSubmit={submitForm}>
                                    <div>
                                        <label htmlFor="FullName">FullName</label>
                                        <div className="relative text-white-dark">
                                            <input
                                                id="FullName"
                                                type="text"
                                                value={fullName}
                                                onChange={(e) => {
                                                    setFullName(e.target.value);
                                                }}
                                                placeholder="Enter Full Name"
                                                className="form-input ps-10 placeholder:text-white-dark"
                                            />
                                            <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                                <IconUser fill={true} />
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="Country">Country</label>
                                        <div className="relative text-white-dark">
                                            <StringArrayDropdown options={countries} onOptionSelect={handleCountrySelect} value={country} />
                                            <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                                <IconUser fill={true} />
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="Email">Email</label>
                                        <div className="relative text-white-dark">
                                            <input
                                                id="Email"
                                                type="email"
                                                value={email}
                                                onChange={(e) => {
                                                    setEmail(e.target.value);
                                                }}
                                                placeholder="Enter Email"
                                                className="form-input ps-10 placeholder:text-white-dark"
                                            />
                                            <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                                <IconMail fill={true} />
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="Password">Password</label>
                                        <div className="relative text-white-dark">
                                            <input
                                                id="Password"
                                                type="password"
                                                value={password}
                                                onChange={(e) => {
                                                    setPassword(e.target.value);
                                                }}
                                                placeholder="Enter Password"
                                                className="form-input ps-10 placeholder:text-white-dark"
                                            />
                                            <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                                <IconLockDots fill={true} />
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="ConfirmPassword">Confirm Password</label>
                                        <div className="relative text-white-dark">
                                            <input
                                                id="ConfirmPassword"
                                                type="password"
                                                value={confirmPassword}
                                                onChange={(e) => {
                                                    setConfirmPassword(e.target.value);
                                                }}
                                                placeholder="Confirm Password"
                                                className="form-input ps-10 placeholder:text-white-dark"
                                            />
                                            <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                                <IconLockDots fill={true} />
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="flex cursor-pointer items-center">
                                            <input type="checkbox" className="form-checkbox bg-white dark:bg-black" />
                                            <span className="text-white-dark">Subscribe to weekly newsletter</span>
                                        </label>
                                    </div>
                                    {error && (
                                        <div className="text-red-700 flex items-center space-x-2">
                                            <IconInfoCircle />
                                            <p>{error}</p>
                                        </div>
                                    )}
                                    <button type="submit" className="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]">
                                        Sign Up
                                    </button>
                                </form>

                                <div className="relative my-7 text-center md:mb-9">
                                    <span className="absolute inset-x-0 top-1/2 h-px w-full -translate-y-1/2 bg-white-light dark:bg-white-dark"></span>
                                    <span className="relative bg-white px-2 font-bold uppercase text-white-dark dark:bg-dark dark:text-white-light">or</span>
                                </div>
                                <div className="mb-10 md:mb-[60px]">
                                    <ul className="flex justify-center gap-3.5 text-white">
                                        <li>
                                            <Link
                                                to="#"
                                                className="inline-flex h-8 w-8 items-center justify-center rounded-full p-0 transition hover:scale-110"
                                                style={{ background: 'linear-gradient(135deg, rgba(239, 18, 98, 1) 0%, rgba(67, 97, 238, 1) 100%)' }}
                                            >
                                                <IconInstagram />
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="#"
                                                className="inline-flex h-8 w-8 items-center justify-center rounded-full p-0 transition hover:scale-110"
                                                style={{ background: 'linear-gradient(135deg, rgba(239, 18, 98, 1) 0%, rgba(67, 97, 238, 1) 100%)' }}
                                            >
                                                <IconFacebookCircle />
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="#"
                                                className="inline-flex h-8 w-8 items-center justify-center rounded-full p-0 transition hover:scale-110"
                                                style={{ background: 'linear-gradient(135deg, rgba(239, 18, 98, 1) 0%, rgba(67, 97, 238, 1) 100%)' }}
                                            >
                                                <IconTwitter fill={true} />
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="#"
                                                className="inline-flex h-8 w-8 items-center justify-center rounded-full p-0 transition hover:scale-110"
                                                style={{ background: 'linear-gradient(135deg, rgba(239, 18, 98, 1) 0%, rgba(67, 97, 238, 1) 100%)' }}
                                            >
                                                <IconGoogle />
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                                <div className="text-center dark:text-white">
                                    Already have an account ?&nbsp;
                                    <Link to="/auth/cover-login" className="uppercase text-primary underline transition hover:text-black dark:hover:text-white">
                                        SIGN IN
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <VerifyOtp verifyAction={verifyRegisterOtp} resendAction={registerUser} resendPayload={resendPayload} message="Check your email for the otp" verifyType="register" />
                        )}
                        <p className="absolute bottom-6 w-full text-center dark:text-white">© {new Date().getFullYear()}.AI Box Trade All Rights Reserved.</p>
                    </div>
                    {id && <TrialCheckoutAfterRegistration userId={id} />}
                </div>
            </div>
        </div>
    );
};

export default RegisterCover;
