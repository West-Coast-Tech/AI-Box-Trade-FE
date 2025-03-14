export const formatNumber = (value: number): string => {
    console.log(value);

    const isNegative = value < 0; // Check if the number is negative
    const absValue = Math.abs(value); // Work with the absolute value

    let formattedValue: string;

    if (absValue >= 1e12) formattedValue = `${(absValue / 1e12).toFixed(2)}T`;
    else if (absValue >= 1e9) formattedValue = `${(absValue / 1e9).toFixed(2)}B`;
    else if (absValue >= 1e6) formattedValue = `${(absValue / 1e6).toFixed(2)}M`;
    else if (absValue >= 1e3) formattedValue = `${(absValue / 1e3).toFixed(2)}K`;
    else formattedValue = absValue.toFixed(2);

    // Reapply the negative sign if the original value was negative
    return isNegative ? `-${formattedValue}` : formattedValue;
};
