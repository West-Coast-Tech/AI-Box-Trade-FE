import React, { useState } from 'react';
import Dropdown2 from '../../../components/Dropdown2';
import IconCaretDown from '../../../components/Icon/IconCaretDown';
import { IWatchLists } from '../../../redux/types';
import IconX from '../../../components/Icon/IconX';

interface WatchListDropdownProps {
    watchLists: IWatchLists[];
    selectedWatchList: IWatchLists;
    onWatchListSelect: (watchList: IWatchLists) => void;
    onDeleteWatchList: (watchListId: string) => void;
    onEditWatchList: (watchListId: string, newName: string) => void;
}

const WatchListDropdown: React.FC<WatchListDropdownProps> = ({ watchLists, selectedWatchList, onWatchListSelect, onDeleteWatchList, onEditWatchList }) => {
    const [editId, setEditId] = useState<string | null>(null);
    const [editName, setEditName] = useState<string>('');

    const handleEditStart = (watchListId: string, currentName: string) => {
        setEditId(watchListId);
        setEditName(currentName);
    };

    const handleEditSave = () => {
        if (editId && editName.trim() !== '') {
            onEditWatchList(editId, editName);
        }
        setEditId(null);
        setEditName('');
    };

    const handleCancelEdit = () => {
        setEditId(null);
        setEditName('');
    };

    return (
        <div className="flex w-full">
            <div className="dropdown">
                <Dropdown2
                    placement="bottom-start"
                    btnClassName="btn btn-outline-info btn-md dropdown-toggle w-[10.6rem]"
                    button={
                        <>
                            {selectedWatchList.listName || 'Select Watchlist'}
                            <span>
                                <IconCaretDown className="ml-1 inline-block" />
                            </span>
                        </>
                    }
                >
                    <ul className="">
                        {watchLists.map((watchList) => (
                            <li key={watchList._id} className="flex items-center justify-between px-2 py-1">
                                {editId === watchList._id ? (
                                    <div
                                        className="flex items-center gap-2 w-full"
                                        onClick={(e) => e.stopPropagation()} // Prevent the dropdown from closing
                                    >
                                        <input type="text" className="form-input w-full px-2 py-1 border rounded-md" value={editName} onChange={(e) => setEditName(e.target.value)} />
                                        <button type="button" className="btn btn-success px-2 py-1" onClick={handleEditSave}>
                                            Save
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <button type="button" onClick={() => onWatchListSelect(watchList)} className="text-left w-full">
                                            {watchList.listName}
                                        </button>
                                        <div className="flex gap-2">
                                            {/* <button type="button" className="btn btn-sm text-blue-500" onClick={() => handleEditStart(watchList._id, watchList.listName)}>
                                                Edit
                                            </button> */}
                                            <button
                                                type="button"
                                                className="text-xs text-red-500"
                                                onClick={() => {
                                                    if (window.confirm('Are you sure you want to delete this watchlist?')) {
                                                        onDeleteWatchList(watchList._id);
                                                    }
                                                }}
                                            >
                                                <IconX />
                                            </button>
                                        </div>
                                    </>
                                )}
                            </li>
                        ))}
                    </ul>
                </Dropdown2>
            </div>
        </div>
    );
};

export default WatchListDropdown;
