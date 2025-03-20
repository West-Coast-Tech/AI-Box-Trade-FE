import React, { useEffect, useState } from 'react';
import { getTime, parse } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

interface MarketInfo {
    marketOpeningTime: string;
}
export let marketOpeningTime = new Date();
const CountdownTimer: React.FC = () => {
    const [marketInfo, setMarketInfo] = useState<MarketInfo | null>(null);
    const [targetTime, setTargetTime] = useState<Date | null>(null);
    const [timeLeft, setTimeLeft] = useState<null | {
        hours: number;
        minutes: number;
        seconds: number;
    }>(null);

    // Bearer token stored securely (replace with your actual token)
    const BEARER_TOKEN = '831|jRJ8PE7kKQiPhyltC5bj4sOPiLbUI5o1FV5jq0Zz';

    const fetchMarketInfo = async () => {
        try {
            const response = await fetch('https://api.apicalls.io/v2/markets/market-info', {
                headers: {
                    Authorization: `Bearer ${BEARER_TOKEN}`,
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch market data');
            }

            const data = await response.json();
            setMarketInfo(data.body);
        } catch (error) {
            console.error('Error fetching market info:', error);
        }
    };

    useEffect(() => {
        fetchMarketInfo();
    }, []);

    useEffect(() => {
        if (marketInfo) {
            const dateString = marketInfo.marketOpeningTime; // e.g., "Nov 4, 2024 09:30 AM ET"
            const dateStringWithoutTimezone = dateString.replace(' ET', '');
            // Parse and convert to UTC
            const parsedDate = parse(dateStringWithoutTimezone, 'MMM d, yyyy hh:mm a', new Date());
            const openingTime = new Date(parsedDate + 'GMT-0400');
            setTargetTime(openingTime);
        }
    }, [marketInfo]);

    useEffect(() => {
        if (targetTime && !isNaN(targetTime.getTime())) {
            const interval = setInterval(() => {
                const now = new Date();
                const difference = targetTime.getTime() - now.getTime();
                if (difference <= 0) {
                    clearInterval(interval);
                    setTimeLeft(null);
                } else {
                    const hours = Math.floor(difference / (1000 * 60 * 60));
                    const minutes = Math.floor((difference / (1000 * 60)) % 60);
                    const seconds = Math.floor((difference / 1000) % 60);

                    setTimeLeft({ hours, minutes, seconds });
                }
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [targetTime]);

    return (
        <div className="flex flex-row items-center justify-center brightness-125 w-full">
            {timeLeft ? (
                <div className="flex flex-row  rounded-lg bg-black-dark-light  text-center justify-center items-center space-x-5 px-2">
                    <div className="flex">
                        <h2 className="text-sm font-semibold text-center items-center justify-center lg:block hidden">Market Opens In:</h2>
                    </div>
                    <div className="flex text-xl space-x-1">
                        <div>
                            <span>{String(timeLeft.hours).padStart(2, '0')}</span>
                            <span className="text-sm ml-1">h</span>
                        </div>
                        <div>
                            <span>{String(timeLeft.minutes).padStart(2, '0')}</span>
                            <span className="text-sm ml-1">m</span>
                        </div>
                        <div>
                            <span>{String(timeLeft.seconds).padStart(2, '0')}</span>
                            <span className="text-sm ml-1">s</span>
                        </div>
                    </div>
                </div>
            ) : (
                <h2 className="text-sm  font-semibold">The market is open!</h2>
            )}
        </div>
    );
};

export default CountdownTimer;
