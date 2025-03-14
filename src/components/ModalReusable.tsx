import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import IconX from './Icon/IconX';
// Import your close icon component (adjust the path as needed)

interface ModalProps {
    title: string;
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
    children: React.ReactNode;
}

const ModalReusable: React.FC<ModalProps> = ({ title, isOpen, onClose, onSave, children }) => {
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-[999]" open={isOpen} onClose={onClose}>
                {/* Backdrop */}
                <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <div className="fixed inset-0 bg-[black]/60" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-screen items-start justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="panel my-8 w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                                {/* Header */}
                                <div className="flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                                    <h3 className="text-lg font-bold">{title}</h3>
                                    <button type="button" className="text-white-dark hover:text-dark" onClick={onClose}>
                                        <IconX />
                                    </button>
                                </div>

                                {/* Content */}
                                <div className="p-5">
                                    {children}
                                    {/* Footer */}
                                    <div className="mt-8 flex items-center justify-end space-x-4">
                                        <button type="button" className="btn btn-outline-danger" onClick={onClose}>
                                            Discard
                                        </button>
                                        <button type="button" className="btn btn-primary" onClick={onSave}>
                                            Save
                                        </button>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default ModalReusable;
