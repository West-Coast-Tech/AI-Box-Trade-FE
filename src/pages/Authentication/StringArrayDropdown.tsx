import React from 'react';
import IconUser from '../../components/Icon/IconUser'; // Adjust the import path accordingly

interface StringArrayDropdownProps {
    options: string[];
    onOptionSelect: (option: string) => void;
    value: string;
}

const StringArrayDropdown: React.FC<StringArrayDropdownProps> = ({ options, onOptionSelect, value }) => {
    return (
        <div className="relative text-white-dark">
            <select value={value} onChange={(e) => onOptionSelect(e.target.value)} className="form-select ps-10 placeholder:text-white-dark">
                <option value="">Select a country</option>
                {options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
            <span className="absolute start-4 top-1/2 -translate-y-1/2">
                <IconUser fill={true} />
            </span>
        </div>
    );
};

export default StringArrayDropdown;
