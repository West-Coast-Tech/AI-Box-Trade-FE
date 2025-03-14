import React from 'react';
import Dropdown2 from './Dropdown2';
import IconCaretDown from './Icon/IconCaretDown';
const Dropdown = () => {
    return (
        <div className="flex items-center justify-center">
            <div className="dropdown">
                <Dropdown2
                    placement="bottom-end"
                    btnClassName="btn btn-outline-success btn-lg dropdown-toggle"
                    button={
                        <>
                            Large Button
                            <span>
                                <IconCaretDown className="ltr:ml-1 rtl:mr-1 inline-block" />
                            </span>
                        </>
                    }
                >
                    <ul className="!min-w-[170px]">
                        <li>
                            <button type="button">Action</button>
                        </li>
                        <li>
                            <button type="button">Another action</button>
                        </li>
                        <li>
                            <button type="button">Something else here</button>
                        </li>
                        <li>
                            <button type="button">Separated link</button>
                        </li>
                    </ul>
                </Dropdown2>
            </div>
        </div>
    );
};

export default Dropdown;
