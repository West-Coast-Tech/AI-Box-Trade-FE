import React, { useMemo } from 'react';

interface ContextMenuProps {
    x: number;
    y: number;
    onRemove: (event: React.MouseEvent<HTMLDivElement>) => void;
    visible: boolean;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, onRemove, visible }) => {
    if (!visible) return null;

    const menuStyle = useMemo(
        () => ({
            position: 'absolute' as const,
            top: `${y}px`,
            left: `${x}px`,
            backgroundColor: '#2c2c2c',
            border: '1px solid #ccc',
            padding: '5px',
            zIndex: 1000,
            boxShadow: '0px 0px 5px rgba(0,0,0,0.2)',
            color: 'white',
        }),
        [x, y]
    );

    return (
        <div style={menuStyle} className="context-menu">
            {/* Add more menu options as needed */}
            <div onClick={onRemove} style={{ cursor: 'pointer' }}>
                Remove
            </div>
        </div>
    );
};

export default ContextMenu;
