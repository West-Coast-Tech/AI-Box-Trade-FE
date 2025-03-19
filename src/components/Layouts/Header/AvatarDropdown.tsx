import React, { ComponentProps } from 'react';
import Dropdown from '../../Dropdown2';
import IconUser from '../../Icon/IconUser';
import { Link } from 'react-router-dom';
import { logoutSuccess } from '../../../redux/features/auth/authSlice';
import IconLogout from '../../Icon/IconLogout';
import { useDispatch } from 'react-redux';
import { Props } from 'react-select';
import { UserData } from '../../../redux/types';
interface AvatarDropdownProps {
    user: UserData;
}
export const AvatarDropdown: React.FC<AvatarDropdownProps> = ({ user }) => {
    const dispatch = useDispatch();
    return (
        <div className="dropdown shrink-0 flex">
            <Dropdown
                offset={[0, 8]}
                placement="bottom-end"
                btnClassName="relative group block"
                button={<IconUser className="w-9 h-9 bg-white-dark/20 p-2 rounded-full object-cover saturate-50 group-hover:saturate-100" />}
            >
                <ul className="text-dark dark:text-white-dark !py-0 w-[230px] font-semibold dark:text-white-light/90">
                    <li>
                        <div className="flex items-center px-4 py-4">
                            <IconUser className="w-9 h-9 bg-white-dark/20 p-2 rounded-full object-cover saturate-50 group-hover:saturate-100" />
                            <div className="ltr:pl-4 rtl:pr-4 truncate">
                                <h4 className="text-base">
                                    {user?.fullName}
                                    {user?.subType == 'pro' && <span className="text-xs bg-success-light rounded text-success px-1 ltr:ml-2 rtl:ml-2">Pro</span>}
                                </h4>
                                <button type="button" className="text-black/60 hover:text-primary dark:text-dark-light/60 dark:hover:text-white">
                                    {user?.email}
                                </button>
                            </div>
                        </div>
                    </li>
                    {/* <li>
                        <Link to="/users/profile" className="dark:hover:text-white">
                            <IconUser className="w-4.5 h-4.5 ltr:mr-2 rtl:ml-2 shrink-0" />
                            Profile
                        </Link>
                    </li> */}
                    <li>
                        <Link to="/users/settings" className="dark:hover:text-white">
                            <IconUser className="w-4.5 h-4.5 ltr:mr-2 rtl:ml-2 shrink-0" />
                            Account Settings
                        </Link>
                    </li>
                    {/* <li>
                                        <Link to="/apps/mailbox" className="dark:hover:text-white">
                                            <IconMail className="w-4.5 h-4.5 ltr:mr-2 rtl:ml-2 shrink-0" />
                                            Inbox
                                        </Link>
                                    </li> */}
                    {/* <li>
                                        <Link to="/auth/boxed-lockscreen" className="dark:hover:text-white">
                                            <IconLockDots className="w-4.5 h-4.5 ltr:mr-2 rtl:ml-2 shrink-0" />
                                            Lock Screen
                                        </Link>
                                    </li> */}
                    <li
                        className="border-t border-white-light dark:border-white-light/10"
                        onClick={() => {
                            dispatch(logoutSuccess());
                        }}
                    >
                        <Link to="/auth/cover-login" className="text-danger !py-3">
                            <IconLogout className="w-4.5 h-4.5 ltr:mr-2 rtl:ml-2 rotate-90 shrink-0" />
                            Sign Out
                        </Link>
                    </li>
                </ul>
            </Dropdown>
        </div>
    );
};
