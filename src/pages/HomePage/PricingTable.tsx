import React from 'react';
import DirectSubscriptionButton from '../../components/Stripe Payment/DirectSubscriptionButton';

interface Plan {
    title: string;
    description: string;
    features: string[];
    monthlyPrice: number;
    buttonVariant: 'dark' | 'primary';
    type: 'free' | 'basic' | 'full';
}

const plans: Plan[] = [
    {
        title: 'Premium Access',
        description: '7 - Day Trial',
        features: ['12+ Screeners', '7 Box Rule', 'Design Portfolio', 'Analyst Rating', 'Top Sector Picks', 'Stock Filters', 'Watch List', 'User Holdings'],
        monthlyPrice: 0,
        buttonVariant: 'dark',
        type: 'free',
    },
    {
        title: 'Pro Plan',
        description: '30 Days',
        features: ['Limited Screeners', '7 Box Rule', 'Analyst Rating', 'Top Sector Picks', 'Watch List', 'User Holdings'],
        monthlyPrice: 39.99,
        buttonVariant: 'primary',
        type: 'basic',
    },
    {
        title: 'Elite Plan',
        description: '30 Days',
        features: ['12+ Screeners', '7 Box Rule', 'Design Portfolio', 'Analyst Rating', 'Top Sector Picks', 'Stock Filters', 'Watch List', 'User Holdings'],
        monthlyPrice: 59.99,
        buttonVariant: 'dark',
        type: 'full',
    },
];

export const PricingTable: React.FC = () => {
    const [yearlyPrice, setYearlyPrice] = React.useState(false);

    // Helper: Calculate the display price and billing period.
    const getDisplayPrice = (monthly: number) => {
        if (yearlyPrice) {
            // Annual price: 12 months with 20% off.
            const annual = Math.round(monthly * 12 * 0.8);
            return { price: annual, period: 'yearly' };
        }
        return { price: monthly, period: 'monthly' };
    };

    return (
        <div className="p-5 rounded-lg bg-gradient-to-br dark:from-black dark:via-blue-950/70 dark:to-black ">
            <div className="max-w-[320px] md:max-w-[1140px] mx-auto dark:text-white-dark">
                {/* Toggle for Monthly / Yearly */}
                {/* <div className="mt-5 md:mt-10 text-center flex justify-center space-x-4 rtl:space-x-reverse font-semibold text-base">
                    <span className={`${!yearlyPrice ? 'text-primary' : 'text-white-dark'}`}>Monthly</span>
                    <label className="w-12 h-6 relative">
                        <input
                            type="checkbox"
                            className="custom_switch absolute ltr:left-0 rtl:right-0 top-0 w-full h-full opacity-0 z-10 cursor-pointer peer"
                            onChange={() => setYearlyPrice(!yearlyPrice)}
                        />
                        <span className="outline_checkbox bg-icon border-2 border-[#ebedf2] dark:border-white-dark block h-full rounded-full before:absolute ltr:before:left-1 rtl:before:right-1 before:bg-[#ebedf2] dark:before:bg-white-dark before:bottom-1 before:w-4 before:h-4 before:rounded-full before:bg-[url(/assets/images/close.svg)] before:bg-no-repeat before:bg-center ltr:peer-checked:before:left-7 rtl:peer-checked:before:right-7 peer-checked:before:bg-[url(/assets/images/checked.svg)] peer-checked:border-primary peer-checked:before:bg-primary before:transition-all before:duration-300"></span>
                    </label>
                    <span className={`relative ${yearlyPrice ? 'text-primary' : 'text-white-dark'}`}>
                        Yearly
                        {yearlyPrice && <span className="badge bg-success rounded-full absolute ltr:left-full rtl:right-full whitespace-nowrap ltr:ml-2 rtl:mr-2 my-auto">20% Off</span>}
                    </span>
                </div> */}

                {/* Pricing Cards */}
                <div className="md:grid grid-cols-3 w-full space-y-4 md:space-y-0 mt-5 md:mt-16 text-white-dark">
                    {plans.map((plan, index) => {
                        const { price, period } = getDisplayPrice(plan.monthlyPrice);
                        // Button classes based on variant
                        const buttonClasses = plan.buttonVariant === 'primary' ? 'btn btn-primary w-full' : 'btn btn-dark w-full';

                        return (
                            <div
                                key={index}
                                className={`p-4  relative flex flex-col lg:p-9 border border-white-light dark:border-[#1b2e4b] rounded-md transition-all duration-300 hover:shadow-[0_0_15px_1px_rgba(113,106,202,0.20)] 
                  ${index === 1 ? 'relative' : ''} ${index === 1 ? '' : ''}`}
                            >
                                {index === 1 && (
                                    <div className="absolute top-0 md:-top-[30px] inset-x-0 bg-primary text-white h-10 flex items-center justify-center text-base rounded-t-md">Most Popular</div>
                                )}
                                <h3 className="text-xl mb-5 font-semibold text-black dark:text-white-light">{plan.title}</h3>
                                <p>{plan.description}</p>
                                <div className="my-7 p-2.5 text-center text-lg">
                                    <strong className="text-[#3b3f5c] dark:text-white-light text-xl lg:text-3xl">${price}</strong> / {period}
                                </div>
                                <div className="flex flex-col justify-between h-full">
                                    <div className="mb-6">
                                        <strong className="text-black dark:text-white-light text-[15px] mb-3 inline-block">{plan.title} Features</strong>
                                        <ul className="space-y-3">
                                            {plan.features.map((feature, i) => (
                                                <li key={i}>{feature}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        {plan.type == 'free' ? (
                                            <button type="button" className="btn btn-dark w-full cursor-default">
                                                Free Tier
                                            </button>
                                        ) : (
                                            <button type="button" className="w-full">
                                                <DirectSubscriptionButton userId={localStorage.getItem('id') || ''} plan={plan.type} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
