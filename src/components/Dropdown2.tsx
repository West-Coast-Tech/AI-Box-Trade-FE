import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { usePopper } from 'react-popper';

const Dropdown = forwardRef<
    { close: () => void },
    {
        button: React.ReactNode;
        children: React.ReactNode;
        btnClassName?: string;
        placement?: any;
        offset?: [number, number];
    }
>((props, ref) => {
    const [open, setOpen] = useState(false);
    const [triggerEl, setTriggerEl] = useState<HTMLButtonElement | null>(null);
    const [popperEl, setPopperEl] = useState<HTMLDivElement | null>(null);
    const buttonWidth = useRef(0);

    const { styles, attributes } = usePopper(triggerEl, popperEl, {
        placement: props.placement || 'bottom-end',
        modifiers: [
            {
                name: 'offset',
                options: { offset: props.offset || [0, 0] },
            },
        ],
    });

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (!triggerEl?.contains(e.target as Node) && !popperEl?.contains(e.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [triggerEl, popperEl]);

    React.useImperativeHandle(ref, () => ({
        close: () => setOpen(false),
    }));

    return (
        <div>
            <button
                ref={(el) => {
                    setTriggerEl(el);
                    if (el) buttonWidth.current = el.offsetWidth;
                }}
                type="button"
                className={props.btnClassName}
                onClick={() => setOpen(!open)}
            >
                {props.button}
            </button>

            {open && (
                <div ref={setPopperEl} className="z-50" style={{ ...styles.popper, minWidth: buttonWidth.current }} {...attributes.popper} onClick={() => setOpen(false)}>
                    {props.children}
                </div>
            )}
        </div>
    );
});

export default Dropdown;
