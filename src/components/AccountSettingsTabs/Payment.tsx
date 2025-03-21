import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setPageTitle } from '../../redux/features/themeConfigSlice';
import { useEffect } from 'react';
import IconPencilPaper from '../../components/Icon/IconPencilPaper';

import IconMapPin from '../../components/Icon/IconMapPin';
import IconMail from '../../components/Icon/IconMail';

import IconClock from '../../components/Icon/IconClock';
import { AppState } from '../../redux/types';
import IconCircleCheck from '../Icon/IconCircleCheck';
import IconXCircle from '../Icon/IconXCircle';
import { plans } from '../../pages/HomePage/PricingTable';
import API from '../../utils/API';
import Swal from 'sweetalert2';
const selectUser = (state: AppState) => state.user.currentUser;

const Payment = () => {
    const user = useSelector(selectUser);
    if (!user)
        return (
            <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    const currentPlan = plans.filter((plan) => plan.type == user?.subscriptionPlan)[0];
    const chunkArray = (array: any, chunkSize: number) => {
        const chunks = [];
        for (let i = 0; i < array.length; i += chunkSize) {
            chunks.push(array.slice(i, i + chunkSize));
        }
        return chunks;
    };
    const totalDays = user.subscriptionStatus == 'trial' ? 7 : 30;
    const time = user.subscriptionStatus == 'trial' ? user.trialEndsAt : user.nextBillingDate;
    let timeRemaining = null;
    if (time) {
        timeRemaining = ((new Date(time).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)).toFixed(0);
    }
    async function handleCancelSubscription() {
        if (!user) return;
        const toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
        });
        try {
            const userId = localStorage.getItem('id');
            if (!userId) {
                console.error('No user found');
                return;
            }
            await API.cancelSubscription(userId, 'canceled');
            toast.fire({
                icon: 'success',
                title: 'Subscription canceled successfully',
            });
        } catch (error) {
            console.error('Error canceling subscription', error);
            toast.fire({
                icon: 'error',
                title: 'Error canceling subscription',
            });
        }
    }
    async function handleRenewSubscription() {
        if (!user) return;
        const toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
        });
        try {
            const userId = localStorage.getItem('id');
            if (!userId) {
                console.error('No user found');
                return;
            }
            await API.renewSubscription(userId, 'active');
            toast.fire({
                icon: 'success',
                title: 'Subscription renewed successfully',
            });
        } catch (error) {
            console.error('Error renewing subscription', error);
            toast.fire({
                icon: 'error',
                title: 'Error renewing subscription',
            });
        }
    }
    return (
        <div>
            <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-5">
                <div className="panel flex flex-col justify-around items-center">
                    <h5 className="font-semibold text-lg dark:text-white-light">Subscription Status</h5>
                    {/* <Link to="/users/user-account-settings" className="ltr:ml-auto rtl:mr-auto btn btn-primary p-2 rounded-full">
                            <IconPencilPaper />
                        </Link> */}

                    {user?.subscriptionStatus == 'trial' || user?.subscriptionStatus == 'active' ? (
                        <IconCircleCheck className="w-24 h-24 text-green-500 rounded-full object-cover  mb-5" />
                    ) : (
                        <IconXCircle className="w-24 h-24 text-red-500 rounded-full object-cover  mb-5" />
                    )}
                    <p className="font-semibold text-primary capitalize text-xl">{user?.subscriptionStatus || 'No Active Subscription'}</p>
                </div>
                <div className="panel lg:col-span-2 xl:col-span-3">
                    <div className="flex items-center justify-between mb-10">
                        <h5 className="font-semibold text-lg dark:text-white-light">{currentPlan?.title || ''}</h5>
                        <div className="flex gap-x-4">
                            {user?.subscriptionStatus == 'active' || user?.subscriptionStatus == 'trial' ? (
                                <button className="btn btn-danger" onClick={handleCancelSubscription}>
                                    Cancel
                                </button>
                            ) : (
                                <button className="btn btn-primary" onClick={handleRenewSubscription}>
                                    Renew Now
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="group">
                        {currentPlan && (
                            <div className="flex gap-4">
                                {chunkArray(currentPlan.features, 3).map((featuresChunk, index) => (
                                    <ul key={index} className="list-inside list-disc text-white-dark font-semibold mb-7 space-y-2">
                                        {featuresChunk.map((feature: string) => (
                                            <li key={feature}>{feature}</li>
                                        ))}
                                    </ul>
                                ))}
                            </div>
                        )}

                        <div className="flex items-center justify-between mb-4 font-semibold">
                            <p className="flex items-center rounded-full bg-dark px-2 py-1 text-xs text-white-light font-semibold">
                                <IconClock className="w-3 h-3 ltr:mr-1 rtl:ml-1" />
                                {timeRemaining} Days Left
                            </p>
                            <p className="text-info">${currentPlan.monthlyPrice} / month</p>
                        </div>
                        <div className="rounded-full h-2.5 p-0.5 bg-dark-light overflow-hidden mb-5 dark:bg-dark-light/10">
                            <div
                                className="bg-gradient-to-r from-[#f67062] to-[#fc5296] w-full h-full rounded-full relative"
                                style={{ width: `${((Number(timeRemaining) - totalDays) / totalDays) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Payment;
