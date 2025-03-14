import React, { useState } from 'react';
import IconPlus from '../../../components/Icon/IconPlus';

const AddWatchList = ({ onSave }: { onSave: (listName: string) => void }) => {
    const [isEditing, setIsEditing] = useState(false); // Tracks whether the input is visible
    const [newWatchListName, setNewWatchListName] = useState(''); // Holds the input value

    const handleSave = () => {
        if (newWatchListName.trim() === '') {
            alert('Watch list name cannot be empty.');
            return;
        }
        onSave(newWatchListName); // Pass the new list name to the parent
        setNewWatchListName(''); // Clear the input
        setIsEditing(false); // Switch back to button mode
    };

    const handleCancel = () => {
        setNewWatchListName(''); // Clear the input
        setIsEditing(false); // Switch back to button mode
    };

    return (
        <div className="flex items-center gap-2">
            {isEditing ? (
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        className="form-input px-3 py-2 border rounded-md"
                        placeholder="Enter watch list name"
                        value={newWatchListName}
                        onChange={(e) => setNewWatchListName(e.target.value)}
                    />
                    <button type="button" className="btn btn-success bg-transparent shadow-none dark:text-white text-black" onClick={handleSave}>
                        Save
                    </button>
                    <button type="button" className="btn btn-secondary bg-transparent shadow-none dark:text-white text-black" onClick={handleCancel}>
                        Cancel
                    </button>
                </div>
            ) : (
                <button
                    type="button"
                    className="btn btn-primary bg-transparent shadow-none dark:text-white text-black"
                    onClick={() => setIsEditing(true)} // Switch to input mode
                >
                    <IconPlus className="w-5 h-5 mr-1 shrink-0" />
                    Add new watch list
                </button>
            )}
        </div>
    );
};

export default AddWatchList;
