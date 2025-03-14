import React, { useState, useEffect } from 'react';
import { SearchBar } from '../../Elements/SearchBar';
import { sectors } from '../../SectorWisePB/TopSectorPicks/TopSectorPicks';
import Dropdown2 from '../../../components/Dropdown2';
import IconCaretDown from '../../../components/Icon/IconCaretDown';
import IconXCircle from '../../../components/Icon/IconXCircle';
import { UserParameters } from './DesignPortfolioPage';

const investmentTypes = ['Short Term', 'Medium Term', 'Long Term'];
const investmentRisks = ['Moderate', 'Conservative', 'Aggressive'];

interface UserParameterBarProps {
    setUserParameters?: (userParameters: UserParameters) => void;
    onSubmit: (userParameters: UserParameters) => void;
    userParameters?: UserParameters;
}

export const UserParameterBar: React.FC<UserParameterBarProps> = ({ setUserParameters, onSubmit, userParameters }) => {
    const [selectedSectors, setSelectedSectors] = useState<string[]>([sectors[0].name]);
    const [selectedInvestmentType, setSelectedInvestmentType] = useState<string | null>(null);
    const [selectedInvestmentRisk, setSelectedInvestmentRisk] = useState<string | null>(null);
    const [investmentCapital, setInvestmentCapital] = useState<number>(100000);
    const [showTooltip, setShowTooltip] = useState<boolean>(false);

    // Sync local state with userParameters when they change in the parent
    useEffect(() => {
        if (userParameters) {
            setSelectedInvestmentType(userParameters.type);
            setSelectedInvestmentRisk(userParameters.mode);
            setInvestmentCapital(userParameters.investment);
        }
    }, [userParameters]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = Number(e.target.value);
        setInvestmentCapital(val);

        // Toggle tooltip if under 25000
        setShowTooltip(val < 25000);
    };

    const handleSubmit = () => {
        if (!selectedInvestmentRisk || !selectedInvestmentType || !investmentCapital) return;

        const newUserParameters: UserParameters = {
            mode: selectedInvestmentRisk.toLowerCase(),
            investment: investmentCapital,
            type: selectedInvestmentType.split(' ')[0].toLowerCase(),
        };

        setUserParameters?.(newUserParameters);
        onSubmit(newUserParameters);
    };

    return (
        <div className="mt-2 h-full">
            <h2 className="text-xl font-bold pl-1 h-[8%]">Select Parameters</h2>
            <div className="flex flex-col justify-between h-[83%]">
                {/* Investment Capital Input */}
                <div className="col-span-1 mt-1">
                    <h3 className="text-sm font-bold pl-1 my-2">
                        Investment Capital <span className="text-danger">*</span>
                    </h3>
                    <input type="number" placeholder="Investment Capital..." value={investmentCapital} onChange={handleChange} className="form-input peer placeholder:tracking-widest" min={25000} />
                    {showTooltip && (
                        <div className="absolute mt-1 px-3 text-xs font-medium cursor-pointer text-warning bg-gray-900 z-10 rounded-md shadow-sm border-warning border-[1px] border-opacity-50 border-solid">
                            Minimum value allowed is 25000
                        </div>
                    )}
                </div>

                {/* Investment Duration Dropdown */}
                <div className="dropdown col-span-1 mt-1">
                    <h3 className="text-sm font-bold pl-1 my-2">
                        Investment Duration <span className="text-danger">*</span>
                    </h3>
                    <Dropdown2
                        placement="bottom-start"
                        btnClassName="btn btn-outline-info btn-sm dropdown-toggle w-full capitalize"
                        button={
                            <>
                                {selectedInvestmentType || 'Select Duration'}
                                <IconCaretDown className="ltr:ml-1 rtl:mr-1 inline-block" />
                            </>
                        }
                    >
                        <ul className="w-full ml-1 capitalize">
                            {investmentTypes.map((item) => (
                                <li key={item}>
                                    <button className="button flex justify-center w-full" onClick={() => setSelectedInvestmentType(item)}>
                                        {item}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </Dropdown2>
                </div>

                {/* Risk Factor Dropdown */}
                <div className="dropdown col-span-1 mt-1">
                    <h3 className="text-sm font-bold pl-1 my-2">
                        Risk Factor <span className="text-danger">*</span>
                    </h3>
                    <Dropdown2
                        placement="bottom-start"
                        btnClassName="btn btn-outline-info btn-sm dropdown-toggle w-full capitalize"
                        button={
                            <>
                                {selectedInvestmentRisk || 'Select Risk Factor'}
                                <IconCaretDown className="ltr:ml-1 rtl:mr-1 inline-block" />
                            </>
                        }
                    >
                        <ul className="">
                            {investmentRisks.map((item) => (
                                <li key={item}>
                                    <button className="button flex justify-center w-full" onClick={() => setSelectedInvestmentRisk(item)}>
                                        {item}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </Dropdown2>
                </div>

                {/* Submit Button */}
                <div>
                    <button
                        className="btn btn-outline-success w-full mt-4"
                        onClick={handleSubmit}
                        disabled={!selectedInvestmentRisk || !selectedInvestmentType || !investmentCapital || investmentCapital < 25000}
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};
