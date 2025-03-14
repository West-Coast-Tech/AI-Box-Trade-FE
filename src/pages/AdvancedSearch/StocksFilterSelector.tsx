import React, { Fragment, useState, useEffect } from 'react';
import { Tab } from '@headlessui/react';
import IconCaretDown from '../../components/Icon/IconCaretDown';
import { IFilters } from './StocksFilterPage';
import IconXCircle from '../../components/Icon/IconXCircle';

const initialFilters: IFilters[] = [
    {
        name: 'Price',
        field: 'price',
        desc: "also known as the share price or market value, is the cost to buy a single share of a company's stock",
        min: '0',
        max: '100',
        example: '10 USD',
    },
    {
        name: 'P/E Ratio',
        field: 'peRatio',
        desc: "the ratio of a company's share price to its earnings per share",
        min: '0',
        max: '100',
        example: '10',
    },
    {
        name: 'Market Cap',
        field: 'marketCap',
        desc: 'calculated by multiplying the current share price by the number of shares outstanding. ',
        min: '0',
        max: '100',
        example: '10M',
    },
    {
        field: 'dividendYield',
        name: 'Dividend Yield',
        desc: 'the rate of return earned by a company from reinvesting the funds contributed by its capital providers',
        min: '0',
        max: '100',
        example: '10%',
    },
    {
        field: 'revenueGrowth',
        name: 'Revenue Growth',
        desc: "the rate at which a company's total revenue increases over a period of time, usually calculated quarterly or annually",
        min: '0',
        max: '100',
        example: '10%',
    },

    {
        name: 'Free Cash Flow',
        field: 'freeCashFlow',
        desc: 'amount of cash a company has left after paying for its operating expenses and capital expenditures',
        min: '0',
        max: '100',
        example: '10M',
    },
];

interface StocksFilterSelectorProps {
    filtersUsed: IFilters[];
    setFiltersUsed: (newFilters: IFilters[]) => void;
    toggleVisibility: (visible: boolean) => void;
}

/**
 * StocksFilterSelector
 * 1) If user selects "Equal To", it sets min & max to the same value.
 * 2) If user selects "More Than", only min is saved in the final filter.
 * 3) If user resaves the same filter, it updates the existing entry instead of adding a new one.
 * 4) When user changes filter or comparison type, reset (nullify) min & max.
 */
const StocksFilterSelector: React.FC<StocksFilterSelectorProps> = ({ filtersUsed, setFiltersUsed, toggleVisibility }) => {
    // The currently selected filter from the left column
    const [selectedFilter, setSelectedFilter] = useState<IFilters>(initialFilters[0]);

    // The user's numeric inputs
    const [min, setMin] = useState<number | null>(null);
    const [max, setMax] = useState<number | null>(null);

    // Track the comparison type
    const [filterType, setFilterType] = useState<'moreThan' | 'lessThan' | 'equalTo' | 'between'>('moreThan');

    /**
     * When user selects a new filter or changes filterType, reset min & max
     * so we don't reuse old values from previous selections.
     */
    useEffect(() => {
        setMin(null);
        setMax(null);
    }, [selectedFilter, filterType]);

    /**
     * Build and save the new filter based on `filterType`.
     *  - If "moreThan", only min is stored.
     *  - If "lessThan", only max is stored.
     *  - If "equalTo", store both, but they are the same value.
     *  - If "between", store both min and max.
     *
     * If the filter (by field) already exists in filtersUsed, update it.
     * Otherwise push a new one.
     */
    function processInput(value: number | null) {
        if (value === null) return null;
        if (selectedFilter.example === '10M') {
            return value * 1000000;
        } else if (selectedFilter.example === '10%') {
            return value / 100;
        }
        return value;
    }
    const handleSave = () => {
        const newFilter: IFilters = {
            field: selectedFilter.field,
            desc: selectedFilter.desc,
            name: selectedFilter.name,
            example: selectedFilter.example,
        };
        if (min === null && max === null) return;
        const minValue = processInput(min);
        const maxValue = processInput(max);
        if (filterType === 'moreThan' && min !== null) {
            newFilter.min = String(minValue);
        } else if (filterType === 'lessThan' && max !== null) {
            newFilter.max = String(maxValue);
        } else if (filterType === 'equalTo' && min !== null && max !== null) {
            // Both min and max are the same
            newFilter.min = String(minValue);
            newFilter.max = String(maxValue);
        } else if (filterType === 'between' && min !== null && max !== null) {
            newFilter.min = String(minValue);
            newFilter.max = String(maxValue);
        }

        // Check if this filter (by field) already exists in filtersUsed

        if (filtersUsed.length > 0) {
            const existingIndex = filtersUsed.findIndex((f) => f.field === selectedFilter.field);
            if (existingIndex >= 0) {
                // Update the existing filter
                const updatedFilters = [...filtersUsed];
                updatedFilters[existingIndex] = newFilter;
                setFiltersUsed(updatedFilters);
            } else {
                // Add a new filter
                setFiltersUsed([...filtersUsed, newFilter]);
            }
        } else {
            setFiltersUsed([newFilter]);
        }
    };

    return (
        <div className="w-[90%] md:w-[60%] lg:w-[50%] sm:w-[70%] xl:w-[40%] bg-white dark:bg-black absolute z-30 block left-10 mt-2 shadow-xl dark:shadow-gray-800">
            <div className="w-full dark:bg-black rounded-md border dark:border-gray-500">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg pl-2 p-2 font-bold">Filters</h2>
                    <div onClick={() => toggleVisibility(false)} className="cursor-pointer p-2 ">
                        <IconXCircle />
                    </div>
                </div>
                <div className="w-full border-t dark:border-gray-500 grid grid-cols-2 lg:grid-cols-3">
                    {/* Left Column: Filter List */}
                    <div className="p-1 flex flex-col space-y-1 justify-between col-span-1">
                        {initialFilters.map((filter: IFilters) => (
                            <div
                                key={filter.field}
                                onClick={() => setSelectedFilter(filter)}
                                className={`px-1  h-full cursor-pointer font-semibold border border-transparent hover:border-purple-900 rounded-md hover:text-purple-400 flex items-center justify-between ${
                                    selectedFilter.field === filter.field ? 'bg-purple-900 bg-opacity-20 text-purple-400' : ''
                                }`}
                            >
                                {filter.name} <IconCaretDown className="-rotate-90" />
                            </div>
                        ))}
                    </div>

                    {/* Right Column: Comparison & Values */}
                    <div className="px-2 text-center flex flex-col justify-between lg:col-span-2">
                        <div>
                            <h2 className="text-lg p-2 font-bold text-center">{selectedFilter.name}</h2>
                            <p>{selectedFilter.desc}</p>

                            {/* Tab Group for More Than, Less Than, Equal To, Between */}
                            <div className="flex flex-col items-center">
                                <Tab.Group>
                                    <Tab.List className="mt-3 flex flex-wrap border-b border-white-light dark:border-[#191e3a]">
                                        <Tab as={Fragment}>
                                            {({ selected }) => (
                                                <button
                                                    onClick={() => setFilterType('moreThan')}
                                                    className={`${
                                                        selected ? '!border-white-light !border-b-white text-purple-600 !outline-none dark:!border-[#191e3a] dark:!border-b-black' : ''
                                                    } dark:hover:border-b-black -mb-[1px] block border border-transparent p-3.5 py-2 hover:text-purple-600`}
                                                >
                                                    More Than
                                                </button>
                                            )}
                                        </Tab>

                                        <Tab as={Fragment}>
                                            {({ selected }) => (
                                                <button
                                                    onClick={() => setFilterType('lessThan')}
                                                    className={`${
                                                        selected ? '!border-white-light !border-b-white text-purple-600 !outline-none dark:!border-[#191e3a] dark:!border-b-black' : ''
                                                    } dark:hover:border-b-black -mb-[1px] block border border-transparent p-3.5 py-2 hover:text-purple-600`}
                                                >
                                                    Less Than
                                                </button>
                                            )}
                                        </Tab>

                                        <Tab as={Fragment}>
                                            {({ selected }) => (
                                                <button
                                                    onClick={() => setFilterType('equalTo')}
                                                    className={`${
                                                        selected ? '!border-white-light !border-b-white text-purple-600 !outline-none dark:!border-[#191e3a] dark:!border-b-black' : ''
                                                    } dark:hover:border-b-black -mb-[1px] block border border-transparent p-3.5 py-2 hover:text-purple-600`}
                                                >
                                                    Equal To
                                                </button>
                                            )}
                                        </Tab>

                                        <Tab as={Fragment}>
                                            {({ selected }) => (
                                                <button
                                                    onClick={() => setFilterType('between')}
                                                    className={`${
                                                        selected ? '!border-white-light !border-b-white text-purple-600 !outline-none dark:!border-[#191e3a] dark:!border-b-black' : ''
                                                    } dark:hover:border-b-black -mb-[1px] block border border-transparent p-3.5 py-2 hover:text-purple-600`}
                                                >
                                                    Between
                                                </button>
                                            )}
                                        </Tab>
                                    </Tab.List>

                                    {/* Tab Panels */}
                                    <Tab.Panels className="w-full px-3 mt-3 text-black">
                                        {/* More Than -> Only min */}
                                        <Tab.Panel>
                                            <input
                                                type="number"
                                                className="w-full p-2 mt-2 rounded-md"
                                                value={min === null ? '' : min}
                                                placeholder={`Enter a Value e.g. ${selectedFilter.example}`}
                                                onChange={(e) => setMin(Number(e.target.value))}
                                            />
                                        </Tab.Panel>

                                        {/* Less Than -> Only max */}
                                        <Tab.Panel>
                                            <input
                                                type="number"
                                                className="w-full p-2 mt-2 rounded-md"
                                                value={max === null ? '' : max}
                                                placeholder={`Enter a Value e.g. ${selectedFilter.example}`}
                                                onChange={(e) => setMax(Number(e.target.value))}
                                            />
                                        </Tab.Panel>

                                        {/* Equal To -> Single field sets both min & max */}
                                        <Tab.Panel>
                                            <input
                                                type="number"
                                                className="w-full p-2 mt-2 rounded-md"
                                                value={min === null ? '' : min}
                                                placeholder={`Enter a Value e.g. ${selectedFilter.example}`}
                                                onChange={(e) => {
                                                    const val = Number(e.target.value);
                                                    setMin(val);
                                                    setMax(val);
                                                }}
                                            />
                                        </Tab.Panel>

                                        {/* Between -> Two fields for min & max */}
                                        <Tab.Panel>
                                            <div className="flex flex-row items-center gap-3">
                                                <input
                                                    type="number"
                                                    className="w-full p-2 mt-2 rounded-md"
                                                    value={min === null ? '' : min}
                                                    placeholder={`Enter a Value e.g. ${selectedFilter.example}`}
                                                    onChange={(e) => setMin(Number(e.target.value))}
                                                />
                                                <input
                                                    type="number"
                                                    className="w-full p-2 mt-2 rounded-md"
                                                    value={max === null ? '' : max}
                                                    placeholder={`Enter a Value e.g. ${selectedFilter.example}`}
                                                    onChange={(e) => setMax(Number(e.target.value))}
                                                />
                                            </div>
                                        </Tab.Panel>
                                    </Tab.Panels>
                                </Tab.Group>
                            </div>
                        </div>

                        {/* Save Button */}
                        <div className="justify-end flex">
                            <button className="btn btn-outline-secondary cursor-pointer m-2 p-1.5 shadow-none px-4" onClick={handleSave}>
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StocksFilterSelector;
